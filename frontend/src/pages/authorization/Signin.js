import React, { useEffect, useState } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";

import { signin } from "../../api/auth";
import { isAuthenticated, setAuth } from "../../helpers/auth";
import "./auth.scss";
import Oauth from "./Oauth/Oauth";

function Signin(props) {
	let history = useHistory();

	//If the user is logged in, dont redirect him to signin page
	useEffect(() => {
		if (isAuthenticated() && isAuthenticated().role === 1) {
			//if admin tries to go to signin page even if he logged in, redirect him to admin page
			history.push("/admin/dashboard");
		} else if (isAuthenticated()) {
			history.push("/");
		}
	}, [history]);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
		errorMsg: false,
		loading: false,
	});

	const { email, password, errorMsg, loading } = formData;

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
			errorMsg: "",
			successMsg: "",
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		//Validate inputs

		if (isEmpty(email) || isEmpty(password)) {
			setFormData({
				...formData,
				errorMsg: "All fields are required",
			});
		} else if (!isEmail(email)) {
			setFormData({
				...formData,
				errorMsg: "Invalid Email!",
			});
		} else {
			let { username, email, password } = formData;
			let body = { username, email, password };

			//If there is an error incoming response
			signin(body)
				.then((response) => {
					setAuth(
						response.data.token,
						response.data.refreshToken,
						response.data.user
					);

					if (isAuthenticated() && isAuthenticated().role === 1) {
						//redirect admin page
						console.log("admin page");
						history.push("/admin/dashboard");
					} else {
						//redirect user page
						history.push("/");
						console.log("user page");
					}
				})
				.catch((err) => {
					console.log("signing error", err);
					setFormData({
						...formData,
						errorMsg:
							err?.response?.data?.errors ||
							"Something went wrong",
					});
				});
		}
	};

	const showSignupFrom = () => {
		return (
			<Form onSubmit={handleSubmit} noValidate>
				<Form.Group controlId='formGroupEmail'>
					<Form.Label>Email</Form.Label>
					<Form.Control
						onChange={handleChange}
						name='email'
						value={email}
						type='email'
						placeholder='example@xyz.com'
					/>
				</Form.Group>
				<Form.Group controlId='formGroupPassword'>
					<Form.Label>Password</Form.Label>

					<Form.Control
						onChange={handleChange}
						name='password'
						value={password}
						type='password'
						placeholder='Password'
					/>
				</Form.Group>

				<button className='auth-btn mb-2' type='submit'>
					SignIn
				</button>
			</Form>
		);
	};
	const showLoginForm = () => {
		return (
			<div className='d-flex flex-column'>
				<div className='login-input-wrap mb-4'>
					<p className='login-label mb-0'>Email</p>
					<input
						type='email'
						name='email'
						onChange={handleChange}
						value={email}></input>
				</div>
				<div className='login-input-wrap mb-2'>
					<p className='login-label mb-0'>Password</p>
					<input
						type='password'
						name='password'
						onChange={handleChange}
						value={password}></input>
				</div>
				<Link
					className='forgot-password mb-4'
					to='/login/forgotpassword'>
					Forgot Password?
				</Link>
				{errorMsg && (
					<small className='mb-2 mt-0 text-danger text-center'>
						{errorMsg}
					</small>
				)}

				<button onClick={handleSubmit} className='sign-in-btn'>
					Sign in
				</button>
			</div>
		);
	};
	return (
		<div
			id='login-main-container'
			className='d-flex flex-column justify-content-center align-items-center'>
			<div>
				<div className='login-content-container mb-5'>
					<div className='mb-4'>
						<h2 className='mb-1'>Sign in</h2>
					</div>
					<Oauth />
					{showLoginForm()}
				</div>
				<div className='text-center'>
					<p>
						Don't have an account?{" "}
						<Link to='/auth/signup' className='font-weight-bold'>
							Join now
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
export default Signin;
