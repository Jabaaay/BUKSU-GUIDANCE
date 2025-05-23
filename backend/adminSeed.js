require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const adminData = {
    username: 'admin',
    email: 'admin@buksu.edu.ph',
    password: 'admin123',
    position: 'Administrator',
    role: 'admin'
};

async function seedAdmin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://guidance:admin@guidance.1c293.mongodb.net/guidance?retryWrites=true&w=majority&appName=Guidance', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        console.log('Starting admin seed process...');
        console.log('Admin data:', adminData);

        // Check if admin already exists
        const existingAdmin = await User.findOne({ 
            $or: [
                { username: adminData.username },
                { email: adminData.email }
            ]
        });

        if (existingAdmin) {
            console.log('Admin already exists. Skipping seed.');
            return;
        }

        // Create admin user
        const admin = new User(adminData);
        await admin.save();
        console.log('Admin user created successfully');
        
        process.exit(0);
    } catch (error) {
        console.error('Error during admin seeding:', error);
        process.exit(1);
    }
}

seedAdmin();
