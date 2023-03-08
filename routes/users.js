const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middlewares/auth');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/rolesList');

// Extra security. stop brute force logining but I have incorrect pw attemps count on login anyway.
const loginLimiter = require('../middlewares/loginLimiter');

// **********************************
router.route('/login').post(loginLimiter, userCtrl.login_post); //login

router.route('/logout').get(userCtrl.logout_get); // logout

router.route('/activation').post(userCtrl.activate_post);
router.route('/forgot').post(userCtrl.forgot_post);
router.route('/reset').post(userCtrl.reset_post);

// is there a cookie with an accesstoken,if yes send bk a new accesstoken
// first used when App compo is loaded
router.route('/refresh_token').get(userCtrl.refreshToken_get);

// ************************************************
// use Auth on all below routes
router.use(auth);
// ************************************************

// auth =verify header has Authorization with accesstoken and then fwd an "user" obj
// usercontext compo- runs when accesstoken changed
router.route('/infor').get(userCtrl.getUser_get);

//get all users
router
	.route('/')
	.get(
		verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
		userCtrl.getAllUsers_get
	);
//create user
router
	// router.route('/signup').post(userCtrl.signup_post); //signup
	.route('/register')
	.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), userCtrl.signup_post);

// delete user
router
	.route('/delete/:id')
	.delete(verifyRoles(ROLES_LIST.Admin), userCtrl.deleteUser_delete);

// update user - : active status, role, validated (ie email address is valid)
router
	.route('/update/:id')
	.put(
		verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
		userCtrl.updateUser_put
	);

module.exports = router;
