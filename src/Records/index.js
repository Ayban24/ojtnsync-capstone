import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles.css';
import Cookies from 'js-cookie';

export default function Records() {
    const [documents, setDocuments] = useState(null)
    const auth = JSON.parse(localStorage.getItem('auth'));
    const location = useLocation();
    
    const fetchDocuments = async () => {
        const response = await fetch(`http://localhost:8080/api/documents/user/${auth.userid}`, {
            method: 'GET',
        })
        if (response && response.ok) {
            try {
                const result = await response.json();
                setDocuments(result)
				console.log("documents: ",result)
            } catch (error) {
                console.error('Error parsing JSON:', error);
                // Handle unexpected JSON parsing error
            }
        } else {
            console.error('Response failed:', response.status, response.statusText);
            try {
                const result = await response.json();
                // Access specific properties from the result if needed
                console.log('Error Message:', result.message);
                // Handle failure, e.g., display an error message to the user
            } catch (error) {
                console.error('Error parsing JSON:', error);
                // Handle unexpected JSON parsing error
            }
        }
    }

    useEffect(() => {
        fetchDocuments()
    },[])

    return (
        <div className='student-records'>
            <h1>RECORDS</h1>


        </div>
    )
  }