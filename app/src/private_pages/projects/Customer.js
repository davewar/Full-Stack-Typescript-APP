import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/user';

import '../../public_pages/accounts/login.css';

import { emailRegEx } from '../../utils/helpers';

const Customer = ({ customer, ...rest }) => {
	const [id] = useState(customer[0]._id);
	const [name, setName] = useState(customer[0].name);
	const [nameErr, setNameErr] = useState('');

	const [businessName, setBusinessName] = useState(
		customer[0].businessName ? customer[0].businessName : ''
	);

	const [email, setEmail] = useState(customer[0].email);
	const [emailErr, setEmailErr] = useState('');

	const [telephone, setTelephone] = useState(customer[0].telephone);
	const [telephoneErr, setTelephoneErr] = useState('');

	const [address, setAddress] = useState({
		addressLine1: customer[0].address.addressLine1,
		addressLine2: customer[0].address.addressLine2,
		addressLine3: customer[0].address.addressLine3,
		town: customer[0].address.town,
		county: customer[0].address.county,
		postcode: customer[0].address.postcode,
	});
	const [addressErr, setAddressErr] = useState('');
	const [postcodeErr, setPostcodeErr] = useState('');
	const [townErr, setTownErr] = useState('');

	const { isEditor, isAdmin } = useContext(UserContext); //global user

	let toTop = () => {
		window.scrollTo(0, 0);
	};

	useEffect(() => {
		toTop();
	}, [customer]);

	const handleChange = (e, item) => {
		//clear
		rest.setSignInErr('');
		rest.setSuccess('');

		if (item === 'name') {
			setName(e.target.value);
			e.target.value.length < 3
				? setNameErr('Name must be at least 3 characters!')
				: setNameErr('');
		}

		if (item === 'email') {
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
			setAddress((prev) => {
				return {
					...prev,
					[e.target.name]: e.target.value,
				};
			});
		}

		if (item === 'telephone') {
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
			let updateCustomer = {
				name,
				email,
				address,
				telephone,
				businessName,
			};

			rest.handleUpdateCustomer(e, id, updateCustomer);
			toTop();
		}
	};

	return (
		<>
			<div className='sign-in create-customer'>
				<form onSubmit={handleSignin}>
					<div className='form-group'>
						<label htmlFor='name'>Customer Name</label>
						<input
							type='text'
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
					<div id='customer-edit'>
						{(isEditor || isAdmin) && (
							<button
								type='button'
								className='btn btn-blue'
								id='btn-delete'
								onClick={(e) => {
									rest.handleDeleteCustomer(e, id);
									toTop();
								}}
							>
								Delete
							</button>
						)}
						<button type='submit' className='btn btn-blue' id='btn-save'>
							Save
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default Customer;
