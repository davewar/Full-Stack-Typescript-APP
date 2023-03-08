const router = require('express').Router();
let Email = require('../models/emails');
const main = require('./sendEmails');

// @desc Get all emails
// @route GET /api/email
// @access Private

module.exports.getEmail_get = async (req, res) => {
	try {
		const emails = await Email.find();

		// if (!emails?.length) {
		// 	return res.status(400).json({ emails: 'No Emails found' });
		// }

		res.status(200).json({ msg: emails });
	} catch (err) {
		res.status(400).json({ errors: err.message });
	}
};

// @desc Create email
// @route POST /api/email
// @access Private

module.exports.addEmail_post = async (req, res) => {
	try {
		const name = req.body.name;
		let email = req.body.email;
		const comment = req.body.comment;

		if (!name || !email || !comment)
			return res
				.status(401)
				.json({ errors: 'All form fields are required. Please try again' });

		const newEmail = new Email({
			name,
			email,
			comment,
		});

		await newEmail.save();
		// test. need ssl for gmail

		let url = '';
		let desc = 'Confirmation of your enquiry';
		let text = `
		Thank you for contacting us!

		We typically respond within 48 hours if a reply is required.

		Regards
		DW-Serv
		
		`;

		//let me know email recd
		main(email, url, desc, text);

		res.status(200).json({
			msg: 'Thank you for your enquiry. We will be in contact with you shortly.',
		});
	} catch (err) {
		console.log('dwerr', err);
		return res.status(400).json({ errors: err.message });
	}
};

// @desc Delete email
// @route DELETE /api/email:id
// @access Private

module.exports.deleteEmail_delete = async (req, res) => {
	try {
		await Email.findByIdAndDelete(req.params.id);

		res.status(200).json('Item deleted');
	} catch (err) {
		return res.status(400).json({ errors: err.message });
	}
};
