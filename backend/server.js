const express = require("express");
const cors = require("cors");
const articleRouter = require("./src/routes/articleRoute");
const authorRouter = require("./src/routes/authorRoute");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRouter = require("./src/routes/authRoute");
const {
	notFoundHandler,
	genericErrorHandler,
} = require("./src/helpers/errorHandling");
const passport = require("passport");
const oauth = require("./src/middlewares/oauth");
const cookieParser = require("cookie-parser");
const server = express();

const port = process.env.PORT || 3001;
const mongodbUri = process.env.MONGODB_URI;

mongoose
	.connect(mongodbUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to DB"))
	.catch((err) => console.log("DB Connection Error! ", err));

//CORS SETTINGS

const whitelist = [process.env.REDIRECT_URL];
const corsOptions = {
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true, //Allow cookie
};
//SETTING UP MIDDLEWARES
server.use(cors(corsOptions));
server.use(express.json());
server.use(cookieParser());
server.use(passport.initialize());

//ROUTES
server.use("/articles", articleRouter);
server.use("/authors", authorRouter);
server.use("/auth", authRouter);

//ERRO HANDLING MIDDLEWARES
server.use(notFoundHandler);
server.use(genericErrorHandler);

//---------------------------------
server.listen(port, () => {
	if (server.get("env") === "production") {
		console.log("Server is running on CLOUD on port:", port);
	} else {
		console.log("Server is running on LOCALLY on port:", port);
	}
});
