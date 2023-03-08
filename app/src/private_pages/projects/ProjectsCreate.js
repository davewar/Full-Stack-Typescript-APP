import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/user';
import usePrivateFetch from '../../hooks/usePrivateFetch';
import '../../public_pages/accounts/login.css';
import Loading from '../../components/Loading';

import { scrollToTop } from '../../utils/helpers';
import Project from './Project';

const ProjectsCreate = () => {
	const [customers, setCustomers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState('');
	const [customerSelected, setCustomerSelected] = useState(
		'Please select customer'
	);
	const [users, setUsers] = useState([]);
	const [userErrors, setUserErrors] = useState('');
	const [userSelected, setUserSelected] = useState('Please select employee');

	const [signInErr, setSignInErr] = useState('');
	const [success, setSuccess] = useState('');

	const { accessToken } = useContext(UserContext); //global user

	let { callFetch } = usePrivateFetch();

	useEffect(() => {
		scrollToTop();
	}, [customers]);

	//get customers
	useEffect(() => {
		let url = '/api/customer';
		let options = {
			headers: { Authorization: `Bearer ${accessToken}` },
		};

		let getCustomers = async () => {
			try {
				let { data, response } = await callFetch(url, options);

				if (response.status === 403 && data.errors) {
					setLoading(false);
					setErrors(data.errors);
				} else if (data.msg) {
					if (data.msg === 'No customers found') {
						setCustomers([]);
						setLoading(false);
						setErrors('');
						setSuccess('No customers found');
					} else {
						setCustomers(data.msg);
						setLoading(false);
						setErrors('');
					}
				}
			} catch (err) {
				console.log('dw email ', err.message);
				setLoading(false);
				setErrors('No Server Response');
			}
		};
		getCustomers();

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
					let usersList = data.msg.map((item) => {
						return { email: item.email, _id: item._id, name: item.name };
					});

					setUsers(usersList);
					// setUsers(data.msg);
					setUserErrors('');
					// setShow(false);
				}
			} catch (err) {
				console.log('dw user ', err);
				setUserErrors('No Server Response');
				// setShow(false);
			}
		};
		getUsers();

		// eslint-disable-next-line
	}, []);

	const handleCustomer = (e) => {
		setSuccess('');
		setSignInErr('');
		if (e.target.value === 'Please select customer') {
			setCustomerSelected(e.target.value);

			return;
		} else {
			// eslint-disable-next-line
			let amendCustomer = customers.filter((item) => {
				if (item.email === e.target.value) {
					return item;
				}
			});

			setCustomerSelected(e.target.value);
		}
	};

	const handleUser = (e) => {
		setSuccess('');
		setSignInErr('');
		if (e.target.value === 'Please select customer') {
			setUserSelected(e.target.value);

			return;
		} else {
			// eslint-disable-next-line
			let amendCustomer = users.filter((item) => {
				if (item.email === e.target.value) {
					return item;
				}
			});

			setUserSelected(e.target.value);
		}
	};

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

			{loading === false && customers.length === 0 && (
				<p>No Customers Found. Please add customer first</p>
			)}
			{customers.length > 0 && (
				<div className='form-group'>
					<h2 className='text-center'>Create Project</h2>
					<select
						required
						className='form-control amend-customer-dropdown'
						data-testid='combobox1'
						value={customerSelected}
						onChange={(e) => handleCustomer(e)}
						key='select-1'
					>
						<option key='customer' value='Please select customer'>
							---select customer---
						</option>

						{customers?.map(function (customer) {
							return (
								<option key={customer._id} value={customer.email}>
									{customer.email}
								</option>
							);
						})}
					</select>
				</div>
			)}

			{loading === false && users.length === 0 && (
				<p>No employees Found. Please add employees first</p>
			)}

			{users.length > 0 && (
				<div className='form-group'>
					<h2 className='text-center'>Assign To</h2>
					<select
						required
						className='form-control amend-customer-dropdown'
						value={userSelected}
						onChange={(e) => handleUser(e)}
						data-testid='combobox2'
						key='select-22'
					>
						<option key='employee' value='Please select employee'>
							---select employee---
						</option>

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

			{customerSelected !== 'Please select customer' &&
				userSelected !== 'Please select employee' && (
					<Project
						employeeSelected={userSelected}
						customerSelected={customerSelected}
					/>
				)}
		</>
	);
};

export default ProjectsCreate;
