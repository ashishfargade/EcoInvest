import axios from "axios";
import { validationResult } from "express-validator";

import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Stock } from "../models/stock.model.js";
import { gnews_api_key, newsapi_api_key } from "../config.js";

const getStock = AsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Check all fields", errors.array());
    }

    const { ticker } = req.body;

    const stockDetails = await Stock.findOne({ ticker });
    if (!stockDetails) {
        return new ApiError(
            404,
            "This stock ticker does not exist in database"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, stockDetails, "Stock details fetched from DB")
        );
});

const getStockNews = AsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Check all fields", errors.array());
    }

    const { ticker } = req.body;

    const stockDetails = await Stock.findOne({ ticker });
    if (!stockDetails) {
        return new ApiError(
            404,
            "This stock ticker is currently not in our DB, if you are certain it exists, please contact us"
        );
    }

    // const cleanCompanyName = stockDetails.companyName.replace(/[^\w\s]/g, "");

    const api_url = `https://gnews.io/api/v4/search?q=${ticker}&lang=en&country=us&max=10&sortBy=publishedAt&apikey=${gnews_api_key}`;

    try {
        const news = await axios.get(api_url);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    news.data?.articles,
                    "Stock news fetched from API"
                )
            );
    } catch (error) {
        return new ApiError(500, "Failed to fetch stock news from API");
    }
});

const getMarketNews = AsyncHandler(async (req, res) => {
    const api_url = `https://newsapi.org/v2/everything?domains=techcrunch.com,thenextweb.com,financialpost.com&sortBy=publishedAt&apiKey=${newsapi_api_key}&pageSize=50`;

    try {
        const apires = await axios.get(api_url);
        const data = apires.data;

        // console.log(data)
        return res.status(200).json(new ApiResponse(200, data?.articles));
    } catch (err) {
        return new ApiError(500, "Failed to fetch stock news from API");
    }
});

export { getStock, getStockNews, getMarketNews };
