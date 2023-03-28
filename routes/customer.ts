// const router = require('express').Router();
// const customerCtrl = require('../controllers/customerCtrl');
const auth = require('../middlewares/auth');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/rolesList');

import { Router } from 'express';
const router = Router();
import {
	getAllUsers_get,
	signup_post,
	deleteUser_delete,
	updateUser_put,
} from '../controllers/customerCtrl';

// use Auth on all below routes
router.use(auth);

//get all customers
router
	.route('/')
	.get(
		verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
		getAllUsers_get
	);

//create customer
router
	.route('/create')
	.post(
		verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
		signup_post
	);

// delete customer
router
	.route('/delete/:id')
	.delete(verifyRoles(ROLES_LIST.Admin), deleteUser_delete);

// update customer -
router
	.route('/update/:id')
	.put(
		verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
		updateUser_put
	);

module.exports = router;
