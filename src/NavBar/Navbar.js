import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import Cookies from 'js-cookie';

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const auth = Cookies.get('auth');

    return(
        <div className= "Navbar">
            <span className='nav-logo'>OJTnSYNC</span>
            <div className={`nav-items ${isOpen && "open"}`}>
                <Link to={JSON.parse(auth).adminid ? `/admin/homepage` : '/homepage'}>Home</Link>
                {JSON.parse(auth).userid && 
                    <Link to="/homepage">About Us</Link>
                }
                {JSON.parse(auth).adminid && 
                    <Link to={`/admin/students`}>Students</Link>
                }
                <Link to="/templates">Templates</Link>
                {JSON.parse(auth).adminid && 
                    <Link to={`/admin/requirements?department=${JSON.parse(auth).departmentId}`}>Requirements</Link>
                }
            </div>
            <div className={`nav-toggle ${isOpen && "open"}`} 
            onClick={() =>setIsOpen(!isOpen)}>
                <div className='bar'></div>
            </div>
        </div>
    )
}

export default Navbar