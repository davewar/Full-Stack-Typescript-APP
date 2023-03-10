import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import PageSeo from './seo/PageSeo';
import Consent from './cookieConsent/Consent';

const Layout = () => {
	const cookiesOn: boolean = false;
	return (
		<>
			<PageSeo />
			<Navbar />

			<Outlet />

			{cookiesOn ? <Consent /> : null}
			<Footer />
		</>
	);
};

export default Layout;
