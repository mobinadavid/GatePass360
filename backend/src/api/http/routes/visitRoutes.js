const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visit/visitController');
const { authenticate } = require('../middlewares/authMiddleware');
const { can } = require('../middlewares/can');
const visitFilter = require('../middlewares/visitFilter');

router.use(authenticate); // All visit routes require login

router.post('/', can('visits.create'), visitController.store);
router.get('/', can('visits.view_all'), visitFilter, visitController.index);
router.get('/me', can('visits.view_own'),  visitFilter,visitController.myVisits);
router.get('/host', can('visits.view_host'), visitFilter, visitController.hostVisits);
router.get('/stats', can('visits.view_stats'), visitController.getStats);
router.get('/:id', can('visits.view_details'), visitController.show);
router.patch('/:id/approve', can('visits.approve'), visitController.approve);
router.patch('/:id/reject', can('visits.reject'), visitController.reject);
router.get('/pending-visits', can('visits.view_approved'), visitFilter, visitController.listPendingSecurity);

module.exports = router;
