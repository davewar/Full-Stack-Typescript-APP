import {
	render,
	screen,
	waitForElementToBeRemoved,
	waitFor,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../../../contexts/user';
import '@testing-library/jest-dom';
import { HelmetProvider } from 'react-helmet-async';
import user from '@testing-library/user-event';

import ProjectCreate from '../ProjectsCreate';
import { CUSTOMERS, TESTUSERS } from '../../../mocks/data/users';
import { projectNew } from '../../../mocks/data/projects';

const mycustomRender = (ui, { providerProps, ...renderOptions }) => {
	return render(
		<UserContext.Provider value={providerProps}>
			<HelmetProvider>
				<BrowserRouter>{ui}</BrowserRouter>
			</HelmetProvider>
		</UserContext.Provider>,
		renderOptions
	);
};

let providerProps = {
	accessToken: '123456',
	user: 'dave',
};

describe('.Projectcreate', () => {
	window.scrollTo = jest.fn();

	jest.setTimeout(10000);

	afterAll(() => {
		jest.clearAllMocks();
		jest.setTimeout(5000);
	});

	test('Component renders correctly if no projects exist2', async () => {
		user.setup();

		mycustomRender(<ProjectCreate />, { providerProps });

		// Loading component found
		expect(screen.getByTestId('loader')).toBeInTheDocument();

		await waitForElementToBeRemoved(() => screen.queryByTestId('loader'));

		expect(screen.getByText('Create Project')).toBeInTheDocument();

		// default
		expect(
			screen.getByRole('option', { name: '---select customer---' }).selected
		).toBe(true);

		//options available are:

		expect(
			screen.getByRole('option', { name: '---select customer---' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: TESTUSERS[0].email })
		).toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: TESTUSERS[0].email })
		).toBeInTheDocument();

		// assign to

		// default
		expect(
			screen.getByRole('option', { name: '---select employee---' }).selected
		).toBe(true);

		//options available are:

		expect(
			screen.getByRole('option', { name: '---select employee---' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: CUSTOMERS[0].email })
		).toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: CUSTOMERS[0].email })
		).toBeInTheDocument();

		//select a cust from the dropdown menu
		await user.selectOptions(
			screen.getByTestId('combobox1'),
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

		//select an employee from the dropdown menu
		await user.selectOptions(
			screen.getByTestId('combobox2'),
			'2testdw@testmocha.com'
		);

		expect(
			screen.getByRole('option', { name: '---select employee---' }).selected
		).toBe(false);
		expect(
			screen.getByRole('option', { name: TESTUSERS[0].email }).selected
		).toBe(false);
		expect(
			screen.getByRole('option', { name: TESTUSERS[1].email }).selected
		).toBe(false);
		expect(
			screen.getByRole('option', { name: TESTUSERS[2].email }).selected
		).toBe(true);

		// one create project customer and person to assign to , this shows the below

		expect(projectTitle()).toHaveValue('');

		//listbox -  nothinh selected yet
		expect(screen.getByRole('option', { name: 'Website' }).selected).toBe(
			false
		);
		expect(screen.getByRole('option', { name: 'Excel' }).selected).toBe(false);
		expect(screen.getByRole('option', { name: 'Access' }).selected).toBe(false);
		expect(screen.getByRole('option', { name: 'BI' }).selected).toBe(false);

		expect(projectTotalCost()).toHaveValue(null);

		expect(projectRequirements()).toHaveValue('');
		expect(projectUserComments()).toHaveValue('');
		expect(projectCompleted()).toBeInTheDocument();

		// expect(submitBtn()).toBeInTheDocument();

		await user.type(projectTitle(), projectNew.title);
		expect(projectTitle()).toHaveValue(projectNew.title);

		await user.selectOptions(projectType(), 'Excel');

		expect(screen.getByRole('option', { name: 'Website' }).selected).toBe(
			false
		);
		expect(screen.getByRole('option', { name: 'Excel' }).selected).toBe(true);
		expect(screen.getByRole('option', { name: 'Access' }).selected).toBe(false);
		expect(screen.getByRole('option', { name: 'BI' }).selected).toBe(false);

		//select multiple
		await user.selectOptions(projectType(), ['Excel', 'Access']);

		expect(screen.getByRole('option', { name: 'Website' }).selected).toBe(
			false
		);
		expect(screen.getByRole('option', { name: 'Excel' }).selected).toBe(true);
		expect(screen.getByRole('option', { name: 'Access' }).selected).toBe(true);
		expect(screen.getByRole('option', { name: 'BI' }).selected).toBe(false);

		await user.type(projectTotalCost(), String(projectNew.price));
		expect(projectTotalCost()).toHaveValue(projectNew.price);

		await user.type(projectRequirements(), projectNew.description);
		expect(projectRequirements()).toHaveValue(projectNew.description);

		await user.type(projectUserComments(), 'my user test comments');
		expect(projectUserComments()).toHaveValue('my user test comments');

		expect(projectCompleted()).not.toBeChecked();
		await user.click(projectCompleted());
		expect(projectCompleted()).toBeChecked();

		await user.click(submitBtn());

		await waitFor(async () => {
			await screen.findByText(/New project added/i);
		});
	});
});

let projectTitle = () => {
	return screen.getByPlaceholderText('Project Title..');
};

let projectType = () => {
	return screen.getByRole('listbox', {
		name: /project type/i,
	});
};

let projectTotalCost = () => {
	return screen.getByRole('spinbutton', {
		name: /project total cost in gbp/i,
	});
};

let projectRequirements = () => {
	return screen.getByPlaceholderText('Please enter project requirements....');
};

let projectUserComments = () => {
	return screen.getByPlaceholderText('Please add commments...');
};
let projectCompleted = () => {
	return screen.getByRole('checkbox', {
		name: /project completed/i,
	});
};

let submitBtn = () => {
	return screen.getByRole('button', {
		name: 'Create',
	});
};
