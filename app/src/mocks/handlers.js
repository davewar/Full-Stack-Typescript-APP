import { rest } from 'msw';
// import { handlers as loginHandlers } from './domains/login';
// import { handlers as contactformHandlers } from './domains/contactform';
// export const handlers = [...loginHandlers, ...contactformHandlers];

import { TESTUSERS, CUSTOMERS } from './data/users';
import { products } from './data/projects';

export const handlers = [
	rest.post('http://localhost/user/reset', async (req, res, ctx) => {
		let { email, accesstoken } = await req.json();

		// no user found
		if (email === 'neilfoulds@madeupaddress.com') {
			return res(
				ctx.status(400),
				ctx.json({
					errors:
						'Invalid Authentication. Please check you entered your email address correctly and try again',
				})
			);
		}

		// user exists + accesstoken correct
		else if (email === TESTUSERS[0].email && accesstoken === '123') {
			return res(
				ctx.status(200),
				ctx.json({
					msg: 'Password successfully changed! Please log in to use your account',
				})
			);
		}

		// user exists but accesstoken incorrect (expired)
		else if (TESTUSERS[0].email && accesstoken !== '123') {
			return res(
				ctx.status(200),
				ctx.json({
					errors:
						'Invalid Authentication. Please request a new link via the SignIn button',
				})
			);
		}
	}),

	rest.post('http://localhost:5000/api/email/', (req, res, ctx) => {
		return res(
			ctx.json({
				msg: 'Thank you for your enquiry. We will be in contact with you shortly.',
			})
		);
	}),

	rest.post('http://localhost:5000/user/login', async (req, res, ctx) => {
		let { password, email } = await req.json();

		let userid = TESTUSERS[0].id;
		let username = TESTUSERS[0].name;
		let userrole = TESTUSERS[0].role;
		let accesstoken =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGNmM2FmYjM3ZWY5OTFkMDc1NTg3NyIsImlhdCI6MTY3NjYyMjk1MCwiZXhwIjoxNjc2NjIzODUwfQ.eW1ABFO-zjF0G1s5HsSisW6TJYap3DF1qaZ5Z32EXoI';

		// valid user - incorrect pw
		if (password === '1234567' && email === TESTUSERS[0].email) {
			return res(
				ctx.status(400),
				ctx.json({
					errors: 'Incorrect login. Please try again',
				})
			);
		}

		// no user found
		if (email !== TESTUSERS[0].email) {
			return res(
				ctx.status(400),
				ctx.json({
					errors: 'Incorrect login. Please try again',
				})
			);
		}

		// valid user all gd
		if (password === '123456789' && email === TESTUSERS[0].email) {
			return res(
				ctx.json({
					msg: {
						accesstoken,
						user: { id: userid, name: username, role: userrole },
					},
				})
			);
		}

		// return res(
		// 	ctx.json({
		// 		msg: {
		// 			accesstoken,
		// 			user: { id: userid, name: username, role: userrole },
		// 		},
		// 	})
		// );
	}),

	rest.get('http://localhost/user/infor', async (req, res, ctx) => {
		let username = TESTUSERS[0].name;
		let userrole = TESTUSERS[0].role;

		return res(
			ctx.status(200),
			ctx.json({
				user: { name: username, role: userrole },
			})
		);
	}),

	rest.post('http://localhost/user/forgot', async (req, res, ctx) => {
		let { email } = await req.json();

		if (email !== TESTUSERS[0].email) {
			// user does not exist
			return res(
				ctx.status(400),
				ctx.json({
					errors: 'Account does not exist',
				})
			);
		} else {
			// user exists
			return res(
				ctx.status(200),
				ctx.json({
					msg: 'Please check your email and reset your password using the link. You may need to check your spam/junk folder.',
				})
			);
		}
	}),

	rest.post('http://localhost/user/register', async (req, res, ctx) => {
		let { email } = await req.json();

		if (email !== TESTUSERS[0].email) {
			//valid user
			return res(
				ctx.status(200),
				ctx.json({
					msg: 'Please check your email and activate your account using the link',
				})
			);
		} else if (email === TESTUSERS[0].email) {
			// account exists
			return res(
				ctx.status(400),
				ctx.json({
					errors: 'Account already exists',
				})
			);
		}
	}),

	// private ClientCreate.js

	rest.post(
		'http://localhost:5000/api/customer/create',
		async (req, res, ctx) => {
			let { email } = await req.json();

			if (email === CUSTOMERS[0].email) {
				//valid user
				return res(
					ctx.status(200),
					ctx.json({
						msg: 'New customer added',
					})
				);
			} else if (email !== CUSTOMERS[0].email) {
				// account exists
				return res(
					ctx.status(400),
					ctx.json({
						errors: 'Account already exists',
					})
				);
			}
		}
	),

	//private ClientEdit.js
	rest.get('http://localhost:5000/api/customer', async (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				msg: CUSTOMERS,
			})
		);
	}),

	//private ClientEdit.js edit customer
	rest.put(
		'http://localhost:5000/api/customer/update/11',
		async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json({
					msg: 'Customer updated',
				})
			);
		}
	),

	//private ClientEdit.js delete cust
	rest.delete(
		'http://localhost:5000/api/customer/delete/11',
		async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json({
					msg: 'Customer deleted',
				})
			);
		}
	),

	//Private Project Create get employees
	rest.get('http://localhost:5000/user', async (req, res, ctx) => {
		let users = TESTUSERS;

		return res(
			ctx.status(200),
			ctx.json({
				msg: users,
			})
		);
	}),

	// PRIVATE - Project.js via Projectcreate.js
	rest.post(
		'http://localhost:5000/api/product/create',
		async (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json({
					msg: 'New project added',
				})
			);
		}
	),

	// private Project list , get list of all projects
	rest.get('http://localhost:5000/api/product', async (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				msg: products,
			})
		);
	}),

	// Public - App testing userefresh hook
	rest.get(
		'http://localhost:5000/user/refresh_token',
		async (req, res, ctx) => {
			let accesstoken = '987654321';

			return res(
				ctx.status(200),
				ctx.json({
					accesstoken,
				})
			);
		}
	),
];
