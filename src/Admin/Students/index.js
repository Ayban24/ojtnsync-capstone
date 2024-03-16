import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Cookies from 'js-cookie';
import DataTable from '../../common/DataTable';

const Students = () => {

    const auth = Cookies.get('auth');
    const [program, setProgram] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [firstName, setFirstName] = useState(null)

    const handleSearch = () => {
        console.log("first name: ",firstName)
        console.log("last name:",lastName)
        console.log("program: ",program)
    }

    return(
        <div id= "students">
            <div className='wrapper'>
                <h2>Search for Student</h2>
                <ul className='filter'>
                    <li>
                        <label>Program</label>
                        <input type='text' onChange={(e) => setProgram(e.target.value)} />
                    </li>
                    <li>
                        <label>Lastname</label>
                        <input type='text' onChange={(e) => setLastName(e.target.value)} />
                    </li>
                    <li>
                        <label>Firstname</label>
                        <input type='text' onChange={(e) => setFirstName(e.target.value)} />
                    </li>
                </ul>
                <div className='filter-options'>
                    <button onClick={handleSearch}>Search</button>
                    <button>clear</button>
                </div>
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
                            <tr>
                                <td>BSIT</td>
                            </tr>
                        </tbody>
                    </table>
                </DataTable>
            </div>
        </div>
    )
}

export default Students