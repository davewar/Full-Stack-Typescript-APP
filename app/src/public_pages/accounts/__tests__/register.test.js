import { render, screen } from '@testing-library/react';
import Register from '../Register';
import { BrowserRouter } from 'react-router-dom';
import user from '@testing-library/user-event';
import { UserContext } from '../../../contexts/user';
import { TESTUSERS } from '../../../mocks/data/users';
import '@testing-library/jest-dom';

// https://stackoverflow.com/questions/56828017/testing-usecontext-with-react-testing-library

let providerProps;

providerProps = {
	user: '',
	accessToken: '12345678910',
	isUser: true,
	isEditor: false,
	isAdmin: false,
	role: 0,
	logUserOut: jest.fn(function () {
		providerProps.isLogged = false;
	}),
	isLogged: true,
};

const mycustomRender = (ui, { providerProps, ...renderOptions }) => {
	return render(
		<UserContext.Provider value={providerProps}>
			<BrowserRouter>{ui}</BrowserRouter>
		</UserContext.Provider>,
		renderOptions
	);
};

describe('.Register', () => {
	test('Component renders correctly if user valid', async () => {
		user.setup();

		mycustomRender(<Register />, { providerProps });

		expect(
			screen.getByRole('heading', { name: 'Register' })
		).toBeInTheDocument();

		let errMessage = 'Invalid Email!';
		let errMessage2 = 'Password must be at least 6 characters!';
		let errMessage3 = 'Passwords are not the same';
		let errMessage4 = 'Full name must be at least 3 characters!';

		await user.type(fullNameInput(), 'Da');
		await user.type(emailInput(), '12');
		await user.type(passwordInput(), '12');
		await user.type(passwordConformInput(), '123');

		expect(screen.getByText(errMessage)).toBeInTheDocument();
		expect(screen.getByText(errMessage2)).toBeInTheDocument();
		expect(screen.getByText(errMessage3)).toBeInTheDocument();
		expect(screen.getByText(errMessage4)).toBeInTheDocument();

		await user.clear(fullNameInput());
		await user.clear(emailInput());
		await user.clear(passwordInput());
		await user.clear(passwordConformInput());

		await user.type(fullNameInput(), registerUser.name);
		await user.type(emailInput(), registerUser.email);
		await user.type(passwordInput(), registerUser.password);
		await user.type(passwordConformInput(), registerUser.password);

		expect(screen.queryByText(errMessage)).not.toBeInTheDocument();
		expect(screen.queryByText(errMessage2)).not.toBeInTheDocument();
		expect(screen.queryByText(errMessage3)).not.toBeInTheDocument();
		expect(screen.queryByText(errMessage4)).not.toBeInTheDocument();

		expect(fullNameInput()).toHaveValue(registerUser.name);
		expect(emailInput()).toHaveValue(registerUser.email);
		expect(passwordInput()).toHaveValue(registerUser.password);
		expect(passwordConformInput()).toHaveValue(registerUser.password);

		await user.click(submitBtn());

		let item = await screen.findByText(
			'Please check your email and activate your account using the link'
		);

		expect(item).toBeInTheDocument();
		expect(item).toHaveClass('text-success text-capitalize');
	});
	test('Component renders an error message if user already exists', async () => {
		user.setup();

		providerProps.accessToken = '987654321';

		mycustomRender(<Register />, { providerProps });

		await user.type(fullNameInput(), 'dave');
		await user.type(emailInput(), TESTUSERS[0].email);
		await user.type(passwordInput(), registerUser.password);
		await user.type(passwordConformInput(), registerUser.password);

		expect(fullNameInput()).toHaveValue('dave');
		expect(emailInput()).toHaveValue(TESTUSERS[0].email);
		expect(passwordInput()).toHaveValue(registerUser.password);
		expect(passwordConformInput()).toHaveValue(registerUser.password);

		await user.click(submitBtn());

		let item = await screen.findByText('Account already exists');
		expect(item).toBeInTheDocument();
		expect(item).toHaveClass('text-danger text-capitalize');
	});
});

let fullNameInput = () => {
	return screen.getByPlaceholderText('Enter full name');
};

let emailInput = () => {
	return screen.getByRole('textbox', { name: 'Email' });
};

let passwordInput = () => {
	return screen.getByPlaceholderText('Enter password');
};

let passwordConformInput = () => {
	return screen.getByPlaceholderText('Re-enter password');
};

let submitBtn = () => {
	return screen.getByRole('button', { name: 'Register' });
};

let registerUser = {
	name: 'Steven Hendry',
	email: 'stevenHendry@madeup.com',
	password: '123123123',
};
