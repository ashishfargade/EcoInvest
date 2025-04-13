import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { validationResult } from "express-validator";

import { User } from "../models/user.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        if (!accessToken || !refreshToken) {
            throw new ApiError(
                500,
                "Failed to generate access or refresh token"
            );
        }

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (err) {
        // console.log(err);
        throw new ApiError(500, "Error generating tokens", err.message);
    }
};

const registerUser = AsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Check all fields", errors.array());
    }

    const { name, email, password } = req.body;

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User already exists, please login");
    }

    const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
    });

    const user = await User.create({
        name,
        email,
        avatar,
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -googleId"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong with registration");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User registered successfully")
        );
});

const loginUser = AsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Check all fields", errors.array());
    }

    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const passwordValid = await user.isPasswordCorrect(password);

    if (!passwordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessRefreshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -googleId"
    );

    const options = {
        httpOnly: true,
        secure: false, // @todo: set true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser},
                "User logged in successfully"
            )
        );
});

const getLoggedUser = AsyncHandler(async (req, res) => {

    const loggedInUser = await User.findById(req.user._id).select(
        "-password -refreshToken -googleId"
    );
    
    if (!loggedInUser) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {user: loggedInUser}, "User info fetched"));

})

const logoutUser = AsyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: false, // @todo: set true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

// const refreshAccessToken = AsyncHandler(async (req, res) => {
//     const incomingRefreshToken =
//       req.cookies.refreshToken || req.body.refreshToken;
  
//     if (!incomingRefreshToken) {
//       throw new ApiError(401, "Unauthorized request");
//     }
  
//     try {
//       const decodedToken = jwt.verify(incomingRefreshToken, refresh_token_secret);
  
//       const user = User.findById(decodedToken?._id);
  
//       if (!user) {
//         throw new ApiError(401, "Invalid refresh token");
//       }
  
//       if (incomingRefreshToken !== user?.refreshToken) {
//         throw new ApiError(401, "Refresh token is expired or used");
//       }
  
//       const options = {
//         httpOnly: true,
//         secure: true,
//       };
  
//       const { accessToken, newRefreshToken } =
//         await generateAccessRefreshTokens(user._id);
  
//       return res
//         .status(200)
//         .cookie("accessToken", accessToken)
//         .cookie("refreshToken", newRefreshToken)
//         .json(
//           new ApiResponse(
//             200,
//             { accessToken, newRefreshToken },
//             "Access token refreshed"
//           )
//         );
//     } catch (error) {
//       throw new ApiError(401, error?.message || "Invalid refresh token");
//     }
//   });

export { registerUser, loginUser, logoutUser, getLoggedUser };