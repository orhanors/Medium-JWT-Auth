const jwt = require("jsonwebtoken");
const Author = require("../models").Author;
const { jwtSecret, jwtRefreshSecret } = require("../config/keys");
const ApiError = require("../classes/ApiError");
const authenticate = async (user) => {
	try {
		const newAccessToken = await generateJWT({ _id: user._id });
		const newRefreshToken = await generateRefreshJWT({ _id: user._id });

		user.refreshTokens = user.refreshTokens.concat({
			token: newRefreshToken,
		});

		await user.save();
		return { token: newAccessToken, refreshToken: newRefreshToken };
	} catch (error) {
		console.log("JWT authenticate error: ", error);
		throw new Error(error);
	}
};

const handleRefreshToken = async (oldRefreshToken) => {
	//check if the old token is valid
	const decoded = await verifyRefreshToken(oldRefreshToken);

	//jwt.verify returns payload. We can check the user existince with _id
	const user = await Author.findOne({ _id: decoded._id });

	if (!user) throw new ApiError(403, "Access is forbidden");

	const currentRefreshToken = user.refreshTokens.find(
		(t) => t.token === oldRefreshToken
	);
	if (!currentRefreshToken)
		throw new ApiError(403, "Refresh token is missing or invalid");

	const newAccessToken = await generateJWT({ _id: user._id });
	const newRefreshToken = await generateRefreshJWT({ _id: user._id });

	// const newRefreshTokens = user.refreshTokens
	// 	.filter((t) => t.token !== oldRefreshToken)
	// 	.concat({ token: newRefreshToken });

	// user.refreshTokens = [...newRefreshTokens];

	currentRefreshToken.token = newRefreshToken;
	await user.save();

	return { token: newAccessToken, refreshToken: newRefreshToken };
};

const generateJWT = (payload) =>
	new Promise((res, rej) => {
		jwt.sign(payload, jwtSecret, { expiresIn: "10000" }, (err, token) => {
			if (err) rej(err);
			res(token);
		});
	});

const verifyJWT = (token) =>
	new Promise((res, rej) => {
		jwt.verify(token, jwtSecret, (err, decoded) => {
			if (err) rej(err);
			res(decoded);
		});
	});

const generateRefreshJWT = (payload) =>
	new Promise((res, rej) =>
		jwt.sign(
			payload,
			jwtRefreshSecret,
			{ expiresIn: "1 week" },
			(err, token) => {
				if (err) rej(err);
				res(token);
			}
		)
	);

const verifyRefreshToken = (token) =>
	new Promise((res, rej) =>
		jwt.verify(token, jwtRefreshSecret, (err, decoded) => {
			if (err) rej(err);
			res(decoded);
		})
	);

module.exports = { authenticate, verifyJWT, handleRefreshToken };
