const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed, // Flexible structure for different page sections
        default: {}
    },
    seo: {
        metaTitle: String,
        metaDescription: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);
