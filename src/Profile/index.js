import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import { Verified } from '@mui/icons-material';

export default function Submission() {
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [profile, setProfile] = useState(null)
    const auth = JSON.parse(Cookies.get('auth'));

    const editProfileHandler = async () => {
        if(isEditingProfile) {
            console.log("profile: ",profile)
            const formData = new FormData();
            formData.append('studentID', profile.studentID);
            formData.append('firstName', profile.firstName);
            formData.append('lastName', profile.lastName);
            formData.append('phone', profile.phone);
            formData.append('course_id', profile.course.id);
            formData.append('email', profile.email);

            try {
                const response = await fetch(`http://localhost:8080/user/update/${profile.studentID}`, {
                    method: 'PUT',
                    body: formData,
                });

                if (response.ok) {
                    auth.firstName = profile.firstName
                    auth.lastName = profile.lastName
                    auth.phone = profile.phone
                    auth.email = profile.email
                    auth.course = profile.course
                    Cookies.set('auth', JSON.stringify(auth));
                    console.log('User updated successfully');

                } else {
                    console.log("Error updating user")
                }
            } catch (error) {
                console.error('Error during user update:', error);
            }
        }
        setIsEditingProfile(!isEditingProfile)
    }

    useEffect(() => {
        setProfile({
            userid      : auth.userid,
            studentID   : auth.studentID,
            firstName   : auth.firstName,
            lastName    : auth.lastName,
            email       : auth.email,
            phone       : auth.phone,
            course      : auth.course,
            Verified    : auth.verified,
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
                                    {!isEditingProfile ?
                                        <>
                                            <label>Full Name</label>
                                            <input 
                                                disabled
                                                value={profile?.firstName+' '+profile?.lastName}
                                            />
                                        </>
                                        : <>
                                           <div style={{ display: 'flex', height:"100%", alignItems: "center" }}>
                                                <label style={{ width: '344px' }}>First Name</label>
                                                <input 
                                                    value={profile?.firstName}
                                                    onChange={(e) => {
                                                        setProfile(prevProfile => ({
                                                            ...prevProfile,
                                                            firstName: e.target.value
                                                        }));
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', height:"100%", alignItems: "center" }}>
                                                <label style={{ width: '344px' }}>Last Name</label>
                                                <input 
                                                    value={profile?.lastName}
                                                    onChange={(e) => {
                                                        setProfile(prevProfile => ({
                                                            ...prevProfile,
                                                            lastName: e.target.value
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </>
                                    }
                                </div>
                                <div className='profile-field'>
                                    <label>Email</label>
                                    <input 
                                        disabled={!isEditingProfile}
                                        value={profile?.email} 
                                        onChange={(e) => {
                                            setProfile(prevProfile => ({
                                                ...prevProfile,
                                                email: e.target.value
                                            }));
                                        }}
                                    />
                                </div>
                                <div className='profile-field'>
                                    <label>Phone</label>
                                    <input 
                                        disabled={!isEditingProfile}
                                        value={profile?.phone} 
                                        onChange={(e) => {
                                            setProfile(prevProfile => ({
                                                ...prevProfile,
                                                phone: e.target.value
                                            }));
                                        }}
                                    />
                                </div>
                                <div className='profile-field'>
                                    <label>Course</label>
                                    <input disabled value={profile?.course.name} />
                                </div>
                            </div>
                            <button onClick={editProfileHandler}>{isEditingProfile ? 'Save' : 'Edit'}</button>
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