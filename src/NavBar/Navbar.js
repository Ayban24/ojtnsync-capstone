import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {

        const [isOpen, setIsOpen] = useState(false);
    return(
        <div className= "Navbar">
            <span className='nav-logo'>OJTnSYNC</span>
            <div className={`nav-items ${isOpen && "open"}`}>
                <Link to="/homepage">Home</Link>
                <Link to="/homepage">About Us</Link>
                <Link to="/homepage">Templates</Link>
            </div>
            <div className={`nav-toggle ${isOpen && "open"}`} 
            onClick={() =>setIsOpen(!isOpen)}>
                <div className='bar'></div>
            </div>
        </div>
    )
}

export default Navbar