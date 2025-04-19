import { Router } from "express";
import { check } from "express-validator";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Controllers
import {
    addToPortfolio,
    removeFromPortfolio,
    userPortfolioValue,
} from "../controllers/portfolio.controller.js";

// Protected Routes
router
    .route("/addToPortfolio")
    .put(
        [
            verifyJWT,
            [
                check("ticker", "ticker is required").notEmpty(),
                check("price", "price per stock is required").notEmpty(),
                check("quantity", "quantity required").notEmpty(),
            ],
        ],
        addToPortfolio
    );

router
    .route("/removeFromPortfolio")
    .put(
        [
            verifyJWT,
            [
                check("ticker", "ticker is required").notEmpty(),
                check("price", "price per stock is required").notEmpty(),
                check("quantity", "quantity required").notEmpty(),
            ],
        ],
        removeFromPortfolio
    );

// router.route("/editTransactions").put()

router.route("/getPortfolioValue").get(verifyJWT, userPortfolioValue);

export default router;
