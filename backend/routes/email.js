const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @route   POST api/email/send
// @desc    Send email
// @access  Private (Admin only)
router.post('/send', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin access only' });
    }

    const { to, subject, text } = req.body;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: 'Email sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
