import React from 'react';
import { Link } from 'react-router-dom';
import * as Paths from '../constants/routes';
import './footer.css';
import { scrollToTop } from '../utils/helpers';

const Footer = () => {
	return (
		<>
			<footer id='footer'>
				<div className='main-container'>
					<div id='footer-box'>
						<h3>Contact us today for a free consultation & quote</h3>
						<p>What are you waiting for?</p>

						<button className='contactbtn'>
							<div onClick={scrollToTop}>
								<Link className='link btn ' to={Paths.CONTACTPATH}>
									Contact Us
								</Link>
							</div>
						</button>

						<h1 id='footer-title'>DW-Serv</h1>
						<p>
							Copyright &copy; {new Date().getFullYear()}. All rights Reserved.
						</p>
					</div>
				</div>
			</footer>
		</>
	);
};

export default Footer;
