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
  
    const openUploadModal = () => setUploadModalOpen(true);
    const closeUploadModal = () => {setUploadModalOpen(false);setIsReUpload(false)};

    const openStatusModal = () => setStatusModalOpen(true);
    const closeStatusModal = () => setStatusModalOpen(false);

    const auth = Cookies.get('auth');
    const location = useLocation();

    const fetchRequirements = async () => {
        
        const searchParams = new URLSearchParams(location.search);
        const department_id = searchParams.get('dep');

        const response = await fetch('http://localhost:8080/api/requirements?userid='+JSON.parse(auth).userid+'&department_id='+department_id, {
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

    const showRequirements = () => {
        return (
            requirements && <ul>
                {requirements.map((item, index) => (
                    <li 
                        key={index} 
                        onClick={() => {
                            // open upload modal if status is not available for this document
                            if(item.documents.length == 0)
                                openUploadModal();
                            else
                                openStatusModal();
                            setSelectedRequirement(item)
                        }}>
                            {item.title} 
                        <span className={"status-"+item.documents[0].status.toLowerCase()}>{(item.documents.length > 0 && item.documents[0].status)}</span>
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
                formData.append('title', 'static title');
                formData.append('description', 'static description');
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
                <div onClick={closeModal}><span>&lt;</span>IT Department</div>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>{title}</h2>
                    <h4>Attach Files</h4>
                    <div className='attached-container'>
                        {document && (
                            <div>
                                <div className='file-info'>{document.name} <a className='delete-btn' onClick={() => {setDocument(null)}}>Delete</a></div>
                                <a className='btn-submit' href='javascript:;' onClick={submitHandler}>Submit</a>
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
            <div onClick={closeModal}><span>&lt;</span>IT Department</div>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className='status-title'>{selectedRequirement.title}</h2>
                <h3>Submission Status</h3>
                <table>
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
                        <td>Static comment</td>
                    </tr>
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
    }, []);
  
    return (
        <div id='submission'>
            <div className='wrapper'>
                <h1>IT DEPARTMENT</h1>
                <section>
                    <h2>PRELIM REQUIREMENTS</h2>
                    {showRequirements()}
                </section>
            </div>
            
            {/* modals */}
            {isUploadModalOpen && (
                <UploadModal closeModal={closeUploadModal} title={selectedRequirement.title} />
            )}

            {isStatusModalOpen && (
                <StatusModal closeModal={closeStatusModal} />
            )}
            {/* end modals */}
        </div>
    );
  }