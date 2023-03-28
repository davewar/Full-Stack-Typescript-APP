import { render, screen } from '@testing-library/react';
import Error from '../Error';
import { BrowserRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

const MockError = () => {
	return (
		<BrowserRouter>
			<Error />
		</BrowserRouter>
	);
};

describe('.Error', () => {
	test('Component renders correctly', async () => {
		user.setup();
		window.history.pushState({}, '', '/blah');

		render(<MockError />);

		let heading = screen.getByRole('heading', {
			name: /Oops!/i,
		});

		let linkItem = screen.getByRole('link', { name: /Visit Our Homepage/i });

		expect(heading).toBeInTheDocument();
		expect(linkItem).toBeInTheDocument();

		await user.click(linkItem);

		expect(window.location.pathname).toBe('/');
	});
});
