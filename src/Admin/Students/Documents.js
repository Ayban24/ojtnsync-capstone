import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Cookies from 'js-cookie';
import DataTable from '../../common/DataTable';

const StudentDocuments = () => {

    const auth = JSON.parse(Cookies.get('auth'));
    const [courses, setCourses] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(0)

    const fetchDocuments = async () => {
        const response = await fetch(`http://localhost:8080/courses?departmentId=${auth.departmentId}`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
				setCourses(result)
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

    const getApprovedDocuments = (course, student) => {
        let approvedCount = 0
        const requirements = course.department.requirements
        requirements.forEach(requirement => {
            requirement.documents.forEach(document => {
                if(document.submittedBy.userid == student.userid && document.status.toLowerCase() == 'approved')
                    approvedCount++;
            });
        });
        return approvedCount
    }

    const showDocuments = () => {
        return (
            <DataTable>
                <table>
                    <thead>
                        <tr>
                            <th>File name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(courses && courses.length > 0) &&
                            courses[selectedCourse].students.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.userid}</td>
                                    <td>{item.firstName}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </DataTable>
        )
    }

    const showCoursesNav = () => {
        return (<div className='course-nav'>
            {(courses && courses.length > 0) && 
                courses.map((item, index) => (
                    <a className={selectedCourse == index ? "active" : ""} key={index} onClick={() => setSelectedCourse(index)}>{item.name} DEPARTMENT</a>
                ))
            }
            
        </div>)
    }

    useEffect(() => {
        fetchDocuments()
    }, []);

    return(
        <div id= "students">
            <div className='wrapper'>
                {showCoursesNav()}
                <div className='header'>
                </div>
                {showDocuments()}
            </div>
        </div>
    )
}

export default StudentDocuments