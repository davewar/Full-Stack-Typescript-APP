import './messageModal.css';
import { RiCloseLine } from 'react-icons/ri';

type DataObjProp = {
	header: string;
	desc: string;
	buttonDesc: string;
	buttonType: string;
};

type ModalProps = {
	dataObj: DataObjProp;
	closeModal: () => void;
	deleteItem: () => void;
};

const MessageModal = (props: ModalProps) => {
	return (
		<>
			<div className='centered'>
				<div className='modal'>
					<div className='modalHeader'>
						<p className='heading'>{props.dataObj.header}</p>
					</div>
					<button className='closeBtn' onClick={() => props.closeModal()}>
						<RiCloseLine style={{ marginBottom: '-3px' }} />
					</button>

					<div className='modalContent'>
						<p>{props.dataObj.desc}</p>
					</div>
					<div className='modalActions'>
						<div className='actionsContainer'>
							<button
								className='cancelBtn btn'
								onClick={() => props.closeModal()}
							>
								Cancel
							</button>
							<button
								className={props.dataObj.buttonType}
								onClick={() => {
									props.deleteItem();
								}}
							>
								{props.dataObj.buttonDesc}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MessageModal;
