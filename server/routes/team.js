const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');
const { protect } = require('../middleware/auth');
const { createUploader } = require('../middleware/upload');
const fs = require('fs');

const upload = createUploader('media'); // Store team images in media

// @route GET /api/team
// @desc Get all team members (Public - Active only, Admin - All)
router.get('/', async (req, res) => {
    try {
        // Check if admin is requesting (via header/query?). For simplicity, if not protected, public sees active.
        // Or we can rely on query param ?admin=true if token present?
        // Simpler: Just return all sorted by order. Frontend filters if needed, BUT public view should be filtered.
        
        // Let's assume public endpoint returns active members. 
        // Admin usually needs a separate route or token check. 
        // To keep it simple: Public sees ALL active. Admin sees ALL.
        
        // Wait, 'protect' middleware adds req.user.
        // But this route is likely public. 
        // Solution: Create separate admin route or return all and let frontend decide (less secure for hidden/draft members).
        // Better: GET / (Active), GET /all (Admin)
        
        const members = await TeamMember.find({ active: true }).sort({ order: 1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/team/all
// @desc Get all team members (Admin)
router.get('/all', protect, async (req, res) => {
    try {
        const members = await TeamMember.find().sort({ order: 1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/team
// @desc Add a team member (Admin)
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        const { name, role, bio, social, active, order } = req.body;
        
        let imageUrl = '';
        if (req.file) {
            const relativePath = req.file.path.replace(/\\/g, '/');
            imageUrl = relativePath.startsWith('uploads') ? `/${relativePath}` : `/${relativePath}`;
        }

        const member = new TeamMember({
            name,
            role,
            bio,
            image: imageUrl,
            social: social ? JSON.parse(social) : {},
            active: active === 'true' || active === true,
            order: order ? parseInt(order) : 0
        });

        await member.save();
        res.status(201).json(member);
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(400).json({ message: error.message });
    }
});

// @route PUT /api/team/:id
// @desc Update team member (Admin)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
    try {
        const { name, role, bio, social, active, order } = req.body;
        const member = await TeamMember.findById(req.params.id);

        if (!member) return res.status(404).json({ message: 'Member not found' });

        if (req.file) {
            // Delete old image? usage varies. Keep for now or delete if needed.
            const relativePath = req.file.path.replace(/\\/g, '/');
            member.image = relativePath.startsWith('uploads') ? `/${relativePath}` : `/${relativePath}`;
        }

        if (name) member.name = name;
        if (role) member.role = role;
        if (bio) member.bio = bio;
        if (social) member.social = typeof social === 'string' ? JSON.parse(social) : social;
        if (active !== undefined) member.active = active === 'true' || active === true;
        if (order !== undefined) member.order = parseInt(order);

        await member.save();
        res.json(member);
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(400).json({ message: error.message });
    }
});

// @route DELETE /api/team/:id
// @desc Delete team member (Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        await TeamMember.findByIdAndDelete(req.params.id);
        res.json({ message: 'Member removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
