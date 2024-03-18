import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation, Link } from 'react-router-dom';
import CustomModal from '../../common/Modal'

export default function Submission() {
    const [requirements, setRequirements] = useState(null)
    const [isAddModal, setIsAddModal] = useState(false)
    const [requirementTitle, setRequirementTitle] = useState(null)
    const [requirementTerm, setRequirementTerm] = useState("Prelim")

    const auth = Cookies.get('auth');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const fetchRequirements = async () => {
        
        const departmentId = searchParams.get('department');

        const response = await fetch(`http://localhost:8080/api/requirements/admin/department/${departmentId}?userid=${JSON.parse(auth).adminid}`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setRequirements(result)
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

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:8080/api/requirements/${id}`, {
            method: 'DELETE',
        })

        if (response.ok) {
            console.log("requirement deleted")
            window.location.reload()
        } else {
            console.error('Deletion failed:', response.status, response.statusText);
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

    const showRequirements = () => {
        return (
            requirements && <ul className='requirement-list'>
                {requirements.map((item, index) => (
                    <li key={index}>
                        <div className='title-con'><Link to={`/admin/validate?requirementId=${item.id}`}>{item.title}</Link></div>
                        <a className='requirement-list-delete-btn' href="#!" onClick={() => handleDelete(item.id)}>Delete</a>
                    </li>
                ))}
            </ul>
        );
    }

    const showAddModal = () => {
        return (
            <CustomModal show={isAddModal} onHide={(val) => {setIsAddModal(val)}}>
                    <div className='add-requirement-modal'>
                        <h2>Create Requirement</h2>
                        <div className='title-con'><label>Title: </label><input type='text' id='add-modal-title' onChange={(e) => setRequirementTitle(e.target.value)} /></div>
                        <div className='body-con'>
                            <div className='sidebar'>
                                <h4>Choose</h4>
                                <label htmlFor="term1" className={requirementTerm == 'Prelim' && "active-term"}><input id='term1' type='radio' name="term" value="Prelim" onChange={handleTermChange} defaultChecked />Prelim</label>
                                <label htmlFor="term2" className={requirementTerm == 'Midterm' && "active-term"}><input id='term2' type='radio' name="term" value="Midterm" onChange={handleTermChange} />Midterm</label>
                                <label htmlFor="term3" className={requirementTerm == 'Pre-Final' && "active-term"}><input id='term3' type='radio' name="term" value="Pre-Final" onChange={handleTermChange} />Pre-Final</label>
                                <label htmlFor="term4" className={requirementTerm == 'Final' && "active-term"}><input id='term4' type='radio' name="term" value="Final" onChange={handleTermChange} />Final</label>
                            </div>
                            <a href="#!" className='confirm-btn' onClick={submitRequirement}>Confirm</a>
                        </div>
                    </div>
            </CustomModal>
        )
    }

    const handleTermChange = (event) => {
        setRequirementTerm(event.target.value);
    };

    const submitRequirement = async () => {
        const formData = new FormData();
        const departmentId = searchParams.get('department');
        formData.append('requirementTitle', requirementTitle)
        formData.append('requirementTerm', requirementTerm)
        formData.append('departmentId', departmentId)

        const response = await fetch("http://localhost:8080/api/requirements", {
            method: 'POST',
            body: formData,
        })

        if(response && response.ok) {
            window.location.reload()
        }
    }

    useEffect(() => {
        fetchRequirements()
    }, []);
  
    return (
        <div id='submission'>
            <div className='wrapper'>
                <a href="#!" className='add-requirement' onClick={() => setIsAddModal(true)}>Add Requirement</a>
                <section>
                    <h2>PRELIM REQUIREMENTS</h2>
                    {showRequirements()}
                </section>
            </div>
            
            {isAddModal && showAddModal()}
            
        </div>
    );
  }