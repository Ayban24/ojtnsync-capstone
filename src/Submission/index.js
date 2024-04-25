import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

export default function Submission() {
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [document, setDocument] = useState(null);
    const [requirements, setRequirements] = useState(null)
    const [selectedRequirement, setSelectedRequirement] = useState(null)
    const [isReUpload, setIsReUpload] = useState(false)
    const [department, setDepartment] = useState(null)
  
    const openUploadModal = () => setUploadModalOpen(true);
    const closeUploadModal = () => {setUploadModalOpen(false);setIsReUpload(false)};

    const openStatusModal = () => setStatusModalOpen(true);
    const closeStatusModal = () => setStatusModalOpen(false);

    const auth = Cookies.get('auth');
    const location = useLocation();

    const fetchRequirements = async () => {
        
        const searchParams = new URLSearchParams(location.search);
        const departmentId = searchParams.get('department');

        const response = await fetch(`http://localhost:8080/api/requirements/department/${departmentId}/course/${JSON.parse(auth).course.id}?userid=${JSON.parse(auth).userid}`, {
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

    const fetchDepartment = async () => {
        
        const searchParams = new URLSearchParams(location.search);
        const departmentId = searchParams.get('department');

        const response = await fetch(`http://localhost:8080/department/${departmentId}`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setDepartment(result)
                console.log("department: ",result)
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

    const showRequirements = (term) => {
        return (
            requirements && <ul>
                {requirements.map((item, index) => (
                    (item.term && item.term.toLowerCase() == term) &&
                    <li key={index}>
                        <a onClick={() => {
                            // open upload modal if status is not available for this document
                            if(item.documents.length == 0)
                                openUploadModal();
                            else
                                openStatusModal();
                            setSelectedRequirement(item)
                        }}>{item.title} </a>
                        {  
                            item.documents.length > 0 && 
                            <span className={"status-"+item.documents[0].status.toLowerCase()}>{(item.documents.length > 0 && item.documents[0].status)}</span>
                        }
                    </li>
                ))}
            </ul>
        );
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setDocument(file)
        }
    };

    const submitHandler = async () => {
        try {
            const formData = new FormData();
            let uploadUrl = "http://localhost:8080/file/upload"
            if(!isReUpload) {
                formData.append('file', document);
                formData.append('userId',JSON.parse(auth).userid);
                formData.append('requirementId', selectedRequirement.id);
                formData.append('isReUpload',isReUpload)
            }
            else {
                formData.append('file', document);
                formData.append('documentId', selectedRequirement.documents[0].id)
                formData.append('userId',JSON.parse(auth).userid);
                uploadUrl = "http://localhost:8080/file/reupload"
            }
    
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            })
    
            if (response.ok) {
                try {
                    const result = await response.json();
                    console.log("response: ",result.document)
                    setDocument(null)
                    window.location.reload()
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
        } catch (error) {
            console.error('Error during file upload:', error);
            // Handle unexpected errors
        }
    }
      

    const UploadModal = ({ closeModal, title }) => {
        return (
            <div className="modal-container">
                <div className='modal-back' onClick={closeModal}><span>&lsaquo;</span>{department ? department.name : ""} Department</div>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>{title}</h2>
                    <h4>Attach Files</h4>
                    <div className='attached-container'>
                        {document && (
                            <div>
                                <div className='file-info'>{document.name} <a className='delete-btn' onClick={() => {setDocument(null)}}>Delete</a></div>
                                <a className='btn-submit' onClick={submitHandler}>Submit</a>
                            </div>
                        )}
                        {!document && (
                            <div className='file-container'>
                                <a type='button' className='file-upload'>Upload Document</a>
                                <input
                                type='file'
                                id='file-upload'
                                onChange={handleFileChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const StatusModal = ({ closeModal, children }) => {
        return (
          <div className="modal-container">
            <img className='modal-bg' src='/images/folder.png' />
            <div className='modal-back' onClick={closeModal}><span>&lsaquo;</span>{department ? department.name : ""} Department</div>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className='status-title'>{selectedRequirement.title}</h2>
                <h3>Submission Status</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>Submission Status</td>
                            <td>Submitted</td>
                        </tr>
                        <tr>
                            <td>Approval Status</td>
                            <td>{selectedRequirement.documents[0].status}</td>
                        </tr>
                        <tr>
                            <td>File</td>
                            <td>{selectedRequirement.documents[0].fileName}</td>
                        </tr>
                        <tr>
                            <td>Comments</td>
                            <td>{selectedRequirement.documents[0].comment ? selectedRequirement.documents[0].comment : "-"}</td>
                        </tr>
                    </tbody>
                </table>
                {
                    selectedRequirement.documents[0].status != "Approved" ? (
                        <button type='button' onClick={() => {
                            setIsReUpload(true); 
                            closeStatusModal(); 
                            openUploadModal();
                        }}>Re-Upload</button>
                    ) : null
                }
            </div>
          </div>
        );
    };

    useEffect(() => {
        fetchRequirements()
        fetchDepartment()
    }, []);
  
    return (
        <div id='submission'>
            <div className='wrapper'>
                <section>
                    <h2>PRELIM REQUIREMENTS</h2>
                    {showRequirements("prelim")}
                </section>
                <section>
                    <h2>MIDTERM REQUIREMENTS</h2>
                    {showRequirements("midterm")}
                </section>
                <section>
                    <h2>PRE-FINAL REQUIREMENTS</h2>
                    {showRequirements("pre-final")}
                </section>
                <section>
                    <h2>FINAL REQUIREMENTS</h2>
                    {showRequirements("final")}
                </section>
            </div>
            
            {/* modals */}
            {(isUploadModalOpen && JSON.parse(auth).verified) && (
                <UploadModal closeModal={closeUploadModal} title={selectedRequirement.title} />
            )}

            {(isStatusModalOpen && JSON.parse(auth).verified) && (
                <StatusModal closeModal={closeStatusModal} />
            )}
            {/* end modals */}
        </div>
    );
  }