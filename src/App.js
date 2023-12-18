import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './LoginForm/Login';
import Signup from './SignupForm/Signup';
import HomePage from './HomeForm/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />

      </Routes>
    </Router>
  );
}

export default App;

