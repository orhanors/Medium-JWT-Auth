const express = require("express");
const passport = require("passport");
const {
	signupController,
	signinController,
	refreshTokenController,
	logoutController,
	logoutAllController,
	googleRedirectController,
} = require("../controller/auth");
const { authorize } = require("../middlewares/auth");
const {
	signupValidator,
	signinValidator,
	validatorResult,
} = require("../middlewares/validator");

const authRouter = express.Router();

authRouter.post("/signup", signupValidator, validatorResult, signupController);

authRouter.post("/signin", signinValidator, validatorResult, signinController);

authRouter.post("/refreshToken", refreshTokenController);

authRouter.post("/logout", authorize, logoutController);
authRouter.post("/logoutAll", authorize, logoutAllController);

//OAUTH
authRouter.get(
	"/googleLogin",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

//NOTE Passport middleware adds "req.user" property to request object
authRouter.get(
	"/googleRedirect",
	passport.authenticate("google"),
	googleRedirectController
);
module.exports = authRouter;
