const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { protect } = require('../middleware/auth');

// @route GET /api/pages/:slug
// @desc Get page content by slug (Public)
router.get('/:slug', async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug });
        if (!page) {
            // Return default/empty structure if not found to avoid frontend crashes
            return res.json({ 
                slug: req.params.slug, 
                title: req.params.slug.charAt(0).toUpperCase() + req.params.slug.slice(1),
                content: {} 
            });
        }
        res.json(page);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/pages/:slug
// @desc Update page content (Admin)
router.put('/:slug', protect, async (req, res) => {
    try {
        const { title, content, seo } = req.body;
        
        const page = await Page.findOneAndUpdate(
            { slug: req.params.slug },
            { 
                title, 
                content, 
                seo,
                slug: req.params.slug // Ensure slug doesn't change easily
            },
            { new: true, upsert: true } // Create if doesn't exist
        );

        res.json(page);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
