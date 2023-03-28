import Customer from '../models/customer';
import 'dotenv/config';
import { Router, Request, Response } from 'express';

const router = Router();

//email string valid ?
const isEmail = (email: string): boolean => {
	return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
		email
	);
};

// @desc  get all users
// @route Get /customer
// @access Private

export const getAllUsers_get = async (req: Request, res: Response) => {
	try {
		const customers = await Customer.find();

		if (customers?.length === 0) {
			return res.status(400).json({ msg: 'No customers found' });
		}

		res.status(200).json({ msg: customers });
	} catch (err) {
		if (err instanceof Error) {
			return res.status(400).json({ errors: err.message });
		}
	}
};

// @desc Create customer
// @route POST /customer/signup
// @access Private

export const signup_post = async (req: Request, res: Response) => {
	try {
		let { name, businessName, email, telephone, address, createdBy } = req.body;

		//form validations
		if (!name || !email || !telephone || !address)
			return res
				.status(400)
				.json({ errors: 'Missing information. Please try again' });

		if (!isEmail(email))
			return res.status(400).json({
				errors: 'Email is not valid. Please re-enter a valid email address',
			});

		//check if user exists
		const user = await Customer.findOne({ email });

		if (user) return res.status(409).json({ errors: 'Account already exists' });

		// if (businessName == null) {
		// 	businessName = '';
		// }

		const newUser = new Customer({
			name,
			businessName,
			email,
			telephone,
			address,
			createdBy,
		});

		await newUser.save();

		res.status(200).send({
			msg: 'New customer added',
		});
	} catch (err) {
		if (err instanceof Error) {
			return res.status(400).json({ errors: err.message });
		}
	}
};

// @desc delete customer
// @route DELETE /customer/delete:id
// @access Private

export const deleteUser_delete = async (req: Request, res: Response) => {
	try {
		await Customer.findByIdAndDelete(req.params.id);
		res.status(202).json({ msg: 'Customer deleted' });
	} catch (err) {
		if (err instanceof Error) {
			return res.status(400).json({ errors: err.message });
		}
	}
};

// @desc  update user
// @route POST /customer/update
// @access Private

export const updateUser_put = async (req: Request, res: Response) => {
	if (!req?.params?.id)
		return res.status(400).json({ errors: 'ID parameter is required.' });

	let { name, businessName, email, telephone, address } = req.body;

	if (!name || !email || !telephone || !address) {
		return res.status(400).json({ errors: 'Missing required fields' });
	}

	let foundUser = await Customer.findOne({ _id: req.params.id });

	if (!foundUser) return res.status(400).json({ errors: 'No user found' });

	let update = {
		name,
		businessName,
		email,
		telephone,
		address,
	};

	try {
		await Customer.findByIdAndUpdate({ _id: req.params.id }, { $set: update });

		return res.json({
			msg: 'Customer updated',
		});
	} catch (err) {
		if (err instanceof Error) {
			console.log('customer update put error', err);
			return res.status(400).json({ errors: err.message });
		}
	}
};
