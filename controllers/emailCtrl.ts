let Email = require('../models/emails');
// const main = require('./sendEmails');
import { main } from './sendEmails';

import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// @desc Get all emails
// @route GET /api/email
// @access Private

export const getEmail_get = async (req: Request, res: Response) => {
	try {
		const emails = await Email.find();

		res.status(200).json({ msg: emails });
	} catch (err) {
		if (err instanceof Error) {
			return res.status(400).json({ errors: err.message });
		}
	}
};

// @desc Create email
// @route POST /api/email
// @access Private

export const addEmail_post = async (req: Request, res: Response) => {
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
		if (err instanceof Error) {
			return res.status(400).json({ errors: err.message });
		}
	}
};

// @desc Delete email
// @route DELETE /api/email:id
// @access Private

export const deleteEmail_delete = async (req: Request, res: Response) => {
	try {
		await Email.findByIdAndDelete(req.params.id);

		res.status(200).json('Item deleted');
	} catch (err) {
		if (err instanceof Error) {
			return res.status(400).json({ errors: err.message });
		}
	}
};
