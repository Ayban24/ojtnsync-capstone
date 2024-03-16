import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation, Link } from 'react-router-dom';
import CustomModal from '../../common/Modal'

export default function Submission() {
    const [requirements, setRequirements] = useState(null)
    const [isAddModal, setIsAddModal] = useState(false)
    const [requirementTitle, setRequirementTitle] = useState(null)
    const [requirementTerm, setRequirementTerm] = useState(null)

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
            requirements && <ul>
                {requirements.map((item, index) => (
                    <li key={index}>
                        <Link to={`/admin/validate?requirementId=${item.id}`}>{item.title}</Link>
                        <a href="#!" onClick={() => handleDelete(item.id)}>Delete</a>
                    </li>
                ))}
            </ul>
        );
    }

    const showAddModal = () => {
        return (
            <CustomModal show={isAddModal} onHide={(val) => {setIsAddModal(val)}}>
                    <h2>Create Requirement</h2>
                    <div className='title-con'><label>Title: </label><input type='text' id='add-modal-title' onChange={(e) => setRequirementTitle(e.target.value)} /></div>
                    <input id='term1' type='radio' name="term" value="Prelim" onChange={handleTermChange} defaultChecked /><label htmlFor="term1">Prelim</label>
                    <input id='term2' type='radio' name="term" value="Midterm" onChange={handleTermChange} /><label htmlFor="term2">Midterm</label>
                    <input id='term3' type='radio' name="term" value="Pre-Final" onChange={handleTermChange} /><label htmlFor="term3">Pre-Final</label>
                    <input id='term4' type='radio' name="term" value="Final" onChange={handleTermChange} /><label htmlFor="term4">Final</label>
                    <a href="#!" onClick={submitRequirement}>Confirm</a>
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
                <a href="#!" onClick={() => setIsAddModal(true)}>Add Requirement</a>
                <section>
                    <h2>PRELIM REQUIREMENTS</h2>
                    {showRequirements()}
                </section>
            </div>
            
            {isAddModal && showAddModal()}
            
        </div>
    );
  }