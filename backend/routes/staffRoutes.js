const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Generate a random password
const generatePassword = () => {
  const length = 8;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Get all staff members
router.get('/', async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' });
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Error fetching staff' });
  }
});

// Delete a staff member
router.delete('/:id', async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Error deleting staff' });
  }
});

// Create staff account and send email
router.post('/add', async (req, res) => {
  try {
    const { name, email, position } = req.body;
    
    // Validate email domain
    if (!email.endsWith('@student.buksu.edu.ph')) {
      return res.status(400).json({ message: 'Only @student.buksu.edu.ph email addresses are allowed' });
    }

    // Check if staff already exists
    const existingStaff = await User.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: 'Staff already exists' });
    }

    // Generate password 
    const password = generatePassword();
    const staff = new User({
      username: email,
      email,
      role: 'staff',
      firstName: name,
      position,
      password
    });

    // Save staff and hash password
    await staff.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to BUKSU Guidance - Staff Account Created',
      html: `
        <p>Dear ${name},</p>
        <p>Your staff account has been created.</p>
        <p>Email: ${email}</p>
        <p>Password: ${password}</p>
        <p>Please keep your password secure and change it after your first login.</p>
        <p><a href="${process.env.FRONTEND_URL}/login">Click here to login</a></p>
        <p>Thank you,</p>
        <p>BUKSU Guidance Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      message: 'Staff added successfully and email sent',
      staff: {
        id: staff._id,
        username: staff.username,
        firstName: staff.firstName,
        position: staff.position,
        email: staff.email
      }
    });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error adding staff' });
  }
});

module.exports = router;
