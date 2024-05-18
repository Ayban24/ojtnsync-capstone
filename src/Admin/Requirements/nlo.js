import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation, Link } from 'react-router-dom';
import CustomModal from '../../common/Modal'
import DataTable from '../../common/DataTable';

export default function Submission() {
    const [requirements, setRequirements] = useState(null)
    const [isAddModal, setIsAddModal] = useState(false)
    const [requirementTitle, setRequirementTitle] = useState(null)
    const [requirementTerm, setRequirementTerm] = useState("Prelim")
    const [courses, setCourses] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(0)
    const [nloIsSelected, setNloIsSelected] = useState(true)
    const [filteredCourses, setFilteredCourses] = useState(null)

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

    const fetchRequirements = async (courseId, isNlo = true) => {
        
        const departmentId = searchParams.get('department');

        let url = (courseId && !isNlo)
            ? `http://localhost:8080/api/requirements/admin/department/${departmentId}/course/${courseId}?userid=${auth.adminid}`
            : `http://localhost:8080/api/requirements/admin/department/nlo?adminId=${auth.adminid}`
        const response = await fetch(url, {
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
                    <figure className='background'><img src="/images/folder_modal.png" /></figure>
                    <div className='add-requirement-modal'>
                        <div className='header'>
                            <h4>{courses[selectedCourse].name} <a onClick={() => setIsAddModal(false)} href='javascript:;'><img src="/icons/close.png" /></a></h4>
                            <h2>Create Requirement</h2>
                        </div>
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

    const handleSearch = (e) => {
        const searchVal = e.target.value
        const filtered = courses.filter((val) => (val.name.toLowerCase().includes(searchVal)))
        setFilteredCourses(filtered)
    }

    const showPrograms = () => {
        return (
            <div className='program-nav'>
                <input placeholder='Search' onChange={handleSearch} />
                {courses && <ul>
                    {(filteredCourses ? filteredCourses : courses ? courses : []).map((item, index) => (
                        <li className={(selectedCourse == index && !nloIsSelected) ? "active" : ""} 
                            onClick={() => {
                                    setSelectedCourse(index);
                                    setNloIsSelected(false)
                                    fetchRequirements(courses[index].id, true);
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
        if(selectedCourse != null)
            formData.append('courseId', courses[selectedCourse].id)

        const response = await fetch("http://localhost:8080/api/requirements", {
            method: 'POST',
            body: formData,
        })

        if(response && response.ok) {
            window.location.reload()
        }
    }

    // Deep clone function
    function deepClone(obj) {
        if (Array.isArray(obj)) {
            return obj.map(deepClone);
        } else if (typeof obj === 'object' && obj !== null) {
            return Object.fromEntries(
                Object.entries(obj).map(([key, val]) => [key, deepClone(val)])
            );
        } else {
            return obj;
        }
    }

    const showNloRequirements = () => {
        const nloRequirements = {
            'OC: Orientation Certificate'       : ['OC',null,'#677800'],
            'CL: Confirmation Letter'           : ['CL',null,'#E900FE'],
            'MOA: Memorandum of Agreement'      : ['MOA',null,'#000000'],
            'DOU: Deed of Undertaking'          : ['DOU',null,'#FF0808'],
            'EL: Endorsement Letter'            : ['EL',null,'#F19F00'],
            'W: Waiver'                         : ['W',null,'#047016'],
            'LOU: Letter of Undertaking'        : ['LOU',null,'#000AFF'],
            'OSL: Official Study Load'          : ['OSL',null,'#FF006B'],
            'COC: Certificate of Completion'    : ['COC',null,'#0DB09C'],
        }

        let students = []

        // Sets the status for requirement on each students
        courses[selectedCourse].students.forEach(student => {
            // copy the static nlo requirement and change the status of the requirements for each student
            const studentRequirement = deepClone(nloRequirements)
            requirements.forEach(item => {
                if(studentRequirement.hasOwnProperty(item.title) && item.documents && item.documents.length > 0) {
                    item.documents.forEach(doc => {
                        if(doc.submittedBy.userid == student.userid) {
                            studentRequirement[item.title][1] = doc.status.toLowerCase()
                        }
                    })
                }
            });
            students.push({details: student, documents: studentRequirement})
        })

        const requirementList = Object.entries(nloRequirements).map(([key, value]) => {
            return <th style={{color:value[2]}}>{value[0]}</th>
        })

        return (
            <>
                {requirements && 
                    <>
                        <div className='nlo-requirements'>
                            <ul>
                                {requirements
                                .filter(req => nloRequirements[req.title] && nloRequirements[req.title].length > 0)
                                .map((item, index) => (
                                    <li key={index}>
                                        <a style={{color: nloRequirements[item.title] ? nloRequirements[item.title][2] : '#000'}}>{item.title}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                }
                {students.length > 0 && 
                <>
                    <DataTable 
                        header={[
                            'User ID',
                            'Firstname',
                            'Lastname',
                            ...requirementList,
                            'Lacking Files',
                            'Action'
                        ]} 
                        data={students.map((item, index) => {
                                return [
                                    item.details.userid,
                                    item.details.firstName, 
                                    item.details.lastName, 
                                    ...Object.entries(item?.documents).map(([key, value]) => {
                                        return <td><i className={`status status-${value[1]}`}></i></td>
                                    }),
                                    Object.entries(item?.documents).filter((value) => {
                                        return (value?.[1]?.[1] != "approved")
                                    })
                                    .map(val => val[1]?.[0])
                                    .join(", "),
                                    <Link to={`/admin/requirements/view?userid=${item.details.userid}`}>View</Link>
                                ]
                            }
                        )} 
                    />
                </>
                }
            </>
        );
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
            <div className='wrapper'>
                <h1 className='page-title'><img src="/icons/documents.png" />OJT Records</h1>
                {requirements && showNloRequirements()}
                
                {isAddModal && showAddModal()}
            </div>
        </div>
    );
  }