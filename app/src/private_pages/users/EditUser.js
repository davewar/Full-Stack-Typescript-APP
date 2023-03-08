import React, { useState } from 'react';
import './editUser.css';
import { ROLES } from '../../constants/roles';

const EditUser = (props) => {
	const [active, setActive] = useState(props.data.active);
	const [role, setRole] = useState(props.data.role);
	const [email] = useState(props.data.email);
	const [name] = useState(props.data.name);
	const [validated, setValidated] = useState(props.data.validated);
	const [_id] = useState(props.data._id);

	const handleSubmit = (e) => {
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
					<label htmlFor='id' type='text' className='user-label'>
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
					<label htmlFor='name' type='text' className='user-label'>
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
					<label htmlFor='email' type='email' className='user-label'>
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
					<label htmlFor='role' type='text' className='user-label'>
						Role:
					</label>
					<select
						type='text'
						name='role'
						className='user-data'
						id='role'
						value={role}
						onChange={(e) => {
							setRole(e.target.value);
						}}
					>
						{roleOptions}
					</select>
				</div>
				<div className='user-row'>
					<label htmlFor='validated' type='text' className='user-label'>
						Validated:
					</label>
					<select
						type='text'
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
					<label htmlFor='active' type='text' className='user-label'>
						Status:
					</label>
					<select
						type='text'
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
