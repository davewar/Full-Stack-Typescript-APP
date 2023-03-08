import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import UserProvider from './contexts/user';
import { HelmetProvider } from 'react-helmet-async'; //meta title data -see Seo component.
import { disableReactDevTools } from '@fvilers/disable-react-devtools'; //disable react dev tools when website live.

if (process.env.REACT_APP_NODE_ENV === 'production') disableReactDevTools();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<UserProvider>
			<HelmetProvider>
				<App />
			</HelmetProvider>
		</UserProvider>
	</React.StrictMode>
);
