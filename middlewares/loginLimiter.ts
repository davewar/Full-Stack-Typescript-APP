import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// stop brute force login
const loginLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 20, // Limit each IP to 5 login requests per `window` per minute  *** <<<<CHANGED FOR TESTING
	message: {
		message:
			'Too many login attempts. Please try again after a 60 second pause',
	},
	skipSuccessfulRequests: true, // if logged in -then dont count me
	handler: (req: Request, res: Response, next: NextFunction, options: any) => {
		res.status(options.statusCode).send(options.message);
	},
	// below are required by docs
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default loginLimiter;
