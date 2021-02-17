import axios from "axios";

export const signup = async (data) => {
	const config = {
		headers: {
			"Content-type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		credentials: "include",
	};

	try {
		const response = await axios.post(
			`${process.env.REACT_APP_BE_DEV_URL}/auth/signup`,
			data,
			config
		);
		console.log("response data --->", response.data);
		if (response.success) {
			return response.data;
		} else {
			return response.data;
		}
	} catch (error) {
		console.log("Error in signup fetching", error);
		console.log("error response data", error.response.data);
		return error.response.data;
	}
};

export const signin = async (data) => {
	const config = {
		headers: { "Content-type": "application/json" },
	};

	const response = await axios.post(
		`${process.env.REACT_APP_BE_DEV_URL}/auth/signin`,
		data,
		config
	);

	return response;
};
