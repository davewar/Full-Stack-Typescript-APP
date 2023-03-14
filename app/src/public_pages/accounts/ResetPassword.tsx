import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './login.css';
import { emailRegEx } from '../../utils/helpers';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';

const ResetPassword = () => {
	const [email, setEmail] = useState<string>('');
	const [emailErr, setEmailErr] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordErr, setPasswordErr] = useState<string>('');

	const [password2, setPassword2] = useState<string>('');
	const [passwordErr2, setPasswordErr2] = useState<string>('');
	/* eslint-disable */

	const [signInErr, setSignInErr] = useState<string>('');
	const [success, setSuccess] = useState<string>('');
	//password visable
	const [visable, setVisable] = useState<boolean>(false);
	const [visable2, setVisable2] = useState<boolean>(false);

	const { id } = useParams();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		item: string
	) => {
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

	const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
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
				if (err instanceof Error) console.log('dw', err.message);
				setSignInErr('No Server Response');
			}
		}
	};
	//toggle password
	const toggleType = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		name: string
	) => {
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

							{success ? (
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
