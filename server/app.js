import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());

// ROUTES
import userRoutes from "./routes/user.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";

app.use("/user", userRoutes);
app.use("/portfolio", portfolioRoutes);

export default app;
