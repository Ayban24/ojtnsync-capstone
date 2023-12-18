import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './login.css'
import logo1 from '../icons/logo1.png';
import login_icon from '../icons/login_icon.png';
import password_icon from '../icons/password.png';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:8080/getByUserid?studentID=${studentID}&password=${password}`);
      const data = await response.json();

      if (response.ok) {    
        setLoggedInUser(data);
        setError(null);
      } else {
        setLoggedInUser(null);
        setError('Input the following fields');
      }
    } catch (error) {
      setError('Log in Failed');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className= "App">
    
    <div className= "login-container">
    <div className= "left-side">
    <img className='Logo' img src={logo1} alt="Logo" />
    <Link to="/signup">
    <h3>Create an Account</h3>
    </Link>
    </div>
    
    
    <div className= "form1">
    <div className='input'>
 
      <h2>Login</h2>
      
      <div className='input'>
              <TextField
                id="outlined-basic"
                label="Student ID"
                variant="outlined"
                type="text"
                fullWidth
                value={studentID}
                onChange={(e) => setStudentID(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={login_icon} alt="loginIcon" style={{ width: '20px', height: '20px' }}/>
                      
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className='input'>
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src={password_icon}
                        alt="PasswordIcon"
                        style={{ width: '20px', height: '20px' }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
               
      
      </div>
      <Button variant = "contained" onClick={handleLogin}>Login</Button>
    
      {loggedInUser && (
        <div>
          <h3>Welcome, {loggedInUser.firstName} {loggedInUser.lastName}!</h3>
          <p>Email: {loggedInUser.email}</p>
          <p>Course: {loggedInUser.course}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    
    </div>
    
    </div>
    
  );
};

export default LoginForm;
