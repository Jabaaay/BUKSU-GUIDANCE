const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'student'],
    default: 'student'
  },
  firstName: {
    type: String,
    required: function() { return this.role === 'student'; },
    trim: true
  },
  lastName: {
    type: String,
    required: function() { return this.role === 'student'; },
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    validate: {
      validator: function(email) {
        if (this.role === 'student') {
          return email.endsWith('@student.buksu.edu.ph');
        } else {
          return email.endsWith('@student.buksu.edu.ph');
        }
      },
      message: 'Only @student.buksu.edu.ph or @student.buksu.edu.ph email addresses are allowed'
    }
  },
  birthday: {
    type: Date,
    required: function() { return this.role === 'student'; }
  },
  age: {
    type: Number,
    required: function() { return this.role === 'student'; },
    min: [18, 'Minimum age is 18']
  },
  college: {
    type: String,
    required: function() { return this.role === 'student'; },
    enum: ['COT', 'CAS', 'CPAG', 'CON', 'COE', 'COB', 'COL']
  },
  course: {
    type: String,
    required: function() { return this.role === 'student'; },
    trim: true
  },
  position: {
    type: String,
    required: function() { 
      return this.role === 'staff' || this.role === 'admin';
    },
    trim: true
  },
  googleId: {
    type: String
    
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = mongoose.model('User', userSchema);
