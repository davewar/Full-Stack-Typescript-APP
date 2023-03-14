import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

// interface ActAccParams {
// 	id: string;
// }

const ActivateAccount = () => {
	const [err, setErr] = useState<string>('');
	const [success, setSuccess] = useState<string>('');

	// /activation
	const { id } = useParams<{ id: string }>();

	const validate = async (id: string) => {
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
			if (err instanceof Error)
				console.log('dw error message forgot pw:', err.message);
			setErr('No Server Response');
		}
	};

	useEffect(() => {
		validate(id!); // "!" = tells TypeScript that even though something looks like it could be null, it wont be, needed to remove undefinded error
	}, [id]);

	return (
		<center className='alert'>
			<p className='text-danger'>{err}</p>
			<p className='text-success'>{success}</p>
		</center>
	);
};

export default ActivateAccount;
