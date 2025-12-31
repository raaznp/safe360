const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @route GET /api/analytics
// @desc Get dashboard analytics (Mock data)
router.get('/', protect, (req, res) => {
    // In a real app, this would aggregate data from DB
    const analytics = {
        visitors: {
            total: 12543,
            growth: 12.5,
            data: [400, 300, 500, 200, 700, 600, 800]
        },
        inquiries: {
            total: 45,
            growth: 5.2,
            data: [2, 5, 3, 8, 4, 6, 7]
        },
        blogViews: {
            total: 3420,
            growth: 24.8,
            data: [120, 200, 150, 300, 250, 400, 350]
        },
        activeJobs: 4
    };
    res.json(analytics);
});

module.exports = router;
