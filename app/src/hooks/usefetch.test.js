import useFetch from './useFetch';
import { renderHook, waitFor } from '@testing-library/react';

import { rest } from 'msw';
import { server } from '../mocks/server';

let url = '/api/email/';

let options = {
	method: 'POST',
	body: JSON.stringify({
		name: 'myname',
		email: 'myEmail@email.com',
		comment: 'mycomment',
	}),
	headers: {
		'Content-Type': 'application/json',
		credentials: 'include',
	},
};

describe('usefetch hook', () => {
	test('Hook to return data', async () => {
		const { result } = renderHook(() => useFetch());

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe('');

		await waitFor(() => result.current.customFetch(url, options));

		await waitFor(() => expect(result.current.isLoading).toBe(true));

		expect(result.current.isLoading).toBe(true); //true
		expect(result.current.isError).toBe('');
		expect(result.current.data).toEqual({
			msg: 'Thank you for your enquiry. We will be in contact with you shortly.',
		});
	});

	test('Hook to return error message', async () => {
		server.use(
			rest.post('http://localhost:5000/api/madeup/', (req, res, ctx) => {
				return res(
					ctx.json({
						errors: 'All form fields are required. Please try again',
					})
				);
			})
		);

		url = '/api/madeup/';

		const { result } = renderHook(() => useFetch());

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe('');

		await waitFor(() => result.current.customFetch(url, options));

		await waitFor(() => expect(result.current.isLoading).toBe(true));

		expect(result.current.isLoading).toBe(true); //true
		expect(result.current.isError).toBe(
			'All form fields are required. Please try again'
		);
		expect(result.current.data).toEqual('');
	});
});
