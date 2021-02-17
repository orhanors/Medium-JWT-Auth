const express = require("express");
const {
	signupController,
	signinController,
	refreshTokenController,
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

authRouter.post("/logout", authorize, async (req, res, next) => {
	try {
		req.user.refreshTokens = req.user.refreshTokens.filter(
			(t) => t.token !== req.body.refreshToken
		);
		await req.user.save();
		res.send();
	} catch (err) {
		next(err);
	}
});

module.exports = authRouter;
