const Author = require("../models").Author;
const { verifyJWT } = require("../helpers/jwt");
const ApiError = require("../classes/ApiError");

const authorize = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = await verifyJWT(token);
		const user = await Author.findOne({
			_id: decoded._id,
		});

		if (!user) {
			throw new ApiError(401, "Unauthorized");
		}

		req.token = token;
		req.user = user;
		next();
	} catch (e) {
		next(new ApiError(401, "Unauthorized"));
	}
};

const adminOnlyMiddleware = async (req, res, next) => {
	if (req.user && req.user.role === "admin") next();
	else {
		const err = new Error("Only for admins!");
		err.httpStatusCode = 403;
		next(err);
	}
};

module.exports = { authorize, adminOnlyMiddleware };
