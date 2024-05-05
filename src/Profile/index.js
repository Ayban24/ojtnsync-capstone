import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

export default function Submission() {
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [profile, setProfile] = useState(null)
    const [courses, setCourses] = useState(null)
    const auth = JSON.parse(Cookies.get('auth'));

    const fetchCourses = async () => {
		let response = null
        response = await fetch(`http://localhost:8080/courses`, {
            method: 'GET',
        })

        if (response.ok) {
			try {
				const result = await response.json();
                console.log("courses: ",result)
				setCourses(result)
			} catch (error) {
				console.error('Error parsing JSON:', error);
			}
		} else {
			console.error('Fetching of courses failed:', response.status, response.statusText);
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
        fetchCourses().then(() => {
            setProfile({
                firstName   : auth.firstName,
                lastName    : auth.lastName,
                email       : auth.email,
                phone       : auth.phone,
                course      : auth.course,
            })
        })
    },[])

    return (
        <div id='profile'>
            <div className='wrapper'>
                <div className='profile-con'>
                    <div className='profile-top'>
                        <section className='profile-top-left'>
                            <figure><img src='/images/profile_placeholder.png' /></figure>
                            <h2>{profile?.firstName} {profile?.lastName}</h2>
                            <p>{auth.course.name}</p>
                            <p>{profile?.phone}</p>
                        </section>
                        <section className='profile-top-right'>
                            <div className='profile-field-con'>
                                <div className='profile-field'>
                                    <label>Full Name</label>
                                    <input 
                                        value={profile?.firstName+' '+profile?.lastName}
                                    />
                                </div>
                                <div className='profile-field'>
                                    <label>Email</label>
                                    <input 
                                        value={profile?.email} 
                                        onChange={(e) => {}}
                                    />
                                </div>
                                <div className='profile-field'>
                                    <label>Phone</label>
                                    <input value={profile?.phone} />
                                </div>
                                <div className='profile-field'>
                                    <label>Course</label>
                                    <input value={profile?.course.name} />
                                </div>
                            </div>
                            <button>Edit</button>
                        </section>
                    </div>
                    <div className='profile-btm'>
                        <section>
                            <div className='profile-btm-header'>
                                <h2>COMPANY DETAILS</h2>
                                <button>Edit</button>
                            </div>
                            <div className='profile-btm-body'>
                                <div className='profile-field'>
                                    <label>Company Name</label>
                                    <input value="Knowles Institute" />
                                </div>
                                <div className='profile-field'>
                                    <label>Company Address</label>
                                    <input value="60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore" />
                                </div>
                                <div className='profile-field'>
                                    <label>Name of Contact Person</label>
                                    <input value="Mr. John Bawiga" />
                                </div>
                                <div className='profile-field'>
                                    <label>Designation</label>
                                    <input value="HR Director" />
                                </div>
                                <div className='profile-field'>
                                    <label>Date Started</label>
                                    <input value="January 11, 2024" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
  }