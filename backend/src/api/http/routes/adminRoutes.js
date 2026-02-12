const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const { authenticate } = require('../middlewares/authMiddleware');
const { can } = require('../middlewares/can');

router.use(authenticate);

router.get('/users', can('users.list'), adminController.listUsers);
router.patch('/users/:id/role', can('users.update_role'), adminController.updateRole);
router.get('/roles', can('roles.list'), adminController.listRoles);

router.get('/reports', can('user-reports.view'), adminController.reports);

module.exports = router;