import React, { useState, useEffect } from 'react';
import './studentform.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ActionAreaCard() {

	const [departments, setDepartments] = useState(null);
	const auth = Cookies.get('auth');

	const fetchDepartments = async () => {
        const response = await fetch(`http://localhost:8080/department/user/${JSON.parse(auth).userid}`, {
            method: 'GET',
        })

        if (response.ok) {
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

	const showCompleted = (index) => {
		const requirements = departments[index].requirements
		const requirementsLength = requirements.length
		let approvedCount = 0
		requirements.forEach((item, i) => {
			if(item.documents.length > 0)
				if(item.documents[0].status.toLowerCase() == "approved")
					approvedCount++
		})
		console.log("requirements length: ",requirementsLength)
		console.log("approved count: ",approvedCount)
		return (approvedCount / requirementsLength * 100).toFixed(2) + "% Completed"
	}

    const showDepartments = () => {
        return (
				departments && <div className='cards'>
					{departments.map((item, index) => (
						<div className="card">
							<h2>{item.name} DEPARTMENT </h2>
							<h4>Upcoming</h4>
							<ul>
								<li>Deed of Undertaking / Waiver (static)</li>
							</ul>
							<p>{showCompleted(index)}</p>
							<Link to={"/submission?department="+item.id}></Link>
						</div>
					))}
				</div>
			
        );
    }

	useEffect(() => {
        fetchDepartments()
    }, []);

  	const renderCards = () => {

		// return	<div className='cards'>
		// 	<div className="card">
		// 		<h2>IT DEPARTMENT </h2>
		// 		<h4>Upcoming</h4>
		// 		<ul>
		// 			<li>Deed of Undertaking / Waiver</li>
		// 		</ul>
		// 		<p>25% completed</p>
		// 		<Link to="/submission"></Link>
		// 	</div>
		// 	<div className="card">
		// 		<h2>NLO DEPARTMENT</h2>
		// 		<h4>Upcoming</h4>
		// 		<ul>
		// 			<li>Endorsement Letter</li>
		// 			<li>Confirmation Letter</li>
		// 		</ul>
		// 		<p>50% completed</p>
		// 		<Link to="/submission"></Link>
		// 	</div>
		// </div>

  	};

  return <div className='student-courses'>{showDepartments()}</div>;
}
