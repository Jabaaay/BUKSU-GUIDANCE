const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

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

  // Student login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log('Student login attempt:', { 
        username,
        passwordLength: password.length
      });
      
      // Find user
      const user = await User.findOne({ 
        $or: [
          { username: username },
          { email: username }
        ]
      });
      
      if (!user) {
        console.log('Student login failed: User not found');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      console.log('Student found:', { 
        userId: user._id,
        username: user.username,
        email: user.email
      });
      
      // Verify password
      const isValidPassword = await user.comparePassword(password);
      console.log('Password validation result:', isValidPassword);
      
      if (!isValidPassword) {
        console.log('Student login failed: Invalid password');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      console.log('Student login successful');
      
      // Generate token
      const token = user.generateAuthToken();
      console.log('Generated token for student:', { userId: user._id });
      
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
    } catch (error) {
      console.error('Student login error:', error);
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

  // Logout user
  logout: async (req, res) => {
    try {
      // Clear the token from the request header
      req.header('Authorization', '');
      
      // Return success response
      res.json({ message: 'Successfully logged out' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

};

module.exports = authController;
