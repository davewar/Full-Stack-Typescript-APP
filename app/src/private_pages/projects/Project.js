import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/user';
import usePrivateFetch from '../../hooks/usePrivateFetch';
import '../../public_pages/accounts/login.css';
import { Products } from '../../constants/products';
import './projects.css';
import { v4 as uuidv4 } from 'uuid';

import { scrollToTop } from '../../utils/helpers';

const Project = (props) => {
	const { accessToken, user } = useContext(UserContext); //global user

	// add project to customer profile
	const [customerID] = useState(props.customerSelected);

	// createdby logged in user
	const [createdBy] = useState(user);

	//project assigned to employee
	const [assignedTo] = useState(props.employeeSelected);

	const [title, setTitle] = useState('');
	const [titleErr, setTitleErr] = useState('');
	//excel , access. bi, web
	const [type, setType] = useState([]);
	const [typeErr, setTypeErr] = useState('');
	//project requirements
	const [description, setDescription] = useState('');
	const [descriptionErr, setDescriptionErr] = useState('');
	//user comments
	const [comments, setComments] = useState('');
	const [commentsErr, setCommentsErr] = useState('');
	//no
	const [projectCompleted, setprojectCompleted] = useState(false);

	// total price of project to customers
	const [price, setPrice] = useState('');

	const [signInErr, setSignInErr] = useState('');
	const [success, setSuccess] = useState('');

	// types of products
	const productOptions = Products.map((item) => {
		return (
			<option key={item[0]} value={item[1]}>
				{item[1]}
			</option>
		);
	});

	let { callFetch } = usePrivateFetch();

	const handleChange = (e, item) => {
		//clear
		setSignInErr('');
		setSuccess('');

		let err = 'Please supply required field';

		if (item === 'title') {
			setTitle(e.target.value);
			e.target.value.length === 0 ? setTitleErr(err) : setTitleErr('');
		} else if (item === 'type') {
			let values = Array.from(
				e.target.selectedOptions,
				(option) => option.value
			);
			setType(values);
			setTypeErr('');
		} else if (item === 'description') {
			setDescription(e.target.value);
			e.target.value.length === 0
				? setDescriptionErr(err)
				: setDescriptionErr('');
		} else if (item === 'comments') {
			setComments(e.target.value);
			e.target.value.length === 0 ? setCommentsErr(err) : setCommentsErr('');
		} else if (item === 'projectCompleted') {
			setprojectCompleted((prev) => !prev);
		} else if (item === 'price') {
			setPrice(e.target.value);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		let err = '';
		let dte = new Date().toLocaleString().replace(',', '');

		if (!title || type.length === 0 || !description || !price || !comments) {
			err = 'Please supply required field';

			if (!title) {
				setTitleErr(err);
			}
			if (type.length === 0) {
				setTypeErr(err);
			}
			if (!description) {
				setDescriptionErr(err);
			}
			if (!comments) {
				setCommentsErr(err);
			}
			if (!price) {
				setCommentsErr(err);
			}

			return;
		}

		if (
			customerID &&
			user &&
			title &&
			!titleErr &&
			type &&
			!typeErr &&
			comments &&
			!commentsErr &&
			description &&
			!descriptionErr &&
			price
		) {
			setSuccess('');
			setSignInErr('');

			let createUrl = `/api/product/create`;
			let createOptions = {
				method: 'POST',
				body: JSON.stringify({
					customerID,
					title,
					type,
					price,
					description: description,
					comments: { id: uuidv4(), comments, dte, createdBy },
					projectCompleted,
					assignedTo,
					createdBy,
					lastUpdatedBy: user,
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
					setTitle('');
					setType([]);
					setDescription('');
					setComments('');
					setprojectCompleted(false);
					setPrice('');
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
				<form onSubmit={handleSubmit}>
					<div className='form-group'>
						<label htmlFor='title'>Project Title</label>
						<input
							type='text'
							required
							autoComplete='off'
							name='title'
							id='title'
							placeholder='Project Title..'
							value={title}
							onChange={(e) => handleChange(e, 'title')}
							autoFocus
						/>
						<small className='text-danger'>{titleErr}</small>
					</div>

					<div className='form-group'>
						<label htmlFor='type'>Project Type</label>
						<select
							multiple={true}
							name='type'
							id='type'
							value={type}
							onChange={(e) => {
								handleChange(e, 'type');
							}}
						>
							{productOptions}
						</select>
						<small className='text-danger'>{typeErr}</small>
					</div>

					<div className='form-group'>
						<label htmlFor='price'>Project Total Cost in GBP</label>
						<input
							required
							type='number'
							min='0.00'
							step='0.01'
							name='price'
							id='price'
							value={price}
							onChange={(e) => handleChange(e, 'price')}
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='description' type='text'>
							Project Requirements
						</label>
						<textarea
							rows='4'
							cols='50'
							name='description'
							autoComplete='off'
							value={description}
							placeholder='Please enter project requirements....'
							onChange={(e) => handleChange(e, 'description')}
						></textarea>
						{descriptionErr && (
							<small className='text-danger'>{descriptionErr}</small>
						)}
					</div>

					<div className='form-group'>
						<label htmlFor='comments' type='text'>
							User Comments
						</label>
						<textarea
							rows='4'
							cols='50'
							name='comments'
							autoComplete='off'
							value={comments}
							placeholder='Please add commments...'
							onChange={(e) => handleChange(e, 'comments')}
						></textarea>
						{commentsErr && (
							<small className='text-danger'>{commentsErr}</small>
						)}
					</div>

					<label className='checkbox-project' htmlFor='projectCompleted'>
						<input
							type='checkbox'
							id='projectCompleted'
							checked={projectCompleted}
							onChange={(e) => handleChange(e, 'projectCompleted')}
						/>
						Project Completed
					</label>

					<button type='submit' className='btn btn-blue' id='btn-save'>
						Create
					</button>
				</form>
			</div>
		</>
	);
};

export default Project;
