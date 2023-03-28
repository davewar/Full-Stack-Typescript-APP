import { render, screen } from '@testing-library/react';
import Home from './Home';
import { BrowserRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

const MockHome = () => {
	return (
		<BrowserRouter>
			<Home />
		</BrowserRouter>
	);
};

describe('Home', () => {
	test('Component renders correctly', async () => {
		user.setup();
		render(<MockHome />);

		let item = screen.getByRole('heading', {
			name: /technical solutions for your business needs/i,
		});
		expect(item).toBeInTheDocument();
		expect(item).toHaveTextContent(
			'Technical solutions for your business needs'
		);

		let item1 = screen.getByRole('heading', {
			name: 'We can help make life easier for you',
		});
		expect(item1).toHaveTextContent('We can help make life easier for you');

		// 6 list items on page
		let item2 = screen.getAllByRole('listitem');
		expect(item2.length).toBe(6);

		let item3 = screen.getByText(/design/i);
		let item4 = screen.getByText(/automation/i);
		expect(item3).toBeInTheDocument();
		expect(item4).toBeInTheDocument();

		let item4b = screen.getByRole('heading', {
			name: /small and large scale projects accepted/i,
		});
		expect(item4b).toBeInTheDocument();

		let item4c = screen.getByText(
			/website development, excel, access, vba, sql, power query, power pivot, power view, business objects and qlikview\./i
		);
		expect(item4c).toBeInTheDocument();

		let item66 = screen.getByRole('link', {
			name: /more info/i,
		});
		expect(item66).toBeInTheDocument();

		let item5 = screen.getByRole('img', {
			name: /pc/i,
		});

		const pHover = screen.queryByText(
			'Simple, low cost and effective solutions'
		);
		// not to be found until hover happens
		expect(pHover).toBeInTheDocument();
		// await user.hover(item5);

		await user.hover(item5);
		// now found
		expect(pHover).toBeInTheDocument();
	});
});
