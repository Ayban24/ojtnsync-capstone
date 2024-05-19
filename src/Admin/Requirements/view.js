import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { Link, useLocation } from 'react-router-dom';
import DataTable from '../../common/DataTable';
import CustomModal from '../../common/Modal'

export default function Submission() {
    const [requirements, setRequirements] = useState(null)
    const [student, setStudent] = useState(null)
    const [activeEditRecords, setActiveEditRecords] = useState(false)

    const auth = Cookies.get('auth');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const fetchUser = async () => {
        const response = await fetch(`http://localhost:8080/userByID/${searchParams.get('userid')}`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("student: ",result)
                setStudent(result)
                return result
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

    const toggleNloRecords = async (requirementId, status) => {
        const formData = new FormData();
        formData.append('requirementId', requirementId)
        formData.append('userId', JSON.parse(auth.userid))
        formData.append('status', status)

        const response = await fetch(`http://localhost:8080/api/documents/nlo/create`, {
            method: 'POST',
            body: formData,
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("nlo record toggle: ",result)
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

    const fetchRequirements = async (student) => {
        const response = await fetch(`http://localhost:8080/api/requirements/department/${JSON.parse(auth).adminid}/course/${student.course.id}?userid=${student.userid}`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setRequirements(result)
                console.log("response: ",result)
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

    const showNloRequirements = () => {

        const  nloRequirements = {
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
        
        if(requirements) {
            // Sets the status for each requirements
            requirements.forEach(item => {
                if(nloRequirements.hasOwnProperty(item.title))
                    nloRequirements[item.title][1] = item?.documents?.[0]?.status.toLowerCase()
            });
        }

        const requirementDetails = requirements?.filter(item => item?.documents?.[0]).map(item2 => {
            return [
                item2.documents[0].fileName,
                item2.title,
                item2.documents[0].status
            ]
        })
        
        return (
            requirements && 
            <>
                <div className='student-documents requirement-section'>
                    <DataTable 
                        showFilter={false}
                        header={['File name', 'Requirement Name', 'Status']} 
                        data={requirementDetails} 
                    />
                </div>

                <div className='nlo-requirements-con requirement-section'>
                    <div className='nlo-requirements'>
                        <div className='nlo-requirements-header'>
                            <h2>NLO RECORDS</h2>
                            <a href='javascript:;' className='edit-btn btn-yellow' onClick={() => setActiveEditRecords(true)}>EDIT</a>
                        </div>
                        <ul>
                            {requirements
                            .filter(req => nloRequirements[req.title] && nloRequirements[req.title].length > 0)
                            .map((item, index) => (
                                <li key={index}>
                                    <a style={{color: nloRequirements[item.title] ? nloRequirements[item.title][2] : '#000'}} href='javascript:;'>{item.title}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='tbl-requirements-status-con'>

                        <table className='tbl-requirements-status tbl-requirements-status1'>
                            <thead>
                                <tr>
                                    {
                                        Object.entries(nloRequirements).map(([key, value]) => {
                                            return <th style={{color:value[2]}}>{value[0]}</th>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    { nloRequirements && requirements &&
                                        Object.entries(nloRequirements).map(([key, value]) => {
                                            return <td>
                                                <a href='javascript:;' className={`status status-${value[1]}`} onClick={() => {
                                                    const req = requirements.find(item => item.title == key)
                                                    // const newStatus = (req.status == 'Active') ? ''
                                                    // toggleNloRecords(req.id, req.status)
                                                }}></a>
                                            </td>
                                        })
                                    }
                                </tr>
                            </tbody>
                        </table>

                        <table className='tbl-requirements-status'>
                            <thead>
                                <tr>
                                    <th>Lacking File/Files</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {
                                            nloRequirements && 
                                            Object.entries(nloRequirements).filter((value) => {
                                                return (value?.[1]?.[1] != "approved")
                                            })
                                            .map(val => val[1]?.[0])
                                            .join(", ")
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table className='tbl-requirements-status'>
                            <thead>
                                <tr><th>Remarks</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {student?.remarks}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    }

    const showEditRecordsModal = () => {
        return <div className="edit-records-modal">
            <CustomModal show={true}>
                <div className='edit-records-modal-header'>
                    <h2>Edit Records</h2>
                    <a href='javascript:;' onClick={() => setActiveEditRecords(false)}><img src="/icons/close.png" /></a>
                </div>
                {showNloRequirements()}
            </CustomModal>
        </div>
    }

    useEffect(() => {
        const fetchData = async () => {
            const student = await fetchUser();
            fetchRequirements(student);
        };
    
        fetchData();
    }, []);
  
    return (
        <div id='requirements-view'>
            <div className='wrapper'>
                <div className='profile requirement-section'>
                    <section><img src="/images/profile_placeholder.png" /></section>
                    <section>
                        <p>Name</p>
                        <p>Email</p>
                        <p>Company Name</p>
                    </section>
                    <section>
                        {student && 
                            <>
                                <p>{student.firstName} {student.lastName}</p>
                                <p>{student.email}</p>
                                <p>{student.companyName}</p>
                            </>
                        }
                    </section>
                    <section>
                    <Link to={`/profile?userid=${student?.userid}`} className='btn-yellow'>View Profile</Link>
                    </section>
                </div>
                <div className='requirements-content'>
                    {showNloRequirements()}
                </div>
            </div>
            {activeEditRecords && showEditRecordsModal()}
        </div>
    );
  }