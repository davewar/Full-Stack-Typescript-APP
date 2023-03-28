import { screen, within } from '@testing-library/react';
import App from './App';
import { customRender } from './myCustomRender';

describe('App', () => {
	test('Component renders correctly', async () => {
		customRender(<App />);

		// *** Test one item from each component to confirm main page okay ***

		// Nav component on page
		const banner = screen.getByRole('banner');

		expect(
			within(banner).getByRole('heading', {
				name: /dw\-serv/i,
			})
		).toBeInTheDocument();

		// Home component on page
		expect(
			screen.getByRole('heading', {
				name: /technical solutions for your business needs/i,
			})
		).toBeInTheDocument();

		// Box component on page
		expect(
			screen.getByText(
				/tell us what you need and we will find your solution\./i
			)
		).toBeInTheDocument();

		// Footer component on page
		expect(
			screen.getByText(/copyright © 2023\. all rights reserved\./i)
		).toBeInTheDocument();
	});
});
