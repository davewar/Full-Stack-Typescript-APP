import { render, screen, waitFor } from '@testing-library/react';
import Login from '../Login';
import { BrowserRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import { TESTUSERS } from '../../../mocks/data/users';

import UserProvider from '../../../contexts/user';

const MockLogin = () => {
	return (
		<BrowserRouter>
			<Login />
		</BrowserRouter>
	);
};

describe('Login', () => {
	test('Component renders correctly', async () => {
		user.setup();

		render(<MockLogin />, { wrapper: UserProvider });

		await user.type(getEmail(), 'dave');

		expect(await screen.findByText(/invalid email!/i)).toBeInTheDocument();

		await user.clear(getEmail());
		await user.type(getEmail(), TESTUSERS[0].email);

		expect(getEmail()).toHaveValue(TESTUSERS[0].email);

		await user.tab();
		expect(getPasswordInput()).toHaveFocus();
		await user.type(getPasswordInput(), '123456789');
		expect(getPasswordInput()).toHaveValue('123456789');
		expect(getPasswordInput()).toHaveAttribute('type', 'password');
		expect(getPassWVis_btn()).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /submit/i }));

		// if login success then state update to ""
		await waitFor(async () => {
			expect(getEmail()).toHaveValue('');
		});

		expect(getPasswordInput()).toHaveValue('');
	});

	test('Component renders correctly, incorrect pw', async () => {
		user.setup();

		render(<MockLogin />, { wrapper: UserProvider });

		await user.type(getEmail(), TESTUSERS[0].email);
		await user.type(getPasswordInput(), '1234567');

		expect(getEmail()).toHaveValue(TESTUSERS[0].email);
		expect(getPasswordInput()).toHaveValue('1234567');

		await user.click(screen.getByRole('button', { name: /submit/i }));

		let item = await screen.findByText('Incorrect login. Please try again', {
			exact: false,
		});

		expect(item).toBeInTheDocument();
		expect(item).toBeVisible();
		expect(item).toHaveClass('text-danger text-capitalize');

		expect(getEmail()).toHaveValue(TESTUSERS[0].email);
		expect(getPasswordInput()).toHaveValue('1234567');
	});

	test('Component renders correctly, no user exist', async () => {
		user.setup();

		render(<MockLogin />, { wrapper: UserProvider });

		await user.type(getEmail(), 'JimmyWhite@gmail.com');
		await user.type(getPasswordInput(), 'whirlwind');

		await user.click(screen.getByRole('button', { name: /submit/i }));

		let item = await screen.findByText('Incorrect login. Please try again', {
			exact: false,
		});

		expect(item).toBeInTheDocument();
		expect(item).toBeVisible();
		expect(item).toHaveClass('text-danger text-capitalize');

		expect(getEmail()).toHaveValue('JimmyWhite@gmail.com');
		expect(getPasswordInput()).toHaveValue('whirlwind');
	});
});

function getEmail() {
	return screen.getByRole('textbox', { name: /email/i });
}

function getPasswordInput() {
	return screen.getByPlaceholderText('Enter password');
}

function getPassWVis_btn() {
	return screen.getByRole('button', {
		name: /click to change password visibility/i,
	});
}
