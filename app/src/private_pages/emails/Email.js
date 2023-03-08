import React from 'react';
import { AiFillDelete } from 'react-icons/ai';

const Email = (props) => {
	const { _id: id, email, name, comment, createdAt } = props;

	return (
		<>
			<tr className=''>
				<td className='cell-name'>{name}</td>
				<td className='cell-email'>{email}</td>
				<td className='cell-comment'>
					<div className='content'>{comment}</div>
				</td>
				<td className='cell-date'>{createdAt.slice(0, 16)}</td>
				<td className='cell-action'>
					<button onClick={() => props.getIdDelete(id)}>
						<AiFillDelete className='delete-icon' />
					</button>
				</td>
			</tr>
		</>
	);
};

export default Email;
