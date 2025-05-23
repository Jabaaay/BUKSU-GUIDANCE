const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const passport = require('passport');


// Registration route
router.post('/register', authController.register);

// Login routes
router.post('/login', authController.login); // For all users
router.post('/admin/login', authController.adminLogin); // For admins

// Password reset route
router.post('/forgot-password', authController.forgotPassword);

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/api/auth/login',
    session: false
  }),
  authController.googleCallback
);

// Logout route
router.post('/logout', auth, authController.logout);

module.exports = router;
