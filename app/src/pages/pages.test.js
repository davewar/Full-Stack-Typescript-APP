import { render, screen } from '@testing-library/react';
import Pages from './Pages';

import user from '@testing-library/user-event';
import { UserContext } from '../contexts/user';
import '@testing-library/jest-dom';
import { HelmetProvider } from 'react-helmet-async';

const mycustomRender = (ui, { providerProps, ...renderOptions }) => {
	return render(
		<UserContext.Provider value={providerProps}>
			<HelmetProvider>{ui}</HelmetProvider>
		</UserContext.Provider>,
		renderOptions
	);
};

let providerProps = {
	user: '',
	accessToken: '',
	isUser: false,
	isEditor: false,
	isAdmin: false,
	role: '',
	logUserOut: jest.fn(function () {
		providerProps.isLogged = false;
	}),
	isLogged: false,
};

describe('.Pages', () => {
	beforeEach(() => {
		window.scrollTo = jest.fn();
	});

	afterAll(() => {
		jest.resetAllMocks();
	});

	test('Component renders correctly, expect public link to navigate to correct page - login', async () => {
		user.setup();
		mycustomRender(<Pages />, { providerProps });
		expect(window.location.pathname).toBe('/');
		let item = screen.getByRole('link', { name: 'Log In' });
		await user.click(item);
		expect(window.location.pathname).toBe('/login');
	});

	test('Component renders correctly, expect public link to navigate to correct page -services', async () => {
		user.setup();
		mycustomRender(<Pages />, { providerProps });
		expect(window.location.pathname).toBe('/login');
		let item = screen.getByRole('link', {
			name: 'link to Services website page',
		});
		await user.click(item);
		expect(window.location.pathname).toBe('/services');
	});

	test('Component renders correctly, expect public link to navigate to correct page - contact us', async () => {
		user.setup();
		mycustomRender(<Pages />, { providerProps });
		expect(window.location.pathname).toBe('/services');
		let item = screen.getByRole('link', {
			name: 'link to contact us website page',
		});
		await user.click(item);
		expect(window.location.pathname).toBe('/contact');
	});

	test('Component renders correctly, "RequireAuth component" protects private page "dashboard" , expect if no token user redirect to home', async () => {
		window.history.pushState({}, '', '/dashboard');

		user.setup();
		mycustomRender(<Pages />, { providerProps });

		expect(window.location.pathname).toBe('/');
	});

	test('Component renders correctly, "RequireAuth component" protects private page "dashboard" , expect if accesstoken but no role then user redirected to unauthorised page', async () => {
		window.history.pushState({}, '', '/dashboard');
		providerProps.accessToken = '123456';

		user.setup();
		mycustomRender(<Pages />, { providerProps });

		expect(window.location.pathname).toBe('/unauthorized');
	});

	test('Component renders correctly, "RequireAuth component" protects private page "dashboard" , expect if accesstoken and a valid role then user redirected to dashboard page', async () => {
		window.history.pushState({}, '', '/dashboard');
		providerProps.accessToken = '123456';
		providerProps.role = 0;

		user.setup();
		mycustomRender(<Pages />, { providerProps });

		expect(window.location.pathname).toBe('/dashboard');
	});

	//

	test('Component renders correctly, "RequireAuth component" protects private page "/email"', async () => {
		window.history.pushState({}, '', '/emails');
		providerProps.accessToken = '';
		providerProps.role = null;

		user.setup();
		mycustomRender(<Pages />, { providerProps });

		expect(window.location.pathname).toBe('/');
	});

	test('Component renders correctly, "RequireAuth component" protects private page "/users"', async () => {
		window.history.pushState({}, '', '/users');
		providerProps.accessToken = '';
		providerProps.role = null;

		user.setup();
		mycustomRender(<Pages />, { providerProps });

		expect(window.location.pathname).toBe('/');
	});

	let listPaths = [
		// '/users',
		'/projects/create',
		'/projects',
		'/projects/create',
		'/projects/customer_create',
		'/projects/customer_amend',
		'/register',
	];

	const addPath = (path, accessToken = null, role = null) => {
		window.history.pushState({}, '', path);
		providerProps.accessToken = accessToken;
		providerProps.role = role;

		user.setup();
		mycustomRender(<Pages />, { providerProps });
	};

	test('Component renders correctly, "RequireAuth component" protects private pages, if not authorised and no token"', async () => {
		addPath(listPaths[0]);
		expect(window.location.pathname).toBe('/');

		addPath(listPaths[1]);
		expect(window.location.pathname).toBe('/');

		addPath(listPaths[2]);
		expect(window.location.pathname).toBe('/');

		addPath(listPaths[3]);
		expect(window.location.pathname).toBe('/');

		addPath(listPaths[4]);
		expect(window.location.pathname).toBe('/');

		addPath(listPaths[5]);
		expect(window.location.pathname).toBe('/');

		addPath(listPaths[6]);
		expect(window.location.pathname).toBe('/');
	});

	test('Component renders correctly, "RequireAuth component" protects private pages, token supplied but no role"', async () => {
		// redirect to path
		let path = '/unauthorized';

		addPath(listPaths[0], '12345');
		expect(window.location.pathname).toBe(path);

		addPath(listPaths[1], '12345');
		expect(window.location.pathname).toBe(path);

		addPath(listPaths[2], '12345');
		expect(window.location.pathname).toBe(path);

		addPath(listPaths[3], '12345');
		expect(window.location.pathname).toBe(path);

		addPath(listPaths[4], '12345');
		expect(window.location.pathname).toBe(path);

		addPath(listPaths[5], '12345');
		expect(window.location.pathname).toBe(path);

		addPath(listPaths[6], '12345');
		expect(window.location.pathname).toBe(path);
	});

	test('Component renders correctly, "RequireAuth component" protects private pages, token supplied with a role"', async () => {
		// redirect to path
		let path = '/unauthorized';

		addPath(listPaths[0], '12345', 0);
		expect(window.location.pathname).toBe(listPaths[0]);
		expect(window.location.pathname).not.toBe(path);

		addPath(listPaths[0], '12345', 1);
		expect(window.location.pathname).toBe(listPaths[0]);
		expect(window.location.pathname).not.toBe(path);

		addPath(listPaths[0], '12345', 2);
		expect(window.location.pathname).toBe(listPaths[0]);
		expect(window.location.pathname).not.toBe(path);

		addPath(listPaths[0], '12345', 3); // << role does not exist
		expect(window.location.pathname).not.toBe(listPaths[0]);
		expect(window.location.pathname).toBe(path);
	});
});
