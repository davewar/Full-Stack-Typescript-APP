// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
require('dotenv').config();
import { NextFunction, Request, Response } from 'express';

const auth = (req: Request | any, res: Response, next: NextFunction) => {
	const tokenHeader: string | undefined = req.header('Authorization');

	// -401 Unauthorized
	if (!tokenHeader?.startsWith(`Bearer `))
		return res.status(401).json({
			errors: 'Invalid Authentication - Please log in.  from auth.js',
		});

	const token: string = tokenHeader.split(' ')[1];

	// -403 Forbidden
	try {
		jwt.verify(token, process.env.SECRET_KEY as string, (err, decoded) => {
			if (err) {
				return res
					.status(403)
					.json({ errors: 'Forbidden - Please log in.  from auth.js' });
			}

			req.user = decoded;

			next();
		});
	} catch (err) {
		if (err instanceof Error) {
			console.log('Auth DW:', err.message);
			res.status(500).json({ errors: err.message });
		}
	}
};

module.exports = auth;
