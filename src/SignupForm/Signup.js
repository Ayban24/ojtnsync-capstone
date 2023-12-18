import React, { useState } from 'react';
import logo1 from '../icons/logo1.png';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { TextField, Modal, Typography } from '@mui/material';

const SignupForm = () => {
  const [studentID, setStudentID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [course, setCourse] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!studentID || !firstName || !lastName || !course || !email || !password) {
      setErrorMessage('Input all fields!');
      setErrorModalOpen(true);
      return; // Stop execution if any field is empty
    }
    if (password !== confirmPassword) {
      setErrorMessage("Password and Confirm Password don't match");
      setErrorModalOpen(true);
      return;
    }
    const user = {
      studentID,
      firstName,
      lastName,
      course,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        console.log('User created successfully');
        setSuccessModalOpen(true);

      } else {
        const errorResponse = await response.text();
        setErrorMessage(errorResponse);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setErrorModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSuccessModalOpen(false);
    navigate('/');

    // Additional logic if needed
  };
  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
    // Additional logic if needed
  };
  return (
    <div className= "App">

    <div className= "signup-container">
    <div className= "left-side">
    <img className='Logo' img src={logo1} alt="Logo" />
    <Link to="/">
    <h3>Already have an account?</h3>
    </Link>
    </div>

    <div className= "form">
    <div className='input'>
      <h2>Signup</h2>
      
        <div className='input'>
          <TextField htmlFor="studentID" label="Student ID" variant="outlined"
          
            type="text"
            id="studentID"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
            style={{ width: '100%', height: '100%'}}>
            </TextField>
        </div>


        <div className='input'> 
          <TextField htmlFor="firstName" label="Firstname" variant="outlined"         
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ width: '100%', height: '100%'}}>
          </TextField>
        </div>


        <div className='input'> 
          <TextField htmlFor="lastName" label="Lastname" variant="outlined"      
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ width: '100%', height: '100%'}}>         
        </TextField>
        </div>
        
        <div className='input'>
          <TextField htmlFor="course" label="Course" variant="outlined"
            type="text"
            id="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            style={{ width: '100%', height: '100%'}}>
          </TextField>
        </div>

        <div className='input'>
          <TextField htmlFor="email" label="Email" variant="outlined" 
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', height: '100%'}}>
            </TextField>
        </div>

        <div className='input'>
          <TextField htmlFor="password" label="Password" variant="outlined"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', height: '100%'}}>
          </TextField>
        </div>
        <div className='input'>
    <TextField
      htmlFor='confirmPassword'
      label='Confirm Password'
      variant='outlined'
      type='password'
      id='confirmPassword'
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      style={{ width: '100%', height: '100%' }}
    />
  </div> 
        <div className='input'>
        <Button variant = "contained" onClick={handleSignup}>
          Sign Up
        </Button>
        </div>

      </div>
      </div>
    </div>
    <Modal
        open={isSuccessModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="user-created-modal-title"
        aria-describedby="user-created-modal-description"
      >
        <div className="modal-paper">
          <Typography variant="h6" id="user-created-modal-title">
            User Created Successfully!
          </Typography>
          <Typography id="user-created-modal-description">
            Congratulations! Your account has been successfully created.
          </Typography>
          <Button variant="contained" onClick={handleCloseModal}>
            Close
          </Button>
        </div>
      </Modal>
      <Modal
          open={isErrorModalOpen}
          onClose={handleCloseErrorModal}
          aria-labelledby="error-modal-title"
          aria-describedby="error-modal-description"
        >
          <div className="modal-paper">
            <Typography variant="h6" id="error-modal-title">
              Error
            </Typography>
            <Typography id="error-modal-description">
              {errorMessage || 'An error occurred during signup.'}
            </Typography>
            <Button variant="contained" onClick={handleCloseErrorModal}>
              Close
            </Button>
          </div>
        </Modal>  
    </div>
  );
};

export default SignupForm;
