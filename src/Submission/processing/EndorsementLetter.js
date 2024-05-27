import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image, pdf  } from '@react-pdf/renderer';

export default function EndorsementLetter({onGenerate}) {

    const auth = localStorage.getItem('auth');

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

    const MyDocument = () => (
        <Document pageMode='fullScreen' title='mypdf.pdf'>
          <Page size="A4" style={styles.page}>
            <View style={styles.paragraph}>
                <Image src='/images/cit_logo.png' />
                <Text>COLLEGE OF COMPUTER STUDIES</Text>
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
                    In connection with the prescribed curriculum for the BS in Information Technology program in
                    Cebu Institute of Technology-University, we would like to request your office to accommodate
                    our student, Mr. Vince lvan C. Cafete to undergo the required 500 hours (minimum) of On-the-
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

    useEffect(() => {

    }, []);
  
    return (
        <div id='endorsement-letter'>
            <h1>ENDORSEMENT LETTER REQUEST</h1>
            <PDFViewer className="pdf-viewer"   >
                <MyDocument />
            </PDFViewer>
            <a href='#!' onClick={sendPDFToBackend}>Submit</a>
        </div>
    );
  }