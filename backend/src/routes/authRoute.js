const express = require("express");
const { signupController, signinController } = require("../controller/auth");
const {
	signupValidator,
	signinValidator,
	validatorResult,
} = require("../middlewares/validator");

const authRouter = express.Router();

authRouter.post("/signup", signupValidator, validatorResult, signupController);

authRouter.post("/signin", signinValidator, validatorResult, signinController);

module.exports = authRouter;
