require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/buksu-guidance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const userData = [
    {
        username: 'admin',
        email: 'admin@buksu.edu.ph',
        password: 'admin123',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        college: 'CAS',
        course: 'BS Psychology',
        birthday: new Date('1990-01-01'),
        age: 35
    },
    {
        username: 'student1',
        email: 'student1@buksu.edu.ph',
        password: 'student123',
        role: 'student',
        firstName: 'John',
        lastName: 'Doe',
        college: 'CAS',
        course: 'BS Psychology',
        birthday: new Date('2000-01-01'),
        age: 23
    }
];

console.log('Starting user seed process...');

// Hash passwords and create users
userData.forEach(async (user, index) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: user.email });
        
        if (existingUser) {
            console.log(`User ${user.username} already exists in the database`);
            console.log('Existing user:', {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role
            });
            return;
        }

        // Create new user
        const newUser = new User(user);
        await newUser.save();
        
        console.log(`User ${user.username} created successfully!`);
        console.log('User details:', {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            firstName: newUser.firstName,
            lastName: newUser.lastName
        });
        
    } catch (error) {
        console.error(`Error creating user ${user.username}:`, error);
    }

    // Exit if this is the last user
    if (index === userData.length - 1) {
        console.log('User seed process completed successfully');
        process.exit(0);
    }
});
