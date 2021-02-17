const mongoose = require("mongoose");
const bcryp = require("bcrypt");

const AuthorSchema = new mongoose.Schema({
	name: { type: String, required: true },
	surname: { type: String, required: true },
	username: { type: String },
	email: { type: String, required: true },
	password: { type: String, required: true },
	isPremium: { type: Boolean, default: false },
	savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
	refreshTokens: [{ token: String }],
	//articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
	//clapsedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
});

AuthorSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.__v;

	return userObject;
};

AuthorSchema.static("findAndPopulateArticles", async function (authorId) {
	const authorWithArticles = await this.findById(authorId).populate(
		"articles"
	);
	if (!authorWithArticles) return false;
	return authorWithArticles;
});

AuthorSchema.statics.findByCredentials = async function (email, password) {
	const user = await this.findOne({ email });
	//If no user return null
	if (!user) return null;

	const isMatched = await bcryp.compare(password, user.password);
	if (isMatched) return user;
	return null;
};

const hashUserPassword = async function (next) {
	const user = this;
	//If user tries to change infos except password we shouldn't change salt
	if (user.isModified("password")) {
		const salt = await bcryp.genSalt(10);
		user.password = await bcryp.hash(user.password, salt);
	}
	next();
};

AuthorSchema.pre("save", hashUserPassword);

const Author = mongoose.model("Author", AuthorSchema);
module.exports = Author;
