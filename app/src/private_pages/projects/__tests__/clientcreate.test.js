import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import user from '@testing-library/user-event';
import { UserContext } from '../../../contexts/user';
import '@testing-library/jest-dom';

import ClientCreate from '../ClientCreate';
import { CUSTOMERS } from '../../../mocks/data/users';

let providerProps;

providerProps = {
	user: 'dave',
	accessToken: '12345678910',
};

const mycustomRender = (ui, { providerProps, ...renderOptions }) => {
	return render(
		<UserContext.Provider value={providerProps}>
			<BrowserRouter>{ui}</BrowserRouter>
		</UserContext.Provider>,
		renderOptions
	);
};

describe('.ClientCreate', () => {
	afterAll(() => {
		jest.clearAllMocks();
	});
	test('Component renders correctly, user able to create customer', async () => {
		window.scrollTo = jest.fn();
		user.setup();

		mycustomRender(<ClientCreate />, { providerProps });

		expect(
			screen.getByRole('heading', { name: 'Create New Customer' })
		).toBeInTheDocument();

		let errMessage = 'Name must be at least 6 characters!';
		let errMessage2 = 'Invalid Email!';
		let errMessage3 = 'Please supply required field';

		await user.type(custNameInput(), 'Da');
		await user.type(emailInput(), '12');

		await user.click(submitBtn());

		expect(screen.getByText(errMessage2)).toBeInTheDocument();
		expect(screen.getByText(errMessage)).toBeInTheDocument();

		expect(custNameInput()).toBeRequired();
		expect(telephoneInput()).toBeRequired();
		expect(addressLineInputCounty()).toBeRequired();
		expect(addressLineInputTown()).toBeRequired();
		expect(addressLineInputPostcode()).toBeRequired();

		expect(screen.getAllByText(errMessage3).length).toBe(4);

		await user.clear(custNameInput());
		await user.clear(emailInput());

		await user.type(custNameInput(), CUSTOMERS[0].name);
		await user.type(emailInput(), CUSTOMERS[0].email);
		await user.type(custBusinessNameInput(), CUSTOMERS[0].businessName);
		await user.type(telephoneInput(), CUSTOMERS[0].telephone);

		await user.type(addressLineInput1(), CUSTOMERS[0].address.addressLine1);

		await user.type(addressLineInputTown(), CUSTOMERS[0].address.town); //reqd
		await user.type(addressLineInputCounty(), CUSTOMERS[0].address.county);
		await user.type(addressLineInputPostcode(), CUSTOMERS[0].address.postcode); //reqd

		expect(screen.queryByText(errMessage)).not.toBeInTheDocument();
		expect(screen.queryByText(errMessage2)).not.toBeInTheDocument();
		expect(screen.queryByText(errMessage3)).not.toBeInTheDocument();

		expect(custNameInput()).toHaveValue(CUSTOMERS[0].name);
		expect(emailInput()).toHaveValue(CUSTOMERS[0].email);
		expect(custBusinessNameInput()).toHaveValue(CUSTOMERS[0].businessName);
		expect(telephoneInput()).toHaveValue(CUSTOMERS[0].telephone);
		expect(addressLineInput1()).toHaveValue(CUSTOMERS[0].address.addressLine1);
		expect(addressLineInputTown()).toHaveValue(CUSTOMERS[0].address.town); //reqd
		expect(addressLineInputCounty()).toHaveValue(CUSTOMERS[0].address.county);
		expect(addressLineInputPostcode()).toHaveValue(
			CUSTOMERS[0].address.postcode
		); //reqd

		await user.click(submitBtn());

		let item = await screen.findByText('New customer added');
		expect(item).toBeInTheDocument();
		expect(item).toHaveClass('text-success text-capitalize');
	});

	test('Component renders correctly, error message received if creating a duplicate customer', async () => {
		user.setup();
		window.scrollTo = jest.fn();

		mycustomRender(<ClientCreate />, { providerProps });

		await user.type(custNameInput(), 'tony draygo');
		await user.type(emailInput(), 'tonydraygo@madeup.com');
		await user.type(custBusinessNameInput(), CUSTOMERS[0].businessName);
		await user.type(telephoneInput(), CUSTOMERS[0].telephone);
		await user.type(addressLineInput1(), CUSTOMERS[0].address.addressLine1);
		await user.type(addressLineInputTown(), CUSTOMERS[0].address.town);
		await user.type(addressLineInputCounty(), CUSTOMERS[0].address.county);
		await user.type(addressLineInputPostcode(), CUSTOMERS[0].address.postcode);

		await user.click(submitBtn());

		let item = await screen.findByText('Account already exists');
		expect(item).toBeInTheDocument();
		expect(item).toHaveClass('text-danger text-capitalize');
	});
});

let custNameInput = () => {
	return screen.getByRole('textbox', { name: 'Customer Name' });
};

let custBusinessNameInput = () => {
	return screen.getByPlaceholderText('Enter Business name');
};

let emailInput = () => {
	return screen.getByPlaceholderText('Enter email');
};

let telephoneInput = () => {
	return screen.getByPlaceholderText('Enter contact number');
};

let addressLineInput1 = () => {
	return screen.getByRole('textbox', { name: 'Address Line 1' });
};
let addressLineInput2 = () => {
	return screen.getByRole('textbox', { name: 'Address Line 2' });
};

let addressLineInput3 = () => {
	return screen.getByRole('textbox', { name: 'Address Line 3' });
};

let addressLineInputTown = () => {
	return screen.getByRole('textbox', { name: 'Town' });
};

let addressLineInputCounty = () => {
	return screen.getByRole('textbox', { name: 'County' });
};

let addressLineInputPostcode = () => {
	return screen.getByPlaceholderText('PostCode');
};

let submitBtn = () => {
	return screen.getByRole('button', { name: 'Create' });
};
