import React, { useState, useContext } from 'react';
import EditUser from './EditUser';
import { UserContext } from '../../contexts/user';

const User = (props) => {
	const [showModal, setShowModal] = useState(false);
	const { isAdmin, isEditor } = useContext(UserContext);

	const { active, createdAt, email, name, role, updatedAt, validated, _id } =
		props;

	let data = {
		active,
		createdAt,
		email,
		name,
		role,
		updatedAt,
		validated,
		_id,
	};

	const dateCoversion = (time) => {
		return new Date(time).toLocaleString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
	};

	return (
		<>
			<div className={'user-box ' + (active ? '' : ' inactive')}>
				<div className='user-row'>
					<p className='user-label'>Id:</p>
					<p className='user-data'>{_id}</p>
				</div>

				<div className='user-row'>
					<p className='user-label'>Name:</p>
					<p className='user-data'>{name}</p>
				</div>

				<div className='user-row '>
					<p className='user-label '>Email:</p>
					<p className='user-data '>{email}</p>
				</div>

				<div className='user-row'>
					<p className='user-label'>Role:</p>
					<p className='user-data'>
						{role === 0 ? 'User' : role === 1 ? 'Editor' : 'Admin'}
					</p>
				</div>
				<div className='user-row'>
					<p className='user-label'>Validated:</p>
					<p className='user-data'>{validated === 'true' ? 'Yes' : 'No'}</p>
				</div>
				<div className='user-row'>
					<p className='user-label'>Status:</p>
					<p className='user-data'>
						{active === 'true' ? 'Active' : 'Inactive'}
					</p>
				</div>
				<div className='user-row'>
					<p className='user-label'>Joined:</p>
					<p className='user-data'>{dateCoversion(createdAt)}</p>
				</div>
				<div className='user-row'>
					<p className='user-label'>Last Updated:</p>
					<p className='user-data'>{dateCoversion(updatedAt)}</p>
				</div>
				{isAdmin || isEditor ? (
					<div className='user-row'>
						<button
							onClick={() => {
								setShowModal(true);
								props.setSuccess('');
								props.setErrors('');
								props.setFail('');
							}}
							type='button'
							className='edit-user-button btn'
						>
							Edit
						</button>
					</div>
				) : null}

				{isAdmin ? (
					<div className='user-row'>
						<button
							onClick={() => {
								props.getIdDelete(_id);
							}}
							className='delete-user-button btn'
						>
							Delete
						</button>
					</div>
				) : null}
			</div>
			{showModal && (
				<EditUser
					data={data}
					setShowModal={setShowModal}
					handleEditUser={props.handleEditUser}
				/>
			)}
		</>
	);
};

export default User;
