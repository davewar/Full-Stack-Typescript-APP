import React, { useEffect, useState } from 'react';
import CookieConsent, {
	getCookieConsentValue,
	Cookies,
} from 'react-cookie-consent';

import ReactGA from 'react-ga4';
import './consent.css';
import { useLocation } from 'react-router-dom';

const Consent = () => {
	const id = 'G-G4916C4E0D';
	// true=[prod]
	// const ga4Live = false;
	const ga4Live = process.env.REACT_APP_GA4LIVE;
	const [showCookieCompo, setShowCookieComp] = useState(false); // delay the component from showing on screen, you wont see animations otherwise on mobile view
	const [show, setShow] = useState(false); // show cookie policy
	// cookie consent
	const [consent, setConsent] = useState({
		necessary: true,
		analytical: true,
		marketing: true,
	});

	const handleAccept = () => {
		if (ga4Live) {
			// add marketing later
			if (consent.analytical) {
				ReactGA.initialize(id);
				ReactGA.send({ hitType: 'pageview', page: location.pathname });
			}
		}
	};

	const handleDecline = () => {
		//remove google analytics cookies if any
		Cookies.remove(`_ga_${id}`);
		Cookies.remove('_gat');
		Cookies.remove('_gid');
		Cookies.remove('_gtag');
	};

	let location = useLocation();

	useEffect(() => {
		let isConsent = getCookieConsentValue();
		// if true then Ga4 is live
		if (ga4Live) {
			if (isConsent === true) {
				ReactGA.send({ hitType: 'pageview', page: location.pathname });
			}
		}
	}, [location, ga4Live]);

	const onChange = (e, name) => {
		if (name === 'analytical') {
			setConsent((prevState) => {
				return {
					...prevState,
					analytical: !prevState.analytical,
				};
			});
		} else if (name === 'marketing') {
			setConsent((prevState) => {
				return {
					...prevState,
					marketing: !prevState.marketing,
				};
			});
		}
	};

	//delay the consent component
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowCookieComp(true);
		}, 5000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div>
			{showCookieCompo && (
				<CookieConsent
					enableDeclineButton
					onAccept={handleAccept}
					onDecline={handleDecline}
					declineButtonText='Reject'
					buttonText='Accept'
					buttonStyle={{
						color: 'white',
						background: '#0000eb',
						fontSize: '13px',
					}}
					declineButtonStyle={{ color: 'white', opacity: '0.6' }}
					overlay={true}
				>
					This website uses cookies to ensure you get the best experience on our
					website.
					<button
						style={{
							fontSize: '10px',
							color: 'red',
							marginLeft: '1em',
							background: 'none',
						}}
						className='bob'
						aria-label='link to cookie page'
						onClick={() => setShow((prev) => !prev)}
					>
						Cookie Policy
					</button>
					{show && (
						<div className='consent-form'>
							<div className='form-check'>
								<input
									className='form-check-input '
									type='checkbox'
									value=''
									id='necessary'
									name='necessary'
									checked={consent.necessary}
									onChange={(e) => onChange(e, 'necessary')}
								/>
								<label className='form-check-label' htmlFor='necessary'>
									<strong>Necessary cookies</strong>
									<p>
										Help with the basic functionality of our website, e.g
										remember if you gave consent to cookies.
									</p>
								</label>
							</div>

							<div className='form-check'>
								<input
									className='form-check-input'
									type='checkbox'
									value=''
									id='analytical'
									checked={consent.analytical}
									name='analytical'
									onChange={(e) => onChange(e, 'analytical')}
								/>
								<label className='form-check-label' htmlFor='analytical'>
									<strong>Analytical cookies</strong>
									<p>
										Make it possible to gather statistics about the use and
										trafiic on our website, so we can make it better.
									</p>
								</label>
							</div>

							<div className='form-check'>
								<input
									className='form-check-input'
									type='checkbox'
									value=''
									id='marketing'
									checked={consent.marketing}
									name='marketing'
									onChange={(e) => onChange(e, 'marketing')}
								/>
								<label className='form-check-label' htmlFor='marketing'>
									<strong>Marketing cookies</strong>
									<p>
										Make it possible to show you more relevant social media
										content and advertisements on our website and other
										platforms.
									</p>
								</label>
							</div>
						</div>
					)}
				</CookieConsent>
			)}
		</div>
	);
};

export default Consent;
