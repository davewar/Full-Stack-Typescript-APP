import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/user';
import usePrivateFetch from '../../hooks/usePrivateFetch';
import '../../public_pages/accounts/login.css';

import { emailRegEx, scrollToTop } from '../../utils/helpers';

const ClientCreate = () => {
	const [name, setName] = useState('');
	const [nameErr, setNameErr] = useState('');

	const [businessName, setBusinessName] = useState('');

	const [email, setEmail] = useState('');
	const [emailErr, setEmailErr] = useState('');

	const [telephone, setTelephone] = useState('');
	const [telephoneErr, setTelephoneErr] = useState('');

	const [address, setAddress] = useState({
		addressLine1: '',
		addressLine2: '',
		addressLine3: '',
		town: '',
		county: '',
		postcode: '',
	});
	const [addressErr, setAddressErr] = useState('');
	const [postcodeErr, setPostcodeErr] = useState('');
	const [townErr, setTownErr] = useState('');

	const [signInErr, setSignInErr] = useState('');
	const [success, setSuccess] = useState('');

	const { accessToken, user } = useContext(UserContext); //global user

	let { callFetch } = usePrivateFetch();

	const handleChange = (e, item) => {
		//clear
		setSignInErr('');
		setSuccess('');

		if (item === 'name') {
			setName(e.target.value);
			e.target.value.length < 6
				? setNameErr('Name must be at least 6 characters!')
				: setNameErr('');
		}

		if (item === 'email') {
			if (emailErr) setEmailErr('');

			setEmail(e.target.value);
			!emailRegEx.test(e.target.value)
				? setEmailErr('Invalid Email!')
				: setEmailErr('');
		}

		// 	let pwdValid = !pwdRegex.test(password);

		// 	!pwdRegex.test(password)
		// 		? setPasswordErr(
		// 				'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
		// 		  )
		// 		: setPasswordErr('');
		// }

		if (item === 'businessname') {
			setBusinessName(e.target.value);
		}
		if (item === 'address') {
			if (e.target.name === 'addressLine1') setAddressErr('');
			if (e.target.name === 'town') setTownErr('');
			if (e.target.name === 'postcode') setPostcodeErr('');

			setAddress((prev) => {
				return {
					...prev,
					[e.target.name]: e.target.value,
				};
			});
		}

		if (item === 'telephone') {
			setTelephoneErr('');
			setTelephone(e.target.value);
		}
	};

	const handleSignin = async (e) => {
		e.preventDefault();

		if (
			!telephone ||
			!address.addressLine1 ||
			!address.town ||
			!address.postcode
		) {
			if (!telephone) {
				setTelephoneErr('Please supply required field');
			}
			if (!address.addressLine1) {
				setAddressErr('Please supply required field');
			}
			if (!address.town) {
				setTownErr('Please supply required field');
			}
			if (!address.postcode) {
				setPostcodeErr('Please supply required field');
			}
			return;
		}

		if (
			name &&
			!nameErr &&
			email &&
			!emailErr &&
			telephone &&
			!telephoneErr &&
			address &&
			!addressErr &&
			!postcodeErr &&
			!townErr
		) {
			setSuccess('');
			setSignInErr('');

			let createUrl = `/api/customer/create`;
			let createOptions = {
				method: 'POST',
				body: JSON.stringify({
					name,
					email,
					address,
					telephone,
					businessName,
					createdBy: user,
				}),
				headers: {
					'Content-Type': 'application/json',
					credentials: 'include',
					Authorization: `Bearer ${accessToken}`,
				},
			};

			try {
				let { data, response } = await callFetch(createUrl, createOptions);

				if (data.errors) {
					if (response.status === 403) {
						//redirect to be added

						setSignInErr(data.errors);
					} else {
						setSignInErr(data.errors);
					}
				} else if (data.msg) {
					setSuccess(data.msg);
					setName('');
					setEmail('');
					setBusinessName('');
					setTelephone('');
					setAddress({
						addressLine1: '',
						addressLine2: '',
						addressLine3: '',
						town: '',
						county: '',
						postcode: '',
					});

					scrollToTop();
				}
			} catch (err) {
				console.log('dw create customer ', err);
				setSignInErr('No Server Response');
			}
		}
	};

	return (
		<>
			<div className='sign-in create-customer'>
				<h2 className='text-center'>Create New Customer</h2>

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
						<label htmlFor='name'>Customer Name</label>
						<input
							type='name'
							required
							autoComplete='off'
							name='name'
							id='name'
							placeholder='Enter full name'
							value={name}
							onChange={(e) => handleChange(e, 'name')}
							autoFocus
						/>
						<small className='text-danger'>{nameErr}</small>
					</div>
					<div className='form-group'>
						<label htmlFor='businessname'>Business Name</label>
						<input
							type='text'
							autoComplete='off'
							name='businessname'
							id='businessname'
							placeholder='Enter Business name'
							value={businessName}
							onChange={(e) => handleChange(e, 'businessname')}
							autoFocus
						/>
					</div>
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
						/>
						<small className='text-danger'>{emailErr}</small>
					</div>
					<div className='form-group'>
						<label htmlFor='telephone'>Contact Telephone</label>
						<input
							type='text'
							required
							autoComplete='off'
							name='telephone'
							id='telephone'
							placeholder='Enter contact number'
							value={telephone}
							onChange={(e) => handleChange(e, 'telephone')}
						/>
						<small className='text-danger'>{telephoneErr}</small>
					</div>

					<label>Address: </label>
					<div className='address' style={{ width: '95%', marginLeft: 'auto' }}>
						{/* address */}
						<div className='form-group'>
							<label htmlFor='addressLine1'>Address Line 1</label>
							<input
								type='text'
								autoComplete='off'
								name='addressLine1'
								id='addressLine1'
								placeholder='First line of adddress'
								value={address.addressLine1}
								onChange={(e) => handleChange(e, 'address')}
								autoFocus
							/>
							<small className='text-danger'>{addressErr}</small>
						</div>
						<div className='form-group'>
							<label htmlFor='addressLine2'>Address Line 2</label>
							<input
								type='text'
								autoComplete='off'
								name='addressLine2'
								id='addressLine2'
								placeholder=''
								value={address.addressLine2}
								onChange={(e) => handleChange(e, 'address')}
								autoFocus
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='addressLine3'>Address Line 3</label>
							<input
								type='text'
								autoComplete='off'
								name='addressLine3'
								id='addressLine3'
								placeholder=''
								value={address.addressLine3}
								onChange={(e) => handleChange(e, 'address')}
								autoFocus
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='town'>Town</label>
							<input
								type='text'
								required
								autoComplete='off'
								name='town'
								id='town'
								placeholder='Town'
								value={address.town}
								onChange={(e) => handleChange(e, 'address')}
								autoFocus
							/>
							<small className='text-danger'>{townErr}</small>
						</div>
						<div className='form-group'>
							<label htmlFor='county'>County</label>
							<input
								type='text'
								required
								autoComplete='off'
								name='county'
								id='county'
								placeholder=''
								value={address.county}
								onChange={(e) => handleChange(e, 'address')}
								autoFocus
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='postcode'>Postcode</label>
							<input
								type='text'
								required
								autoComplete='off'
								name='postcode'
								id='postcode'
								placeholder='PostCode'
								value={address.postcode}
								onChange={(e) => handleChange(e, 'address')}
								autoFocus
							/>
							<small className='text-danger'>{postcodeErr}</small>
						</div>
					</div>
					<br />

					<button type='submit' className='btn btn-blue' id='btn-save'>
						Create
					</button>
				</form>
			</div>
		</>
	);
};

export default ClientCreate;
