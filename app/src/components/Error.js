import React from 'react';
import { Link } from 'react-router-dom';
const Error = () => {
	return (
		<center>
			<h1>Oops!</h1>
			<p>Page Not Found</p>
			<Link className='link-item underline' to='/'>
				Visit Our Homepage
			</Link>
		</center>
	);
};

export default Error;
