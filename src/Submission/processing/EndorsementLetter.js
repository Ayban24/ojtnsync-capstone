import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import { Document as ViewerDocument, Page as ViewerPage, pdfjs } from 'react-pdf';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image, pdf  } from '@react-pdf/renderer';

export default function EndorsementLetter({onGenerate, document, onDocChange}) {

    const auth = JSON.parse(localStorage.getItem('auth'));
    const [degree, setDegree] = useState('');
    const [salutation, setSalutation] = useState('Mr.');
    const [firstName, setFirstName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [designation, setDesignation] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [step, setStep] = useState(1)
    const [checkInfo, setCheckInfo] = useState (null)
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            degree,
            salutation,
            firstName,
            middleInitial,
            lastName,
            contactPerson,
            designation,
            companyName,
            companyAddress,
            contactNumber,
        };
        console.log(formData);
        setStep(2)
        sendPDFToBackend()
        onDocChange({
            ...document,
            step : 2
        })
    };
    

    // Create styles
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#E4E4E4',
            padding: 10,
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        },
        paragraph: {
            marginBottom: '20px'
        }
    });

    const step1 = () => {
        return <>
            <form onSubmit={handleSubmit}>
                <h4>1. Degree Program (ex. BS in Information Technology)</h4>
                <input
                    placeholder='Enter your answer'
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                />

                <div>
                    <h2>Student Details</h2>

                    <h4>2. Salutation</h4>
                    <label htmlFor="salutation-mr">
                    Mr.
                    <input
                        type='radio'
                        value="mr."
                        name='salutation'
                        id='salutation-mr'
                        checked={salutation === 'Mr.'}
                        onChange={(e) => setSalutation(e.target.value)}
                    />
                    </label>
                    <label htmlFor="salutation-mrs">
                    Mrs.
                    <input
                        type='radio'
                        value="mrs."
                        name='salutation'
                        id='salutation-mrs'
                        checked={salutation === 'Mrs.'}
                        onChange={(e) => setSalutation(e.target.value)}
                    />
                    </label>

                    <h4>3. First Name (ex. Patrick)</h4>
                    <input
                    placeholder='Enter your answer'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    />

                    <h4>4. Middle Initial (ex. L.)</h4>
                    <input
                    placeholder='Enter your answer'
                    value={middleInitial}
                    onChange={(e) => setMiddleInitial(e.target.value)}
                    />

                    <h4>5. Last Name (ex. Bacalso)</h4>
                    <input
                    placeholder='Enter your answer'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div>
                    <h2>Company Details</h2>

                    <h4>6. Name of Contact Person (ex. Consuelo R. Migallos)</h4>
                    <input
                    placeholder='Enter your answer'
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    />

                    <h4>7. Designation (ex. HR Director)</h4>
                    <input
                    placeholder='Enter your answer'
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    />

                    <h4>8. Company Name (ex. Cebu Institute of Technology - University)</h4>
                    <input
                    placeholder='Enter your answer'
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    />

                    <h4>9. Company Address (ex. N. Bacalso Avenue Cebu City 6000 Philippines)</h4>
                    <input
                    placeholder='Enter your answer'
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    />

                    <h4>10. Contact Number (ex 032 - 411 2000 loc 110)</h4>
                    <input
                    placeholder='Enter your answer'
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    />

                    <p>Please review your answers before submitting</p>
                    <button type='submit' className='btn-yellow step-submit'>Submit</button>
                </div>
            </form>
        </>
    }

    const step2 = () => {
        return <div className='faculty-approval'>
            <img src='/icons/work-in-progress.png' />
            <p>Your Document is still on review.</p>
            <p>Please wait for the faculty to make` your document</p>
        </div>
    }

    const step3 = () => {
        return <div className='faculty-approval'>
            <img src='/icons/work-in-progress.png' />
            <p>Your Document is reviewed by the NLO department.</p>
            <p>Please wait for the NLO to Approve your document.</p>
        </div>
    }

    const showDocument = () => {
        return (
        <div className='document-con'>
            <div className='document-info'>
                <div className='header'>
                    <h4>{checkInfo.submittedBy.firstName} {checkInfo.submittedBy.lastName}</h4>
                    <div className='actions'>
                        <a href={`http://localhost:8080/file/download/${checkInfo.id}`}>Download</a>
                    </div>
                </div>
                {checkInfo.extName == "pdf" 
                    ?   <ViewerDocument file={`http://localhost:8080/file/download/${checkInfo.id}`} >
                            <ViewerPage pageNumber={1} />
                        </ViewerDocument>
                    :   <figure><img src={`http://localhost:8080/file/download/${checkInfo.id}`} /></figure>
                }
            </div>
        </div>
        )
    }

    const MyDocument = () => (
        <Document pageMode='fullScreen' title='mypdf.pdf'>
          <Page size="A4" style={styles.page}>
            <View style={styles.paragraph}>
                <Image src='/images/cit_logo.png' />
                <Text>{degree}</Text>
            </View>
            <View style={styles.paragraph}>
                <Text>January 6, 2024</Text>
            </View>
            <View style={styles.paragraph}>
                <Text>Mr. Yuan ller Ponce A. llad</Text>
                <Text>HR/IT Systems Manager</Text>
                <Text>Knowwles Training Institute</Text>
                <Text>60 Paya lebar Road, #07-54 Paya Lebar Square</Text>
                <Text>Singapore 409051</Text>
            </View>
            <View style={styles.paragraph}>
                <Text>Dear Mr. llad,</Text>
            </View>
            <View>
                <Text style={styles.paragraph}>
                    In connection with the prescribed curriculum for the {degree} program in
                    Cebu Institute of Technology-University, we would like to request your office to accommodate
                    our student, {salutation} {firstName} {middleInitial}. {lastName} to undergo the required 500 hours (minimum) of On-the-
                </Text>

                <Text style={styles.paragraph}>
                    Job Training for the subject/course IT412, which will be taken this Second Semester 3.Y. 2023-
                    2024 on a Virtual training environment.
                </Text>

                <Text style={styles.paragraph}>
                    Attached is information about the OJT Program, which includes among others, our requested
                    areas of training and the training requirements we impose on our students.
                </Text>

                <Text>If our request is favorably granted, Mr. Cafiete, can start anytime this month. Furthermore, we</Text>

                <Text style={styles.paragraph}>
                    would like to request you to accomplish and return the attached confirmation letter to us in pdf,
                    through email: nlof@citedu; cc: cstaromana@citedu, cheryl.pantaleon@citedu and
                    patrick _bacalso@cit.edu for proper documentation.
                </Text>

                <Text style={styles.paragraph}>Thank you very much.</Text>

                <Text style={styles.paragraph}>Very truly yours,</Text>
            </View>
            <View style={styles.paragraph}>
                <Text>Cheryl B. Pantaleon</Text>
                <Text>Chair, IT Department</Text>
            </View>
            <View style={styles.paragraph}>
                <Text>Cherry Lyn C. Sta. Romana</Text>
                <Text>Dean, College of Computer Studies</Text>
            </View>
            <View style={styles.paragraph}>
                <Text>A. Bacako Avende, Cebu City G10, Philippines</Text>
                <Text>Tel. No. 201.7741, Faxbel No. 261-7743</Text>
                <Text>www.cit.edu</Text>
            </View>
          </Page>
        </Document>
      );


    const sendPDFToBackend = async () => {
        const blob = await pdf(<MyDocument />).toBlob();
        if(onGenerate)
            onGenerate(blob)
    };

    const showSteps = () => {
        return <div className='steps'>
            <ul>
                <li className={step == 1 && 'active'}>Step 1 <span>Document Filing</span></li>
                <li className={step == 2 && 'active'}>Step 2 <span>Faculty Approval</span></li>
                <li className={step == 3 && 'active'}>Step 3 <span>NLO Approval</span></li>
                <li className={step == 4 && 'active'}>Step 4 <span>Download</span></li>
            </ul>
        </div>
    }

    useEffect(() => {
        if(document)
            setStep(document.step || 1)
        setCheckInfo(document)
    }, []);
  
    return (
        <div id='endorsement-letter'>
            {showSteps()}
             { step && step == 1 &&
                <div>{step1()}</div>
             }
             { step && step == 2 &&
                <div>{step2()}</div>
             }
             { step && step == 3 &&
                <div>{step3()}</div>
             }
             { step && step == 4 &&

                showDocument()
                // <PDFViewer className="pdf-viewer"   >
                //     <MyDocument />
                // </PDFViewer>
            }
        </div>
    );
  }