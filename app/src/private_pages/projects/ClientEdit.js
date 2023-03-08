import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/user';
import usePrivateFetch from '../../hooks/usePrivateFetch';
import Loading from '../../components/Loading';
import Customer from './Customer';

import { scrollToTop } from '../../utils/helpers';

const ClientEdit = () => {
	const [customers, setCustomers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState('');
	const [customerSelected, setCustomerSelected] = useState('');
	const [customer, setCustomer] = useState({});

	const [signInErr, setSignInErr] = useState('');
	const [success, setSuccess] = useState('');

	const { accessToken } = useContext(UserContext); //global user

	let { callFetch } = usePrivateFetch();

	useEffect(() => {
		scrollToTop();
	}, [customers]);

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

	const handleCustomer = (e) => {
		setSuccess('');
		setSignInErr('');
		if (e.target.value === 'Please select customer') {
			setCustomerSelected(e.target.value);
			setCustomer({});
			return;
		} else {
			// eslint-disable-next-line
			let amendCustomer = customers.filter((item) => {
				if (item.email === e.target.value) {
					return item;
				}
			});

			setCustomerSelected(e.target.value);
			setCustomer(amendCustomer);
		}
	};

	const handleUpdateCustomer = async (e, id, updateCustomer) => {
		e.preventDefault();
		setSuccess('');
		setSignInErr('');

		let updateUrl = `/api/customer/update/${id}`;
		let updateOptions = {
			method: 'PUT',
			body: JSON.stringify({
				...updateCustomer,
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

					setSignInErr(data.errors);
				} else {
					setSignInErr(data.errors);
				}
			} else if (data.msg) {
				setSuccess(data.msg);

				// updatestate
				let newlist = customers.map((item) => {
					if (item._id === id) {
						return { _id: id, ...updateCustomer };
					}
					return item;
				});
				setCustomers(newlist);
			}
		} catch (err) {
			console.log('dw create customer ', err);
			setSignInErr('No Server Response');
		}
	};

	const handleDeleteCustomer = async (e, id) => {
		e.preventDefault();
		setSuccess('');
		setSignInErr('');

		let deleteUrl = `/api/customer/delete/${id}`;
		let deleteOptions = {
			method: 'DELETE',
			body: JSON.stringify({
				_id: id,
			}),
			headers: {
				'Content-Type': 'application/json',
				credentials: 'include',
				Authorization: `Bearer ${accessToken}`,
			},
		};

		try {
			let { data, response } = await callFetch(deleteUrl, deleteOptions);

			if (data.errors) {
				if (response.status === 403) {
					//redirect to be added

					setSignInErr(data.errors);
				} else {
					setSignInErr(data.errors);
				}
			} else if (data.msg) {
				// const newList = customers.filter((item) => item._id !== id);
				// setCustomers(newList);
				setCustomers((prevCustomers) => {
					return prevCustomers.filter((item) => item._id !== id);
				});

				setSuccess(data.msg);
				setCustomer([]);
				setCustomerSelected('Please select customer');

				// }
			}
		} catch (err) {
			console.log('dw create customer ', err);
			setSignInErr('No Server Response');
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
			{customers.length > 0 && (
				<div className='form-group'>
					<h2 className='text-center'>Amend Customer</h2>
					<select
						required
						className='form-control amend-customer-dropdown'
						value={customerSelected}
						onChange={(e) => handleCustomer(e)}
					>
						<option value='Please select customer'>
							---select customer---
						</option>

						{customers?.map(function (customer) {
							return (
								<option key={customer.email} value={customer.email}>
									{customer.email}
								</option>
							);
						})}
					</select>
				</div>
			)}

			{customer.length > 0 && (
				<Customer
					key={customer[0]._id}
					customer={customer}
					handleUpdateCustomer={handleUpdateCustomer}
					setSuccess={setSuccess}
					setSignInErr={setSignInErr}
					handleDeleteCustomer={handleDeleteCustomer}
				/>
			)}
		</>
	);
};
export default ClientEdit;
