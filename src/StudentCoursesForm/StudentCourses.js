import React, { useState, useEffect } from 'react';
import './studentform.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ActionAreaCard() {

	const [departments, setDepartments] = useState(null);
	const [requirements, setRequirements] = useState(null)
	const [isUpdatedCompany, setIsUpdatedCompany] = useState(false)
	const auth = Cookies.get('auth');

	const fetchDepartments = async () => {
		let response = null
		if(JSON.parse(auth).userid) {
			response = await fetch(`http://localhost:8080/department/user/${JSON.parse(auth).userid}`, {
				method: 'GET',
			})
		}
        

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("response: ",result)
				setDepartments(result)
				fetchRequirements()
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

	const fetchRequirements = async () => {
        const response = await fetch(`http://localhost:8080/api/requirements/admin/department/${JSON.parse(auth).course.department.id}`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
				setRequirements(result)
                console.log("requirements: ",result)
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

	const getCompleted = (index) => {
		const requirements = departments[index].requirements
		const requirementsLength = requirements.length
		let approvedCount = 0
		requirements.forEach((item, i) => {
			if(item.documents.length > 0)
				if(item.documents[0].status.toLowerCase() == "approved")
					approvedCount++
		})
		return approvedCount > 0 ? (approvedCount / requirementsLength * 100).toFixed(0) + "%" : 0 + "%"
	}

    const showDepartments = () => {
        return (
				departments && <div className='cards'>
					{departments.map((item, index) => (
						<div className="card">
							<figure>
								<img src={item.name.toLowerCase() == "nlo" ? "/images/nlo_requirements.jpg" : "/images/course_requirements.jpg"} />
								<h2>{item.name}</h2>
							</figure>
							<h4>{item.name} Requirements</h4>
							<div className='progress-bar-con'><div className='progress-bar' style={{width: `${getCompleted(index)}`}}></div></div>
							<p>{getCompleted(index)} Completed</p>
							<Link to={"/submission?department="+item.id}></Link>
						</div>
					))}
				</div>
			
        );
    }

	const getCount = (status) => {
		let count = 0
		departments.forEach(department => {
			department.requirements.forEach(requirement => {
				if(requirement.documents.length > 0 && requirement.documents[0].status.toLowerCase() == status)
					count++
			})
		})
		return count
    }

	const validateCompany = () => {
		const user = JSON.parse(auth)
		return (
			user.companyName != null && user.companyName != ""
			&& user.companyAddress != null && user.companyAddress != ""
			&& user.contactPerson != null && user.contactPerson != ""
			&& user.designation != null && user.designation != ""
			&& user.dateStarted != null && user.dateStarted != ""
		)
	}

	useEffect(() => {
        fetchDepartments()
		setIsUpdatedCompany(validateCompany())
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

  return <div className='student-courses'>
			{ !isUpdatedCompany &&
				<div className='update-profile-warning'>
					<p>Update your<br />Profile Now!</p>
					<img src="/icons/update_profile_warning.png" />
					<Link to="/profile"></Link>
				</div>
			}
			<div className='progress-counter'>
				<section>
					<p>APPROVED DOCUMENTS</p>
					<img src='/icons/doc_approved.png' />
					{departments && 
						<h4>{getCount("approved")}</h4>
					}
				</section>
				<section>
					<p>PENDING DOCUMENTS</p>
					<img src='/icons/doc_pending.png' />
					{departments && 
						<h4>{getCount("pending")}</h4>
					}
				</section>
				<section>
					<p>DECLINED DOCUMENTS</p>
					<img src='/icons/doc_declined.png' />
					{departments && 
						<h4>{getCount("declined")}</h4>
					}
				</section>
            </div>
			<div className='overview'>
				<h4 className='cards-header'><img src="/icons/documents.png" />Overview</h4>
				{showDepartments()}
			</div>
		</div>;
}
