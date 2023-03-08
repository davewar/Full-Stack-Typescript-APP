const router = require('express').Router();
let User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const main = require('./sendEmails');

require('dotenv').config();

// 900s
//create token - 15 mins
const createToken = (id) => {
	return jwt.sign({ id }, process.env.SECRET_KEY, {
		expiresIn: '900s',
	});
};

//1d
const createRefeshToken = (id) => {
	return jwt.sign({ id }, process.env.REFESH_SECRET_KEY, {
		expiresIn: '1d',
	});
};

//email string valid ?
const isEmail = (email) => {
	return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
		email
	);
};

// @desc login
// @route POST /user/login
// @access Private

// returns access token and sends cookie named refresh
module.exports.login_post = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password)
			return res
				.status(401)
				.json({ errors: 'Incorrect login. Please try again' });
		if (password.length < 6)
			return res
				.status(401)
				.json({ errors: 'Password is at least 6 characters long.' });
		if (!isEmail(email))
			return res.status(401).json({
				errors: 'Email is not valid. Please re-enter your email address',
			});

		//is there a user
		const user = await User.findOne({ email });

		// no user found
		if (!user)
			return res
				.status(400)
				.json({ errors: 'Incorrect login. Please try again' });

		// user has inactive status
		if (!user.active)
			return res
				.status(400)
				.json({ errors: 'Incorrect login. Please try again' });

		const isMatch = await bcrypt.compare(password, user.password);

		let count = user.IncorrectPW;

		if (!isMatch) {
			if (count > 10) {
				//LOCK ACCOUNT
				await User.findOneAndUpdate(
					{ _id: user._id },
					{
						validated: false,
					}
				);
				return res.status(400).json({
					errors:
						'Incorrect login - The Account has been Locked. Please reset your password',
				});
			} else {
				await User.findOneAndUpdate(
					{ _id: user._id },
					{
						IncorrectPW: count + 1,
					}
				);
				return res
					.status(400)
					.json({ errors: 'Incorrect login. Please try again' });
			}
		}

		//password okay -reset user.IncorrectPW to zero
		if (count > 0) {
			await User.findOneAndUpdate(
				{ _id: user._id },
				{
					IncorrectPW: 0,
				}
			);
		}

		const val = user.validated;

		//email address needs to be valid before first use
		if (val == 'false') {
			const accesstoken = createToken(user._id);
			const url = `${process.env.CLIENT_URL}/user/activate/${accesstoken}`;
			// main(email, url, 'DWSHOP - Please activate your account');

			return res.status(400).json({
				errors:
					'An email has just been sent to you, please activate your account using the link sent.',
			});
		}

		//create tokens
		const accesstoken = createToken(user._id);
		const refreshToken = createRefeshToken(user._id);

		//all gd
		// maxAge: 1 * 24 * 60 * 60 * 1000, // 1d
		res.cookie('refreshtoken', refreshToken, {
			httpOnly: true,
			// secure: true, //https
			// sameSite: 'None', //cross-site cookie
			path: '/user/refresh_token',
			maxAge: 1 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({
			msg: {
				accesstoken,
				user: { id: user._id, name: user.name, role: user.role },
			},
		});

		// res.status(200).json({
		// 	accesstoken,
		// 	user: { id: user._id, name: user.name, role: user.role },
		// });
	} catch (err) {
		res.status(400).json({ errors: err.message });
	}
};

// @desc Create user
// @route POST /user/signup
// @access Public

module.exports.signup_post = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		//form validations
		if (!name || !email || !password)
			return res
				.status(400)
				.json({ errors: 'Missing Information. Please try again' });
		if (password.length < 6)
			return res
				.status(400)
				.json({ errors: 'Password is at least 6 characters long.' });
		if (!isEmail(email))
			return res.status(400).json({
				errors: 'Email is not valid. Please re-enter your email address',
			});

		//check if user exists
		const user = await User.findOne({ email });

		if (user) return res.status(409).json({ errors: 'Account already exists' });

		//hashpassword
		const hashpassword = await bcrypt.hash(password, 10);

		const newUser = new User({ name, email, password: hashpassword });

		await newUser.save();
		//create tokens
		const accesstoken = createToken(newUser._id);

		const x = `${process.env.CLIENT_URL}/user/activate/${accesstoken}`;

		let desc =
			'DW-Serv. Please activate your account - link valid for 10 minutes';

		let url = '';
		let text = `
		Please use the below link to activate your password.

		The link is only valid for 10 minutes.

		${x}

		Regards
		DW-Serv
		
		`;

		//send email
		main(email, url, desc, text);

		res.status(200).send({
			msg: 'Please check your email and activate your account using the link',
		});
	} catch (err) {
		res.status(500).json({ errors: err.message });
	}
};

// @desc logout user
// @route GET /user/logout
// @access Public

// res.clearCookie('refreshtoken', { path: '/api/user/refresh_token' });
module.exports.logout_get = async (req, res) => {
	try {
		res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
		return res.status(202).json({ msg: 'logged out' });
	} catch (err) {
		res.status(400).json({ errors: err.message });
	}
};

// @desc delete user
// @route DELETE /user/delete:id
// @access Public

module.exports.deleteUser_delete = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		res.status(202).json({ msg: 'user deleted' });
	} catch (err) {
		res.json({ errors: err.message });
	}
};

// @desc does user have a cookie named refresh & valid ? if yes give them a new access token
// @route GET /user/refresh_token
// @access Private

// When APP Component first loads this function is run
module.exports.refreshToken_get = async (req, res) => {
	try {
		const refresh_token = req.cookies.refreshtoken;

		if (!refresh_token)
			return res.status(403).json({ msg: 'Please Login or Register -a' });

		jwt.verify(refresh_token, process.env.REFESH_SECRET_KEY, (err, decoded) => {
			if (err)
				return res.status(403).json({ msg: 'Please Login or Register -b' });

			const accesstoken = createToken(decoded.id);

			res.status(200).json({ accesstoken });
		});
	} catch (err) {
		res.status(400).json({ msg: err.message });
	}
};

// @desc get user
// @route GET /user/infor
// @access Private

// context>user component - send access token in authization header. returns user name + role.
// This function will run again from this compo if access token changes
module.exports.getUser_get = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');

		if (!user) return res.status(400).json({ msg: 'User does not exist.' });

		res.status(200).json({
			user: { name: user.name, role: user.role },
		});
	} catch (err) {
		res.status(400).json({ msg: err.message });
	}
};

// @desc user supply email if they forgot pw. if user found > email sent  with access token in href link
// @route POST /user/forgot
// @access Public

module.exports.forgot_post = async (req, res) => {
	try {
		let { email } = req.body;

		if (!email)
			return res
				.status(400)
				.json({ errors: 'Incorrect login. Please try again' });

		if (!isEmail(email))
			return res.status(400).json({
				errors: 'Email is not valid. Please re-enter your email address',
			});

		const user = await User.findOne({ email });

		if (!user)
			return res.status(400).json({ errors: 'Account does not exist' });

		//create tokens
		const accesstoken = createToken(user._id);

		const x = `${process.env.CLIENT_URL}/reset_password/${accesstoken}`;

		let desc =
			"DW-Serv. Please reset your password - link valid for 10 minutes'";

		let url = '';
		let text = `
		Please use the below link to reset your password.

		The link is only valid for 10 minutes.

		${x}

		Regards
		DW-Serv
		
		`;

		main(email, url, desc, text);

		//all gd

		res.status(200).send({
			msg: 'Please check your email and reset your password using the link. You may need to check your spam/junk folder.',
		});
	} catch (err) {
		console.log('Forgot PW. DW', err.message);
		res.status(500).json({ errors: err.message });
	}
};

// @desc new user activate account via email sent to them.
// @route POST /user/activation
// @access Public
module.exports.activate_post = async (req, res) => {
	try {
		const { accesstoken } = req.body;

		if (!accesstoken)
			return res.status(400).json({
				errors:
					'Invalid Authentication. Please request a new link via the SignIn button',
			});

		jwt.verify(accesstoken, process.env.SECRET_KEY, (err, decoded) => {
			if (err) {
				return res.status(400).json({
					errors:
						'Invalid Authentication. Please request a new link via the SignIn button',
				});
			}

			req.user = decoded.id;
		});

		const user = await User.findById(req.user);

		if (!user)
			return res
				.status(400)
				.json({ errors: 'No Account exists. Please register' });

		await User.findOneAndUpdate(
			{ _id: req.user },
			{
				validated: true,
			}
		);

		return res.json({ msg: 'Account activated. Please log in.' });
	} catch (err) {
		console.log('Activate DW', err.message);
		res.status(500).json({ errors: err.message });
	}
};

// @desc  reset password
// @route POST /user/reset
// @access Public

module.exports.reset_post = async (req, res) => {
	try {
		const { password, email, accesstoken } = req.body;

		//form validations

		if (!accesstoken || !email || !password)
			return res
				.status(400)
				.json({ errors: 'Incorrect login. Please try again' });
		if (password.length < 6)
			return res
				.status(400)
				.json({ errors: 'Password is at least 6 characters long.' });
		if (!isEmail(email))
			return res.status(400).json({
				errors: 'Email is not valid. Please re-enter your email address',
			});

		//check the email address entered correectly
		const account = await User.findOne({ email });
		if (!account)
			return res.status(400).json({
				errors:
					'Invalid Authentication. Please check you entered your email address correctly and try again',
			});

		jwt.verify(accesstoken, process.env.SECRET_KEY, (err, decoded) => {
			if (err) {
				return res.status(400).json({
					errors:
						'Invalid Authentication. Please request a new link via the SignIn button',
				});
			}

			req.user = decoded.id;
		});

		const user = await User.findById(req.user);

		if (!user)
			return res.status(400).json({
				errors:
					'Invalid Authentication. Please request a new link via the SignIn button',
			});

		const hashpassword = await bcrypt.hash(password, 10);

		await User.findOneAndUpdate(
			{ _id: req.user },
			{
				password: hashpassword,
				IncorrectPW: 0,
				validated: true,
			}
		);

		res.json({
			msg: 'Password successfully changed! Please log in to use your account',
		});
	} catch (err) {
		res.status(400).json({ errors: err.message });
	}
};

// @desc  update user active status + role, only Admin.
// @route POST /user/update
// @access Private

module.exports.updateUser_put = async (req, res) => {
	if (!req?.params?.id)
		return res.status(400).json({ errors: 'ID parameter is required.' });

	let { role, active, validated } = req.body;

	if (!active || !validated) {
		return res.status(400).json({ errors: 'Missing required fields' });
	}

	let foundUser = await User.findOne({ _id: req.params.id });

	if (!foundUser) return res.status(400).json({ errors: 'No user found' });

	let update = {
		active: active,
		validated: validated,
		role: role,
	};

	try {
		await User.findByIdAndUpdate({ _id: req.params.id }, { $set: update });

		return res.json({
			msg: 'User updated',
		});
	} catch (err) {
		console.log('update put error', err);
		res.status(400).json({ errors: err.message });
	}
};

// @desc  get all users
// @route Get /user
// @access Private

module.exports.getAllUsers_get = async (req, res) => {
	try {
		const users = await User.find().select('-password');

		if (!users?.length) return res.status(400).json({ msg: 'No users found' });

		res.status(200).json({ msg: users });
	} catch (err) {
		res.status(400).json({ errors: err.message });
	}
};
