import React, { useState, useEffect } from 'react';
import Pages from './pages/Pages';
import Loading from './components/Loading';

import useRefreshToken from './hooks/useRefreshToken';

export const URL = 'http://localhost:5000';

function App() {
	const [isLoading, setLoading] = useState(true);

	let refresh = useRefreshToken();

	useEffect((): void => {
		setLoading(false);
	}, []);

	useEffect(() => {
		const firstLogin: string | null = localStorage.getItem('firstlogin');

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
