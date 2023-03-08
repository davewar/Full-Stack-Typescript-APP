import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/user';
import usePrivateFetch from '../../hooks/usePrivateFetch';
import Loading from '../../components/Loading';
import SearchForm from './SearchForm';

import ProjectListItem from './ProjectListItem';

import MessageModal from '../../components/MessageModal';

const ProjectList = () => {
	const [projects, setProjects] = useState([]);
	const [search, setSearch] = useState('');
	const [radio, setRadio] = useState('all');
	const [paidRadio, setPaidRadio] = useState('all');

	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState('');
	const [success, setSuccess] = useState('');

	//delete Message Modal
	const [deleteShow, setDeleteShow] = useState(false); //delete message box
	const [deleteId, setDeleteId] = useState('');

	let filteredData = [];
	let filter = '';
	let filter2 = '';

	const { accessToken } = useContext(UserContext); //global user

	let { callFetch } = usePrivateFetch();
	//get projects
	useEffect(() => {
		let url = '/api/product';
		let options = {
			headers: { Authorization: `Bearer ${accessToken}` },
		};

		let getAllProjects = async () => {
			try {
				let { data, response } = await callFetch(url, options);

				if (response.status === 403 && data.errors) {
					setLoading(false);
					setErrors(data.errors);
				} else if (data.msg) {
					if (data.msg === 'No projects found') {
						setProjects([]);
						setLoading(false);
						setErrors('');
					} else {
						// sort by customer email address
						let sortedData = data.msg.sort((a, b) =>
							a.customerID < b.customerID ? -1 : 1
						);

						setProjects(sortedData);
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
		getAllProjects();

		// eslint-disable-next-line
	}, []);

	if (!loading && projects.length > 0) {
		if (search === '') {
			filteredData = projects;
		}
		if (search !== '') {
			filteredData = projects.filter((item) => {
				return (
					item.title.toLowerCase().includes(search.toLowerCase()) ||
					item.createdBy.toLowerCase().includes(search.toLowerCase()) ||
					item.description[0].toLowerCase().includes(search.toLowerCase()) ||
					item.assignedTo.toLowerCase().includes(search.toLowerCase()) ||
					item.customerID.toLowerCase().includes(search.toLowerCase()) ||
					item.lastUpdatedBy.toLowerCase().includes(search.toLowerCase())
				);
			});
		}

		// projected completed
		filter = radio === 'all' ? 'all' : radio === 'completed' ? true : false;

		if (filter === 'all') {
			// eslint-disable-next-line
			filteredData = filteredData.filter((item) => {
				if (item.projectCompleted === true || item.projectCompleted === false) {
					return item;
				}
			});
		} else {
			// eslint-disable-next-line
			filteredData = filteredData.filter((item) => {
				if (item.projectCompleted === filter) {
					return item;
				}
			});
		}

		// paid
		filter2 =
			paidRadio === 'all' ? 'all' : paidRadio === 'completed' ? true : false;

		if (filter2 === 'all') {
			// eslint-disable-next-line
			filteredData = filteredData.filter((item) => {
				if (item.paid === true || item.paid === false) {
					return item;
				}
			});
		} else {
			// eslint-disable-next-line
			filteredData = filteredData.filter((item) => {
				if (item.paid === filter2) {
					return item;
				}
			});
		}
	}

	//delete project
	const deleteItem = async () => {
		setErrors('');
		setSuccess('');

		//no id to delete
		if (!deleteId) {
			setDeleteShow(false); //close modal
			return;
		}

		try {
			let urlDelete = `/api/product/delete/${deleteId}`;

			let optionsDelete = {
				method: 'DELETE',
				body: JSON.stringify({ _id: deleteId }),
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

					setErrors(data.errors);
					setDeleteShow(false);
					setDeleteId('');
				} else {
					setErrors(data.errors);
					setDeleteShow(false);
					setDeleteId('');
				}
			} else if (data) {
				const newList = projects.filter((item) => item._id !== deleteId);
				setProjects(newList);
				setSuccess(data.msg);
				setDeleteShow(false); //close modal
				setDeleteId('');
			}
		} catch (err) {
			console.log('dw email ', err.message);
			setErrors('No Server Response');
			setDeleteShow(false); //close modal
		}
	};

	const getIdDelete = (id) => {
		setDeleteId(id);
		setDeleteShow(true); // show modal
	};

	// user chosen not to delete email, clear state & close modal
	const closeModal = (id) => {
		setDeleteId('');
		setDeleteShow(false);
	};

	//props for Message Modal
	let dataObj = {
		header: 'Delete Confirmation',
		desc: 'Are you sure you want to delete ?',
		buttonDesc: 'Delete',
		buttonType: ' deleteBtn',
	};

	///end of delete process

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
			{deleteShow && (
				<MessageModal
					dataObj={dataObj}
					closeModal={closeModal}
					deleteItem={deleteItem}
				/>
			)}

			<SearchForm
				search={search}
				setSearch={setSearch}
				radio={radio}
				setRadio={setRadio}
				paidRadio={paidRadio}
				setPaidRadio={setPaidRadio}
			/>

			<div className='projects-container'>
				{projects &&
					filteredData.map((project) => {
						return (
							<ProjectListItem
								key={project._id}
								obj={project}
								deleteItem={deleteItem}
								getIdDelete={getIdDelete}
							/>
						);
					})}
			</div>
			{filteredData.length === 0 && <div>No records found</div>}
		</>
	);
};

export default ProjectList;
