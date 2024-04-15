import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';
import Cookies from 'js-cookie';
import Logo from '../icons/logo1.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const auth = Cookies.get('auth');
    const location = useLocation();

    // Function to check if a given path matches the current URL
    const isPathActive = (path) => {
        return location.pathname === path;
    };

    return(
        <div className= "Navbar">
            <a href="/" className='nav-logo'><img src={Logo} alt="Logo" /></a>
            <div className={`nav-items ${isOpen && "open"}`}>
                <Link to={JSON.parse(auth).adminid ? `/admin/homepage` : '/homepage'} className={isPathActive(`/admin/homepage`) || isPathActive(`/homepage`) ? 'active' : ''}>Dashboard</Link>
                {JSON.parse(auth).adminid && 
                    <Link to={`/admin/requirements?department=${JSON.parse(auth).departmentId}`} className={isPathActive(`/admin/requirements`) ? 'active' : ''}>Requirements</Link>
                }
                {JSON.parse(auth).userid && 
                    <Link to="/homepage" className={isPathActive(`/about`) ? 'active' : ''}>About Us</Link>
                }
                {JSON.parse(auth).adminid && 
                    <Link to={`/admin/students`} className={isPathActive(`/admin/students`) ? 'active' : ''}>Students</Link>
                }
                <Link to="/templates" className={isPathActive(`/templates`) ? 'active' : ''}>Templates</Link>
            </div>
            <div className={`nav-toggle ${isOpen && "open"}`} onClick={() =>setIsOpen(!isOpen)}>
                <div className='bar'></div>
            </div>
        </div>
    )
}

export default Navbar;
