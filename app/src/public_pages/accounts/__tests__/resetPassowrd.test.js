import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import user from '@testing-library/user-event';
import ResetPassword from '../ResetPassword';

import { TESTUSERS } from '../../../mocks/data/users';

import '@testing-library/jest-dom';

let myroute = '';

const mockUseParams = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => mockUseParams(),
}));

describe('Password Reset', () => {
	test('Component renders correctly, if user does exist', async () => {
		mockUseParams.mockReturnValue({
			id: '123',
		});

		myroute = '/reset_password/123456';
		user.setup();

		const renderWithRouter = (
			ui,
			{ route = '/reset_password/123456' } = {}
		) => {
			window.history.pushState({}, '', route);

			return render(ui, { wrapper: BrowserRouter });
		};

		renderWithRouter(<ResetPassword />, { route: myroute });

		expect(window.location.pathname).toBe(myroute);

		expect(screen.getByText('Create your new Password')).toBeInTheDocument();

		let errMessage = 'Invalid Email!';
		let errMessage2 = 'Password must be at least 6 characters!';
		let errMessage3 = 'Passwords are not the same';

		await user.click(submitBtn());
		expect(emailInput()).toBeInvalid();

		await user.type(emailInput(), '12');
		await user.type(passwordInput(), '12');
		await user.type(passwordConformInput(), '123');

		expect(screen.getByText(errMessage)).toBeInTheDocument();
		expect(screen.getByText(errMessage2)).toBeInTheDocument();
		expect(screen.getByText(errMessage3)).toBeInTheDocument();

		await user.clear(emailInput());
		await user.clear(passwordInput());
		await user.clear(passwordConformInput());

		await user.type(emailInput(), TESTUSERS[0].email);
		await user.type(passwordInput(), '123456789');
		await user.type(passwordConformInput(), '123456789');

		expect(screen.queryByText(errMessage)).not.toBeInTheDocument();
		expect(screen.queryByText(errMessage2)).not.toBeInTheDocument();
		expect(screen.queryByText(errMessage3)).not.toBeInTheDocument();

		expect(passwordInput()).toHaveValue('123456789');
		expect(passwordConformInput()).toHaveValue('123456789');
		expect(emailInput()).toHaveValue(TESTUSERS[0].email);

		await user.click(submitBtn());

		let item = await screen.findByText(
			'Password successfully changed! Please log in to use your account'
		);

		expect(item).toBeInTheDocument();
		expect(item).toHaveClass('text-success text-capitalize');
	});

	test('Component renders correctly, if user does not exist', async () => {
		myroute = '/reset_password/123456';
		user.setup();

		mockUseParams.mockReturnValue({
			id: '1234',
		});

		const renderWithRouter = (
			ui,
			{ route = '/reset_password/123456' } = {}
		) => {
			window.history.pushState({}, '', route);

			return render(ui, { wrapper: BrowserRouter });
		};

		renderWithRouter(<ResetPassword />, { route: myroute });

		await user.type(emailInput(), 'neilfoulds@madeupaddress.com');
		await user.type(passwordInput(), '123456789');
		await user.type(passwordConformInput(), '123456789');

		await user.click(submitBtn());

		let item = await screen.findByText(
			'Invalid Authentication. Please check you entered your email address correctly and try again'
		);

		expect(item).toBeInTheDocument();
		expect(item).toHaveClass('text-danger text-capitalize');
	});
	test('Component renders correctly, if user does exist but accesstoken incorrect', async () => {
		myroute = '/reset_password/45678';
		user.setup();

		mockUseParams.mockReturnValue({
			id: '456789',
		});

		const renderWithRouter = (
			ui,
			{ route = '/reset_password/456789' } = {}
		) => {
			window.history.pushState({}, '', route);

			return render(ui, { wrapper: BrowserRouter });
		};

		renderWithRouter(<ResetPassword />, { route: myroute });

		await user.type(emailInput(), TESTUSERS[0].email);
		await user.type(passwordInput(), '123456789');
		await user.type(passwordConformInput(), '123456789');

		await user.click(submitBtn());

		let item = await screen.findByText(
			'Invalid Authentication. Please request a new link via the SignIn button'
		);

		expect(item).toBeInTheDocument();
		expect(item).toHaveClass('text-danger text-capitalize');
	});

	// jest.clearAllMocks();
	mockUseParams.mockReset();
});

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
	return screen.getByRole('button', { name: 'Submit' });
};
