const { text } = require("express");
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
	{
		text: { type: String, required: true },
		user: { type: String, required: true },
	},
	{ timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
