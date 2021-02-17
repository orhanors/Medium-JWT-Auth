import axios from "axios";

import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getCookie, setCookie } from "../helpers/cookies";

const { REACT_APP_BE_DEV_URL } = process.env;
const refreshAuthLogic = (failedRequest) =>
	axios
		.post(`${process.env.REACT_APP_BE_DEV_URL}/auth/refreshToken`, {
			refreshToken: getCookie("refreshToken"),
		})
		.then((tokenRefreshResponse) => {
			console.log("Refresh token logic is working....");
			setCookie("refreshToken", tokenRefreshResponse.data.refreshToken);

			setCookie("token", tokenRefreshResponse.data.token);

			failedRequest.response.config.headers["Authorization"] =
				"Bearer " + tokenRefreshResponse.data.token;
			return Promise.resolve();
		});

createAuthRefreshInterceptor(axios, refreshAuthLogic);

export const publishArticle = async (article) => {
	const config = {
		headers: {
			"Content-type": "application/json",
			Authorization: "Bearer " + getCookie("token"),
		},
	};

	try {
		const response = await axios.post(
			`${REACT_APP_BE_DEV_URL}/articles`,
			article,
			config
		);
		return response.data;
	} catch (error) {
		console.log("Article POST error", error);
		return error.response.data;
	}
};

export const getArticles = async () => {
	try {
		const response = await axios.get(`${REACT_APP_BE_DEV_URL}/articles`);
		return response.data;
	} catch (error) {
		console.log("Article GET error", error);
		return error.response.data;
	}
};

export const getArticlesByAuthorId = async (authorId) => {
	try {
		const response = await axios.get(
			`${REACT_APP_BE_DEV_URL}/articles/user/${authorId}`
		);
		return response.data;
	} catch (error) {
		console.log("Article GETById error", error);
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

export const deleteArticle = async (articleId) => {
	try {
		const response = await axios.delete(
			`${REACT_APP_BE_DEV_URL}/articles/${articleId}`
		);
		return response.data;
	} catch (error) {
		console.log("Article DELETE error", error);
		return error.response.data;
	}
};
