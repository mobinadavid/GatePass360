const express = require('express');
const router = express.Router();
const authController = require('../controllers/authentication/authController');
const profileController = require('../controllers/user/userController');

// middlewares
const { validateRegister } = require('../middlewares/validator');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/register', validateRegister, authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, profileController.me);

module.exports = router;