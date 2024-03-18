import React from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../icons/logo1.png';
import './homepage.css'
import StudentCourses from '../StudentCoursesForm/StudentCourses'

const HomePage = () => {
    return (
    
      <div id='homepage'>
        <div className='wrapper'>
			<h1>Dashboard</h1>
	        <StudentCourses/>
        </div>
      </div>
      
      );
}


export default HomePage;

