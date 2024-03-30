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
    const [courses, setCourses] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(0)

    const auth = JSON.parse(Cookies.get('auth'));
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const fetchCourses = async () => {
        
        const departmentId = searchParams.get('department');

        const response = await fetch(`http://localhost:8080/courses/get?departmentId=${departmentId}`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setCourses(result)
                console.log("courses: ",result)
                return result
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
        return null;
    }

    const fetchRequirements = async (courseId) => {
        
        const departmentId = searchParams.get('department');

        const response = await fetch(`http://localhost:8080/api/requirements/admin/department/${departmentId}/course/${courseId}?userid=${auth.adminid}`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setRequirements(result)
                console.log("resquirements: ",result)
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

    const showRequirements = (term) => {
        return (
            requirements && <ul className='requirement-list'>
                {requirements.map((item, index) => (
                    (item.term && item.term.toLowerCase() == term) &&
                    <li key={index}>
                        <div className='title-con'><Link to={`/admin/validate?requirementId=${item.id}`}>{item.title}</Link></div>
                        { (auth.adminType != "NLO") &&
                            <a className='requirement-list-delete-btn' href="#!" onClick={() => handleDelete(item.id)}>Delete</a>
                        }
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
                                <label htmlFor="term1" className={requirementTerm == 'Prelim' ? "active-term" : ""}><input id='term1' type='radio' name="term" value="Prelim" onChange={handleTermChange} defaultChecked />Prelim</label>
                                <label htmlFor="term2" className={requirementTerm == 'Midterm' ? "active-term" : ""}><input id='term2' type='radio' name="term" value="Midterm" onChange={handleTermChange} />Midterm</label>
                                <label htmlFor="term3" className={requirementTerm == 'Pre-Final' ? "active-term" : ""}><input id='term3' type='radio' name="term" value="Pre-Final" onChange={handleTermChange} />Pre-Final</label>
                                <label htmlFor="term4" className={requirementTerm == 'Final' ? "active-term" : ""}><input id='term4' type='radio' name="term" value="Final" onChange={handleTermChange} />Final</label>
                            </div>
                            <a href="#!" className='confirm-btn' onClick={submitRequirement}>Confirm</a>
                        </div>
                    </div>
            </CustomModal>
        )
    }

    const showPrograms = () => {
        return (
            <div className='program-nav'>
                <h4>Programs</h4>
                {courses && <ul>
                    {courses.map((item, index) => (
                        <li className={selectedCourse == index ? "active" : ""} 
                            onClick={() => {
                                    setSelectedCourse(index);
                                    fetchRequirements(courses[index].id);
                                }
                            } 
                            key={index}>{item.name}
                        </li>
                    ))}
                </ul>}
            </div>
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
        formData.append('courseId', courses[selectedCourse].id)

        const response = await fetch("http://localhost:8080/api/requirements", {
            method: 'POST',
            body: formData,
        })

        if(response && response.ok) {
            window.location.reload()
        }
    }

    useEffect(() => {
        fetchCourses().then((course) => {
            console.log("courses useeffect: ",course)
            fetchRequirements(course[0].id)
        })
    }, []);
  
    return (
        <div id='submission'>
            {courses && showPrograms()}
            <div className='wrapper nav-wrapper'>
                { (auth.adminType != "NLO") &&
                    <a href="#!" className='add-requirement' onClick={() => setIsAddModal(true)}>Add Requirement</a>
                }
                <section>
                    <h2>PRELIM REQUIREMENTS</h2>
                    {showRequirements("prelim")}
                </section>
                <section>
                    <h2>MIDTERM REQUIREMENTS</h2>
                    {showRequirements("midterm")}
                </section>
                <section>
                    <h2>PRE-FINAL REQUIREMENTS</h2>
                    {showRequirements("pre-final")}
                </section>
                <section>
                    <h2>FINAL REQUIREMENTS</h2>
                    {showRequirements("final")}
                </section>
            </div>
            
            {isAddModal && showAddModal()}
            
        </div>
    );
  }