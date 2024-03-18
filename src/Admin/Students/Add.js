import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Cookies from 'js-cookie';
import DataTable from '../../common/DataTable';

const Students = () => {

    const auth = Cookies.get('auth');
    const [program, setProgram] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [firstName, setFirstName] = useState(null)
    const [students, setStudents] = useState(null)

    const handleSearch = async () => {
        console.log("first name: ",firstName)
        console.log("last name:",lastName)
        console.log("program: ",program)
        const response = await fetch(`http://localhost:8080/searchUserAttributes?departmentName=${program}&firstName=${firstName}&lastName=${lastName}`, {
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

    const handleAddStudent = async (index) => {
        const response = await fetch(`http://localhost:8080/user/${students[index].studentID}/verify`, {
            method: 'PUT',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("response: ",result)
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

    const showStudents = () => {
        return (
            <DataTable>
                <table>
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Student Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { (students && students.length > 0) &&
                            students.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.department.name}</td>
                                    <td>{item.lastName}, {item.firstName}</td>
                                    <td><a href='#!' onClick={() => handleAddStudent(index)}>Add Student</a></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </DataTable>
        )
    }

    const handleClear = () => {
        setFirstName("")
        setLastName("")
        setProgram("")
    }

    useEffect(() => {
        fetchStudents()
    }, []);

    return(
        <div id= "students">
            <div className='wrapper'>
                <h2>Search for Student</h2>
                <ul className='filter'>
                    <li>
                        <label>Program</label>
                        <input type='text' value={program} onChange={(e) => setProgram(e.target.value)} />
                    </li>
                    <li>
                        <label>Lastname</label>
                        <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </li>
                    <li>
                        <label>Firstname</label>
                        <input type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </li>
                </ul>
                <div className='filter-options'>
                    <button onClick={handleSearch}>Search</button>
                    <button onClick={handleClear}>clear</button>
                </div>
                {showStudents()}
            </div>
        </div>
    )
}

export default Students