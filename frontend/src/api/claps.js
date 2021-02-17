import axios from "axios";

const { REACT_APP_BE_DEV_URL } = process.env;

export const postClaps = async (articleId, authorId) => {
	const config = {
		headers: {
			"Content-type": "application/json",
		},
	};

	try {
		const response = await axios.post(
			`${REACT_APP_BE_DEV_URL}/articles/${articleId}/claps/${authorId}`,
			config
		);
		return response.data;
	} catch (error) {
		console.log("Claps POST error", error);
		return error.response.data;
	}
};
