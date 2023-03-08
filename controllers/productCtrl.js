const router = require('express').Router();
let Product = require('../models/product');
let Customer = require('../models/customer');
require('dotenv').config();

// @desc  get all users
// @route Get /product
// @access Private

module.exports.getAllProjects_get = async (req, res) => {
	try {
		const products = await Product.find();

		if (!products?.length)
			return res.status(400).json({ msg: 'No projects found' });

		res.status(200).json({ msg: products });
	} catch (err) {
		res.status(400).json({ errors: err.message });
	}
};

// @desc Create product
// @route POST /product/signup
// @access Private

module.exports.newProject_post = async (req, res) => {
	try {
		const {
			customerID,
			title,
			type,
			description,
			comments,
			projectCompleted,
			price,
			paid,
			paidDate,
			createdBy,
			assignedTo,
			lastUpdatedBy,
		} = req.body;

		//form validations
		if (
			!customerID ||
			!title ||
			type.length === 0 ||
			!description ||
			!price ||
			!assignedTo ||
			!createdBy ||
			!comments
		)
			return res
				.status(400)
				.json({ errors: 'Missing information. Please try again' });

		//check if user exists
		const user = await Customer.findOne({ email: customerID });

		if (!user) return res.status(409).json({ errors: 'No Customer Exists' });

		const newProduct = new Product({
			customerID,
			title,
			type,
			price,
			description,
			comments,
			projectCompleted,
			assignedTo,
			createdBy,
			lastUpdatedBy,
		});

		await newProduct.save();

		res.status(200).send({
			msg: 'New project added',
		});
	} catch (err) {
		res.status(500).json({ errors: err.message });
	}
};

// @desc delete product
// @route DELETE /product/delete:id
// @access Private

module.exports.deleteProject_delete = async (req, res) => {
	try {
		await Product.findByIdAndDelete(req.params.id);
		res.status(202).json('Project deleted');
	} catch (err) {
		res.json({ errors: err.message });
	}
};

// @desc  update product
// @route POST /product/update
// @access Private

module.exports.updateProject_put = async (req, res) => {
	if (!req?.params?.id)
		return res.status(400).json({ errors: 'ID parameter is required.' });

	let {
		customerID,
		title,
		type,
		description,
		comments,
		projectCompleted,
		price,
		paid,
		payments,
		createdBy,
		assignedTo,
		lastUpdatedBy,
	} = req.body;

	if (
		!customerID ||
		!title ||
		!type ||
		!description ||
		!comments ||
		!payments ||
		!price ||
		!createdBy ||
		!assignedTo ||
		!lastUpdatedBy
	) {
		return res.status(400).json({ errors: 'Missing required fields' });
	}

	let foundUser = await Product.find({ _id: req.params.id });

	if (!foundUser) return res.status(400).json({ errors: 'No user found' });

	let update = {
		customerID,
		title,
		type,
		description,
		comments,
		projectCompleted,
		price,
		paid,
		payments,
		createdBy,
		assignedTo,
		lastUpdatedBy,
	};

	try {
		await Product.findByIdAndUpdate({ _id: req.params.id }, { $set: update });

		return res.json({
			msg: 'Project updated',
		});
	} catch (err) {
		console.log('project update put error', err);
		res.status(400).json({ errors: err.message });
	}
};

// @desc get single product
// @route GET /product/item
// @access Private
module.exports.getProject_get = async (req, res) => {
	try {
		const products = await Product.find({ _id: req.params.id });

		if (!products?.length)
			return res.status(400).json({ msg: 'No project found' });

		res.status(200).json({ msg: products });
	} catch (err) {
		res.status(400).json({ errors: err.message });
	}
};
