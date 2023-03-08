import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../contexts/user';
import '@testing-library/jest-dom';
import { HelmetProvider } from 'react-helmet-async';

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
	user: 'Dave',
};

describe('.Dashboard', () => {
	test('Component renders correctly with user prop name', async () => {
		mycustomRender(<Dashboard />, { providerProps });

		expect(screen.getAllByRole('link').length).toBe(3);

		expect(
			screen.queryByRole('heading', { name: 'Welcome:' })
		).not.toBeInTheDocument();

		expect(
			screen.getByRole('heading', { name: 'Welcome: Dave' })
		).toBeInTheDocument();

		expect(screen.getByText('You are logged in!')).toBeInTheDocument();

		let item = screen.getByRole('link', { name: 'Emails' });
		expect(item).toBeInTheDocument();
	});
});
