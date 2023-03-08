import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import user from '@testing-library/user-event';
import { UserContext } from '../../../contexts/user';
import '@testing-library/jest-dom';

import ClientEdit from '../ClientEdit';

let providerProps;

providerProps = {
	user: 'dave',
	accessToken: '12345678910',
	role: 0,
	isAdmin: false,
	isEditor: false,
};

const mycustomRender = (ui, { providerProps, ...renderOptions }) => {
	return render(
		<UserContext.Provider value={providerProps}>
			<BrowserRouter>{ui}</BrowserRouter>
		</UserContext.Provider>,
		renderOptions
	);
};

describe('.Customer', () => {
	window.scrollTo = jest.fn();
	afterAll(() => {
		jest.clearAllMocks();
	});

	test('Component renders correctly, Delete function button is NOT available to a User role', async () => {
		window.scrollTo = jest.fn();
		user.setup();

		mycustomRender(<ClientEdit />, { providerProps });

		// Loading component found
		expect(screen.getByTestId('loader')).toBeInTheDocument();

		await waitForElementToBeRemoved(() => screen.queryByTestId('loader'));

		//select a cust from the dropdown menu
		await user.selectOptions(
			screen.getByRole('combobox'),
			'customer1@gmail.com'
		);

		let item = screen.queryByRole('button', { name: 'Delete' });
		expect(item).not.toBeInTheDocument();
	});

	test('Component renders correctly, Delete function button is available to a Editor role + works', async () => {
		window.scrollTo = jest.fn();
		user.setup();

		providerProps.role = 1;
		providerProps.isAdmin = false;
		providerProps.isEditor = true;

		mycustomRender(<ClientEdit />, { providerProps });
		// Loading component found
		expect(screen.getByTestId('loader')).toBeInTheDocument();
		await waitForElementToBeRemoved(() => screen.queryByTestId('loader'));

		//select a cust from the dropdown menu
		await user.selectOptions(
			screen.getByRole('combobox'),
			'customer1@gmail.com'
		);

		let item = screen.getByRole('button', { name: 'Delete' });
		expect(item).toBeInTheDocument();

		await user.click(item);

		let msg = await screen.findByText('Customer deleted');
		expect(msg).toBeInTheDocument();
		expect(msg).toHaveClass('text-success text-capitalize');
	});

	test('Component renders correctly, Delete function button is available to a Admin role + works', async () => {
		window.scrollTo = jest.fn();
		user.setup();

		providerProps.role = 2;
		providerProps.isAdmin = true;
		providerProps.isEditor = false;

		mycustomRender(<ClientEdit />, { providerProps });
		// Loading component found
		expect(screen.getByTestId('loader')).toBeInTheDocument();
		await waitForElementToBeRemoved(() => screen.queryByTestId('loader'));

		//select a cust from the dropdown menu
		await user.selectOptions(
			screen.getByRole('combobox'),
			'customer1@gmail.com'
		);

		let item = screen.getByRole('button', { name: 'Delete' });
		expect(item).toBeInTheDocument();

		await user.click(item);

		let msg = await screen.findByText('Customer deleted');
		expect(msg).toBeInTheDocument();
		expect(msg).toHaveClass('text-success text-capitalize');
	});
});
