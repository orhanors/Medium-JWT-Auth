import React from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar";
import Home from "./pages/home/Home";
import NewStory from "./pages/new-story/NewStory";
import Topics from "./pages/topics/Topics";
import Read from "./pages/read/Read";
import Search from "./pages/search/Search";
import Stats from "./pages/stats";
import Stories from "./pages/stories";
import SignUp from "./pages/authorization/Signup";
import SignIn from "./pages/authorization/Signin";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import { isAuthenticated } from "./helpers/auth";

const protectedRoutes = [
	{ path: "/new-story", component: NewStory },
	{ path: "/topics", component: Topics },
	{ path: "/read/:slug", component: Read },
	{ path: "/search", component: Search },
	{ path: "/stats", component: Stats },
	{ path: "/stories", component: Stories },
];

function App() {
	return (
		<Router>
			<NavBar />
			<Route path='/' exact component={Home} />

			{protectedRoutes.map(({ path, component }) => {
				return (
					<ProtectedRoute exact path={path} component={component} />
				);
			})}

			<Route path='/auth/login' exact component={SignIn} />
			<Route path='/auth/signup' exact component={SignUp} />
		</Router>
	);
}

export default App;
