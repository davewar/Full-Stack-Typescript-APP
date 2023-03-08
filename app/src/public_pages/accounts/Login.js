import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { UserContext } from '../../contexts/user';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { emailRegEx } from '../../utils/helpers';

const Login = () => {
	const { setAccessToken, setRole } = useContext(UserContext); //global user

	const [email, setEmail] = useState('');
	const [emailErr, setEmailErr] = useState('');
	const [password, setPassword] = useState('');
	const [passwordErr, setPasswordErr] = useState('');
	const [signInErr, setSignInErr] = useState('');
	const [visable, setVisable] = useState('false');

	const navigate = useNavigate();

	const handleChange = (e, item) => {
		//clear
		setSignInErr('');

		/* eslint-disable */

		if (item === 'email') {
			setEmail(e.target.value);
			!emailRegEx.test(e.target.value)
				? setEmailErr('Invalid Email!')
				: setEmailErr('');
		}

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

		// To use in test
		if (item === 'password') {
			setPassword(e.target.value);
			e.target.value.length < 3
				? setPasswordErr('Password must be at least 6 characters!')
				: setPasswordErr('');
		}
	};

	const handleSignin = async (e) => {
		e.preventDefault();

		let baseUrl = process.env.REACT_APP_BACKEND_URL;

		if (email && password && !emailErr && !passwordErr) {
			setSignInErr('');

			try {
				const res = await fetch(`${baseUrl}/user/login`, {
					// const res = await fetch('/user/login', {
					method: 'POST',
					body: JSON.stringify({ email, password }),
					headers: {
						'Content-Type': 'application/json',
						credentials: 'include',
					},
				});

				const data = await res.json();

				if (data.msg) {
					localStorage.setItem('firstlogin', true);
					setAccessToken(data.msg.accesstoken);
					setRole(data.msg.user.role);
					setEmail('');
					setPassword('');

					navigate('../dashboard');
				} else if (data.errors) {
					setSignInErr(data.errors);
				}
			} catch (err) {
				console.log('dw error message login:', err.message);
				setSignInErr('No Server Response');
			}
		}
	};

	const toggleType = () => {
		setVisable((prev) => !prev);
	};

	return (
		<>
			<div className='main-container'>
				<div className='sign-in'>
					<h2 className='text-center'>Sign in</h2>

					{signInErr && (
						<div className='alert alert-danger text-center'>
							<span className='text-danger text-capitalize'>{signInErr}</span>
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
									onClick={toggleType}
									aria-label='click to change password visibility'
								>
									{visable ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
								</button>
							</div>
							<small className='text-danger'>{passwordErr}</small>
						</div>

						<button type='submit' className='btn btn-blue' id='btn-save'>
							Submit
						</button>

						<div className='forgot-pw'>
							<Link className=' link-item underline' to='../resetaccount'>
								Forgotten Password
							</Link>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default Login;
