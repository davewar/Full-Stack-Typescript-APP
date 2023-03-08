import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

const ActivateAccount = () => {
	const [err, setErr] = useState('');
	const [success, setSuccess] = useState('');

	// /activation
	const { id } = useParams();

	const validate = async (id) => {
		try {
			const res = await fetch('/user/activation', {
				method: 'POST',
				body: JSON.stringify({ accesstoken: id }),
				headers: { 'Content-Type': 'application/json', credentials: 'include' },
			});

			const data = await res.json();

			if (data.errors) {
				setErr(data.errors);
			} else {
				setSuccess(data.msg);
			}
		} catch (err) {
			console.log('dw error message forgot pw:', err.message);
			setErr('No Server Response');
		}
	};

	useEffect(() => {
		validate(id);
	}, [id]);

	return (
		<center className='alert'>
			<p className='text-danger'>{err}</p>
			<p className='text-success'>{success}</p>
		</center>
	);
};

export default ActivateAccount;
