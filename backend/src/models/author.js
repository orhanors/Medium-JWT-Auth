const mongoose = require("mongoose");
const bcryp = require("bcrypt");

const AuthorSchema = new mongoose.Schema({
	name: { type: String, required: true },
	surname: { type: String, required: true },
	username: { type: String },
	email: { type: String, required: true },
	password: { type: String, required: true },
	isPremium: false,
	savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
	//articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
	//clapsedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
});

AuthorSchema.static("findAndPopulateArticles", async function (authorId) {
	const authorWithArticles = await this.findById(authorId).populate(
		"articles"
	);
	if (!authorWithArticles) return false;
	return authorWithArticles;
});

const hashUserPassword = async function (next) {
	const salt = await bcryp.genSalt(10);
	this.password = await bcryp.hash(this.password, salt);
	next();
};

AuthorSchema.pre("save", hashUserPassword);

const Author = mongoose.model("Author", AuthorSchema);
module.exports = Author;
