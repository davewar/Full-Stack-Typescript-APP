import { render, screen } from '@testing-library/react';
import Services from './Services';
import { BrowserRouter } from 'react-router-dom';

import '@testing-library/jest-dom';

const MockServices = () => {
	return (
		<BrowserRouter>
			<Services />
		</BrowserRouter>
	);
};

describe('Services', () => {
	test('Component renders correctly', () => {
		render(<MockServices />);

		let tOne = screen.getByRole('heading', {
			name: /welcome to dw servicing/i,
		});

		let tTwo = screen.getByText(/We are located in south east kent and/i);
		let tThree = screen.getByText(
			/tell us what you need and let us show you how we can help\. we provide a free quotation with no obligation for all our services\./i
		);

		expect(tOne).toBeInTheDocument();
		expect(tTwo).toBeInTheDocument();
		expect(tThree).toBeInTheDocument();

		// expect(img1).toBeInTheDocument();
		// expect(img2).toBeInTheDocument();
		// expect(img3).toBeInTheDocument();
		// expect(img4).toBeInTheDocument();
	});
});
