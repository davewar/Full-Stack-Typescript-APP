import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { emailRegEx } from '../../utils/helpers';

const ForgotPassword = () => {
	const [email, setEmail] = useState<string>('');
	const [emailErr, setEmailErr] = useState<string>('');

	/* eslint-disable */

	const [signInErr, setSignInErr] = useState<string>('');
	const [success, setSuccess] = useState<string>('');

	const navigate = useNavigate();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		item: string
	) => {
		//clear
		setSignInErr('');

		if (item === 'email') {
			setEmail(e.target.value);
			!emailRegEx.test(e.target.value)
				? setEmailErr('Invalid Email!')
				: setEmailErr('');
		}
	};

	const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (email && !emailErr) {
			setSignInErr('');
			setSuccess('');

			try {
				const res = await fetch('/user/forgot', {
					method: 'POST',
					body: JSON.stringify({ email }),
					headers: {
						'Content-Type': 'application/json',
						credentials: 'include',
					},
				});

				const data = await res.json();

				if (data.errors) {
					setSignInErr(data.errors);
				} else {
					setSuccess(data.msg);
					setEmail('');
				}
			} catch (err) {
				if (err instanceof Error)
					console.log('dw error message forgot pw:', err.message);
				setSignInErr('No Server Response');
			}
		}
	};

	return (
		<>
			<div className='main-container'>
				<div className='sign-in'>
					<h2 className='text-center'>Reset Password</h2>

					{signInErr && (
						<div className='alert alert-danger text-center'>
							<span className='text-danger text-capitalize'>{signInErr}</span>
						</div>
					)}

					{success && (
						<div className='alert alert-success text-center'>
							<span className='text-success text-capitalize'>{success}</span>
						</div>
					)}
					<form onSubmit={handleSignin}>
						<div className='form-group'>
							<label htmlFor='email'>Email</label>
							<input
								type='email'
								required
								autoComplete='off'
								name='email'
								id='email'
								placeholder='Enter email'
								value={email}
								onChange={(e) => handleChange(e, 'email')}
								autoFocus
							/>
							<small className='text-danger'>{emailErr}</small>
						</div>

						<button type='submit' className='btn btn-blue' id='btn-save'>
							Submit
						</button>
						<div className='forgot-pw'>
							<Link className=' link-item underline' to='../login'>
								Log In
							</Link>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default ForgotPassword;
