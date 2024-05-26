import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import Cookies from 'js-cookie';
import DataTable from '../../common/DataTable';
import CustomModal from '../../common/Modal'

const YearSemester = () => {

    const [yearSemesters, setYearSemesters] = useState(null)
    const [activeAddModal, setActiveAddModal] = useState(false)
    const [yearInput, setYearInput] = useState(null)
    const [semesterInput, setSemesterInput] = useState(null)
    const auth = JSON.parse(Cookies.get('auth'));
    const navigate = useNavigate();

    const fetchYearSemesters = async () => {
        const response = await fetch(`http://localhost:8080/yearSemesters`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("year semesters: ",result)
				setYearSemesters(result)
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

    const onSave = async () => {
        const formData = new FormData();
		formData.append('year', yearInput);
		formData.append('semester', semesterInput);

        const response = await fetch(`http://localhost:8080/yearSemesters`, {
            method: 'POST',
            body: formData,
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("year semesters: ",result)
				window.location.reload()
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

    const showYearSemesters = () => {
        return <>
            { yearSemesters && yearSemesters.map((ys) => {
                return <section onClick={() => onYearSemesterClick(ys)}>
                    <h2>{ys.year} - {ys.semester}</h2>
                </section>
            })}
        </>
    }

    const onYearSemesterClick = (ys) => {
        Cookies.set('ys', JSON.stringify(ys));
        navigate('/admin/homepage')
    }

    useEffect(() => {
        fetchYearSemesters()
    }, []);

    return(
        <div id= "school-year">
            <div className='wrapper'>
                <div className='header'>
                    <h1>Year Semester</h1>
                    <a href='javascript:;' className='btn-yellow' onClick={() => setActiveAddModal(true)}>Add Folder</a>
                </div>
                {yearSemesters && 
                    <div className='boxes'>
                        {showYearSemesters()}
                    </div>
                }
            </div>
            { activeAddModal &&
                <CustomModal show={true} onHide={() => {setActiveAddModal(false)}}>
                        <h2>Add Modal</h2>

                        <input 
                            name='year' 
                            type='text' 
                            value={yearInput}
                            onChange={(e) => setYearInput(e.target.value)}/>
                        <input 
                            name='semester' 
                            type='text' 
                            value={semesterInput}
                            onChange={(e) => setSemesterInput(e.target.value)}/>
                        <a onClick={() => onSave()} href='javascript:;' className='btn-yellow'>Save</a>

                </CustomModal>
            }
        </div>
    )
}

export default YearSemester