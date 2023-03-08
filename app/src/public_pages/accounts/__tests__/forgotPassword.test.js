import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import user from '@testing-library/user-event';
import { TESTUSERS } from '../../../mocks/data/users';
import UserProvider from '../../../contexts/user';
import ForgotPassword from '../ForgotPassword';

const MockResetPw = () => {
	return (
		<BrowserRouter>
			<ForgotPassword />
		</BrowserRouter>
	);
};

describe('Password Reset', () => {
	test('Component renders correctly, if user does not exist', async () => {
		user.setup();

		render(<MockResetPw />, { wrapper: UserProvider });

		let title = screen.getByRole('heading', { name: 'Reset Password' });

		let emailInput = screen.getByRole('textbox', { name: /email/i });

		let submitBtn = screen.getByRole('button', { name: 'Submit' });

		expect(title).toBeInTheDocument();

		expect(emailInput).toBeInTheDocument();
		expect(emailInput).toBeRequired();

		expect(submitBtn).toBeInTheDocument();
		expect(submitBtn).toHaveAttribute('type', 'submit');

		let errMessage = screen.queryByText('Invalid Email!', {
			exact: false,
		});
		expect(errMessage).not.toBeInTheDocument();

		user.click(submitBtn);

		expect(emailInput).toBeInvalid(); // please fill in the form message appears

		await user.type(emailInput, 'hello');
		expect(emailInput).toHaveValue('hello');
		await user.type(emailInput, '@gmail.com');
		expect(emailInput).toHaveValue('hello@gmail.com');
		expect(emailInput).toBeValid();
		expect(errMessage).not.toBeInTheDocument();

		await user.click(submitBtn);

		await waitFor(async () => {
			expect(
				await screen.findByText('Account does not exist')
			).toBeInTheDocument();
		});

		let item = screen.getByText('Account does not exist', {
			exact: false,
		});

		expect(item).toBeInTheDocument();
		expect(item).toBeVisible();
		expect(item).toHaveClass('text-danger text-capitalize');
		expect(emailInput).toHaveValue('hello@gmail.com');
	});

	test('Component renders correctly, if user does exist', async () => {
		user.setup();

		render(<MockResetPw />, { wrapper: UserProvider });

		let emailInput = screen.getByRole('textbox', { name: /email/i });

		let submitBtn = screen.getByRole('button', { name: 'Submit' });

		await user.type(emailInput, TESTUSERS[0].email);
		await user.click(submitBtn);

		await waitFor(async () => {
			expect(
				await screen.findByText(
					'Please check your email and reset your password using the link. You may need to check your spam/junk folder.'
				)
			).toBeInTheDocument();
		});

		let item = screen.getByText(
			'Please check your email and reset your password using the link. You may need to check your spam/junk folder.',
			{
				exact: false,
			}
		);

		expect(item).toBeInTheDocument();
		expect(item).toBeVisible();
		expect(item).toHaveClass('text-success text-capitalize');
		expect(emailInput).toHaveValue('');
	});
});
