import useRefreshToken from './useRefreshToken';
import { baseUrl } from '../constants/roles';

type FetcherResults = {
	data: { msg?: string | object; errors: string };
	response: {
		status: number;
	};
};

const usePrivateFetch = () => {
	let refresh = useRefreshToken();

	let originalFetch = async (
		url: RequestInfo,
		options: RequestInit
	): Promise<any> => {
		let response: Response = await fetch(`${baseUrl}${url}`, options);
		let data: FetcherResults = await response.json();

		return { data, response };
	};

	let callFetch = async (url: RequestInfo, options: RequestInit) => {
		let { data, response } = await originalFetch(url, options);

		//status code - forbidden.
		if (response?.status === 403) {
			// Does a valid cookie exist - if yes, get a new access token & update state
			let newToken = await refresh();

			if (newToken) {
				//run fetch again

				options['headers'] = {
					Authorization: `Bearer ${newToken}`,
				};

				let { data: newData, response: newResponse } = await originalFetch(
					url,
					options
				);

				response = newResponse;
				data = newData;

				return { data, response };
			} else {
			}
		}
		return { data, response };
	};

	return { callFetch };
};

export default usePrivateFetch;
