const router = require('express').Router();
const productCtrl = require('../controllers/productCtrl');
const auth = require('../middlewares/auth');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/rolesList');

// use Auth on all below routes
router.use(auth);

//get all projects
router
	.route('/')
	.get(
		verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
		productCtrl.getAllProjects_get
	);

//get a project
router
	.route('/item/:id')
	.get(
		verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
		productCtrl.getProject_get
	);

//create project
router
	.route('/create')
	.post(
		verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
		productCtrl.newProject_post
	);

// delete project
router
	.route('/delete/:id')
	.delete(
		verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
		productCtrl.deleteProject_delete
	);

// update project
router
	.route('/update/:id')
	.put(
		verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
		productCtrl.updateProject_put
	);

module.exports = router;
