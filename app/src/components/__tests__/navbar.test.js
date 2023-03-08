import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';
import { BrowserRouter } from 'react-router-dom';
import user from '@testing-library/user-event';
import { UserContext } from '../../contexts/user';
import '@testing-library/jest-dom';

let providerProps;

const mycustomRender = (ui, { providerProps, ...renderOptions }) => {
	return render(
		<UserContext.Provider value={providerProps}>
			<BrowserRouter>{ui}</BrowserRouter>
		</UserContext.Provider>,
		renderOptions
	);
};

describe('.Navbar', () => {
	test('Component renders correctly if user NOT logged in', async () => {
		user.setup();

		providerProps = {
			user: '',
			isUser: false,
			isEditor: false,
			isAdmin: false,
			role: '',
			logUserOut: jest.fn(function () {
				providerProps.isLogged = false;
			}),
			isLogged: false,
		};

		mycustomRender(<Navbar />, { providerProps });

		let item = screen.getByRole('img', { name: /vector1/i });
		expect(item).toBeInTheDocument();

		let item2 = screen.getByRole('heading', { name: /DW-Serv/i });
		expect(item2).toBeInTheDocument();

		let contactlink = screen.getByRole('link', {
			name: /link to contact us website page/i,
		});
		expect(contactlink).toHaveAttribute('href', '/contact');

		let serviceslink = screen.getByRole('link', {
			name: /link to Services website page/i,
		});
		expect(serviceslink).toHaveAttribute('href', '/services');

		//dont show
		let dashboardlink = screen.queryByRole('link', { name: /dashboard/i });
		expect(dashboardlink).not.toBeInTheDocument();
		// eslint-disable-next-line
		expect(dashboardlink).toBeNull();

		//dont show
		let loginlink = screen.getByRole('link', { name: /Log In/i });
		expect(loginlink).toHaveAttribute('href', '/login', 'link-item underline');
	});

	test('Component renders correctly if user is logged in', async () => {
		user.setup();

		providerProps.isLogged = true;

		mycustomRender(<Navbar />, { providerProps });

		//dont show
		let loginlink = screen.queryByRole('link', { name: /Log In/i });
		expect(loginlink).not.toBeInTheDocument();

		let logOutlink = screen.getByRole('link', { name: /log out/i });
		expect(logOutlink).toHaveAttribute('href', '/', 'link-item underline');

		let dashboardlink = screen.getByRole('link', { name: /dashboard/i });
		expect(dashboardlink).toHaveAttribute(
			'href',
			'/dashboard',
			'link-item underline'
		);

		await user.click(logOutlink);

		expect(providerProps.logUserOut).toHaveBeenCalledTimes(1);
	});

	test('Component renders if a user is logged in and then logs out', async () => {
		user.setup();

		providerProps = {
			logUserOut: jest.fn(function () {
				providerProps.isLogged = false;
			}),
			isLogged: true,
		};

		mycustomRender(<Navbar />, { providerProps });

		//dont show
		let loginlink = screen.queryByRole('link', { name: /Log In/i });
		expect(loginlink).not.toBeInTheDocument();

		let logOutlink = screen.getByRole('link', { name: /log out/i });
		expect(logOutlink).toHaveAttribute('href', '/', 'link-item underline');

		let dashboardlink = screen.getByRole('link', { name: /dashboard/i });
		expect(dashboardlink).toHaveAttribute(
			'href',
			'/dashboard',
			'link-item underline'
		);

		await user.click(logOutlink);

		expect(providerProps.logUserOut).toHaveBeenCalledTimes(1);

		expect(providerProps.isLogged).toBeFalsy();
		// expect(providerProps.isLogged).toBeTruthy();

		// now show
		let getLogin = screen.getByRole('link', { name: /Log In/i });
		expect(getLogin).toBeInTheDocument();

		// now dont show
		let logOutBtn = screen.queryByRole('link', { name: /log out/i });
		expect(logOutBtn).not.toBeInTheDocument();
	});
});
