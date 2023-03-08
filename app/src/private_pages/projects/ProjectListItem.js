import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../../contexts/user';

const ProjectListItem = (props) => {
	let {
		title,
		projectCompleted,
		customerID,
		paid,
		description,
		assignedTo,
		lastUpdatedBy,
		_id,
		createdBy,
		price,
	} = props.obj;

	const { isAdmin, isEditor } = useContext(UserContext);

	const navigate = useNavigate();

	return (
		<div className='project-box'>
			<div>
				<div className='user-row'>
					<p className='user-label'>Customer: </p>
					<p className='user-data'>{customerID}</p>
				</div>
				<div className='user-row'>
					<p className='user-label'>Owner: </p>
					<p className='user-data'>{assignedTo}</p>
				</div>
				<div className='user-row'>
					<p className='user-label'>Project Price:</p>
					<p className='user-data'>£{price}</p>
				</div>
				<div className='user-row'>
					<p className='user-label'>Title:</p>
					<p className='user-data'>{title}</p>
				</div>
				<div className='user-row'>
					<p className='user-label'>Project Description:</p>
					<p className='user-data'>{description[0]}</p>
				</div>
				<div className='user-row'>
					<p className='user-label'>CreatedBy:</p>
					<p className='user-data'>{createdBy}</p>
				</div>
				<div className='user-row'>
					<p className='user-label'>Last updated by: </p>
					<p className='user-data'>{lastUpdatedBy}</p>
				</div>
				<div className='user-row'>
					<p className='user-label'>Project Completed:</p>
					<p className='user-data'>{projectCompleted ? 'Yes' : 'No'}</p>
				</div>
				<div className='user-row'>
					<p className='user-label'>Balance Paid:</p>
					<p className='user-data'>{paid ? 'Yes' : 'No'}</p>
				</div>
			</div>

			<div className='user-row'>
				<button
					onClick={() => {
						navigate(`/projects/item/${_id}`);
					}}
					type='button'
					className='edit-user-button btn'
				>
					Edit
				</button>
			</div>
			{(isAdmin || isEditor) && (
				<div className='user-row'>
					<button
						type='button'
						onClick={() => {
							props.getIdDelete(_id);
						}}
						className='delete-user-button btn'
					>
						Delete
					</button>
				</div>
			)}
		</div>
	);
};

export default ProjectListItem;
