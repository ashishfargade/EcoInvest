import { Router } from "express";
import { check } from "express-validator";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Controllers
import {
    getMarketNews,
    getStock,
    getStockNews,
} from "../controllers/stock.controller.js";

// Protected Routes
router
    .route("/stockDetails")
    .post([verifyJWT, [check("ticker").notEmpty()]], getStock);

router
    .route("/getNews")
    .post([verifyJWT, [check("ticker").notEmpty()]], getStockNews);

router.route("/getMarketNews").get(verifyJWT, getMarketNews);

export default router;
