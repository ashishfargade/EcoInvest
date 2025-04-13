import { Router } from "express";
import { check } from "express-validator";

import { getLoggedUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password should have min 8 chars").isLength({
            min: 8,
        }),
    ],
    registerUser
);

router.route("/login").post(
    [
        check("email", "Please include a registered email").isEmail(),
        check("password", "Password required to login"),
    ],
    loginUser
)


//Secured Routes:
router.route("/currentUser").get(verifyJWT, getLoggedUser);

router.route("/logout").post(verifyJWT, logoutUser);

export default router;
