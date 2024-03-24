import React, { useState, useEffect } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

// Chart.js
import "chart.js/auto";
import { Line } from 'react-chartjs-2';

export default function Dashboard() {


	const auth = Cookies.get('auth');

    const data = {
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
      

    const showDashboard = () => {
        return (
			<div>
                <h2>Test Chart</h2>
                <Line data={data} options={options} />
            </div>
        );
    }

	useEffect(() => {

    }, []);

  return <div className='student-courses'>{showDashboard()}</div>;
}
