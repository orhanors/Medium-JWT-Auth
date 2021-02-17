const db = require("../models");
const bcryp = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../config/keys");
const ApiError = require("../classes/ApiError");
exports.signupController = async (req, res) => {
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

exports.signinController = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await db.Author.findOne({ email });

		//Check if the user exist
		if (!user) throw new ApiError(400, "Invalid Credentials");

		console.log("Name of the user", user.fullName);
		//Compare plain password and hashed password
		const isPasswordMatched = await bcryp.compare(password, user.password);
		if (!isPasswordMatched) throw new ApiError(400, "Invalid Credentials");

		//Create jwt payload
		const payload = {
			user: user._id,
		};

		//Create token and send both token and user
		jwt.sign(
			payload,
			jwtSecret,
			{ expiresIn: jwtExpire },
			function (err, token) {
				if (err) console.log("jwt error", err);

				const { _id, name, surname, username, email, role } = user;

				res.json({
					token,
					user: { _id, name, surname, username, email, role },
				});
			}
		);
	} catch (error) {
		console.log("SigninController error: ", error);
		next(error);
	}
};
