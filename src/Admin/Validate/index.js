import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './styles.css'
import DataTable from '../../common/DataTable'
import CustomModal from '../../common/Modal'

const Validate = () => {

    const [documents, setDocuments] = useState(null)
    const [check, setCheck] = useState(false)
    const [modalInfo, setModalInfo] = useState(null)
    const [comment, setComment] = useState(null)
    const [filter, setFilter] = useState("pending")

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const requirementId = searchParams.get('requirementId');

    const fetchDocuments = async (status = "pending") => {
        setFilter(status)
        const response = await fetch(`http://localhost:8080/api/requirements/${requirementId}`, {
            method: 'GET',
        })
        if(response && response.ok) {
            try {
                const result = await response.json();
                console.log("documents: ",result.documents)
                if(!status)
                    setDocuments(result.documents)
                else
                    setDocuments(result.documents.filter((item) => item.status.toLowerCase() == status))
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

    const formatDate = (dateToFormat) => {
        const createdAtDate = new Date(dateToFormat);
        const month = createdAtDate.getMonth() + 1; // Months are zero-based, so add 1
        const day = createdAtDate.getDate();
        const year = createdAtDate.getFullYear();

        return `${month}/${day}/${year}`;
    }

    const showDocuments = () => {
        return (
            documents && 
            <table id='documents-table'>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>File Uploaded</th>
                        <th>Date/Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((item, index) => (
                        <tr key={index}>
                            <td>{item.submittedBy.userid}</td>
                            <td>{item.submittedBy.firstName}</td>
                            <td>{item.submittedBy.lastName}</td>
                            <td>{item.fileName}</td>
                            <td>{formatDate(item.createdAt)}</td>
                            {
                                (filter && filter == "pending") ? <td><a href="#!" onClick={() => {setModalInfo(item);setCheck(true);}}>Check</a></td>
                                : <td style={{textAlign:"center"}}>-</td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    const handleDocumentStatus = async (documentId = null, status = "Pending") => {
        const formData = new FormData();
        formData.append('comment', comment)
        formData.append('status', status)
        console.log("comment: ",comment)
        console.log("status: ",status)
        const response = await fetch(`http://localhost:8080/api/documents/${documentId}`, {
            method: 'PUT',
            body: formData,
        })
        if(response && response.ok) {
            console.log("Update success")
            window.location.reload();
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

    useEffect(() => {
        fetchDocuments()
    }, []);

    return (
    
      <div id='validate'>
        <div className='wrapper'>
			<h1>Validate</h1>
            <div className="validate-nav">
                <ul>
                    <input type='radio' name='status' id='status1' defaultChecked onChange={() => fetchDocuments("pending")} /><label htmlFor="status1">FOR CHECKING</label>
                    <input type='radio' name='status' id='status2' onChange={() => fetchDocuments("approved")} /><label htmlFor="status2">APPROVED</label>
                    <input type='radio' name='status' id='status3' onChange={() => fetchDocuments("declined")} /><label htmlFor="status3">DECLINED</label>
                </ul>
            </div>
            {showDocuments()}
            {(check && modalInfo) && 
                <CustomModal show={true} onHide={(val) => setCheck(val)}>
                    <div id='check-modal'>
                        <h4>{modalInfo.fileName}<span>-</span></h4>
                        <a href={`http://localhost:8080/file/download/${modalInfo.id}`} target='_blank' rel='noopener noreferrer'>Download</a>
                        <label>Enter Comments</label>
                        <textarea onChange={(e) => setComment(e.target.value)}></textarea>
                        <div className='modal-footer'>
                            <button onClick={() => handleDocumentStatus(modalInfo.id, "Declined")}>Decline</button>
                            <button onClick={() => handleDocumentStatus(modalInfo.id, "Approved")}>Approve</button>
                        </div>
                    </div>
                </CustomModal>
            }
        </div>
      </div>
      
      );
}


export default Validate;

