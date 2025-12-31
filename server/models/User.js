const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    // Profile Fields
    fullName: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    
    // Social Media
    socials: {
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        twitter: { type: String, default: '' },
        website: { type: String, default: '' }
    },

    // Education
    education: [{
        school: { type: String },
        degree: { type: String },
        year: { type: String }
    }],

    // Work History
    workHistory: [{
        company: { type: String },
        role: { type: String },
        location: { type: String },
        duration: { type: String },
        description: { type: String }
    }]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await argon2.hash(this.password);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await argon2.verify(this.password, enteredPassword);
};

module.exports = mongoose.model('User', userSchema);
