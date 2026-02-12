const express = require('express');
const router = express.Router();
const passController = require('../controllers/pass/passController');
const { authenticate } = require('../middlewares/authMiddleware');
const { can } = require('../middlewares/can');
const passFilter = require('../middlewares/passFilter');

router.use(authenticate);
router.post('/', can('passes.issue'), passController.issue);

router.post('/check-in', can('passes.record_traffic'), passController.checkIn);

router.post('/check-out', can('passes.record_traffic'), passController.checkOut);

router.get('/reports/present', can('passes.view_reports'), passController.present);

router.get('/', can('passes.view_all'), passFilter, passController.index);

router.get('/stats', can('reports.view'), passController.getDashboardStats);

module.exports = router;