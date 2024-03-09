import React, { useState } from 'react';
import './styles.css';
import Cookies from 'js-cookie';

export default function Submission() {
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [document, setDocument] = useState(null);
  
    const openUploadModal = () => setUploadModalOpen(true);
    const closeUploadModal = () => setUploadModalOpen(false);

    const openStatusModal = () => setStatusModalOpen(true);
    const closeStatusModal = () => setStatusModalOpen(false);

    const auth = Cookies.get('auth');

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
      
        if (file) {
        
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('title', 'static title');
                formData.append('description', 'static description');
                formData.append('userId',JSON.parse(auth).userid)
        
                const response = await fetch('http://localhost:8080/upload', {
                    method: 'POST',
                    body: formData,
                })
        
                if (response.ok) {
                    try {
                        const result = await response.json();
                        setDocument(result.document)
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
    };
      

    const UploadModal = ({ closeModal, children }) => {
        return (
            <div className="modal-container">
                <div onClick={closeModal}><span>&lt;</span>IT Department</div>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>Deed of Undertaking</h2>
                    <h4>Attach Files</h4>
                    <div className='attached-container'>
                        {document && (
                            <div className='file-info'>{document.fileName} <a className='delete-btn' onClick={() => {setDocument(null)}}>Delete</a></div>
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
                <h2 className='status-title'>Deed of Undertaking</h2>
                <h3>Submission Status</h3>
                <table>
                    <tr>
                        <td>Submission Status</td>
                        <td>Submitted</td>
                    </tr>
                    <tr>
                        <td>Approval Status</td>
                        <td>Pending</td>
                    </tr>
                    <tr>
                        <td>File</td>
                        <td>deedofundertaking.pdf</td>
                    </tr>
                    <tr>
                        <td>Comments</td>
                        <td>Comments</td>
                    </tr>
                </table>
                <button type='button'>Re-Upload</button>
            </div>
          </div>
        );
    };

  
    return (
        <div id='submission'>
            <div className='wrapper'>
                <h1>IT DEPARTMENT</h1>
                <section>
                    <h2>PRELIM REQUIREMENTS</h2>
                    <ul>
                        <li onClick={openUploadModal}>
                            Endorsement Letter
                        </li>
                        <li onClick={openStatusModal}>
                            Endorsement Letter
                        </li>
                    </ul>
                </section>
            </div>
            
            {/* modals */}
            {isUploadModalOpen && (
                <UploadModal closeModal={closeUploadModal}>
                    <h3>Upload modal</h3>
                </UploadModal>
            )}

            {isStatusModalOpen && (
                <StatusModal closeModal={closeStatusModal}>
                    <h3>Status modal</h3>
                </StatusModal>
            )}
            {/* end modals */}
        </div>
    );
  }