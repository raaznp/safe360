const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');
const { createUploader, validateFileContent } = require('../middleware/upload');
const fs = require('fs');

const upload = createUploader('file'); // For resumes

// @route GET /api/careers
// @desc Get all active jobs (Public)
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find({ active: true }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/careers/all
// @desc Get all jobs (Admin)
router.get('/all', protect, async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 }).populate('applicationCount');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/careers
// @desc Create a job (Admin)
router.post('/', protect, async (req, res) => {
    const { title, type, location, department, description, requirements } = req.body;
    try {
        const job = new Job({ title, type, location, department, description, requirements });
        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route PUT /api/careers/:id
// @desc Update a job (Admin)
router.put('/:id', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job) {
            job.title = req.body.title || job.title;
            job.type = req.body.type || job.type;
            job.location = req.body.location || job.location;
            job.department = req.body.department || job.department;
            job.description = req.body.description || job.description;
            job.requirements = req.body.requirements || job.requirements;
            job.active = req.body.active !== undefined ? req.body.active : job.active;

            const updatedJob = await job.save();
            res.json(updatedJob);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route DELETE /api/careers/:id
// @desc Delete a job (Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job) {
            await job.deleteOne();
            res.json({ message: 'Job removed' });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/careers/apply/:id
// @desc Submit an application (Public)
router.post('/apply/:id', upload.single('resume'), async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        
        if (!job) {
             // Clean up uploaded file if job not found
             if (req.file) fs.unlinkSync(req.file.path);
             return res.status(404).json({ message: 'Job not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Resume file is required' });
        }

        // Create relative URL for resume
        const relativePath = req.file.path.replace(/\\/g, '/');
        const resumeUrl = relativePath.startsWith('uploads') ? `/${relativePath}` : `/${relativePath}`;

        const { firstName, lastName, email, phone, coverLetter } = req.body;

        const application = new Application({
            job: jobId,
            firstName,
            lastName,
            email,
            phone,
            resume: resumeUrl,
            coverLetter
        });

        await application.save();
        res.status(201).json({ message: 'Application submitted successfully' });

    } catch (error) {
        // Clean up file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ message: error.message });
    }
});

// @route GET /api/careers/applications
// @desc Get all applications (Admin)
router.get('/applications', protect, async (req, res) => {
    try {
        const { job } = req.query;
        const query = {};
        if (job) query.job = job;

        const applications = await Application.find(query)
            .populate('job', 'title')
            .sort({ appliedAt: -1 });
            
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/careers/applications/:id
// @desc Update application status (Admin)
router.put('/applications/:id', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id);

        if (application) {
            application.status = status || application.status;
            const updatedApp = await application.save();
            res.json(updatedApp);
        } else {
            res.status(404).json({ message: 'Application not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
