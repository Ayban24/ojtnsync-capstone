import React from 'react';
import './styles.css'
import Programs from '../Programs'
import Cookies from 'js-cookie';

const HomePage = () => {
	const ys = JSON.parse(Cookies.get('ys'));

	return (
	
		<div id='homepage'>
			<div className='wrapper'>
				<h1>Dashboard</h1>
				<Programs/>
			</div>
		</div>
	
	);
}


export default HomePage;

