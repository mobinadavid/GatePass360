const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visit/visitController');
const { authenticate } = require('../middlewares/authMiddleware');
const { can } = require('../middlewares/can');

router.use(authenticate); // All visit routes require login

router.post('/', can('visits.create'), visitController.store);
router.get('/me', can('visits.view_own'), visitController.myVisits);
router.get('/host', can('visits.view_host'), visitController.hostVisits);
router.patch('/:id/approve', can('visits.approve'), visitController.approve);
router.patch('/:id/reject', can('visits.reject'), visitController.reject);

module.exports = router;