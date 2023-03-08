import { render, screen } from '@testing-library/react';
import Box from '../Box';
import user from '@testing-library/user-event';

describe('.Box', () => {
	test('Component renders correctly', async () => {
		render(<Box />);

		user.setup();

		let image1 = screen.getByRole('img', { name: 'email' });
		let image2 = screen.getByRole('img', { name: 'handshake' });
		let image3 = screen.getByRole('img', { name: 'fast-delivery' });

		expect(screen.getAllByRole('img').length).toBe(3);

		expect(image1).toBeInTheDocument();
		expect(image2).toBeInTheDocument();
		expect(image3).toBeInTheDocument();

		//testing 1 item
		let item1 = screen.getByText('1. Contact Us');

		expect(item1).toBeInTheDocument();
		expect(item1).toHaveClass('box-title');

		let item2 = screen.getByText(
			'Tell us what you need and we will find your solution.'
		);
		expect(item2).toBeInTheDocument();
	});
});
