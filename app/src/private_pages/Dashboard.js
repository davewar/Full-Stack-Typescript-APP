import React, { useContext } from 'react';
import { UserContext } from '../contexts/user';
import { format } from 'date-fns';

import { Link } from 'react-router-dom';

const Dashboard = () => {
	const { user } = useContext(UserContext); //global user

	return (
		<center>
			<h1>Welcome: {user}</h1>
			<br />

			<p>{format(new Date(), 'do MMMM Y')}</p>
			<br />
			<p>You are logged in!</p>

			<br />
			<Link to='/emails'>Emails</Link>
			<br />
			<Link to='/projects'>Projects</Link>
			<br />
			<Link to='/users'>Users</Link>
			<br />
		</center>
	);
};

export default Dashboard;
