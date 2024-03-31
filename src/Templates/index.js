import * as React from 'react';
import './styles.css';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Modal from '../common/Modal'

export default function Templates() {

    const [templates, setTemplates] = useState(null)
    const [file,setFile] = useState(null)
    const [title, setTitle] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const auth = JSON.parse(Cookies.get('auth'));

    const fetchTemplates = async () => {
        const response = await fetch('http://localhost:8080/templates/all', {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setTemplates(result)
                console.log("response: ",result)
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

    const showTemplates = () => {
        return (
            templates && <ul>
                {templates.map((item, index) => (
                    <li key={index}> 
                        <a href={`http://localhost:8080/templates/download/${item.id}`} target='_blank' rel='noopener noreferrer'>{item.title}</a>
                    </li>
                ))}
            </ul>
        );
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file)
        }
    };

    const submitHandler = async () => {
        try {
            const formData = new FormData();
            let uploadUrl = "http://localhost:8080/templates/upload"
            formData.append('title', title)
            formData.append('file', file);
            formData.append('adminId',auth.adminId);
    
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            })
    
            if (response.ok) {
                try {
                    const result = await response.json();
                    console.log("response: ",result.template)
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

    useEffect(() => {
        fetchTemplates()
    }, []);


    return <div id='templates'>
        <div className='wrapper'>
            <h1>Requirements Templates</h1>

            { auth.adminId &&
                <a href="#!" onClick={() => setShowModal(true)}>Add</a>
            }
            {showTemplates()}
        </div>
            { showModal && 
            <Modal show={showModal} onHide={() => setShowModal(false)}>

                <h2>Add Template</h2>
                <input type='text' placeholder='Title' onChange={(e) => setTitle(e.target.value)} />
                <input
                    type='file'
                    id='file-upload'
                    onChange={handleFileChange}
                />
                <button type='button' onClick={submitHandler} >Upload</button>

            </Modal>
            }
    </div>;
}
