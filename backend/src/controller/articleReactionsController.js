const mongoose = require("mongoose");
const ApiError = require("../classes/ApiError");
const db = require("../models");

exports.articleReviewGetController = async (req, res, next) => {
	try {
		const { articleId } = req.params;
		const allReviewsForArticle = await db.Article.findById(articleId, {
			reviews: 1,
			_id: 0,
		});
		//TODO Check if the article exist
		res.status(200).json({ success: true, data: allReviewsForArticle });
	} catch (error) {
		console.log("Article GetReview controller error", error);
		next(error);
	}
};

exports.articleReviewGetByIdController = async (req, res, next) => {
	try {
		const { reviewId, articleId } = req.params;

		const { reviews } = await db.Article.findOne(
			{
				_id: articleId,
			},
			{ _id: 0, reviews: { $elemMatch: { _id: reviewId } } }
		);

		if (reviews)
			return res.status(200).json({ success: true, data: reviews });

		throw new ApiError(404, "Article Not Found");
	} catch (error) {
		console.log("Article GetReviewById controller error", error);
		next(error);
	}
};

exports.articleReviewPostController = async (req, res, next) => {
	try {
		const { articleId } = req.params;

		//Create and Save new review to Review Collection
		const newReview = await new db.Review({ ...req.body });
		await newReview.save();

		//Find and update the related article collection
		const updatedArticle = await db.Article.findByIdAndUpdate(
			articleId,
			{ $push: { reviews: newReview } },
			{ runValidators: true, new: true }
		);

		if (!updatedArticle) {
			throw new ApiError(404, "Article Not Found");
		}
		res.status(201).json({ success: true, data: updatedArticle });
	} catch (error) {
		console.log("Article PostReview controller error", error);
		next(error);
	}
};

exports.articleReviewPutController = async (req, res, next) => {
	try {
		const { articleId, reviewId } = req.params;

		//This returns a reviews array
		const { reviews } = await db.Article.findOne(
			{ _id: articleId },
			{
				_id: 0,
				reviews: { $elemMatch: { _id: reviewId } },
			}
		);

		if (reviews && reviews.length > 0) {
			const editedReview = { ...reviews[0].toObject(), ...req.body };

			const newReview = await db.Article.findOneAndUpdate(
				{ _id: articleId, "reviews._id": reviewId },
				{ $set: { "reviews.$": editedReview } },
				{ runValidators: true, new: true }
			);
			const editedReviewOnCollection = await db.Review.findOneAndUpdate(
				{ _id: reviewId },
				{
					$set: editedReview,
				},
				{ runValidators: true, new: true }
			);
			res.status(201).json({ success: true, data: editedReview });
		} else {
			throw new ApiError(404);
		}
	} catch (error) {
		console.log("Article GetReview controller error", error);
		if ((error.name = "CastError")) return next(new ApiError(404));
		next(error);
	}
};

exports.articleReviewDeleteController = async (req, res, next) => {
	try {
		const { articleId, reviewId } = req.params;

		const modifiedReviews = await db.Article.findByIdAndUpdate(
			articleId,
			{
				$pull: {
					reviews: { _id: reviewId },
				},
			},
			{ new: true }
		);

		if (!modifiedReviews) throw new ApiError(404);

		await db.Review.findByIdAndDelete(reviewId);
		res.json({ success: true, data: "OK" });
	} catch (error) {
		console.log("Article GetReview controller error", error);
		next(error);
	}
};

exports.articleClapsController = async (req, res, next) => {
	try {
		const { articleId, authorId } = req.params;

		const updatedArticle = await db.Article.findByIdAndUpdate(
			articleId,
			{ $push: { claps: authorId } },
			{ runValidators: true, new: true }
		);

		if (!updatedArticle) {
			throw new ApiError(404, "Article Not Found");
		}
		res.status(201).json({ success: true, data: updatedArticle });
	} catch (error) {
		console.log("Article GetReview controller error", error);
		next(error);
	}
};
