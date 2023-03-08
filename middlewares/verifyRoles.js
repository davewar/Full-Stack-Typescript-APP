const User = require('../models/user');

const verifyRoles = (...allowedRoles) => {
	return async (req, res, next) => {
		if (!req.user.id)
			return res.status(401).json({ errors: 'Access denied 1' });

		try {
			let id = req.user.id;

			const user = await User.findById(id);

			if (user.active === false || user.validated === false)
				return res.status(401).json({ errors: 'Access denied 1b' });

			const rolesArray = [...allowedRoles];

			const result = rolesArray.includes(user.role);

			if (result === false)
				return res.status(403).json({ errors: 'Access denied 2' });

			next();
		} catch (err) {
			console.log('Verify DW:', err.message);
			res.status(500).json({ errors: err.message });
		}
	};
};

module.exports = verifyRoles;
