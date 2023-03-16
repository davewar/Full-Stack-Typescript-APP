import React, { useState } from 'react';
import './editUser.css';
import { ROLES } from '../../constants/roles';

import { updateUserProp } from '../models/usersPropTypes';

type dataProp = {
	active: string;
	createdAt: string;
	email: string;
	name: string;
	role: number;
	updatedAt: string;
	validated: string;
	_id: string;
};

type UserEditProps = {
	data: dataProp;
	handleEditUser: (id: string, updateUser: updateUserProp) => void;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditUser = (props: UserEditProps) => {
	const [active, setActive] = useState(props.data.active);
	const [role, setRole] = useState(props.data.role);
	const [email] = useState(props.data.email);
	const [name] = useState(props.data.name);
	const [validated, setValidated] = useState(props.data.validated);
	const [_id] = useState(props.data._id);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// update user
		props.handleEditUser(_id, {
			role: role,
			active: active,
			validated: validated,
		});
		// close modal
		props.setShowModal(false);
	};

	const roleOptions = Object.values(ROLES).map((item) => {
		return (
			<option key={item} value={item}>
				{item === 0 ? 'User' : item === 1 ? 'Editor' : 'Admin'}
			</option>
		);
	});

	return (
		<div className='user-form-container'>
			<form
				className={'user-box  user-form ' + (active ? 'active' : 'inactive')}
				id='user-form'
				onSubmit={handleSubmit}
			>
				<div className='user-row'>
					<label htmlFor='id' className='user-label'>
						Id:
					</label>
					<input
						type='text'
						name='id'
						className='user-data'
						disabled
						id='id'
						value={_id}
						onChange={() => {}}
					/>
				</div>
				<div className='user-row'>
					<label htmlFor='name' className='user-label'>
						Name:
					</label>
					<input
						type='text'
						name='name'
						className='user-data'
						id='name'
						value={name}
						onChange={() => {}}
						disabled
					/>
				</div>
				<div className='user-row'>
					<label htmlFor='email' className='user-label'>
						Email:
					</label>
					<input
						type='email'
						name='email'
						className='user-data'
						id='email'
						value={email}
						onChange={() => {}}
						disabled
					/>
				</div>
				<div className='user-row'>
					<label htmlFor='role' className='user-label'>
						Role:
					</label>
					<select
						name='role'
						className='user-data'
						id='role'
						value={role}
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
							setRole(parseInt(e.target.value));
						}}
					>
						{roleOptions}
					</select>
				</div>
				<div className='user-row'>
					<label htmlFor='validated' className='user-label'>
						Validated:
					</label>
					<select
						name='validated'
						className='user-data'
						id='validated'
						value={validated}
						onChange={(e) => {
							setValidated(e.target.value);
						}}
					>
						<option value={'true'}>Yes</option>
						<option value={'false'}>No</option>
					</select>
				</div>
				<div className='user-row'>
					<label htmlFor='active' className='user-label'>
						Status:
					</label>
					<select
						name='active'
						className='user-data'
						id='active'
						value={active}
						onChange={(e) => {
							setActive(e.target.value);
						}}
					>
						<option value={'true'}>Active</option>
						<option value={'false'}>Inactive</option>
					</select>
				</div>

				<div className='user-row user-row-buttons'>
					<button
						className='cancelBtn btn'
						type='button'
						onClick={() => props.setShowModal(false)}
					>
						Cancel
					</button>

					<button className='updateBtn' type='submit'>
						Save
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditUser;
