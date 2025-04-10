import axios from "axios";

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { polygon_api_key } from "../config.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addToPortfolio = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { ticker, quantity, price } = req.body;
    const TICKER = ticker.toUpperCase();

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

export { addToPortfolio, removeFromPortfolio };
