const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const MEDIA_DIR = path.join(UPLOADS_DIR, 'media');
const FILES_DIR = path.join(UPLOADS_DIR, 'files');

// Import Models (Need to point to actual model files)
// Assuming standard structure
const User = require('../models/User');
const BlogPost = require('../models/BlogPost');
const Media = require('../models/Media'); // If you have a separate Media model

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/safe360');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

const migrateFiles = async () => {
    console.log('Starting File Migration...');
    
    if (!fs.existsSync(MEDIA_DIR)) {
        fs.mkdirSync(MEDIA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILES_DIR)) {
        fs.mkdirSync(FILES_DIR, { recursive: true });
    }

    // Get all items in uploads directory
    const items = fs.readdirSync(UPLOADS_DIR);

    // Filter for year directories (YYYY)
    const yearDirs = items.filter(item => {
        return /^\d{4}$/.test(item) && fs.statSync(path.join(UPLOADS_DIR, item)).isDirectory();
    });

    console.log(`Found year directories: ${yearDirs.join(', ')}`);

    for (const year of yearDirs) {
        const oldPath = path.join(UPLOADS_DIR, year);
        const newPath = path.join(MEDIA_DIR, year);

        console.log(`Moving ${oldPath} -> ${newPath}`);
        
        // Check if destination already exists (partial migration?)
        if (fs.existsSync(newPath)) {
            console.log(`Warning: ${newPath} already exists. Merging...`);
        }

        // Strategy: Copy recursively, then remove old.
        // This handles cases where a file might be locked (EPERM on rename).
        try {
            console.log(`Copying ${oldPath} -> ${newPath}`);
            fs.cpSync(oldPath, newPath, { recursive: true });
            
            console.log(`Deleting old directory ${oldPath}`);
            try {
                fs.rmSync(oldPath, { recursive: true, force: true });
            } catch (rmErr) {
                console.warn(`Warning: Could not fully delete ${oldPath}. Check if files are open. Error: ${rmErr.message}`);
                // Proceed anyway, as files are effectively moved (copied).
            }
        } catch (copyErr) {
            console.error(`Failed to copy ${year}:`, copyErr.message);
            // Abort migration for this folder if copy failed
            continue; 
        }
    }
    console.log('File Migration Completed.');
};

const migrateDatabase = async () => {
    console.log('Starting Database Migration...');

    // 1. Update Media Collection
    // Files moved to /uploads/media/...
    // URLs match /uploads/YYYY... -> /uploads/media/YYYY...
    
    // We update regex: starts with /uploads/2 or /uploads/1 (years)
    // Avoid double migration if already /uploads/media
    
    console.log('Updating Media documents...');
    const mediaRes = await Media.updateMany(
        { url: { $regex: /^\/uploads\/\d{4}/ } },
        [
            {
                $set: {
                    url: {
                        $replaceOne: {
                            input: "$url",
                            find: "/uploads/",
                            replacement: "/uploads/media/"
                        }
                    }
                }
            }
        ]
    );
    console.log(`Media updated: ${mediaRes.modifiedCount}`);

    // 2. Update User Avatars
    console.log('Updating User avatars...');
    const userRes = await User.updateMany(
        { avatar: { $regex: /\/uploads\/\d{4}/ } }, // Match if URL contains /uploads/YYYY
        // Note: Avatar might be full URL (http://...).
        // regex /uploads/YYYY matches path part too.
        // We replace /uploads/ with /uploads/media/ only if followed by digit
        [
            {
                $set: {
                    avatar: {
                        $replaceOne: {
                            input: "$avatar",
                            find: "/uploads/",
                            replacement: "/uploads/media/"
                        }
                    }
                }
            }
        ]
    );
    // Caveat: If avatar is http://host/uploads/2025... -> http://host/uploads/media/2025...
    // The regex /uploads/ finds the first occurrence.
    // If we have http://... checked?
    // User avatar often: "http://localhost:5001/uploads/2025/..."
    console.log(`Users updated: ${userRes.modifiedCount}`);

    // 3. Update BlogPost Content (HTML)
    // This requires iterating and replacing content string.
    
    console.log('Updating BlogPost content...');
    const posts = await BlogPost.find({ content: { $regex: /\/uploads\/\d{4}/ } });
    let postCount = 0;
    
    for (const post of posts) {
        // Simple string replace for all occurrences
        // Regex: /uploads/(YYYY)
        // We want to capture the group to ensure we don't double replace logic?
        // Just replace "/uploads/" with "/uploads/media/" IF followed by digit.
        
        let newContent = post.content.replace(/\/uploads\/(\d{4})/g, '/uploads/media/$1');
        
        // Also update featured image 'image' field
        let newImage = post.image;
        if (post.image && post.image.includes('/uploads/') && !post.image.includes('/uploads/media/')) {
             newImage = post.image.replace(/\/uploads\/(\d{4})/, '/uploads/media/$1');
        }

        if (newContent !== post.content || newImage !== post.image) {
            post.content = newContent;
            post.image = newImage;
            await post.save();
            postCount++;
        }
    }
    console.log(`BlogPosts updated: ${postCount}`);
};

const run = async () => {
    await connectDB();
    await migrateFiles();
    await migrateDatabase();
    console.log('Migration Finished.');
    process.exit();
};

run();
