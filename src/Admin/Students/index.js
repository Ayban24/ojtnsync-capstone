import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Cookies from 'js-cookie';
import DataTable from '../../common/DataTable';

const Students = () => {

    const auth = Cookies.get('auth');
    const [students, setStudents] = useState(null)

    const fetchStudents = async () => {
        const response = await fetch(`http://localhost:8080/users`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("response: ",result)
				setStudents(result)
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

    const showStudents = () => {
        return (
            <DataTable>
                <table>
                    <thead>
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
                        {(students && students.length > 0) &&
                            students.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.userid}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.email}</td>
                                    <td>1 (static)</td>
                                    <td><a href="#!">View</a></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </DataTable>
        )
    }

    const handleSearch = async (e) => {
        let searchVal = e.target.value
        const response = await fetch(`http://localhost:8080/searchUsers?searchVal=${searchVal}`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                setStudents(result)
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