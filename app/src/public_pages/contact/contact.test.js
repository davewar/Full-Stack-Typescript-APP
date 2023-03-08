import { render, screen, waitFor } from '@testing-library/react';
import Contact from './Contact';
import { BrowserRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import { rest } from 'msw';
import { server } from '../../mocks/server';

// import { expect, jest, test } from '@jest/globals';

const MockContact = () => {
	return (
		<BrowserRouter>
			<Contact />
		</BrowserRouter>
	);
};

describe('Contact', () => {
	test('Component renders correctly', async () => {
		user.setup();

		render(<MockContact />);

		let tOne = screen.getByRole('heading', {
			name: /tell us more about your project/i,
		});

		let tTwo = screen.getByRole('heading', {
			name: /Free quotation/i,
		});
		let tThree = screen.getByText('Please fill out', { exact: false });

		let tFour = screen.getByText(
			'Please fill out the quick form and we will be in touch with lighting speed.',
			{ exact: true }
		);

		expect(tOne).toBeInTheDocument();
		expect(tTwo).toBeInTheDocument();
		expect(tThree).toBeInTheDocument();
		expect(tFour).toBeInTheDocument();

		let namePlaceHolder = screen.getByPlaceholderText(/full name/i);
		expect(namePlaceHolder).toBeInTheDocument();

		let nameLabel = screen.getByLabelText(/name:/i);
		expect(nameLabel).toBeInTheDocument();

		let nameInput = screen.getByRole('textbox', {
			name: /name:/i,
		});

		let emailLabel = screen.getByLabelText(/email:/i);
		expect(emailLabel).toBeInTheDocument();

		let emailInput = screen.getByRole('textbox', {
			name: /email:/i,
		});

		let tAreaInput = screen.getByTestId('custom-element');
		expect(tAreaInput).toBeInTheDocument();

		expect(tAreaInput).toBeInTheDocument();

		// invalid input
		await user.type(nameInput, 'dw');
		expect(nameInput).toHaveValue('dw');
		expect(
			screen.getByText('Name must be at least 3 characters!')
		).toBeInTheDocument();

		//clear input box
		await user.clear(nameInput);
		expect(nameInput).toHaveValue('');

		//correct input
		await user.type(nameInput, 'dave w');
		expect(nameInput).toHaveValue('dave w');
		expect(
			screen.queryByText('Name must be at least 3 characters!')
		).toBeNull(); // eslint-disable-line

		await user.tab();
		expect(emailInput).toHaveFocus();
		// invalid input
		await user.type(emailInput, 'fakename');
		expect(emailInput).toHaveValue('fakename');
		expect(screen.getByText('Invalid Email!')).toBeInTheDocument();

		// clear input box
		await user.clear(emailInput);
		expect(emailInput).toHaveValue('');

		// select all textin the input and then over type

		//correct input
		await user.type(emailInput, 'fakename@12345blahmail.com');
		expect(emailInput).toHaveValue('fakename@12345blahmail.com');

		await user.tab();
		await user.type(tAreaInput, 'Hello world');
		expect(tAreaInput).toHaveValue('Hello world');

		// screen.debug(tAreaInput);

		let submitBtn = screen.getByRole('button', {
			name: /submit/i,
		});

		// post to 'api/email'
		await user.click(submitBtn);

		let resData;

		await waitFor(async () => {
			resData = await screen.findByText(
				'Thank you for your enquiry. We will be in contact with you shortly.',
				{
					exact: false,
				}
			);
			expect(resData).toBeInTheDocument();
		});

		expect(resData).toHaveTextContent(
			'Thank you for your enquiry. We will be in contact with you shortly.'
		);

		expect(resData).toBeVisible();
		expect(resData).toHaveClass('text-success text-capitalize');

		// state values should be clear
		expect(emailInput).toHaveValue('');
		expect(nameInput).toHaveValue('');
		expect(tAreaInput).toHaveValue('');
	});
});

describe('Contact form error message', () => {
	test('Component renders correctly', async () => {
		// send error
		server.use(
			rest.post('http://localhost:5000/api/email/', (req, res, ctx) => {
				return res(
					ctx.status(401),
					ctx.json({
						errors: 'All form fields are required. Please try again',
					})
				);
			})
		);

		user.setup();

		render(<MockContact />);

		let nameInput = screen.getByRole('textbox', {
			name: /name:/i,
		});

		let emailInput = screen.getByRole('textbox', {
			name: /email:/i,
		});

		let tAreaInput = screen.getByTestId('custom-element');

		// input
		await user.type(nameInput, 'Steve Davis');
		await user.tab();

		await user.type(emailInput, 'SteveDavis@blahblah.com');
		await user.tab();

		await user.tab();
		await user.type(tAreaInput, 'blah.................');

		let submitBtn = screen.getByRole('button', {
			name: /submit/i,
		});

		expect(submitBtn).toHaveAttribute('type', 'submit');

		// post to 'api/email'
		await user.click(submitBtn);

		await waitFor(async () => {
			expect(await findErrMessage()).toBeInTheDocument();
		});

		let item = screen.getByText(
			'All form fields are required. Please try again',
			{
				exact: false,
			}
		);

		expect(item).toBeInTheDocument();
		expect(item).toBeVisible();
		expect(item).toHaveClass('text-danger text-capitalize');

		// state values should NOT be cleared
		expect(nameInput).toHaveValue('Steve Davis');
		expect(emailInput).toHaveValue('SteveDavis@blahblah.com');
		expect(tAreaInput).toHaveValue('blah.................');
	});
});

function findErrMessage() {
	return screen.findByText('All form fields are required. Please try again', {
		exact: false,
	});
}
