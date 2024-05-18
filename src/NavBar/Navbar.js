import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';
import Cookies from 'js-cookie';
import Logo from '../icons/logo1.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeProfileMenu, setActiveProfileMenu] = useState(false)
    const auth = Cookies.get('auth');
    const location = useLocation();

    // Function to check if a given path matches the current URL
    const isPathActive = (path) => {
        return location.pathname === path;
    };

    const logout = () => {
        Cookies.remove('auth');
        window.location.replace("/")
    }

    return(
        <div className= "Navbar">
            <a href="/" className='nav-logo'><img src="/images/nav_logo.png" alt="Logo" /></a>
            <div className='nav-menu'>
                <div className={`nav-items ${isOpen && "open"}`}>
                    <Link to={JSON.parse(auth).adminid ? `/admin/homepage` : '/homepage'} className={isPathActive(`/admin/homepage`) || isPathActive(`/homepage`) ? 'active' : ''}>Dashboard</Link>
                    {JSON.parse(auth).adminid && 
                        <Link to={`/admin/requirements?department=${JSON.parse(auth).departmentId}`} className={isPathActive(`/admin/requirements`) ? 'active' : ''}>{JSON.parse(auth).adminType && JSON.parse(auth).adminType == 'faculty' ? 'Requirements' : 'Records'}</Link>
                    }
                    {JSON.parse(auth).userid && 
                        <Link to={`/submission?department=${JSON.parse(auth).course.department.id}`} className={isPathActive(`/submission`) ? 'active' : ''}>Requirements</Link>
                    }
                    {JSON.parse(auth).adminid && JSON.parse(auth).adminType && JSON.parse(auth).adminType == 'faculty' && 
                        <>
                            <Link to={`/admin/students`} className={isPathActive(`/admin/students`) ? 'active' : ''}>Records</Link>
                            <Link to="/templates" className={isPathActive(`/templates`) ? 'active' : ''}>Templates</Link>
                        </>
                    }
                </div>
                {/* <Link to={(JSON.parse(auth).adminid) ? '' : '/profile'} className='profile-menu'><img src="/images/profile.png" /></Link> */}
                <a className='profile-menu' onClick={() => setActiveProfileMenu(!activeProfileMenu)}>
                    {activeProfileMenu &&
                        <div className='profile-modal'>
                            <Link to={(JSON.parse(auth).adminid) ? '' : '/profile'}>View Profile</Link>
                            <a onClick={logout}>Logout</a>
                        </div>
                    }
                    <img src="/images/profile.png" />
                </a>
            </div>
            <div className={`nav-toggle ${isOpen && "open"}`} onClick={() =>setIsOpen(!isOpen)}>
                <div className='bar'></div>
            </div>
        </div>
    )
}

export default Navbar;
