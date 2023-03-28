import { auth } from '../middlewares/auth';
import { verifyRoles } from '../middlewares/verifyRoles';
import ROLES_LIST from '../config/rolesList';

import { Router } from 'express';
const router = Router();

import {
	login_post,
	logout_get,
	activate_post,
	forgot_post,
	reset_post,
	refreshToken_get,
	getUser_get,
	getAllUsers_get,
	signup_post,
	deleteUser_delete,
	updateUser_put,
} from '../controllers/userCtrl';

// Extra security. stop brute force logining but I have incorrect pw attemps count on login anyway.

import loginLimiter from '../middlewares/loginLimiter';

// **********************************
router.route('/login').post(loginLimiter, login_post); //login

router.route('/logout').get(logout_get); // logout

router.route('/activation').post(activate_post);
router.route('/forgot').post(forgot_post);
router.route('/reset').post(reset_post);

// is there a cookie with an accesstoken,if yes send bk a new accesstoken
// first used when App compo is loaded
router.route('/refresh_token').get(refreshToken_get);

// ************************************************
// use Auth on all below routes
router.use(auth);
// ************************************************

// auth =verify header has Authorization with accesstoken and then fwd an "user" obj
// usercontext compo- runs when accesstoken changed
router.route('/infor').get(getUser_get);

//get all users
router
	.route('/')
	.get(
		verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
		getAllUsers_get
	);
//create user
router
	// router.route('/signup').post(userCtrl.signup_post); //signup
	.route('/register')
	.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), signup_post);

// delete user
router
	.route('/delete/:id')
	.delete(verifyRoles(ROLES_LIST.Admin), deleteUser_delete);

// update user - : active status, role, validated (ie email address is valid)
router
	.route('/update/:id')
	.put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateUser_put);

export default router;
