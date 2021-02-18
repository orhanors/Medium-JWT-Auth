const db = require("../models");
const bcryp = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../config/keys");
const ApiError = require("../classes/ApiError");
const { generateTokens, handleRefreshToken } = require("../helpers/jwt");
exports.signupController = async (req, res, next) => {
	const { email } = req.body;

	try {
		const foundUser = await db.Author.findOne({ email });
		if (foundUser) throw new ApiError(400, "Email already exist!");

		//We re hashing password using mongoose hooks
		const newUser = new db.Author({ ...req.body });

		await newUser.save();
		res.status(201).json({ success: true, data: "Successfully created" });
	} catch (error) {
		console.log(error);
		next(error);
	}
};

exports.signinController = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await db.Author.findByCredentials(email, password);
		if (!user) throw new ApiError(400, "Invalid email or password");
		const { token, refreshToken } = await generateTokens(user);
		res.cookie("token", token);
		res.cookie("refreshToken", token);
	} catch (error) {
		console.log("SigninController error: ", error);
		next(error);
	}
};

exports.refreshTokenController = async (req, res, next) => {
	try {
		const oldRefreshToken = req.cookies.refreshToken;
		if (!oldRefreshToken)
			throw new ApiError(400, "Refresh token is required");

		//Give old token and take new "access" and "refresh" token
		const newTokens = await handleRefreshToken(oldRefreshToken);
		res.status(201).json(newTokens);
	} catch (error) {
		console.log("RefreshTokenController error: ", error);
		next(new ApiError(403, error.message));
	}
};

exports.logoutController = async (req, res, next) => {
	try {
		req.user.refreshTokens = req.user.refreshTokens.filter(
			(t) => t.token !== req.body.refreshToken
		);

		await req.user.save();
		res.send("OK");
	} catch (err) {
		console.log("Logout error: ", err);
		next(err);
	}
};

exports.logoutAllController = async (req, res, next) => {
	try {
		req.user.refreshTokens = [];
		await req.user.save();
		res.clearCookie("token");
		res.clearCookie("refreshToken");
		res.send("OK");
	} catch (error) {
		console.log("LogoutAll error: ", error);
		next(error);
	}
};

//--------------------------
//OAUTH

exports.googleRedirectController = async (req, res, next) => {
	try {
		const { token, refreshToken } = req.user.tokens;
		//Passport adds req.user object
		//inside of req.user we can grab tokens
		//After grabbing tokens we can send as cookie
		res.cookie("token", token, { httpOnly: true });
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			path: "/auth/refreshToken",
		});

		res.status(200).redirect(process.env.REDIRECT_URL);
	} catch (error) {
		console.log("Google redirect controller error: ", error);
		next(error);
	}
};

exports.facebookRedirectController = async (req, res, next) => {
	try {
		const { token, refreshToken } = req.user.tokens;
		res.cookie("token", token, { httpOnly: true });
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			path: "/auth/refreshToken",
		});
		res.redirect(process.env.REDIRECT_URL);
	} catch (error) {
		console.log("Facebook redirect controller error: ", error);
	}
};
