import React from 'react';
import Box from '../../components/Box';
import './home.css';
import { scrollToTop } from '../../utils/helpers';
import pcImg from '../../assets/images/sysadmin_03.jpg';
import tickImg from '../../assets/images/tick.png';
import ReactGA from 'react-ga4';

import { Link } from 'react-router-dom';

const Home = () => {
	const onClick = () => {
		ReactGA.event({
			category: 'clicked_servicesBtn_category',
			action: 'clicked_servicesBtn_action',
		});
	};
	return (
		<>
			<main className='main-container'>
				<section id='home-section'>
					<h1 id='home-title'>
						Technical solutions for your <br></br> business needs
					</h1>
					<div className='secondary-title'>
						<h2>We can help make life easier for you</h2>
						<ul>
							<li className='list-tick'>
								<img
									className='img-tick'
									src={tickImg}
									alt='green tick to advising we provide this service'
								/>

								<p className='list-p'>Design</p>
							</li>
							<li className='list-tick'>
								<img
									className='img-tick'
									src={tickImg}
									alt='green tick to advising we provide this service'
								/>
								<p className='list-p'>Automation</p>
							</li>
							<li className='list-tick'>
								<img
									className='img-tick'
									src={tickImg}
									alt='green tick to advising we provide this service'
								/>
								<p className='list-p'>Streamling</p>
							</li>
							<li className='list-tick'>
								<img
									className='img-tick'
									src={tickImg}
									alt='green tick to advising we provide this service'
								/>
								<p className='list-p'>Reporting</p>
							</li>
							<li className='list-tick'>
								<img
									className='img-tick'
									src={tickImg}
									alt='green tick to advising we provide this service'
								/>
								<p className='list-p'>Reduction in manual errors</p>
							</li>
							<li className='list-tick'>
								<img
									className='img-tick'
									src={tickImg}
									alt='green tick to advising we provide this service'
								/>
								<p className='list-p'>Time saving efficiencies</p>
							</li>
						</ul>
						<h3 className='small-p'>Small and large scale projects accepted</h3>
					</div>
					<div id='specials'>
						<p>
							Website Development, Excel, Access, VBA, SQL, Power Query, Power
							Pivot, Power View, Business Objects and Qlikview.
						</p>

						<button id='more-button' onClick={(() => scrollToTop, onClick)}>
							<Link id='more-btn' to='/services'>
								More Info
							</Link>
						</button>
					</div>

					<div id='image-container'>
						<img id='image-pc' src={pcImg} alt='pc' />
						<p className='overlay'>Simple, low cost and effective solutions</p>
					</div>
				</section>
			</main>
			<Box />
		</>
	);
};

export default Home;
