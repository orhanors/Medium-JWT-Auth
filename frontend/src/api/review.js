import axios from "axios";

const { REACT_APP_BE_DEV_URL } = process.env;

export const publishReview = async (articleId, review) => {
	const config = {
		headers: {
			"Content-type": "application/json",
		},
	};

	try {
		const response = await axios.post(
			`${REACT_APP_BE_DEV_URL}/articles/${articleId}`,
			review,
			config
		);
		return response.data;
	} catch (error) {
		console.log("Review POST error", error);
		return error.response.data;
	}
};

export const getReviewsForArticle = async (articleId) => {
	try {
		const response = await axios.get(
			`${REACT_APP_BE_DEV_URL}/articles/${articleId}/reviews`
		);
		return response.data;
	} catch (error) {
		console.log("Review GET error", error);
		return error.response.data;
	}
};

export const getArticlesByAuthorName = async () => {
	try {
		const response = await axios.get(
			`${REACT_APP_BE_DEV_URL}/articles/?author=orhanors`
		);
		return response.data;
	} catch (error) {
		console.log("Article GET error", error);
		return error.response.data;
	}
};

export const getArticleById = async (articleId) => {
	try {
		const response = await axios.get(
			`${REACT_APP_BE_DEV_URL}/articles/${articleId}`
		);
		return response.data;
	} catch (error) {
		console.log("Article GETById error", error);
		return error.response.data;
	}
};

export const editArticle = async (article, articleId) => {
	const config = {
		headers: {
			"Content-type": "application/json",
		},
	};
	try {
		const response = await axios.put(
			`${REACT_APP_BE_DEV_URL}/articles/${articleId}`,
			article,
			config
		);
		return response.data;
	} catch (error) {
		console.log("Article PUT error", error);
		return error.response.data;
	}
};

export const removeReview = async (articleId, reviewId) => {
	try {
		const response = await axios.delete(
			`${REACT_APP_BE_DEV_URL}/articles/${articleId}/reviews/${reviewId}`
		);
		return response.data;
	} catch (error) {
		console.log("Article DELETE error", error);
		return error.response.data;
	}
};
