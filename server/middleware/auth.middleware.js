import jwt from "jsonwebtoken";

import { ApiError } from "../utils/ApiError.js";
import { access_token_secret } from "../config.js";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    // @todo : remove header property after testing

    if (!token) {
        // Direct response instead of next()
        return res.status(401).json({
            success: false,
            message: "Unauthorized request",
        });
    }

    const decodedToken = jwt.verify(token, access_token_secret);

    const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken -googleId"
    );

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid access token",
        });
    }

    req.user = user;
    next();
};
