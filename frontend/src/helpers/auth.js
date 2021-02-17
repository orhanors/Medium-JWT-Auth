import {
	getLocalStorage,
	setLocalStorage,
	deleteLocalStorage,
} from "./localStorage";
import { getCookie, setCookie, deleteCookie } from "./cookies";

// set token in cookie and user info in localstorage
export const setAuth = (token, refreshToken, user) => {
	setLocalStorage("user", user);
	setCookie("token", token);
	setCookie("refreshToken", refreshToken);
};

//check if there are cookie and user
export const isAuthenticated = () => {
	if (getCookie("token") && getLocalStorage("user")) {
		return getLocalStorage("user");
	} else {
		return false;
	}
};

export const logout = (next) => {
	deleteCookie("token");
	deleteCookie("refreshToken");
	deleteLocalStorage("user");
	next(); //callback function
};
