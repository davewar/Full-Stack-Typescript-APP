import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { BrowserRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

const MockFooter = () => {
	return (
		<BrowserRouter>
			<Footer />
		</BrowserRouter>
	);
};

describe('.Footer', () => {
	test('Component renders correctly', async () => {
		user.setup();

		render(<MockFooter />);

		let heading = screen.getByRole('heading', {
			name: /contact us today for a free consultation & quote/i,
		});

		// getByRole('link', { name: /contact us/i });

		let contactBtn = screen.getByRole('button', { name: /contact us/i });

		let copyright = screen.getByText(
			/copyright © 2023\. all rights reserved\./i
		);

		expect(heading).toBeInTheDocument();
		expect(copyright).toBeInTheDocument();

		expect(contactBtn).toBeInTheDocument();
	});
});
