import React, { useState, useEffect } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ActionAreaCard() {

	const [departments, setDepartments] = useState(null);
	const auth = Cookies.get('auth');

	const fetchDepartments = async () => {
		let response = null
		if(JSON.parse(auth).adminid) {
			response = await fetch(`http://localhost:8080/department/admin/${JSON.parse(auth).adminid}`, {
				method: 'GET',
			})
		}
        

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("response: ",result)
				setDepartments(result)
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

    const showDepartments = () => {
        return (
				departments && <div className='cards'>
					{departments.map((item, index) => (
						<div className="card" key={index}>
							<h2>{item.name} DEPARTMENT</h2>
							<Link to={"/admin/submission?department="+item.id}></Link>
						</div>
					))}
				</div>
			
        );
    }

	useEffect(() => {
        fetchDepartments()
    }, []);

  return <div className='student-courses'>{showDepartments()}</div>;
}
