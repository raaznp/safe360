const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const { protect } = require('../middleware/auth');
const { createUploader, validateFileContent } = require('../middleware/upload');
const fs = require('fs');

const upload = createUploader('media');

// Helper to calculate reading time
const calculateReadingTime = (content) => {
    if (!content) return 0;
    const text = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
    const wordCount = text.trim().split(/\s+/).length;
    return Math.ceil(wordCount / 200); // Assuming 200 words per minute
};

// @route POST /api/blog/upload
router.post('/upload', protect, upload.single('image'), async (req, res) => {
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

        // Create relative URL (e.g. /uploads/media/2025/...)
        const relativePath = req.file.path.replace(/\\\\/g, '/');
        // Ensure it starts with /
        const imageUrl = relativePath.startsWith('uploads') ? `/${relativePath}` : `/${relativePath}`;
        
        // Remove leading double slash if it exists (caused by aboves check if path starts with / already)
        const finalUrl = imageUrl.replace(/^\/\//, '/');

        res.json({ imageUrl: finalUrl });
    } catch (error) {
         if (req.file && fs.existsSync(req.file.path)) {
             fs.unlinkSync(req.file.path);
         }
         res.status(500).json({ message: error.message });
    }
});

// @route GET /api/blog
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const tag = req.query.tag;
        const author = req.query.author;
        const category = req.query.category;

        // Filter for scheduled posts and visibility
        const now = new Date();
        const query = { 
            published: true,
            publishedAt: { $lte: now },
            visibility: 'public'
        };
        
        if (tag) query.tags = tag;
        if (tag) query.tags = tag;
        
        if (author) {
            // Check if author is ID or username
            if (mongoose.Types.ObjectId.isValid(author)) {
                query.author = author;
            } else {
                const User = require('../models/User');
                const authorUser = await User.findOne({ username: author });
                if (authorUser) {
                    query.author = authorUser._id;
                } else {
                    // If username not found, match nothing (or handle appropriately)
                    query.author = null; 
                }
            }
        }

        if (category) query.categories = category;
        if (category) query.categories = category;

        const totalPosts = await BlogPost.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / limit);

        const posts = await BlogPost.find(query)
            .sort({ createdAt: -1, _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('author', 'fullName username');

        res.json({
            posts,
            currentPage: page,
            totalPages,
            totalPosts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/blog/admin (Admin only - fetch all with filters)
router.get('/admin', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search;
        const status = req.query.status || 'all'; // 'all', 'mine', 'published', 'draft', 'private', 'trash'
        const tag = req.query.tag;
        const author = req.query.author;
        const category = req.query.category;
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;

        const baseQuery = {};
        if (search) {
            baseQuery.title = { $regex: search, $options: 'i' };
        }
        if (tag) baseQuery.tags = tag;
        if (author) baseQuery.author = author;
        if (category) baseQuery.categories = category;

        // Clone baseQuery for specific count aggregations
        // Note: Filters line "Mine" depend on the current user
        const currentUserId = req.user._id;
        const now = new Date();

        // 1. Calculate Counts
        const [
            allCount,
            mineCount,
            publishedCount,
            scheduledCount,
            draftCount,
            privateCount
        ] = await Promise.all([
            BlogPost.countDocuments({ ...baseQuery }),
            BlogPost.countDocuments({ ...baseQuery, author: currentUserId }),
            BlogPost.countDocuments({ ...baseQuery, published: true, publishedAt: { $lte: now } }),
            BlogPost.countDocuments({ ...baseQuery, published: true, publishedAt: { $gt: now } }),
            BlogPost.countDocuments({ ...baseQuery, published: false }),
            BlogPost.countDocuments({ ...baseQuery, visibility: 'private' })
        ]);

        const counts = {
            all: allCount,
            mine: mineCount,
            published: publishedCount,
            scheduled: scheduledCount,
            draft: draftCount,
            private: privateCount
        };

        // 2. Apply Status Filter to Main Query
        let finalQuery = { ...baseQuery };

        if (status === 'mine') {
            finalQuery.author = currentUserId;
        } else if (status === 'published') {
            finalQuery.published = true;
            finalQuery.publishedAt = { $lte: now };
        } else if (status === 'scheduled') {
            finalQuery.published = true;
            finalQuery.publishedAt = { $gt: now };
        } else if (status === 'draft') {
            finalQuery.published = false;
        } else if (status === 'private') {
            finalQuery.visibility = 'private';
        }

        const totalPosts = await BlogPost.countDocuments(finalQuery);
        const totalPages = Math.ceil(totalPosts / limit);

        const sortOptions = {};
        sortOptions[sortBy] = order;
        if (sortBy !== '_id' && sortBy !== 'createdAt') {
             sortOptions._id = -1; 
        }

        const posts = await BlogPost.find(finalQuery)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit)
            .limit(limit)
            .populate('author', 'fullName username'); // Populate author name for display

        res.json({
            posts,
            counts,
            currentPage: page,
            totalPages,
            totalPosts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/blog/admin/post/:id (Admin only - fetch single by ID)
router.get('/admin/post/:id', protect, async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/blog/:slug
router.get('/:slug', async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug }).populate('author', 'fullName username avatar bio');
        if (post) {
            // Fetch related posts
            const relatedQuery = {
                _id: { $ne: post._id },
                published: true,
                $or: [
                    { tags: { $in: post.tags } }
                ]
            };
            
            if (post.categories && post.categories.length > 0) {
                 relatedQuery.$or.push({ categories: { $in: post.categories } });
            }

            const related = await BlogPost.find(relatedQuery).limit(3).populate('author', 'fullName username');

            const next = await BlogPost.findOne({
                _id: { $ne: post._id },
                published: true,
                createdAt: { $gt: post.createdAt }
            }).sort({ createdAt: 1 }).select('title slug');

            const previous = await BlogPost.findOne({
                _id: { $ne: post._id },
                published: true,
                createdAt: { $lt: post.createdAt }
            }).sort({ createdAt: -1 }).select('title slug');

            res.json({ post, related, next, previous });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/blog (Admin only)
router.post('/', protect, async (req, res) => {
    const { title, slug, metaDescription, content, image, tags, categories, published, visibility, publishedAt, commentsEnabled, author } = req.body;
    try {
        const readingTime = calculateReadingTime(content);
        
        // Determine author: if admin provides author ID, use it. Otherwise default to current user.
        // We trust the admin to provide valid ID, but logic implies:
        // If user is admin (req.user.role === 'admin') AND author is provided, use it.
        // Else use req.user._id
        
        let authorId = req.user._id;
        if (req.user.role === 'admin' && author) {
            authorId = author;
        }

        const post = new BlogPost({ 
            title, 
            slug, 
            metaDescription,
            content, 
            image, 
            tags, 
            categories,
            published: published !== undefined ? published : true,
            visibility: visibility || 'public',
            publishedAt: publishedAt || new Date(),
            readingTime,
            commentsEnabled: commentsEnabled !== undefined ? commentsEnabled : true,
            author: authorId
        });
        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route PUT /api/blog/:id (Admin only)
router.put('/:id', protect, async (req, res) => {
    const { title, slug, metaDescription, content, image, tags, categories, published, visibility, publishedAt, commentsEnabled, author } = req.body;
    try {
        const post = await BlogPost.findById(req.params.id);

        if (post) {
            post.title = title || post.title;
            post.slug = slug || post.slug;
            post.metaDescription = metaDescription || post.metaDescription;
            post.content = content || post.content;
            post.image = image !== undefined ? image : post.image;
            post.tags = tags || post.tags;
            post.categories = categories || post.categories;
            post.published = published !== undefined ? published : post.published;
            post.visibility = visibility || post.visibility;
            post.publishedAt = publishedAt !== undefined ? publishedAt : post.publishedAt;
            post.commentsEnabled = commentsEnabled !== undefined ? commentsEnabled : post.commentsEnabled;
            
            // Allow author update if admin
            if (req.user.role === 'admin' && author) {
                post.author = author;
            }

            // Auto-set publishedAt if publishing and not set
            if (post.published && !post.publishedAt) {
                post.publishedAt = new Date();
            }

            if (content) {
                post.readingTime = calculateReadingTime(content);
            }

            const updatedPost = await post.save();
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route DELETE /api/blog/:id (Admin only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);

        if (post) {
            await post.deleteOne();
            res.json({ message: 'Post removed' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

