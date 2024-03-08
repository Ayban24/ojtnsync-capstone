import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './LoginForm/Login';
import Signup from './SignupForm/Signup';
import HomePage from './HomeForm/HomePage';
import AdminLoginForm from './AdminLoginForm/AdminLoginForm';
import AdminSignupForm from './AdminSignupForm/AdminSignup';
import SplashScreen from './SplashScreen'; // Import the SplashScreen component


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<SplashScreen />} /> 

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path= "/adminsignupform" element={<AdminSignupForm/>} />
        <Route path= "/adminloginform" element={<AdminLoginForm/>} />

      </Routes>
    </Router>
  );
}

export default App;

