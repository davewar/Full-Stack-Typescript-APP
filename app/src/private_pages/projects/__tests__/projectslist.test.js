import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../../../contexts/user';
import '@testing-library/jest-dom';
import { HelmetProvider } from 'react-helmet-async';
import user from '@testing-library/user-event';

import ProjectList from '../ProjectList';
import { rest } from 'msw';
import { server } from '../../../mocks/server';

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
};

describe('.ProjectList', () => {
	window.scrollTo = jest.fn();

	jest.setTimeout(10000);

	afterAll(() => {
		jest.clearAllMocks();
		jest.setTimeout(5000);
	});

	test('Component renders correctly if no projects exist', async () => {
		server.use(
			rest.get('http://localhost:5000/api/product', (req, res, ctx) => {
				return res.once(
					ctx.status(200),
					ctx.json({
						msg: 'No projects found',
					})
				);
			})
		);

		user.setup();
		mycustomRender(<ProjectList />, { providerProps });

		// Loading component found
		expect(screen.getByTestId('loader')).toBeInTheDocument();
		await waitForElementToBeRemoved(() => screen.queryByTestId('loader'));

		expect(screen.getByText(/no records found/i)).toBeInTheDocument();
	});
});
