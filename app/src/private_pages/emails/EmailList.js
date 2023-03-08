import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/user';
import Loading from '../../components/Loading';
import usePrivateFetch from '../../hooks/usePrivateFetch';
import Email from './Email';
import './emails.css';
import MessageModal from '../../components/MessageModal';

const EmailList = () => {
	const { accessToken } = useContext(UserContext); //global user

	const [emails, setEmails] = useState();
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState('');

	const [show, setShow] = useState(false);
	const [deleteId, setDeleteId] = useState(false);
	//sorting
	const [direction, setDirection] = useState();
	const [value, setValue] = useState();

	let { callFetch } = usePrivateFetch();

	useEffect(() => {
		let url = '/api/email';
		let options = {
			headers: { Authorization: `Bearer ${accessToken}` },
		};

		let getEmails = async () => {
			try {
				let { data, response } = await callFetch(url, options);

				if (response.status === 403 && data.errors) {
					setLoading(false);
					setErrors(data.errors);
					setShow(false);
				} else if (data.msg) {
					setEmails(data.msg);
					setLoading(false);
					setErrors('');
					setDeleteId('');
					setShow(false);
				}
			} catch (err) {
				console.log('dw email ', err.message);
				setLoading(false);
				setErrors('No Server Response');
				setShow(false);
			}
		};
		getEmails();

		// eslint-disable-next-line
	}, []);

	const deleteItem = async () => {
		setErrors('');

		let id = deleteId;
		//no id to delete
		if (!id) {
			setShow(false); //close modal
			return;
		}
		try {
			let url1 = `/api/email/${id}`;

			let options1 = {
				method: 'DELETE',
				body: JSON.stringify({ id }),
				headers: {
					'Content-Type': 'application/json',
					credentials: 'include',
					Authorization: `Bearer ${accessToken}`,
				},
			};

			let { data, response } = await callFetch(url1, options1);

			if (response.status === 403 && data.errors) {
				setErrors(data.errors);
				setShow(false);
			} else if (data) {
				const newList = emails.filter((item) => item._id !== id);

				setEmails(newList);
				setShow(false); //close modal
			}
		} catch (err) {
			console.log('dw email ', err.message);
			setLoading(false);
			setErrors('No Server Response');
			setShow(false);
		}
	};
	// user clicks on delete icon, we open modal, this gets the ID of the deleted item selected.
	//id is then stored in state, so that we can use if user confirms on the modal to delete item.
	const getIdDelete = (id) => {
		setDeleteId(id);
		setShow(true); // show modal
	};

	// user chosen not to delete email, clear state & close modal
	const closeModal = (id) => {
		setDeleteId('');
		setShow(false);
	};

	// sorting
	const orderBy = (emails, value, direction) => {
		if (direction === 'asc') {
			return [...emails].sort((a, b) => (a[value] > b[value] ? 1 : -1));
		}

		if (direction === 'desc') {
			return [...emails].sort((a, b) => (a[value] > b[value] ? -1 : 1));
		}

		return emails;
	};

	const switchDirection = () => {
		if (direction === '') {
			setDirection('desc');
		} else if (direction === 'desc') {
			setDirection('asc');
		} else {
			setDirection('');
		}
	};

	const setValueAndDirection = (value) => {
		switchDirection();
		setValue(value);
	};

	// **** sorting end

	//props for Message Modal
	let dataObj = {
		header: 'Delete Confirmation',
		desc: 'Are you sure you want to delete ?',
		buttonDesc: 'Delete',
		buttonType: ' deleteBtn',
	};

	let newEmails = orderBy(emails, value, direction);

	return (
		<>
			<div className='email-container'>
				<h1 id='emails-info'>Emails Info</h1>
				<br />

				{loading && <Loading />}
				{errors && (
					<div className='alert alert-danger text-center'>
						<span className='text-danger text-capitalize'>{errors}</span>
					</div>
				)}

				{show && (
					<MessageModal
						dataObj={dataObj}
						closeModal={closeModal}
						deleteItem={deleteItem}
					/>
				)}
				<table className='table-emails'>
					<thead>
						<tr>
							<th
								className='cell-name'
								onClick={() => {
									setValueAndDirection('name');
								}}
							>
								Name
							</th>
							<th
								className='cell-address'
								onClick={() => {
									setValueAndDirection('email');
								}}
							>
								Email Address
							</th>
							<th className='cell-comment'>Comment</th>
							<th
								className='cell-date'
								onClick={() => {
									setValueAndDirection('createdAt');
								}}
							>
								Date
							</th>
							<th className='cell-action'>Action</th>
						</tr>
					</thead>
					<tbody>
						{emails && !loading ? (
							newEmails.map((item) => {
								return (
									<Email key={item._id} {...item} getIdDelete={getIdDelete} />
								);
							})
						) : (
							<p id='noEmails'>No Emails</p>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default EmailList;
