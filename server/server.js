require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Default is tricky with some libraries, simplified for now
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
// Serve uploads directory - Ensure nosniff is effective
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        res.set('X-Content-Type-Options', 'nosniff');
        // Force download for generic files to avoid browser trying to execute/render them?
        // Maybe optional for images/videos.
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

app.get('/', (req, res) => {
    res.send('Safe360 API is running');
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
