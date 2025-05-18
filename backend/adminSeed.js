require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/buksu-guidance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const adminData = {
    username: 'admin',
    email: 'admin@buksu.edu.ph',
    password: 'admin123',
    department: 'Guidance',
    position: 'Administrator',
    role: 'admin'
};

console.log('Starting admin seed process...');
console.log('Admin data:', adminData);

// Hash the password
bcrypt.genSalt(10, (err, salt) => {
    if (err) {
        console.error('Error generating salt:', err);
        throw err;
    }
    
    console.log('Salt generated successfully');
    
    bcrypt.hash(adminData.password, salt, async (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            throw err;
        }
        
        // Create admin object with hashed password
        const admin = new Admin({
            ...adminData,
            password: hash
        });
        
        console.log('Password hashed successfully');
        console.log('Hashed password length:', hash.length);
        
        try {
            // Check if admin already exists
            console.log('Checking if admin exists...');
            const existingAdmin = await Admin.findOne({ email: adminData.email });
            
            if (existingAdmin) {
                console.log('Admin user already exists in the database');
                console.log('Existing admin:', {
                    id: existingAdmin._id,
                    username: existingAdmin.username,
                    email: existingAdmin.email,
                    role: existingAdmin.role
                });
                process.exit(0);
            }
            
            // Save admin user
            console.log('Creating new admin user...');
            await admin.save();
            console.log('Admin user created successfully!');
            console.log('Admin details:', {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                department: admin.department,
                position: admin.position
            });
            
            console.log('Admin seed process completed successfully');
            process.exit(0);
        } catch (error) {
            console.error('Error creating admin user:', error);
            process.exit(1);
        }
    });
});
