import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { client_origin } from "./config.js";

const app = express();

const allowedOrigin = client_origin;
const corsOptions = {
    origin: allowedOrigin,
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());

// ROUTES
import userRoutes from "./routes/user.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import stockRoutes from "./routes/stock.routes.js"

app.use("/user", userRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/stock", stockRoutes);

export default app;