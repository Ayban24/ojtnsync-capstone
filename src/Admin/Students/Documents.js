import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles.css';
import Cookies from 'js-cookie';
import DataTable from '../../common/DataTable';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const StudentDocuments = () => {

    const auth = JSON.parse(Cookies.get('auth'));
    const [documents, setDocuments] = useState(null)
    const [courses, setCourses] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState()
    const [check, setCheck] = useState(false)
    const [checkInfo, setCheckInfo] = useState(null)
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const fetchDocuments = async () => {
        const userId = searchParams.get('userid');
        const courseId = searchParams.get('course');
        const response = await fetch(`http://localhost:8080/api/documents/user/${userId}`, {
            method: 'GET',
        })
        const response2 = await fetch(`http://localhost:8080/courses?departmentId=${auth.departmentId}`, {
            method: 'GET',
        })

        if (response && response.ok && response2 && response.ok) {
            try {
                const result = await response.json();
                const result2 = await response2.json();
                setCourses(result2)
                setDocuments(result)
                setSelectedCourse(result2.findIndex((item) => item.id == courseId))
				console.log("documents: ",result)
                console.log("courses: ",result2)
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

    const showDocuments = () => {
        return (
            // <DataTable>
            //     <table>
            //         <thead>
            //             <tr>
            //                 <th>File name</th>
            //                 <th>Status</th>
            //             </tr>
            //         </thead>
            //         <tbody>
            //             {(documents && documents.length > 0) &&
            //                 documents.map((item, index) => (
            //                     <tr key={index}>
            //                         <td><a href="#!" onClick={() => {setCheck(true);setCheckInfo(item)}}>{item.fileName}</a></td>
            //                         <td>{item.status}</td>
            //                     </tr>
            //                 ))
            //             }
            //         </tbody>
            //     </table>
            // </DataTable>
            <DataTable 
                showFilter={false} 
                header={['File name', 'Status']} 
                data={(documents && documents.length > 0) && documents
                    .map((item, index) => ([
                        <a href="#!" onClick={() => {setCheck(true);setCheckInfo(item)}}>{item.fileName}</a>, 
                        item.status
                    ]))
                } 
            />
        )
    }

    const showCoursesNav = () => {
        return (<div className='course-nav'>
            {(courses && courses.length > 0) && 
                courses.map((item, index) => (
                    <a className={selectedCourse == index ? "active" : ""} key={index}>{item.name} DEPARTMENT</a>
                ))
            }
            
        </div>)
    }

    const showDocument = () => {
        return (
        <div className='document-con'>
            <button className='back-btn' onClick={() => setCheck(false)}>&lsaquo;</button>
            <div className='document-info'>
                <div className='header'>
                    <h4>{checkInfo.submittedBy.firstName} {checkInfo.submittedBy.lastName}</h4>
                    <div className='actions'>
                        <a href={`http://localhost:8080/file/download/${checkInfo.id}`}>Download</a>
                    </div>
                </div>
                {checkInfo.extName == "pdf" 
                    ?   <Document file={`http://localhost:8080/file/download/${checkInfo.id}`} >
                            <Page pageNumber={1} />
                        </Document>
                    :   <figure><img src={`http://localhost:8080/file/download/${checkInfo.id}`} /></figure>
                }
            </div>
        </div>
        )
    }

    useEffect(() => {
        fetchDocuments()
    }, []);

    return(
        <div id= "students">
            <div className='wrapper'>
                {showCoursesNav()}
                <div className='header'>
                </div>
                {showDocuments()}
            </div>
            {(check && checkInfo) && showDocument()}
        </div>
    )
}

export default StudentDocuments