const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    altText: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    caption: {
        type: String,
        default: ''
    },
    size: {
        type: Number, // in bytes
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
