import axios from "axios";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
dayjs.extend(isSameOrAfter);

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { polygon_api_key, alphavantage_api_key } from "../config.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addToPortfolio = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { ticker, quantity, price } = req.body;
    const TICKER = ticker.toUpperCase();

    // console.log(ticker, quantity, price)

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // @optional : check if ticker exists - (frontend or/and backend)
    const url = `https://api.polygon.io/v3/reference/tickers?ticker=${TICKER}&market=stocks&active=true&order=asc&limit=10&sort=ticker&apiKey=${polygon_api_key}`;

    try {
        const response0 = await axios.get(url);

        if (response0.data?.results.length === 0) {
            throw new ApiError(404, "Stock not found");
        }
    } catch (err) {
        const status = err.response?.status || 500;
        const message = err.response?.data?.error || "Polygon API error";
        throw new ApiError(status, message, err.response?.data);
    }

    await user.addBuyTransaction(TICKER, quantity, price);

    const updatedUser = await User.findById(userId).select("portfolio");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser.portfolio, "Portfolio updated"));
});

const removeFromPortfolio = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { ticker, quantity, price } = req.body;
    const TICKER = ticker.toUpperCase();

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await user.addSellTransaction(TICKER, quantity, price);

    const updatedUser = await User.findById(userId).select("portfolio");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser.portfolio, "Portfolio updated"));
});

function getInvestmentHistory(portfolio) {
    const dateMap = new Map();
    const yesterday = dayjs().subtract(1, "day").startOf("day");

    // Find the earliest buy date
    let earliestDate = yesterday;
    for (const stock of portfolio) {
        for (const buy of stock.buyHistory) {
            const buyDate = dayjs(buy.date).startOf("day");
            if (buyDate.isBefore(earliestDate)) earliestDate = buyDate;
        }
    }

    const totalDays = Math.min(yesterday.diff(earliestDate, "day") + 1, 100);
    for (let i = 0; i < totalDays; i++) {
        const date = yesterday.subtract(i, "day").format("YYYY-MM-DD");
        dateMap.set(date, {});
    }

    for (const stock of portfolio) {
        for (const buy of stock.buyHistory) {
            const buyDate = dayjs(buy.date).startOf("day").format("YYYY-MM-DD");
            for (const [date] of dateMap) {
                if (dayjs(date).isSameOrAfter(buyDate)) {
                    const prev = dateMap.get(date)[stock.ticker] || 0;
                    dateMap.get(date)[stock.ticker] =
                        prev + buy.quantity * buy.price;
                }
            }
        }

        for (const sell of stock.sellHistory) {
            const sellDate = dayjs(sell.date)
                .startOf("day")
                .format("YYYY-MM-DD");
            for (const [date] of dateMap) {
                if (dayjs(date).isSameOrAfter(sellDate)) {
                    const prev = dateMap.get(date)[stock.ticker] || 0;
                    dateMap.get(date)[stock.ticker] =
                        prev - sell.quantity * stock.averageBuyPrice;
                }
            }
        }
    }

    // Format the result as requested
    const result = Array.from(dateMap.entries())
        .reverse()
        .map(([date, data]) => ({
            date,
            investments: Object.entries(data).map(([ticker, value]) => ({
                [ticker]: value,
            })),
        }));

    return result;
}

const getInvestmentValue = async (portfolio, investmentHistory) => {
    const tickers = [...new Set(portfolio.map((stock) => stock.ticker))];

    // Fetch Alpha Vantage data for all tickers
    const tickerToPriceData = {};
    for (const ticker of tickers) {
        try {
            const { data } = await axios.get(
                `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${alphavantage_api_key}`
            );

            const dailySeries = data["Time Series (Daily)"];

            if (dailySeries) {
                tickerToPriceData[ticker] = dailySeries;
            }
        } catch (err) {
            console.error(`Error fetching data for ${ticker}:`, err.message);
        }
    }

    // Calculate value per stock per date
    const result = investmentHistory.map((entry) => {
        const { date, investments } = entry;

        const stocks = investments.map((investmentObj) => {
            const [ticker, invested] = Object.entries(investmentObj)[0];

            const stock = portfolio.find((s) => s.ticker === ticker);
            let sharesHeld = 0;

            for (const buy of stock.buyHistory) {
                if (dayjs(date).isSameOrAfter(dayjs(buy.date).startOf("day"))) {
                    sharesHeld += buy.quantity;
                }
            }

            for (const sell of stock.sellHistory) {
                if (
                    dayjs(date).isSameOrAfter(dayjs(sell.date).startOf("day"))
                ) {
                    sharesHeld -= sell.quantity;
                }
            }

            const formattedDate = dayjs(date).format("YYYY-MM-DD");

            let closingPrice = 0;
            const priceData = tickerToPriceData?.[ticker];

            if (priceData) {
                // Try exact date first
                if (priceData[formattedDate]) {
                    closingPrice = parseFloat(
                        priceData[formattedDate]["4. close"]
                    );
                } else {
                    // Fallback: get previous available date
                    const availableDates = Object.keys(priceData)
                        .sort()
                        .reverse(); // Newest to oldest

                    const fallbackDate = availableDates.find((d) =>
                        dayjs(d).isBefore(formattedDate)
                    );
                    if (fallbackDate) {
                        closingPrice = parseFloat(
                            priceData[fallbackDate]["4. close"]
                        );
                    }
                }
            }

            const value = sharesHeld * closingPrice;

            return {
                ticker,
                investment: invested,
                value: parseFloat(value.toFixed(2)),
            };
        });

        return {
            date,
            stocks,
        };
    });

    return result;
};

const userPortfolioValue = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const portfolio = user.portfolio;
    const investmentHistory = getInvestmentHistory(portfolio);
    const result = await getInvestmentValue(portfolio, investmentHistory);

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Portfolio value fetched successfully"));
});

export { addToPortfolio, removeFromPortfolio, userPortfolioValue };
