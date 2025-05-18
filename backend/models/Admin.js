const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required']
    },
    position: {
        type: String,
        required: [true, 'Position is required']
    },
    role: {
        type: String,
        default: 'admin',
        enum: ['admin', 'staff']
    }
}, {
    timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Password hashed in pre-save:', {
            passwordLength: this.password.length,
            userId: this._id
        });
        next();
    } catch (error) {
        console.error('Error in password pre-save:', error);
        next(error);
    }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
    console.log('Comparing password:', {
        candidatePasswordLength: candidatePassword.length,
        storedPasswordLength: this.password.length
    });
    
    try {
        const isValid = await bcrypt.compare(candidatePassword, this.password);
        console.log('Password comparison result:', isValid);
        return isValid;
    } catch (error) {
        console.error('Error comparing password:', error);
        return false;
    }
};

// Method to generate JWT token
adminSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { 
            userId: this._id, 
            role: this.role,
            username: this.username,
            email: this.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

module.exports = mongoose.model('Admin', adminSchema);
