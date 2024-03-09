import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './LoginForm/Login';
import Signup from './SignupForm/Signup';
import HomePage from './HomeForm/HomePage';
import AdminLoginForm from './AdminLoginForm/AdminLoginForm';
import AdminSignupForm from './AdminSignupForm/AdminSignup';
import SplashScreen from './SplashScreen'; // Import the SplashScreen component
import Templates from './Templates';
import Navbar from './NavBar/Navbar';
import Submission from './Submission';
import './App.css';

function App() {
	const currentPath = window.location.pathname;

	// Check if the current path is "/signup" or "/login"
	const isSignupOrLogin = currentPath === '/signup' || currentPath === '/login';

	// Conditionally render the Nav component
	const renderNav = () => {
		if (!isSignupOrLogin) {
		return <Navbar />;
		}
		return null;
	};

	return (
		<Router>
			{renderNav()}
			<Routes>
				<Route path="/" element={<SplashScreen />} /> 

				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
				<Route path="/homepage" element={<HomePage />} />
				<Route path= "/adminsignupform" element={<AdminSignupForm/>} />
				<Route path= "/adminloginform" element={<AdminLoginForm/>} />
				<Route path="/templates" element={<Templates/>} />
				<Route path="/submission" element={<Submission/>} />

			</Routes>
		</Router>
	);
}

export default App;

