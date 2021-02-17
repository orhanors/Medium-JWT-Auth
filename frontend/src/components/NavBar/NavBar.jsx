import React, { Component } from "react";
import {
	Navbar,
	Nav,
	Dropdown,
	Container,
	Image,
	Button,
} from "react-bootstrap";
import logo from "../../assets/medium_logo.svg";
import {
	IoNotificationsOutline,
	IoBookmarksOutline,
	IoSearchOutline,
} from "react-icons/io5";
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated, logout } from "../../helpers/auth";
const NavBar = (props) => {
	const handleLogout = () => {
		logout(() => {
			props.history.push("/auth/login");
		});
	};

	const showDropDownMenu = () => {
		return (
			<Dropdown.Menu>
				{isAuthenticated() ? (
					<>
						<Dropdown.Item as={Link} to='/new-story'>
							Write a story
						</Dropdown.Item>
						<Dropdown.Item as={Link} to='/stories'>
							Stories
						</Dropdown.Item>
						<Dropdown.Item as={Link} to='/stats'>
							Stats
						</Dropdown.Item>
						<Dropdown.Item onClick={handleLogout}>
							Logout
						</Dropdown.Item>
					</>
				) : (
					<>
						<Dropdown.Item as={Link} to='/auth/login'>
							Login
						</Dropdown.Item>
						<Dropdown.Item as={Link} to='/auth/signup'>
							Signup
						</Dropdown.Item>
					</>
				)}
			</Dropdown.Menu>
		);
	};

	const showDropDown = () => {
		return (
			<div>
				<Dropdown>
					<Dropdown.Toggle variant='success' as='div'>
						<Image
							style={{ height: 30 }}
							src='https://strive.school/favicon.ico'
							roundedCircle
						/>
					</Dropdown.Toggle>

					<div>{showDropDownMenu()}</div>
				</Dropdown>
			</div>
		);
	};
	return (
		<Navbar style={{ paddingTop: 24 }}>
			<Container>
				<Navbar.Brand as={Link} to='/'>
					<img style={{ height: 54 }} alt='medium-logo' src={logo} />
				</Navbar.Brand>
				<h5 style={{ fontWeight: "bold", marginTop: "0.6em" }}>
					Good Morning
				</h5>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='ml-auto'>
						<Nav.Link as={Link} to='/search'>
							<IoSearchOutline style={{ fontSize: 20 }} />
						</Nav.Link>
						<Nav.Link href='#home'>
							<IoBookmarksOutline style={{ fontSize: 20 }} />
						</Nav.Link>
						<Nav.Link href='#link' className='medium-icon'>
							<IoNotificationsOutline style={{ fontSize: 20 }} />
						</Nav.Link>
						<Nav.Link href='#link' className='medium-icon'>
							<Button variant='outline-secondary'>Upgrade</Button>
						</Nav.Link>
						<div>{showDropDown()}</div>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default withRouter(NavBar);
