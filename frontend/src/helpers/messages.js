import { Alert } from "react-bootstrap";

export const showsuccessMessage = (msg) => {
	return <Alert variant='success'>{msg}</Alert>;
};

export const showErrorMessage = (msg) => {
	return <Alert variant='danger'>{msg}</Alert>;
};
