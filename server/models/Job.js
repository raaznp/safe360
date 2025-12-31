const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true }, // Full-time, Part-time, Contract
    location: { type: String, required: true },
    department: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    active: { type: Boolean, default: true }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate for applications
jobSchema.virtual('applications', {
    ref: 'Application',
    localField: '_id',
    foreignField: 'job'
});

jobSchema.virtual('applicationCount', {
    ref: 'Application',
    localField: '_id',
    foreignField: 'job',
    count: true
});

module.exports = mongoose.model('Job', jobSchema);
