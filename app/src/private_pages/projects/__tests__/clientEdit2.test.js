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

import { rest } from 'msw';
import { server } from '../../../mocks/server';

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
	afterAll(() => {
		jest.clearAllMocks();
	});

	test('Component renders correctly when fetch returns no customers exist', async () => {
		server.use(
			rest.get('http://localhost:5000/api/customer', (req, res, ctx) => {
				return res.once(
					ctx.status(400),
					ctx.json({
						msg: 'No customers found',
					})
				);
			})
		);

		window.scrollTo = jest.fn();
		user.setup();

		mycustomRender(<ClientEdit />, { providerProps });

		// Loading component found
		expect(screen.getByTestId('loader')).toBeInTheDocument();
		await waitForElementToBeRemoved(() => screen.queryByTestId('loader'));

		let item = await screen.findByText('No customers found');
		expect(item).toBeInTheDocument();
		expect(item).toHaveClass('text-success text-capitalize');
	});
});
