const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		customerID: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		type: {
			type: Array,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		comments: {
			type: Array,
			default: [],
			required: true,
		},
		projectCompleted: {
			type: Boolean,
			default: false,
		},

		price: {
			type: Number,
			required: true,
			default: 0,
		},
		paid: {
			type: Boolean,
			default: false,
		},
		payments: {
			type: Array,
			default: [],
		},

		createdBy: {
			type: String,
			trim: true,
			required: true,
		},
		assignedTo: {
			type: String,
			required: true,
			trim: true,
		},
		lastUpdatedBy: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
