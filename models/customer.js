const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		businessName: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			required: true,
		},

		telephone: {
			type: String,
			required: true,
		},
		address: {
			type: Object,
			required: true,
		},
		createdBy: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Customer', customerSchema);
