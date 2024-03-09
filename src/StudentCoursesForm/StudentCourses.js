import * as React from 'react';
import './studentform.css';
import { Link } from 'react-router-dom';

export default function ActionAreaCard() {

  const renderCards = () => {

		return	<div className='cards'>
			<div className="card">
				<h2>IT DEPARTMENT </h2>
				<h4>Upcoming</h4>
				<ul>
					<li>Deed of Undertaking / Waiver</li>
				</ul>
				<p>25% completed</p>
				<Link to="/submission"></Link>
			</div>
			<div className="card">
				<h2>NLO DEPARTMENT</h2>
				<h4>Upcoming</h4>
				<ul>
					<li>Endorsement Letter</li>
					<li>Confirmation Letter</li>
				</ul>
				<p>50% completed</p>
				<Link to="/submission"></Link>
			</div>
		</div>

  };

  return <div className='student-courses'>{renderCards()}</div>;
}
