import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import EndorsementLetter from './processing/EndorsementLetter';

export default function Submission() {
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [document, setDocument] = useState(null);
    const [requirements, setRequirements] = useState(null)
    const [selectedRequirement, setSelectedRequirement] = useState(null)
    const [isReUpload, setIsReUpload] = useState(false)
    const [department, setDepartment] = useState(null)
    const [departments, setDepartments] = useState(null);
  
    const openUploadModal = () => setUploadModalOpen(true);
    const closeUploadModal = () => {setUploadModalOpen(false);setIsReUpload(false)};

    const openStatusModal = () => setStatusModalOpen(true);
    const closeStatusModal = () => setStatusModalOpen(false);

    const auth = localStorage.getItem('auth');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const fetchDepartments = async () => {
		let response = null
		if(JSON.parse(auth).userid) {
			response = await fetch(`http://localhost:8080/department/user/${JSON.parse(auth).userid}`, {
				method: 'GET',
			})
		}
        

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("departments: ",result)
				setDepartments(result)
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

    const fetchRequirements = async () => {

        const response = await fetch(`http://localhost:8080/api/requirements/admin/department/1`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setRequirements(result)
                if(result && result.length > 0)
                    setSelectedRequirement(result[0])
                console.log("nlo requirements: ",result)
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

    const fetchDepartment = async (departmentId = searchParams.get('department')) => {

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

    const showNloRequirements = () => {

        const  nloRequirements = {
            'OC: Orientation Certificate'       : ['Orientation Certificate',null,'#677800'],
            'CL: Confirmation Letter'           : ['Confirmation Letter',null,'#E900FE'],
            'MOA: Memorandum of Agreement'      : ['Memorandum of Agreement',null,'#000000'],
            'DOU: Deed of Undertaking'          : ['Deed of Undertaking',null,'#FF0808'],
            'EL: Endorsement Letter'            : ['Endorsement Letter',null,'#F19F00'],
            'W: Waiver'                         : ['Waiver',null,'#047016'],
            'LOU: Letter of Undertaking'        : ['Letter of Undertaking',null,'#000AFF'],
            'OSL: Official Study Load'          : ['Official Study Load',null,'#FF006B'],
            'COC: Certificate of Completion'    : ['Certificate of Completion',null,'#0DB09C'],
        }
        
        if(requirements) {
            // Sets the status for each requirements
            requirements.forEach(item => {
                if(nloRequirements.hasOwnProperty(item.title))
                    nloRequirements[item.title][1] = item?.documents?.[0]?.status.toLowerCase()
            });
        }
        
        return (
            requirements && 
            <>
                <div className='nlo-requirements-nav'>
                    <ul>
                        { requirements && requirements.length > 0 &&
                            requirements
                            .filter(req => !['MOA: Memorandum of Agreement','OC: Orientation Certificate'].includes(req.title))
                            .map((req, index) => {
                                return <li 
                                        key={req.id} 
                                        className={(selectedRequirement.id == req.id) ? 'active' : ''}
                                        onClick={() => {
                                            setSelectedRequirement(req)
                                            if(!['EL: Endorsement Letter'].includes(req.title)) {
                                                let hasSubmitted = false
                                                req.documents.forEach(doc => {
                                                    if(doc.submittedBy.userid == JSON.parse(auth).userid){
                                                        openStatusModal()
                                                        hasSubmitted = true
                                                    }
                                                })
                                                if(!hasSubmitted)
                                                    openUploadModal()
                                            }
                                        }}>
                                            {nloRequirements[req.title][0]}
                                    </li>
                            })
                        }
                    </ul>
                </div>
            </>
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

    const endorsementLetterHandler = async (file) => {
        try {
            const formData = new FormData();
            let uploadUrl = "http://localhost:8080/file/upload"
            if(!isReUpload) {
                formData.append('file', file, 'myfile.pdf');
                formData.append('userId',JSON.parse(auth).userid);
                formData.append('requirementId', selectedRequirement.id);
                formData.append('isReUpload',isReUpload)
            }
            else {
                formData.append('file', file, 'myfile.pdf');
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
                <img className='modal-bg' src='/images/folder.png' />
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
                                <a type='button' className='file-upload'><img src="/icons/upload.png" />Upload Document</a>
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
        fetchDepartments()
        fetchRequirements()
        fetchDepartment()
    }, []);
  
    return (
        <div id='nlo-requirements'>
            <div className='wrapper'>
                <div className='requirements-header'>
                    <h1><img src='/icons/documents.png' />NLO Requirements</h1>
                </div>

                <div className='nlo-requirements-content'>
                    {department && showNloRequirements()}
                </div>

                { selectedRequirement && selectedRequirement.title == "EL: Endorsement Letter" &&
                    <EndorsementLetter onGenerate={endorsementLetterHandler}/>
                }
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