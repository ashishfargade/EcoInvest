import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { access_token_secret, refresh_token_secret } from "../config.js";
import { ApiError } from "../utils/ApiError.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        default: null,
        // null for google users
    },
    googleId: {
        type: String,
        default: null,
        // null for manual users
    },
    refreshToken: {
        type: String,
    },

    portfolio: [
        {
            ticker: {
                type: String,
                ref: "Stock",
                required: true,
                uppercase: true,
                trim: true,
            },
            shares: {
                type: Number,
                required: true,
                min: 0,
            },
            averageBuyPrice: {
                type: Number,
                required: true,
                min: 0,
            },
            buyHistory: [
                {
                    quantity: {
                        type: Number,
                        required: true,
                    },
                    price: {
                        type: Number,
                        required: true,
                        min: 0,
                    },
                    date: {
                        type: Date,
                        required: true,
                    },
                },
            ],
            sellHistory: [
                {
                    quantity: {
                        type: Number,
                        required: true,
                    },
                    price: {
                        type: Number,
                        required: true,
                        min: 0,
                    },
                    date: {
                        type: Date,
                        required: true,
                    },
                },
            ],
        },
    ],
});

/*
function updateHolding(currentShares, currentAvgPrice, newQuantity, newPrice) {
    const totalCost = (currentShares * currentAvgPrice) + (newQuantity * newPrice);
    const totalShares = currentShares + newQuantity;
    const newAvgPrice = totalCost / totalShares;
  
    return {
      shares: totalShares,
      averageBuyPrice: newAvgPrice,
    };
}
*/

// profit = (currentPrice - averageBuyPrice) * shares;

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    const payload = { _id: this._id };
    return jwt.sign(payload, access_token_secret, { expiresIn: "1d" });
};

userSchema.methods.generateRefreshToken = function () {
    const payload = { _id: this._id };
    return jwt.sign(payload, refresh_token_secret, { expiresIn: "30d" });
};

userSchema.methods.addBuyTransaction = async function (
    ticker,
    quantity,
    price
) {
    quantity = Number(quantity);
    price = Number(price);

    const portfolioItem = this.portfolio.find(
        (item) => item.ticker === ticker
    );

    if (portfolioItem) {
        const currentShares = Number(portfolioItem.shares);
        const currentAvgPrice = Number(portfolioItem.averageBuyPrice);

        const totalCost = currentAvgPrice * currentShares + price * quantity;
        const totalShares = currentShares + quantity;

        portfolioItem.averageBuyPrice = totalCost / totalShares;
        portfolioItem.shares = totalShares;

        portfolioItem.buyHistory.push({
            quantity,
            price,
            date: new Date(),
        });
    } else {
        // Add new portfolio entry
        this.portfolio.push({
            ticker: ticker.toUpperCase(),
            shares: quantity,
            averageBuyPrice: price,
            buyHistory: [
                {
                    quantity,
                    price,
                    date: new Date(),
                },
            ],
            sellHistory: [],
        });
    }

    await this.save();
};

userSchema.methods.addSellTransaction = async function (ticker, quantity, price) {
    quantity = Number(quantity);
    price = Number(price);

    const portfolioItem = this.portfolio.find(
        (item) => item.ticker === ticker
    );

    if (!portfolioItem) {
        throw new ApiError(404, `No shares of ${ticker} owned`);
    }

    const currentShares = Number(portfolioItem.shares);

    if (currentShares < quantity) {
        throw new ApiError(400, `You are trying to sell more shares than you own for ${ticker}`);
    }

    portfolioItem.sellHistory.push({
        quantity,
        price,
        date: new Date(),
    });

    portfolioItem.shares = currentShares - quantity;

    // remove stock from portfolio if no shares left
    if (portfolioItem.shares === 0) {
        this.portfolio = this.portfolio.filter(item => item.ticker !== ticker);
    }

    await this.save();
};

export const User = mongoose.model("User", userSchema);
