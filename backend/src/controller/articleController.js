const db = require("../models");
const mongoose = require("mongoose");
const ApiError = require("../classes/ApiError");
exports.articlePostController = async (req, res, next) => {
	try {
		const newArticle = new db.Article({ ...req.body });
		await newArticle.save();
		res.status(201).json({ success: true, data: newArticle });
	} catch (error) {
		console.log("Article POST controller error", error);
		next(error);
	}
};
exports.articleGetByAuthorIdController = async (req, res, next) => {
	try {
		const { authorId } = req.params;
		const articles = await db.Article.find({
			author: mongoose.Types.ObjectId(authorId),
		}).populate("author");

		if (articles)
			return res.status(OK).json({ success: true, data: articles });

		throw new ApiError(404, "Author ID Not Found");
	} catch (error) {
		console.log("Article GetByAuthorId controller error", error);
		next(error);
	}
};
exports.articleGetController = async (req, res, next) => {
	try {
		const allArticles = await db.Article.find().populate("author");

		res.status(200).json({ success: true, data: allArticles });
	} catch (error) {
		console.log("Article GET controller error", error);
		next(error);
	}
};

exports.articleGetByIdController = async (req, res, next) => {
	try {
		const { articleId } = req.params;

		const foundArticle = await db.Article.findOne({
			_id: articleId,
		}).populate("authors");

		if (foundArticle)
			return res.status(200).json({ success: true, data: foundArticle });
		throw new ApiError(404, "Article Not Found!");
	} catch (error) {
		console.log("Article GETById controller error", error);
		if ((error.name = "CastError"))
			return next(new ApiError(404, "Article Not Found"));
		next(error);
	}
};

exports.articlePutController = async (req, res, next) => {
	try {
		const { articleId } = req.params;

		const modifiedArticle = await db.Article.findByIdAndUpdate(
			articleId,
			req.body,
			{ new: true, runValidators: true }
		);

		if (foundArticle)
			return res
				.status(201)
				.json({ success: true, data: modifiedArticle });

		throw new ApiError(404, "Article Not Found");
	} catch (error) {
		console.log("Article PUT controller error", error);
		next(error);
	}
};

exports.articleDeleteController = async (req, res, next) => {
	try {
		const { articleId } = req.params;
		const deletedUser = await db.Article.findByIdAndDelete(articleId);

		if (deletedUser)
			return res.status(201).json({ success: true, data: "OK" });

		throw new ApiError(404, "Article Not Found");
	} catch (error) {
		console.log("Article DELETE controller error", error);
		if ((error.name = "CastError"))
			return next(new ApiError(404, "Article Not Found"));
		next(error);
	}
};
