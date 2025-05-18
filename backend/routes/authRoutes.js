const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Registration route
router.post('/register', authController.register);

// Login routes
router.post('/login', authController.login); // For students
router.post('/admin/login', authController.adminLogin); // For admins

// Logout route
router.post('/logout', auth, authController.logout);

module.exports = router;
