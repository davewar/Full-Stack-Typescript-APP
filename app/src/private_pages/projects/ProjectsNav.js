import React from 'react';
import { NavLink } from 'react-router-dom';
import './projects.css';

const activeStyles = {
	fontWeight: 'bold',
	color: '#0000eb',
};

const ProjectsNav = ({ children }) => {
	return (
		<div id='project'>
			<div className='main-container'>
				<div className='nav-container project-nav'>
					<div className='flex-item'>
						<NavLink
							className='link-item underline'
							to='/projects/all'
							aria-label='link to all projects page'
							style={({ isActive }) => (isActive ? activeStyles : null)}
						>
							All Projects
						</NavLink>
					</div>
					<div className='flex-item'>
						<NavLink
							className='link-item underline'
							to='/projects/create'
							aria-label='link to create project page'
							style={({ isActive }) => (isActive ? activeStyles : null)}
						>
							Create Project
						</NavLink>
					</div>
					<div className='flex-item'>
						<NavLink
							className='link-item underline'
							to='/projects/customer_create'
							aria-label='link to create client page'
							style={({ isActive }) => (isActive ? activeStyles : null)}
						>
							Create Customer
						</NavLink>
					</div>
					<div className='flex-item'>
						<NavLink
							className='link-item underline'
							to='/projects/customer_amend'
							aria-label='link to amend client page'
							style={({ isActive }) => (isActive ? activeStyles : null)}
						>
							Amend Customer
						</NavLink>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectsNav;
