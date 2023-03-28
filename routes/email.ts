import { verifyRoles } from '../middlewares/verifyRoles';
import ROLES_LIST from '../config/rolesList';
import { auth } from '../middlewares/auth';
import { Router } from 'express';
import {
	addEmail_post,
	getEmail_get,
	deleteEmail_delete,
} from '../controllers/emailCtrl';

const router = Router();

router.route('/').post(addEmail_post); // <<====(public) Contact us + we send a confirmation created email

// ***************** use the "Auth" middleware on the below api's ************
router.use(auth);

router
	.route('/')
	.get(
		verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
		getEmail_get
	); //get all emails

router
	.route('/:id')
	.delete(
		verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
		deleteEmail_delete
	); //delete emails

// module.exports = router;

export default router;
