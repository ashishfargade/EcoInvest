import { Router } from "express";
import { check } from "express-validator";

import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    addToPortfolio,
    removeFromPortfolio,
} from "../controllers/portfolio.controller.js";

const router = Router();

// Protected Routes
router
    .route("/addToPortfolio")
    .put(
        [
            verifyJWT,
            [
                check("ticker", "ticker is required"),
                check("price", "price per stock is required"),
                check("quantity", "quantity required"),
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
                check("ticker", "ticker is required"),
                check("price", "price per stock is required"),
                check("quantity", "quantity required"),
            ],
        ],
        removeFromPortfolio
    );

// router.route("/editTransactions").put()

export default router;
