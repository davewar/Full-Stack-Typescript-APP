import React from 'react';
import { Outlet } from 'react-router-dom';
import ProjectsNav from './ProjectsNav';
import GoToTop from '../../components/GoToTop';
import './projects.css';

const Projects = () => {
	//fetch all projects

	return (
		<div id='project-page'>
			<GoToTop />
			<ProjectsNav />

			<div className='main-container'>
				<Outlet />
			</div>
		</div>
	);
};

export default Projects;
