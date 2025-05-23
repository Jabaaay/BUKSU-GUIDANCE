const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Swal = require('sweetalert2');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const transporter = require('../config/emailConfig');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email: profile.emails[0].value });
    
    if (existingUser) {
      return done(null, existingUser);
    }

    // Create new user
    const newUser = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      role: 'student', // Set default role to student
      profilePicture: profile.photos[0]?.value
    });

    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const authController = {

  // Register new user
  register: async (req, res) => {
    try {
      const { 
        username, 
        password,
        firstName,
        lastName,
        email,
        birthday,
        age,
        college,
        course
      } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      
      // Create new user
      const user = new User({
        username,
        password,
        firstName,
        lastName,
        email,
        birthday: new Date(birthday),
        age: parseInt(age),
        college,
        course
      });
      
      await user.save();
      
      // Generate JWT token
      const token = user.generateAuthToken();
      
      res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          birthday: user.birthday,
          age: user.age,
          college: user.college,
          course: user.course
        }
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Single login endpoint for all user types
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      console.log('Login attempt received:', {
        username,
        passwordLength: password ? password.length : 'no password provided'
      });
      
      // Find user by username or email
      const user = await User.findOne({ 
        $or: [
          { username: username },
          { email: username }
        ]
      });
      
      if (!user) {
        console.log('Login failed: User not found for:', username);
        return res.status(401).json({ 
          message: 'Invalid credentials',
          error: 'User not found' 
        });
      }

      console.log('User found:', {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      });

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      console.log('Password validation result:', isValidPassword);
      
      if (!isValidPassword) {
        console.log('Login failed: Invalid password for user:', user.username);
        return res.status(401).json({ 
          message: 'Invalid credentials',
          error: 'Invalid password' 
        });
      }

      console.log('Login successful for user:', user.username);
      
      // Generate token
      const token = user.generateAuthToken();
      console.log('Generated token for user:', user.username);
      
      // Return appropriate response based on role
      if (user.role === 'admin') {
        console.log('Returning admin response');
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            role: user.role,
            email: user.email,
            position: user.position,
            department: user.department
          }
        });
      } else {
        console.log('Returning student response');
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            birthday: user.birthday,
            age: user.age,
            college: user.college,
            course: user.course
          }
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  // Admin login
  adminLogin: async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log('Admin login attempt:', { 
        username,
        passwordLength: password.length
      });
      
      // Find admin
      const admin = await Admin.findOne({ 
        $or: [
          { username: username },
          { email: username }
        ]
      });
      
      if (!admin) {
        console.log('Admin login failed: Admin not found');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      console.log('Admin found:', { 
        adminId: admin._id,
        username: admin.username,
        email: admin.email
      });
      
      // Verify password
      const isValidPassword = await admin.comparePassword(password);
      console.log('Password validation result:', isValidPassword);
      
      if (!isValidPassword) {
        console.log('Admin login failed: Invalid password');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      console.log('Admin login successful');
      
      // Generate token
      const token = admin.generateAuthToken();
      console.log('Generated token for admin:', { adminId: admin._id });
      
      res.json({
        token,
        user: {
          id: admin._id,
          username: admin.username,
          role: 'admin',
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          department: admin.department,
          position: admin.position
        }
      });
    } catch (error) {
      console.error('Admin login error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

// Update authController.js logout function
logout: async (req, res) => {
  try {
    // Clear the token from the request header
    req.header('Authorization', '');
    
    // Clear the JWT token from cookies
    res.clearCookie('token', { path: '/' });
    
    // Clear any other session-related cookies
    res.clearCookie('connect.sid', { path: '/' });
    
    // Return success response
    console.log('Logout successful');
    res.json({ 
      message: 'Successfully logged out',
      success: true 
    });
  } catch (error) {
    console.error('Logout error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Server error during logout', 
      error: error.message 
    });
  }
},

// Password reset controller
forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Validate email
      if (!email || !email.endsWith('@student.buksu.edu.ph')) {
        return res.status(400).json({
          message: 'Invalid BUKSU student email address'
        });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      // Generate new password (8 characters with numbers and special characters)
      const newPassword = Math.random().toString(36).slice(-8);

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password
      await User.updateOne(
        { email },
        { $set: { password: hashedPassword } },
        { runValidators: true }
      );

      // Send email with new password
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'BUKSU Guidance System - New Password',
        html: `
          <h2>New Password</h2>
          <p>Your password has been reset. Here is your new password:</p>
          <p style="font-size: 18px; font-weight: bold;">${newPassword}</p>
          <p>Please log in and change your password immediately.</p>
          <p>Thank you,</p>
          <p>BUKSU Guidance System Team</p>
        `
      };

      // Send email
      await transporter.sendMail(mailOptions);

      // Return success response
      res.json({
        message: 'A new password has been sent to your email address. Please check your inbox.'
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({
        message: 'An error occurred while resetting password'
      });
    }
  },

  googleCallback: async (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign({
        id: req.user._id,
        role: req.user.role
      }, process.env.JWT_SECRET, { expiresIn: '24h' });

      // Set token in cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      // Redirect to frontend dashboard
      res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173/dashboard');
    } catch (error) {
      console.error('Google callback error:', error);
      res.clearCookie('token');
      res.redirect(process.env.FRONTEND_URL || '/login?error=auth_failed');
    }
  }
};

module.exports = {
  register: authController.register,
  login: authController.login,
  adminLogin: authController.adminLogin,
  logout: authController.logout,
  googleCallback: authController.googleCallback,
  forgotPassword: authController.forgotPassword
};
