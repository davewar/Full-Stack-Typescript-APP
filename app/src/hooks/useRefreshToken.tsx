import { useContext } from 'react';
import { UserContext } from '../contexts/user';
import { baseUrl } from '../constants/roles';

// let baseUrl = process.env.REACT_APP_BACKEND_URL;

// Does a refresh cookie exist? if,yes, give a new access token

type FetchData = {
	accesstoken?: string;
};

const useRefreshToken = () => {
	let { setAccessToken, logUserOut } = useContext(UserContext);

	const refresh = async () => {
		try {
			const res: Response = await fetch(`${baseUrl}/user/refresh_token`, {
				credentials: 'include',
			});

			const data: FetchData = await res.json();

			if (data.accesstoken) {
				setAccessToken(data.accesstoken);

				return data.accesstoken;
			} else {
				// log user out as token expired!
				logUserOut();
			}
		} catch (err) {
			if (err instanceof Error) {
				console.log(err);
			}
		}
	};

	return refresh;
};

export default useRefreshToken;
