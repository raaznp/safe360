const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    metaDescription: { type: String },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    image: { type: String, default: '' }, // Featured Image URL
    imageAlt: { type: String, default: '' }, // Alt text for the image
    published: { type: Boolean, default: true },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    publishedAt: { type: Date },
    readingTime: { type: Number, default: 0 }, // in minutes
    commentsEnabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
