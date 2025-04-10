import jwt from "jsonwebtoken";

import { ApiError } from "../utils/ApiError.js";
import { access_token_secret } from "../config.js";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorisation")?.replace("Bearer ", "");
        // @todo : remove header property after testing

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, access_token_secret);

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken -googleId"
        );

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;
        next();
    } catch (err) {
        throw new ApiError(401, err?.message || "Error verifying token");
    }
};
