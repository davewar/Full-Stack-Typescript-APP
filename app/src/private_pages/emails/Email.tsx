import { AiFillDelete } from 'react-icons/ai';

type EmailObjProp = {
	_id: string;
	comment: string;
	createdAt: string;
	email: string;
	name: string;
	updatedAt: string;
	getIdDelete: (id: string) => void;
};

const Email = (props: EmailObjProp) => {
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
