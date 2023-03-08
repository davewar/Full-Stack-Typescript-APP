import { render, screen } from '@testing-library/react';
import ProjectsMain from '../ProjectsMain';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../../../contexts/user';
import '@testing-library/jest-dom';
import { HelmetProvider } from 'react-helmet-async';
import user from '@testing-library/user-event';

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

describe('.Projectmain', () => {
	window.scrollTo = jest.fn();
	afterAll(() => {
		jest.clearAllMocks();
	});
	test('Component renders correctly', async () => {
		user.setup();
		mycustomRender(<ProjectsMain />, { providerProps });

		// Links:  all projects, create project, create cust + amend cust
		expect(screen.getAllByRole('link').length).toBe(4);

		let item = screen.getByRole('link', { name: 'link to create client page' });
		expect(item).toBeInTheDocument();
	});
});
