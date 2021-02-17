const db = require("../models");
const bcryp = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../config/keys");
const ApiError = require("../classes/ApiError");
const { authenticate, handleRefreshToken } = require("../helpers/jwt");
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
		const { token, refreshToken } = await authenticate(user);
		res.status(201).json({ token, refreshToken, user });
	} catch (error) {
		console.log("SigninController error: ", error);
		next(error);
	}
};

exports.refreshTokenController = async (req, res, next) => {
	try {
		const oldRefreshToken = req.body.refreshToken;
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

/**
 * 
				res.json({
					token,
					user: { _id, name, surname, username, email, role },
				});
 */
