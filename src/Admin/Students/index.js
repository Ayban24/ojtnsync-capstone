import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Cookies from 'js-cookie';
import DataTable from '../../common/DataTable';

const Students = () => {

    const auth = JSON.parse(Cookies.get('auth'));
    const [courses, setCourses] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(0)

    const fetchStudents = async () => {
        const response = await fetch(`http://localhost:8080/courses?departmentId=${auth.departmentId}`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("courses: ",result)
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

    let header = [
        'col1',
        'col2'
    ]

    let data = [
        ['data1', 'd1'],
        ['data2', 'd2']
    ]

    const showStudents = () => {
        // const data=(courses && courses.length > 0) && courses.map((item, index) => (
        //     [item.userid, item.firstName, item.lastName, item.email, 'test', 'test']
        // ))
        console.log("test: ",courses ? courses : 0)
        return (
            <DataTable 
                header={['User ID', 'Firstname', 'Lastname', 'Email', 'Documents Approved', 'Action']} 
                data={(courses && courses.length > 0) && courses[selectedCourse].students.map((item, index) => (
                    [item.userid, item.firstName, item.lastName, item.email, getApprovedDocuments(courses[selectedCourse], item), '<Link to={`/admin/student/documents?userid=${item.userid}&course=${courses[selectedCourse].id}`}>View</Link>']
                ))} 
            />
                    /* <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Email</th>
                            <th>Documents Approved</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(courses && courses.length > 0) &&
                            courses[selectedCourse].students.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.userid}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.email}</td>
                                    <td>{getApprovedDocuments(courses[selectedCourse], item)}</td>
                                    <td><Link to={`/admin/student/documents?userid=${item.userid}&course=${courses[selectedCourse].id}`}>View</Link></td>
                                </tr>
                            ))
                        }
                    </tbody>
            </DataTable> */
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

    const handleSearch = async (e) => {
        let searchVal = e.target.value
        const response = await fetch(`http://localhost:8080/courses/search?departmentId=${auth.departmentId}&searchVal=${searchVal}`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("search courses: ",result)
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

    useEffect(() => {
        fetchStudents()
    }, []);

    return(
        <div id= "students">
            <div className='wrapper'>
                {showCoursesNav()}
                <div className='header'>
                    <input placeholder='Search' className='search' onChange={(e) => {handleSearch(e)}} />
                    <div className='header-actions'>
                        <Link to='/admin/students/add'>Add Student</Link>
                        <Link to='/admin/students/delete'>Delete Student</Link>
                    </div>
                </div>
                {showStudents()}
            </div>
        </div>
    )
}

export default Students