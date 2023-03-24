import { useState } from 'react';

const useFetch = () => {
	const [data, setData] = useState('');
	const [isLoading, setLoading] = useState(false);
	const [isError, setError] = useState('');

	let baseUrl = process.env.REACT_APP_BACKEND_URL;

	const customFetch = async (url, options = null) => {
		try {
			const res = await fetch(`${baseUrl}${url}`, options);

			const data = await res.json();

			if (data.errors) {
				setError(data.errors);
				setLoading(true);
			} else if (!data?.errors) {
				setData(data);
				setLoading(true);
			}
		} catch (err) {
			console.log(err);

			setLoading(true);
			setError('Server Issue. Please try later');
		}
	};

	return { data, isLoading, isError, customFetch };
};

export default useFetch;
