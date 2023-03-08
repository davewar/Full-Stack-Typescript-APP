const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter name'],
		},
		email: {
			type: String,
			required: [true, 'Please supply email'],
		},
		comment: {
			type: String,
			required: [true, 'Please supply brief description'],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Email', emailSchema);
