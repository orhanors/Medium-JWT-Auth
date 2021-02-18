const express = require("express");
const passport = require("passport");
const {
	signupController,
	signinController,
	refreshTokenController,
	logoutController,
	logoutAllController,
	googleRedirectController,
	facebookRedirectController,
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
//---------------

//GOOGLE

/**
 * Frontend sends a request to this route
 */
authRouter.get(
	"/googleLogin",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

//NOTE Passport middleware adds "req.user" property to request object
/**
 * We re redirecting user to this route
 */
authRouter.get(
	"/googleRedirect",
	passport.authenticate("google"),
	googleRedirectController
);

//FACEBOOK
authRouter.get(
	"/facebookLogin",
	passport.authenticate("facebook", { scope: ["email"] })
);
authRouter.get(
	"/facebookRedirect",
	passport.authenticate("facebook"),
	facebookRedirectController
);
module.exports = authRouter;
