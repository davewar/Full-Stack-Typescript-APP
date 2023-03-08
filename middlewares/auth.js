const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
	const tokenHeader = req.header('Authorization');

	// -401 Unauthorized
	if (!tokenHeader?.startsWith(`Bearer `))
		return res.status(401).json({
			errors: 'Invalid Authentication - Please log in.  from auth.js',
		});

	const token = tokenHeader.split(' ')[1];

	// -403 Forbidden
	try {
		jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
			if (err) {
				return res
					.status(403)
					.json({ errors: 'Forbidden - Please log in.  from auth.js' });
			}

			req.user = decoded;

			next();
		});
	} catch (err) {
		console.log('Auth DW:', err.message);
		res.status(500).json({ errors: err.message });
	}
};

module.exports = auth;
