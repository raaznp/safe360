const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../../models/User');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const admin = await User.findOne({ username: 'admin' });
        
        if (admin) {
            console.log('Admin user found. Updating password...');
            admin.password = 'password123'; // Triggers pre-save hook
            await admin.save();
            console.log('Admin password reset to: password123');
        } else {
            console.log('Admin user not found. Creating new one...');
            const newAdmin = new User({
                username: 'admin',
                email: 'admin@safe360.com',
                password: 'password123',
                role: 'admin'
            });
            await newAdmin.save();
            console.log('Admin user created with password: password123');
        }

        process.exit();
    } catch (error) {
        console.error('Error resetting password:', error);
        process.exit(1);
    }
};

resetAdmin();
