import User from '../models/user';
import { Request, Response, NextFunction } from 'express';

export const verifyRoles = (...allowedRoles: any) => {
	return async (req: Request | any, res: Response, next: NextFunction) => {
		if (!req.user.id)
			return res.status(401).json({ errors: 'Access denied 1' });

		try {
			let id = req.user.id;

			const user = await User.findById(id);

			// console.log('user verifyroles', user);

			if (user?.active === false || user?.validated === false)
				return res.status(401).json({ errors: 'Access denied 1b' });

			// console.log(req.user, 'verifyrole here');

			const rolesArray = [...allowedRoles];

			const result = rolesArray.includes(user?.role);

			if (result === false)
				return res.status(403).json({ errors: 'Access denied 2' });

			next();
		} catch (err) {
			if (err instanceof Error) {
				console.log('VerifyRoles DW:', err.message);
				res.status(500).json({ errors: err.message });
			}
		}
	};
};
