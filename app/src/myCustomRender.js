import { render } from '@testing-library/react';
import UserProvider from './contexts/user';
import { HelmetProvider } from 'react-helmet-async'; //meta title data -see Seo component.

let AllTheProviders = ({ children }) => {
	return (
		<UserProvider>
			<HelmetProvider>{children}</HelmetProvider>
		</UserProvider>
	);
};

const customRender = (ui, options) =>
	render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender };
