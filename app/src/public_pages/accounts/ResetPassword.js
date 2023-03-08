import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './login.css';
import { emailRegEx } from '../../utils/helpers';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';

const ResetPassword = () => {
	const [email, setEmail] = useState('');
	const [emailErr, setEmailErr] = useState('');
	const [password, setPassword] = useState('');
	const [passwordErr, setPasswordErr] = useState('');

	const [password2, setPassword2] = useState('');
	const [passwordErr2, setPasswordErr2] = useState('');
	/* eslint-disable */

	const [signInErr, setSignInErr] = useState('');
	const [success, setSuccess] = useState('');
	//password visable
	const [visable, setVisable] = useState('false');
	const [visable2, setVisable2] = useState('false');

	const { id } = useParams();

	const handleChange = (e, item) => {
		//clear
		setSignInErr('');

		/* eslint-disable */

		// To use in Prod
		// if (item === 'password') {
		// 	setPassword(e.target.value);

		// 	let pwdValid = !pwdRegex.test(password);

		// 	!pwdRegex.test(password)
		// 		? setPasswordErr(
		// 				'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
		// 		  )
		// 		: setPasswordErr('');
		// }

		if (item === 'email') {
			setEmail(e.target.value);
			!emailRegEx.test(e.target.value)
				? setEmailErr('Invalid Email!')
				: setEmailErr('');
		} else if (item === 'password') {
			setPassword(e.target.value);
			e.target.value.length < 6
				? setPasswordErr('Password must be at least 6 characters!')
				: setPasswordErr('');
		} else if (item === 'password2') {
			setPassword2(e.target.value);

			e.target.value !== password
				? setPasswordErr2('Passwords are not the same')
				: setPasswordErr2('');
		}
	};

	const handleSignin = async (e) => {
		e.preventDefault();

		if (
			email &&
			password &&
			password2 &&
			!emailErr &&
			!passwordErr &&
			!passwordErr2
		) {
			setSignInErr('');
			setSuccess('');

			try {
				const res = await fetch('/user/reset', {
					method: 'POST',
					body: JSON.stringify({ email, password, accesstoken: id }),
					headers: {
						'Content-Type': 'application/json',
						credentials: 'include',
					},
				});

				const data = await res.json();

				if (data.errors) {
					setSignInErr(data.errors);
				} else {
					if (data.msg) {
						setSuccess(data.msg);
						setEmail('');
						setPassword('');
						setPassword2('');
					}
				}
			} catch (err) {
				console.log('dw', err.message);
				setSignInErr('No Server Response');
			}
		}
	};
	//toggle password
	const toggleType = (e, name) => {
		if (name === 'password') {
			setVisable((prev) => !prev);
		} else {
			setVisable2((prev) => !prev);
		}
	};

	return (
		<>
			<div className='main-container'>
				<div className='sign-in'>
					<h2 className='text-center'>Create your new Password</h2>

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
					{success.length == 0 ? (
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
							<div className='form-group'>
								<label htmlFor='password'>Password</label>
								<div className='input-container'>
									<input
										type={visable ? 'password' : 'text'}
										required
										autoComplete='off'
										name='password'
										id='passwordl'
										placeholder='Enter password'
										value={password}
										onChange={(e) => handleChange(e, 'password')}
									/>
									<button
										className='icon'
										onClick={(e) => toggleType(e, 'password')}
									>
										{visable ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
									</button>
								</div>
								<small className='text-danger'>{passwordErr}</small>
							</div>

							<div className='form-group'>
								<label htmlFor='password2'>Confirm Password</label>
								<div className='input-container'>
									<input
										type={visable2 ? 'password' : 'text'}
										required
										autoComplete='off'
										name='password2'
										id='password2'
										placeholder='Re-enter password'
										value={password2}
										onChange={(e) => handleChange(e, 'password2')}
									/>
									<button
										className='icon'
										onClick={(e) => toggleType(e, 'password2')}
									>
										{visable2 ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
									</button>
								</div>
								<small className='text-danger'>{passwordErr2}</small>
							</div>

							<button type='submit' className='btn btn-blue' id='btn-save'>
								Submit
							</button>

							{success == 0 ? (
								<div className='forgot-pw'>
									<Link className=' link-item underline' to='../siginin'>
										Sign In
									</Link>
								</div>
							) : null}
						</form>
					) : null}
				</div>
			</div>
		</>
	);
};

export default ResetPassword;
