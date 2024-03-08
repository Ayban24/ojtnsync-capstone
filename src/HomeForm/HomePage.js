import React from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../icons/logo1.png';
import './homepage.css'
import Navbar from '../NavBar/Navbar';
import StudentCourses from '../StudentCoursesForm/StudentCourses'

const HomePage = () => {
    return (
    
      <div>
      <Navbar/>
      <StudentCourses/>
      </div>
      
      );
}


export default HomePage;

