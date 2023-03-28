import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/user';
import usePrivateFetch from '../../hooks/usePrivateFetch';
import Loading from '../../components/Loading';
import { useParams } from 'react-router-dom';
import { Products } from '../../constants/products';
import { v4 as uuidv4 } from 'uuid';
import './projects.css';
import { scrollToTop } from '../../utils/helpers';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { ProjectProps } from '../models/projectPropTypes';

type User = {
	email: string;
	name: string;
	_id: string;
};

const ProjectAmend = () => {
	const [project, setProject] = useState<ProjectProps>({} as ProjectProps);

	const [addShow, setAddShow] = useState(false);
	const [addComments, setAddComments] = useState<string>('');

	const [users, setUsers] = useState<User[]>([]);
	const [userErrors, setUserErrors] = useState<string>('');

	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState<string>('');

	const [signInErr, setSignInErr] = useState<string>('');
	const [success, setSuccess] = useState<string>('');

	const { id } = useParams();

	// form
	const [titleErr, setTitleErr] = useState<string>('');
	const [typeErr, setTypeErr] = useState<string>('');
	const [descriptionErr, setDescriptionErr] = useState<string>('');
	const [commentsErr, setCommentsErr] = useState<string>('');
	const [priceErr, setPriceErr] = useState<string>('');

	// types of products
	const productOptions = Products.map((item) => {
		return (
			<option key={item[0]} value={item[1]}>
				{item[1]}
			</option>
		);
	});
	// add payments
	const [startDate, setStartDate] = useState(new Date());
	const [paidAmount, setPaidAmount] = useState('0');
	const [addPaidShow, setPaidShow] = useState(false);
	const [outstanding, setOutstanding] = useState(0);

	const { accessToken, user } = useContext(UserContext); //global user

	let dte = new Date().toLocaleString().replace(',', '');

	let { callFetch } = usePrivateFetch();

	//get projects
	useEffect(() => {
		let url: RequestInfo = '/api/product/item/' + id;
		let options: RequestInit = {
			headers: { Authorization: `Bearer ${accessToken}` },
		};

		let getProject = async () => {
			try {
				let { data, response } = await callFetch(url, options);

				if (response.status === 403 && data.errors) {
					setLoading(false);
					setErrors(data.errors);
				} else if (data.msg) {
					if (data.msg === 'No projects found') {
						setProject({} as ProjectProps);
						setLoading(false);
						setErrors('');
					} else {
						let sum = 0.0;
						// eslint-disable-next-line
						let paidSofar = data.msg[0].payments.map((i: any) => {
							let num = parseFloat(i.paidAmount);
							return (sum += num);
						});

						setOutstanding(data.msg[0].price - sum);
						setProject(data.msg[0]);
						setLoading(false);
						setErrors('');
					}
				}
			} catch (err) {
				if (err instanceof Error) console.log('dw email ', err.message);
				setLoading(false);
				setErrors('No Server Response');
			}
		};
		getProject();

		// eslint-disable-next-line
	}, []);

	// get employees
	useEffect(() => {
		let url = '/user';
		let options = {
			headers: { Authorization: `Bearer ${accessToken}` },
		};

		let getUsers = async () => {
			try {
				let { data, response } = await callFetch(url, options);

				if (response.status === 403 && data.errors) {
					setUserErrors(data.errors);
					// setShow(false);
				} else if (data.msg) {
					// let usersList = data.msg.map(({ email, _id, name }) => {
					// 	return { email, _id, name };
					// });
					let usersList = data.msg.map((item: any) => {
						return { email: item.email, _id: item._id, name: item.name };
					});

					setUsers(usersList);
					// setUsers(data.msg);
					setUserErrors('');
					// setShow(false);
				}
			} catch (err) {
				if (err instanceof Error) console.log('dw user ', err);
				setUserErrors('No Server Response');
				// setShow(false);
			}
		};
		getUsers();

		// eslint-disable-next-line
	}, []);

	const handleCommentUpdate = (): void => {
		if (addComments === '') return;

		let newValue = {
			id: uuidv4(),
			comments: addComments,
			dte,
			createdBy: user!,
		};
		//updatestate
		setProject((prev) => {
			return { ...prev, comments: [newValue, ...prev.comments] };
		});
		// clear input field
		setAddComments('');
		setAddShow(false);
	};

	const handlePaidUpdate = (): void => {
		if (paidAmount === '0') return;

		let newValue1 = {
			id: uuidv4(),
			paidAmount: paidAmount,
			paymentDate: startDate.toLocaleString().slice(0, 10),
			createdBy: user!,
		};
		//updatestate balance o/s
		setOutstanding((prev) => {
			return prev - parseInt(paidAmount);
		});

		// add extra payment
		setProject((prev) => {
			return { ...prev, payments: [newValue1, ...prev.payments] };
		});
		// clear input field
		setPaidAmount('0');
		setPaidShow(false);
	};

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLSelectElement>
			| React.ChangeEvent<HTMLTextAreaElement>,
		item: string
	) => {
		//clear
		setSignInErr('');
		setSuccess('');

		// const { name, value, checked } = e.target;
		const { name, value } = e.target;

		let err = 'Please supply required field';

		if (item === 'title') {
			setProject((prev) => {
				return { ...prev, [name]: value };
			});

			value.length === 0 ? setTitleErr(err) : setTitleErr('');
		} else if (item === 'type') {
			let event = e.target as HTMLSelectElement;
			let values = Array.from(event.selectedOptions, (option) => option.value);
			setProject((prev) => {
				return { ...prev, [name]: values };
			});
			setTypeErr('');
		} else if (item === 'description') {
			setProject((prev) => {
				return { ...prev, [name]: value };
			});
			value.length === 0 ? setDescriptionErr(err) : setDescriptionErr('');
		} else if (item === 'comments') {
			value.length === 0 ? setCommentsErr(err) : setCommentsErr('');
		} else if (item === 'projectCompleted') {
			let checked = (e.target as HTMLInputElement).checked;
			setProject((prev) => {
				return { ...prev, projectCompleted: checked };
			});
		} else if (item === 'prcheckedice') {
			setProject((prev) => {
				return { ...prev, [name]: value };
			});

			value === '' ? setPriceErr(err) : setPriceErr('');
		} else if (item === 'paid') {
			let checked = (e.target as HTMLInputElement).checked;
			setProject((prev) => {
				return { ...prev, paid: checked };
			});
		}
	};

	// send updated details to db
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// check no errors
		if (titleErr || typeErr || descriptionErr || commentsErr || priceErr)
			return;

		//reset
		setErrors('');
		setSuccess('');

		let updateUrl = `/api/product/update/${id}`;
		let updateOptions = {
			method: 'PUT',
			body: JSON.stringify({
				...project,
			}),
			headers: {
				'Content-Type': 'application/json',
				credentials: 'include',
				Authorization: `Bearer ${accessToken}`,
			},
		};

		try {
			let { data, response } = await callFetch(updateUrl, updateOptions);

			if (data.errors) {
				if (response.status === 403) {
					//redirect to be added

					setErrors(data.errors);
				} else {
					setErrors(data.errors);
				}
			} else if (data.msg) {
				setSuccess(data.msg);
				scrollToTop();
			}
		} catch (err) {
			if (err instanceof Error) console.log('dw user ', err);

			setErrors('No Server Response');
		}
	};

	//end update to db

	return (
		<>
			{loading && <Loading />}
			{errors && (
				<div className='alert alert-danger text-center'>
					<span className='text-danger text-capitalize'>{errors}</span>
				</div>
			)}
			{userErrors && (
				<div className='alert alert-danger text-center'>
					<span className='text-danger text-capitalize'>{userErrors}</span>
				</div>
			)}
			{success && (
				<div className='alert alert-success text-center'>
					<span className='text-success text-capitalize'>{success}</span>
				</div>
			)}
			{signInErr && (
				<div className='alert alert-success text-center'>
					<span className='text-success text-capitalize'>{signInErr}</span>
				</div>
			)}
			<h2 className='text-center'>Update Project</h2>
			{users.length > 0 && (
				<div className='form-group'>
					<h2 className='text-center'>Assign To</h2>
					<select
						required
						className='form-control amend-customer-dropdown'
						value={project.assignedTo}
						onChange={(e) =>
							setProject((prev) => {
								return { ...prev, assignedTo: e.target.value };
							})
						}
					>
						{users?.map(function (user) {
							return (
								<option key={user._id} value={user.email}>
									{user.email}
								</option>
							);
						})}
					</select>
				</div>
			)}
			{/* 
			{Object.keys(project).length} */}

			{Object.keys(project).length > 0 && (
				<form onSubmit={handleSubmit}>
					<div className='form-group'>
						<label htmlFor='title'>Title</label>
						<input
							type='text'
							required
							autoComplete='off'
							name='title'
							id='title'
							placeholder='Project Title..'
							value={project.title}
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
							value={project.type}
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
							value={project.price}
							onChange={(e) => handleChange(e, 'price')}
						/>
						{priceErr && <small className='text-danger'>{priceErr}</small>}
					</div>
					<label className='checkbox-project' htmlFor='paid'>
						<input
							type='checkbox'
							id='projectPaid'
							checked={project.paid}
							onChange={(e) => handleChange(e, 'paid')}
						/>
						Project Paid in Full
					</label>

					<div className='form-group'>
						<label htmlFor='description'>Project Requirements</label>
						<textarea
							rows={4}
							cols={50}
							name='description'
							autoComplete='off'
							value={project.description}
							onChange={(e) => handleChange(e, 'description')}
						></textarea>
						{descriptionErr && (
							<small className='text-danger'>{descriptionErr}</small>
						)}
					</div>

					<div>
						<button
							className='addBtn btn'
							type='button'
							onClick={() => setAddShow((prev) => !prev)}
						>
							{addShow ? 'Close Add Comments' : 'Add more comments'}
						</button>
					</div>

					{addShow && (
						<div className='form-group'>
							<label htmlFor='comments'>Comment</label>
							<textarea
								rows={10}
								cols={50}
								name='comments'
								autoComplete='off'
								value={addComments}
								onChange={(e) => setAddComments(e.target.value)}
								className='amendTextarea'
							></textarea>
						</div>
					)}

					{addShow && (
						<div>
							<button
								className='addBtn btn'
								type='button'
								onClick={handleCommentUpdate}
							>
								Add
							</button>
						</div>
					)}

					{
						<div className='comment-container'>
							{project.comments?.map((item) => {
								return (
									<div className='project-comment-box' key={item.id}>
										<div className='project-comment-box-created'>
											<b>Created by : </b> {item.createdBy} on {item.dte}
										</div>

										<textarea
											rows={10}
											cols={50}
											readOnly
											value={item.comments}
										></textarea>
									</div>
								);
							})}
						</div>
					}

					<div>
						<button
							className='addBtn btn'
							type='button'
							onClick={() => setPaidShow((prev) => !prev)}
						>
							{addPaidShow ? 'Close Add Payments' : 'Add more payments'}
						</button>
					</div>

					{addPaidShow && (
						<div className='form-group comment-container'>
							<label htmlFor='description'>Date Paid</label>
							<div>
								<DatePicker
									// locale='en-GB'
									dateFormat='dd/MM/yyyy'
									selected={startDate}
									onChange={(date) => setStartDate(date!)}
								/>
							</div>
							<div className='form-group'>
								<label htmlFor='paid-amount'>Paid Amount</label>
								<input
									required
									type='number'
									min={0.0}
									step={0.01}
									name='paid-amount'
									id='paid-amount'
									value={paidAmount}
									onChange={(e) => setPaidAmount(e.target.value)}
								/>
							</div>

							{addPaidShow && (
								<div>
									<button
										className='addBtn btn'
										type='button'
										onClick={handlePaidUpdate}
									>
										Add
									</button>
								</div>
							)}
						</div>
					)}

					{/* ***payments**** */}
					<div className='form-group'>
						<b>Balance Outstanding: £{outstanding.toFixed(2)}</b>
					</div>

					{
						<div className='comment-container'>
							{project?.payments?.map((item) => {
								return (
									<div className='project-comment-box' key={item.id}>
										<div className=''>
											<b>Added by : </b> {item.createdBy}
										</div>

										<div className=''>
											<b>Paid </b>£{item.paidAmount} on the {item.paymentDate}
										</div>
									</div>
								);
							})}
						</div>
					}

					<label className='checkbox-project' htmlFor='projectCompleted'>
						<input
							type='checkbox'
							id='projectCompleted'
							checked={project.projectCompleted}
							onChange={(e) => handleChange(e, 'projectCompleted')}
						/>
						Project Completed
					</label>

					<button type='submit' className='btn btn-blue' id='btn-save'>
						Save All Changes
					</button>
				</form>
			)}
		</>
	);
};

export default ProjectAmend;
