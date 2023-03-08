import useRefreshToken from './useRefreshToken';

const usePrivateFetch = () => {
	let refresh = useRefreshToken();

	let baseUrl = process.env.REACT_APP_BACKEND_URL;

	let originalFetch = async (url, options) => {
		let response = await fetch(`${baseUrl}${url}`, options);
		let data = await response.json();

		return { data, response };
	};

	let callFetch = async (url, options) => {
		let { data, response } = await originalFetch(url, options);

		//status code - forbidden.
		if (response.status === 403) {
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
