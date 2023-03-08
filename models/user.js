const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		validated: {
			type: String,
			default: false,
		},
		IncorrectPW: {
			type: Number,
			default: 0,
		},
		role: {
			type: Number,
			default: 0,
		},
		active: {
			type: String,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('User', userSchema);
