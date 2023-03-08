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
import { CUSTOMERS, AMENDCUSTOMER1 } from '../../../mocks/data/users';

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

describe('.ClientEdit', () => {
	window.scrollTo = jest.fn();
	jest.setTimeout(10000); // need longer

	afterAll(() => {
		jest.clearAllMocks();
		jest.setTimeout(5000); // bk to default
	});

	test('Component renders correctly when fetch returns a customers list', async () => {
		window.scrollTo = jest.fn();
		user.setup();

		mycustomRender(<ClientEdit />, { providerProps });

		// Loading component found
		expect(screen.getByTestId('loader')).toBeInTheDocument();

		await waitForElementToBeRemoved(() => screen.queryByTestId('loader'));

		expect(
			screen.getByRole('heading', { name: /amend customer/i })
		).toBeInTheDocument();

		// https://testing-library.com/docs/ecosystem-user-event#selectoptionselement-values-options

		const custSelectDropdown = screen.getByRole('combobox');
		expect(custSelectDropdown).toBeInTheDocument();

		// default
		expect(
			screen.getByRole('option', { name: '---select customer---' }).selected
		).toBe(true);

		//options available are:

		expect(
			screen.getByRole('option', { name: '---select customer---' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: CUSTOMERS[0].email })
		).toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: CUSTOMERS[0].email })
		).toBeInTheDocument();

		// expect form fields not to be in the document until a customer is selected
		expect(screen.queryByText(/customer name/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/business name/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/email/i)).not.toBeInTheDocument();

		//select a cust from the dropdown menu
		await user.selectOptions(
			screen.getByRole('combobox'),
			'customer1@gmail.com'
		);

		expect(
			screen.getByRole('option', { name: '---select customer---' }).selected
		).toBe(false);
		expect(
			screen.getByRole('option', { name: CUSTOMERS[0].email }).selected
		).toBe(true);
		expect(
			screen.getByRole('option', { name: CUSTOMERS[1].email }).selected
		).toBe(false);

		// on selecting Customer, this renders the Customer.js component

		expect(screen.getByText(/customer name/i)).toBeInTheDocument();
		expect(screen.getByText(/business name/i)).toBeInTheDocument();
		expect(screen.getByText(/email/i)).toBeInTheDocument();

		//check props have been passed donwn correctly
		expect(custNameInput()).toHaveValue(CUSTOMERS[0].name);
		expect(emailInput()).toHaveValue(CUSTOMERS[0].email);
		expect(custBusinessNameInput()).toHaveValue(CUSTOMERS[0].businessName);
		expect(telephoneInput()).toHaveValue(CUSTOMERS[0].telephone);
		expect(addressLineInput1()).toHaveValue(CUSTOMERS[0].address.addressLine1);
		expect(addressLineInput2()).toHaveValue(CUSTOMERS[0].address.addressLine2);
		expect(addressLineInput3()).toHaveValue(CUSTOMERS[0].address.addressLine3);
		expect(addressLineInputTown()).toHaveValue(CUSTOMERS[0].address.town);
		expect(addressLineInputCounty()).toHaveValue(CUSTOMERS[0].address.county);
		expect(addressLineInputPostcode()).toHaveValue(
			CUSTOMERS[0].address.postcode
		);

		//clear a field -
		await user.clear(custNameInput());
		expect(
			screen.getByText('Name must be at least 3 characters!')
		).toBeInTheDocument();

		await user.clear(custNameInput());
		await user.type(custNameInput(), AMENDCUSTOMER1[0].name);
		expect(custNameInput()).toHaveValue(AMENDCUSTOMER1[0].name);

		await user.clear(emailInput());
		await user.type(emailInput(), AMENDCUSTOMER1[0].email);
		expect(emailInput()).toHaveValue(AMENDCUSTOMER1[0].email);

		await user.clear(custBusinessNameInput());
		await user.type(custBusinessNameInput(), AMENDCUSTOMER1[0].businessName);
		expect(custBusinessNameInput()).toHaveValue(AMENDCUSTOMER1[0].businessName);

		await user.clear(telephoneInput());
		await user.type(telephoneInput(), AMENDCUSTOMER1[0].telephone);
		expect(telephoneInput()).toHaveValue(AMENDCUSTOMER1[0].telephone);

		await user.clear(addressLineInput1());
		await user.type(
			addressLineInput1(),
			AMENDCUSTOMER1[0].address.addressLine1
		);
		expect(addressLineInput1()).toHaveValue(
			AMENDCUSTOMER1[0].address.addressLine1
		);

		await user.clear(addressLineInput2());
		await user.type(
			addressLineInput2(),
			AMENDCUSTOMER1[0].address.addressLine2
		);
		expect(addressLineInput2()).toHaveValue(
			AMENDCUSTOMER1[0].address.addressLine2
		);

		await user.clear(addressLineInput3());
		await user.type(
			addressLineInput3(),
			AMENDCUSTOMER1[0].address.addressLine3
		);
		expect(addressLineInput3()).toHaveValue(
			AMENDCUSTOMER1[0].address.addressLine3
		);

		await user.clear(addressLineInputTown());
		await user.type(addressLineInputTown(), AMENDCUSTOMER1[0].address.town);
		expect(addressLineInputTown()).toHaveValue(AMENDCUSTOMER1[0].address.town);

		await user.clear(addressLineInputCounty());
		await user.type(addressLineInputCounty(), AMENDCUSTOMER1[0].address.county);
		expect(addressLineInputCounty()).toHaveValue(
			AMENDCUSTOMER1[0].address.county
		);

		await user.clear(addressLineInputPostcode());
		await user.type(
			addressLineInputPostcode(),
			AMENDCUSTOMER1[0].address.postcode
		);
		expect(addressLineInputPostcode()).toHaveValue(
			AMENDCUSTOMER1[0].address.postcode
		);

		await user.click(submitBtn());

		let item = await screen.findByText('Customer updated');
		expect(item).toBeInTheDocument();
		expect(item).toHaveClass('text-success text-capitalize');
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
	return screen.getByRole('button', {
		name: /save/i,
	});
};
