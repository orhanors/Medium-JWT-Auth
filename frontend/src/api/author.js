import axios from "axios";

const { REACT_APP_BE_DEV_URL } = process.env;

export const getAuthorById = async (authorId) => {
	try {
		const response = await axios.get(
			`${REACT_APP_BE_DEV_URL}/authors/${authorId}`
		);
		return response.data;
	} catch (error) {
		console.log("Article GETById error", error);
		return error.response.data;
	}
};
