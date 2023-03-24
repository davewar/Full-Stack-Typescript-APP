import React, { createContext, useEffect, useState } from 'react';
import { baseUrl } from '../constants/roles';

type UserContextType = {
	user: string | null;
	setUser: React.Dispatch<React.SetStateAction<string>>;
	accessToken: string;
	setAccessToken: React.Dispatch<React.SetStateAction<string>>;
	isLogged: boolean;
	setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
	isUser: boolean;
	setIsUser: React.Dispatch<React.SetStateAction<boolean>>;
	isEditor: boolean;
	setIsEditor: React.Dispatch<React.SetStateAction<boolean>>;
	isAdmin: boolean;
	setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
	role: number | null;
	setRole: React.Dispatch<React.SetStateAction<number | null>>;
	logUserOut: () => Promise<void>;
};

type UserContextProviderProps = {
	children: React.ReactNode;
};

// export const UserContext = createContext<UserContextType | null>(null);
export const UserContext = createContext({} as UserContextType);

const UserProvider = ({
	children,
}: UserContextProviderProps): React.ReactElement => {
	const [user, setUser] = useState<string>('');
	const [accessToken, setAccessToken] = useState<string>('');
	const [isLogged, setIsLogged] = useState<boolean>(false);
	const [isUser, setIsUser] = useState<boolean>(false);
	const [isEditor, setIsEditor] = useState<boolean>(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [role, setRole] = useState<number | null>(null);

	const logUserOut = async (): Promise<void> => {
		try {
			//remove cookie
			await fetch(`${baseUrl}/user/logout`);
			//remove local storage
			localStorage.removeItem('firstlogin');
			// reset state
			setUser('');
			setAccessToken('');
			setIsLogged(false);
			setIsUser(false);
			setIsEditor(false);
			setIsAdmin(false);
			setRole(null);
		} catch (err) {
			if (err instanceof Error) console.log(err);
		}
	};

	// finds out if logged user is admin or customer
	useEffect(() => {
		if (accessToken) {
			const getUser = async () => {
				try {
					const res = await fetch(`${baseUrl}/user/infor`, {
						headers: { Authorization: `Bearer ${accessToken}` },
					});

					const data = await res.json();

					if (data?.user) {
						setIsLogged(true);
						setUser(data.user.name);
						setRole(data.user.role);

						if (data.user.role === 0) setIsUser(true);
						if (data.user.role === 1) setIsEditor(true);
						if (data.user.role === 2) setIsAdmin(true);
					}
				} catch (err) {
					if (err instanceof Error) console.log('DW', err.message);
				}
			};

			getUser();
		}
	}, [accessToken]);

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				isLogged,
				setIsLogged,
				isAdmin,
				setIsAdmin,
				accessToken,
				setAccessToken,
				role,
				setRole,
				isUser,
				setIsUser,
				setIsEditor,
				isEditor,
				logUserOut,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
