const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    image: {
        type: String // URL to uploaded image
    },
    social: {
        linkedin: String,
        twitter: String,
        email: String
    },
    order: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
