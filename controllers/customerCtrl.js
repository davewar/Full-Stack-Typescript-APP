const router = require('express').Router();
let Customer = require('../models/customer');
require('dotenv').config();

//email string valid ?
const isEmail = (email) => {
	return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
		email
	);
};

// @desc  get all users
// @route Get /customer
// @access Private

module.exports.getAllUsers_get = async (req, res) => {
	try {
		const customers = await Customer.find();

		if (customers?.length === 0) {
			return res.status(400).json({ msg: 'No customers found' });
		}

		res.status(200).json({ msg: customers });
	} catch (err) {
		res.status(400).json({ errors: err.message });
	}
};

// @desc Create customer
// @route POST /customer/signup
// @access Private

module.exports.signup_post = async (req, res) => {
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
		res.status(500).json({ errors: err.message });
	}
};

// @desc delete customer
// @route DELETE /customer/delete:id
// @access Private

module.exports.deleteUser_delete = async (req, res) => {
	try {
		await Customer.findByIdAndDelete(req.params.id);
		res.status(202).json({ msg: 'Customer deleted' });
	} catch (err) {
		res.json({ errors: err.message });
	}
};

// @desc  update user
// @route POST /customer/update
// @access Private

module.exports.updateUser_put = async (req, res) => {
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
		console.log('customer update put error', err);
		res.status(400).json({ errors: err.message });
	}
};
