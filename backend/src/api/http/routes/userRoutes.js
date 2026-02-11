const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');
const { authenticate } = require('../middlewares/authMiddleware');

// Guest needs to see hosts to fill the form
router.get('/hosts', authenticate, userController.listHosts);

module.exports = router;