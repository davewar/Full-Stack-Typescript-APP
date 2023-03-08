import React, { useState, useEffect } from 'react';
import Pages from './pages/Pages';
import Loading from './components/Loading';

import useRefreshToken from './hooks/useRefreshToken';

export const URL = process.env.REACT_APP_BACKEND_URL;

function App() {
	const [isLoading, setLoading] = useState(true);

	let refresh = useRefreshToken();

	useEffect(() => {
		setLoading(false);
	}, []);

	useEffect(() => {
		const firstLogin = localStorage.getItem('firstlogin');

		if (firstLogin) {
			const refreshToken = async () => {
				// eslint-disable-next-line
				let token = await refresh();
			};
			refreshToken();
		}
		// eslint-disable-next-line
	}, []);

	return <div className='App'>{isLoading ? <Loading /> : <Pages />}</div>;
}

export default App;
