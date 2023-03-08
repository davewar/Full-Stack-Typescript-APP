const router = require('express').Router();
const emailCtrl = require('../controllers/emailCtrl');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/rolesList');
const auth = require('../middlewares/auth');

router.route('/').post(emailCtrl.addEmail_post); // <<====(public) Contact us + we send a confirmation created email

// ***************** use the "Auth" middleware on the below api's ************
router.use(auth);

router
	.route('/')
	.get(
		verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
		emailCtrl.getEmail_get
	); //get all emails

router
	.route('/:id')
	.delete(
		verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
		emailCtrl.deleteEmail_delete
	); //delete emails

module.exports = router;
