const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const { protect } = require('../middleware/auth');

// @route GET /api/tags
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find().sort({ name: 1 });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/tags
router.post('/', protect, async (req, res) => {
    const { name, slug } = req.body;
    try {
        const tag = new Tag({ name, slug });
        const createdTag = await tag.save();
        res.status(201).json(createdTag);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route PUT /api/tags/:id
router.put('/:id', protect, async (req, res) => {
    const { name, slug } = req.body;
    try {
        const tag = await Tag.findById(req.params.id);
        if (tag) {
            tag.name = name || tag.name;
            tag.slug = slug || tag.slug;
            const updatedTag = await tag.save();
            res.json(updatedTag);
        } else {
            res.status(404).json({ message: 'Tag not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route DELETE /api/tags/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (tag) {
            await tag.deleteOne();
            res.json({ message: 'Tag removed' });
        } else {
            res.status(404).json({ message: 'Tag not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
