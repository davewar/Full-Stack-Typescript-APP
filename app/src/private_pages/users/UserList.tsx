import './userList.css';
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/user';
import Loading from '../../components/Loading';
import usePrivateFetch from '../../hooks/usePrivateFetch';
import User from './User';
import MessageModal from '../../components/MessageModal';
import { useNavigate } from 'react-router-dom';

import { UserProps, updateUserProp } from '../models/usersPropTypes';

type DataObjProp = {
	header: string;
	desc: string;
	buttonDesc: string;
	buttonType: string;
};

const UserList = () => {
	const { accessToken, isAdmin, isEditor } = useContext(UserContext); //global user

	const [users, setUsers] = useState<UserProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState<string>('');

	const [show, setShow] = useState(false); // edit modal
	const [success, setSuccess] = useState<string>('');
	const [fail, setFail] = useState<string>('');

	//delete Message Modal
	const [deleteShow, setDeleteShow] = useState(false); //delete message box
	const [deleteId, setDeleteId] = useState<string>('');

	let { callFetch } = usePrivateFetch();

	let navigate = useNavigate();

	useEffect(() => {
		let url: RequestInfo = `/user`;
		let options: RequestInit = {
			headers: { Authorization: `Bearer ${accessToken}` },
		};

		let getUsers = async (): Promise<void> => {
			try {
				let { data, response } = await callFetch(url, options);

				if (response.status === 403 && data.errors) {
					setLoading(false);
					setErrors(data.errors);
					// setShow(false);
				} else if (data.msg) {
					setUsers(data.msg);
					setLoading(false);
					setErrors('');
				}
			} catch (err) {
				if (err instanceof Error) console.log('dw user ', err);
				setLoading(false);
				setErrors('No Server Response');
			}
		};
		getUsers();

		// eslint-disable-next-line
	}, []);

	//update user
	const handleEditUser = async (id: string, updateUser: updateUserProp) => {
		let { role, active, validated } = updateUser;

		//reset
		setErrors('');
		setSuccess('');
		setFail('');

		let updateUrl: RequestInfo = `/user/update/${id}`;
		let updateOptions: RequestInit = {
			method: 'PUT',
			body: JSON.stringify({ role, active, validated }),
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
					setShow(false);
					setFail(data.errors);
				} else {
					setFail(data.errors);
					setShow(false);
				}
			} else if (data.msg) {
				const newUsers = users.map((item) => {
					if (id === item._id) {
						return { ...item, ...updateUser };
					}
					return item;
				});

				setUsers(newUsers);
				setSuccess(data.msg);
				setShow(false);
			}
		} catch (err) {
			if (err instanceof Error) console.log('dw user ', err);
			setLoading(false);
			setErrors('No Server Response');
			setShow(false);
		}
	};

	const deleteItem = async () => {
		setErrors('');
		setSuccess('');
		setFail('');

		let id = deleteId;
		//no id to delete
		if (!id) {
			setShow(false); //close modal
			return;
		}

		try {
			let urlDelete = `/user/delete/${id}`;

			let optionsDelete = {
				method: 'DELETE',
				body: JSON.stringify({ id }),
				headers: {
					'Content-Type': 'application/json',
					credentials: 'include',
					Authorization: `Bearer ${accessToken}`,
				},
			};

			let { data, response } = await callFetch(urlDelete, optionsDelete);

			if (data.errors) {
				if (response.status === 403) {
					//redirect to be added
					setFail(data.errors);
					setErrors(data.errors);
					setDeleteShow(false);
				} else {
					setFail(data.errors);
					setErrors(data.errors);
					setDeleteShow(false);
				}
			} else if (data) {
				const newList = users.filter((item) => item._id !== id);
				setUsers(newList);
				setDeleteShow(false); //close modal
				setSuccess(data.msg);
			}
		} catch (err) {
			if (err instanceof Error) console.log('dw email ', err.message);
			setLoading(false);
			setErrors('No Server Response');
			setDeleteShow(false);
		}
	};

	const getIdDelete = (id: string): void => {
		setDeleteId(id);
		setDeleteShow(true); // show modal
	};

	// user chosen not to delete email, clear state & close modal
	const closeModal = (): void => {
		setDeleteId('');
		setDeleteShow(false);
	};

	//props for Message Modal
	let dataObj: DataObjProp = {
		header: 'Delete Confirmation',
		desc: 'Are you sure you want to delete ?',
		buttonDesc: 'Delete',
		buttonType: ' deleteBtn',
	};

	return (
		<>
			<div className='main-container'>
				<h2 id='user-info'>Employees</h2>

				{isAdmin || isEditor ? (
					<div>
						<button
							className='addBtn btn'
							type='button'
							onClick={() => navigate('../register')}
						>
							Add Employee
						</button>
					</div>
				) : null}

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

				{fail && (
					<div className='alert alert-danger text-center'>
						<span className='text-danger text-capitalize'>{fail}</span>
					</div>
				)}

				{deleteShow && (
					<MessageModal
						dataObj={dataObj}
						closeModal={closeModal}
						deleteItem={deleteItem}
					/>
				)}
				<div className='user-container'>
					{users &&
						users.map((item) => {
							return (
								<User
									key={item._id}
									{...item}
									setShow={setShow}
									show={show}
									handleEditUser={handleEditUser}
									setSuccess={setSuccess}
									setErrors={setErrors}
									setFail={setFail}
									deleteItem={deleteItem}
									getIdDelete={getIdDelete}
								/>
							);
						})}
				</div>
			</div>
		</>
	);
};

export default UserList;
