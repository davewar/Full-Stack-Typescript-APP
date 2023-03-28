import { useState } from 'react';

import { URL } from '../App';

type FetchData = {
	msg?: string;
	errors?: string;
};

const useFetch = () => {
	const [data, setData] = useState<string>('');
	const [isLoading, setLoading] = useState<boolean>(false);
	const [isError, setError] = useState<string>('');

	// let baseUrl = process.env.REACT_APP_BACKEND_URL;
	let baseUrl = URL;

	const customFetch = async (
		url: string,
		options: RequestInit = {}
	): Promise<void> => {
		try {
			const res: Response = await fetch(`${baseUrl}${url}`, options);

			const data: FetchData = await res.json();

			if (data.errors) {
				setError(data?.errors);
				setLoading(true);
			} else if (data?.msg) {
				setData(data.msg);
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
