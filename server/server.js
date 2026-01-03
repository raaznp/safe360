require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const BlogPost = require('./models/BlogPost');

const app = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // unsafe-eval required for some dev tools/libraries
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com", "blob:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            connectSrc: ["'self'", "http://localhost:5174", "ws://localhost:5174"], // Allow vite dev server
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    xContentTypeOptions: true // Strict MIME type checking (nosniff)
}));
app.use((req, res, next) => {
    // Prevent execution in uploads folder by forcing download or strict types? 
    // Helmet nosniff helps.
    // Additional headers can be added here if needed.
    next();
});
app.use(cors());
app.use(express.json());
// Serve Client Static Files (Production)
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        res.set('X-Content-Type-Options', 'nosniff');
    }
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/careers', require('./routes/careers'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/team', require('./routes/team'));
app.use('/api/users', require('./routes/users'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/media', require('./routes/media'));
app.use('/api/files', require('./routes/files'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/tags', require('./routes/tags'));

// API Root
app.get('/api', (req, res) => {
    res.send('Safe360 API is running');
});

// Wildcard Route for React SPA
// Wildcard Route for React SPA with SEO Injection
app.get('*', async (req, res) => {
    const indexPath = path.join(__dirname, '../client/dist/index.html');
    
    // Check if it's a blog post request
    if (req.path.startsWith('/blog/') && req.path.split('/').length > 2) {
        try {
            const slug = req.path.split('/').pop();
            const post = await BlogPost.findOne({ slug });

            if (post) {
                // Read index.html
                fs.readFile(indexPath, 'utf8', (err, htmlData) => {
                    if (err) {
                        console.error('Error reading index.html', err);
                        return res.status(500).send('Server Error');
                    }

                    // Inject Metadata
                    const title = post.title || 'Safe360 - Immersive Corporate Training';
                    const description = post.metaDescription || post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...';
                    // Ensure image is absolute URL if relative
                    let image = post.image || 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=2078&auto=format&fit=crop';
                    if (image.startsWith('/')) {
                        image = `https://safe360.rajkumarnepal.com.np${image}`;
                    }

                    // Replace Meta Tags
                    let injectedHtml = htmlData
                        .replace('<title>Safe360</title>', `<title>${title} | Safe360</title>`)
                        .replace(/content="Safe360 - Immersive Corporate Training"/g, `content="${title}"`)
                        .replace(/content="Revolutionizing corporate training with immersive VR\/AR technologies and next-gen Learning Management Systems."/g, `content="${description}"`)
                        .replace(/content="https:\/\/images.unsplash.com\/photo-1593508512255-86ab42a8e620\?q=80&w=2078&auto=format&fit=crop"/g, `content="${image}"`);
                    
                    // Also explicitly target OG and Twitter tags if the generic replace missed them (regex fallback)
                    // The above simple replacements rely on strict string matching with the default index.html content.
                    // For robustness, we can use regex to replace specific property contents.
                    
                    // Note: The simple replace above works if index.html exactly matches the string. 
                    // To be safer, we can re-inject purely.
                    
                    return res.send(injectedHtml);
                });
                return;
            }
        } catch (error) {
            console.error('SEO Injection Error:', error);
            // Fallback to static serve on error
        }
    }

    // Default Static Serve (Home, Login, etc.)
    res.sendFile(indexPath);
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err); // Log to console
    
    if (err.message === 'Only image files are allowed!' || err.message.startsWith('Invalid file type')) {
        return res.status(400).json({ message: err.message });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: `DEBUG: Unexpected field '${err.field}'. Check client FormData.` });
    }
    res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
