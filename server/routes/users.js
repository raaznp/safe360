const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { createUploader, validateFileContent } = require('../middleware/upload');
const fs = require('fs');

const upload = createUploader('media');

// @route   POST api/users/profile/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/profile/avatar', protect, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        // Validate content
        const isValid = await validateFileContent(req.file.path, 'media');
        if (!isValid) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Invalid file content detected' });
        }

        const user = await User.findById(req.user);
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Create relative URL (e.g. /uploads/media/2025/...)
        const relativePath = req.file.path.replace(/\\\\/g, '/');
        // Ensure it starts with /
        const avatarUrl = relativePath.startsWith('uploads') ? `/${relativePath}` : relativePath;
        
        user.avatar = avatarUrl;
        await user.save();

        res.json({ message: 'Avatar updated', avatar: avatarUrl });
    } catch (err) {
        console.error('Upload Error:', err);
        if (req.file && fs.existsSync(req.file.path)) {
             fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Server error during upload' });
    }
});

// ==========================
// Profile Routes (Specific)
// ==========================

// @route GET /api/users/profile
// @desc Get current user profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route PUT /api/users/profile
// @desc Update user profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;
            
            if (req.body.socials) {
                user.socials = {
                    linkedin: req.body.socials.linkedin !== undefined ? req.body.socials.linkedin : user.socials?.linkedin,
                    github: req.body.socials.github !== undefined ? req.body.socials.github : user.socials?.github,
                    twitter: req.body.socials.twitter !== undefined ? req.body.socials.twitter : user.socials?.twitter,
                    website: req.body.socials.website !== undefined ? req.body.socials.website : user.socials?.website
                };
            }

            if (req.body.education) {
                user.education = req.body.education;
            }

            if (req.body.workHistory) {
                user.workHistory = req.body.workHistory;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                fullName: updatedUser.fullName,
                phone: updatedUser.phone,
                address: updatedUser.address,
                bio: updatedUser.bio,
                avatar: updatedUser.avatar,
                socials: updatedUser.socials,
                education: updatedUser.education,
                workHistory: updatedUser.workHistory
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==========================
// Admin/General User Routes
// ==========================

// @route GET /api/users
// @desc Get all users
// @route GET /api/users
// @desc Get all users with post counts
router.get('/', protect, async (req, res) => {
    try {
        // Use aggregation to join with blogposts and count them
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'blogposts', // collection name (usually lowercase plural of model name)
                    localField: '_id',
                    foreignField: 'author',
                    as: 'posts'
                }
            },
            {
                $addFields: {
                    postCount: { $size: '$posts' }
                }
            },
            {
                $project: {
                    password: 0,
                    posts: 0 // Remove the heavy posts array
                }
            }
        ]);
        
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route POST /api/users
// @desc Create a user
router.post('/', protect, async (req, res) => {
    try {
        const { username, email, password, role, fullName } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password,
            role,
            fullName: fullName || ''
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                fullName: user.fullName
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route PUT /api/users/:id
// @desc Update user by ID
router.put('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            user.fullName = req.body.fullName || user.fullName;
            
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                fullName: updatedUser.fullName
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route DELETE /api/users/:id
// @desc Delete user
router.delete('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
