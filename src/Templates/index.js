import * as React from 'react';
import './styles.css';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Templates() {

    const [requirements, setRequirements] = useState(null)
    const auth = Cookies.get('auth');

    const fetchRequirements = async () => {
        const response = await fetch('http://localhost:8080/api/requirements?userid='+JSON.parse(auth).userid, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setRequirements(result)
                console.log("response: ",result)
            } catch (error) {
                console.error('Error parsing JSON:', error);
                // Handle unexpected JSON parsing error
            }
        } else {
            console.error('Upload failed:', response.status, response.statusText);
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

    const showTemplates = () => {
        return (
            requirements && <ul>
                {requirements.map((item, index) => (
                    <li key={index}> 
                        <a href='javascript:;'>{item.title}</a>
                    </li>
                ))}
            </ul>
        );
    }

    useEffect(() => {
        fetchRequirements()
    }, []);


    return <div id='templates'>
        <div className='wrapper'>
            <h1>List of Requirements</h1>
            <h4>Templates</h4>
            {showTemplates()}
        </div>
    </div>;
}
