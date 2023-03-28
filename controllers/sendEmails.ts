import nodemailer from 'nodemailer';
import 'dotenv/config';

// https://myaccount.google.com/lesssecureapps
// https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/

export const main = (
	emailaddress: string,
	url: string,
	msg: string,
	text: string,
	html?: any
) => {
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_NAME as string,
			pass: process.env.GMAIL_PASS as string,
		},
	});

	let mailOptions = {
		from: '"DW-Serv" <DW-Serv.com>', // sender address
		to: emailaddress, // list of receivers
		subject: msg, // Subject line
		text: text ? text : '', // plain text body
		html: html ? `${url}` : '', // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function (err, data) {
		if (err) {
			console.log(err.message);
		}
	});
};
