import React, { useState } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import isEmail from "validator/lib/isEmail";
import equals from "validator/lib/equals";
import isEmpty from "validator/lib/isEmpty";

import { signup } from "../../api/auth";
import "./auth.scss";
import { showsuccessMessage, showErrorMessage } from "../../helpers/messages";
import Oauth from "./Oauth/Oauth";
function Signup(props) {
	const [formData, setFormData] = useState({
		name: "",
		surname: "",
		username: "",
		email: "",
		password: "",
		password2: "",
		successMsg: false,
		errorMsg: false,
		loading: false,
	});

	const {
		name,
		surname,
		username,
		email,
		password,
		password2,
		successMsg,
		errorMsg,
		loading,
	} = formData;

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

		if (
			isEmpty(email) ||
			isEmpty(username) ||
			isEmpty(password) ||
			isEmpty(password2)
		) {
			setFormData({
				...formData,
				errorMsg: "All fields are required",
				successMsg: "",
			});
		} else if (!isEmail(email)) {
			setFormData({
				...formData,
				errorMsg: "Invalid Email!",
				successMsg: "",
			});
		} else if (!equals(password, password2)) {
			setFormData({
				...formData,
				errorMsg: "Passwords are not same",
				successMsg: "",
			});
		} else {
			let { name, surname, username, email, password } = formData;
			let body = { name, surname, username, email, password };

			const response = await signup(body);
			if (response.errors) {
				setFormData({
					...formData,
					errorMsg: response.errors,
					successMsg: "",
				});
			} else {
				setFormData({
					name: "",
					surname: "",
					username: "",
					email: "",
					password: "",
					password2: "",
					errorMsg: "",
					successMsg: response.data,
				});
			}
		}
	};

	const showSignupForm2 = () => {
		return (
			<div className='d-flex flex-column mt-4'>
				<div className='login-input-wrap mb-4'>
					<p className='login-label mb-0'>Name</p>
					<input
						type='text'
						name='name'
						onChange={handleChange}
						value={name}></input>
				</div>

				<div className='login-input-wrap mb-4'>
					<p className='login-label mb-0'>Surname</p>
					<input
						type='text'
						name='surname'
						onChange={handleChange}
						value={surname}></input>
				</div>

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

				<div className='login-input-wrap mb-2'>
					<p className='login-label mb-0'>Confirm Password</p>
					<input
						type='password'
						name='password2'
						onChange={handleChange}
						value={password2}></input>
				</div>

				{errorMsg && (
					<small className='mb-2 mt-0 text-danger text-center'>
						{errorMsg}
					</small>
				)}

				{successMsg && (
					<small className='mb-2 mt-0 text-success text-center'>
						{successMsg}
					</small>
				)}
				<hr />

				<button onClick={handleSubmit} className='sign-in-btn'>
					Sign up
				</button>

				<div className='text-center'>
					<p className='mt-2'>
						Already have an account?{" "}
						<Link to='/auth/login' className='font-weight-bold'>
							Login
						</Link>
					</p>
				</div>
			</div>
		);
	};

	return (
		<div
			id='login-main-container'
			className='d-flex flex-column justify-content-center align-items-center'>
			<div>
				<div className='signup-content-container mb-5'>
					<div className='mb-4'>
						<h2 className='mb-1'>Sign up</h2>
					</div>
					<Oauth />
					{showSignupForm2()}
				</div>
			</div>
		</div>
	);
}

export default Signup;
