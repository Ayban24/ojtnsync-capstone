import React, { useState, useEffect } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

// Chart.js
import "chart.js/auto";
import { Line, Pie } from 'react-chartjs-2';

export default function Dashboard() {

    const [courses, setCourses] = useState(null)
    const [studentsPerCourseData, setStudentsPerCourseData] = useState(null)

	const auth = Cookies.get('auth');

    const fetchStudents = async () => {
        const response = await fetch(`http://localhost:8080/courses`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
				setCourses(result)
                return result;
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
    
    const initStudentsPerCourseData = (courses) => {
        console.log("courses: ",courses)
        const colors = [
            '#8B008B',
            '#FF6347',
            '#4682B4',
            '#3CB371',
            '#FF69B4',
            '#FFD700',
            '#00FFFF',
            '#8A2BE2',
            '#00FF00',
            '#FF4500'
        ];
        const data = {
            labels: courses.map((course) => course.name),
            datasets: [
              {
                data: courses.map((course) => course.students.length),
                backgroundColor: colors,
                hoverBackgroundColor: colors,
              },
            ],
        };
        setStudentsPerCourseData(data)
    }

    const lineData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
            label: 'Sales',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            },
        ],
    };

    const pieData = {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
          {
            data: [300, 50, 100],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
    };
        
    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                    beginAtZero: true,
                    },
                },
            ],
        },
    };


	useEffect(() => {
        fetchStudents().then((courses) => {
            initStudentsPerCourseData(courses)
        })
    }, []);

    return <div className='student-courses'>
        <div>
            <h1>Dashboard</h1>
            {/* <Line data={lineData} options={options} /> */}
            {/* {studentsPerCourseData &&
                <Pie data={studentsPerCourseData} />
            } */}
        </div>
    </div>;
}
