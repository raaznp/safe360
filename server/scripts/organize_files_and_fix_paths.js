const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const MEDIA_DIR = path.join(UPLOADS_DIR, 'media');
const FILES_DIR = path.join(UPLOADS_DIR, 'files');

// Allowed Image Extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.ico'];

// Import Models
const User = require('../models/User');
const Media = require('../models/Media');
const BlogPost = require('../models/BlogPost');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/safe360');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

const getFilesRecursively = (dir) => {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) { 
            results = results.concat(getFilesRecursively(filePath));
        } else { 
            results.push(filePath);
        }
    });
    return results;
};

const moveNonImageFiles = async () => {
    console.log('Scanning uploads/media for non-image files...');
    if (!fs.existsSync(MEDIA_DIR)) {
        console.log('uploads/media does not exist. Skipping move.');
        return;
    }

    const allMediaFiles = getFilesRecursively(MEDIA_DIR);
    let movedCount = 0;

    for (const filePath of allMediaFiles) {
        const ext = path.extname(filePath).toLowerCase();
        
        if (!IMAGE_EXTENSIONS.includes(ext)) {
            // It's a file (PDF, doc, etc.)
            // Construct new path in FILES_DIR
            // Keep relative structure from MEDIA_DIR
            // e.g. .../media/2025/12/30/file.pdf -> .../files/2025/12/30/file.pdf
            
            const relativePath = path.relative(MEDIA_DIR, filePath);
            const newPath = path.join(FILES_DIR, relativePath);
            const newDir = path.dirname(newPath);

            if (!fs.existsSync(newDir)) {
                fs.mkdirSync(newDir, { recursive: true });
            }

            try {
                fs.renameSync(filePath, newPath);
                console.log(`Moved: ${relativePath} -> files/${relativePath}`);
                movedCount++;

                // Update Database for this specific file
                // Old URL part: /uploads/media/{relativePath} (normalized)
                // New URL part: /uploads/files/{relativePath}
                
                const normalizedRel = relativePath.replace(/\\/g, '/');
                const oldUrlPart = `/uploads/media/${normalizedRel}`;
                const newUrlPart = `/uploads/files/${normalizedRel}`;

                // Update Media (Exact match on URL suffix usually, but let's regex to be safe)
                // Media might store absolute URL too, so we match path suffix
                
                await Media.updateMany(
                    { url: { $regex: oldUrlPart } },
                    [
                        {
                            $set: {
                                url: {
                                    $replaceOne: {
                                        input: "$url",
                                        find: oldUrlPart,
                                        replacement: newUrlPart
                                    }
                                }
                            }
                        }
                    ]
                );

            } catch (err) {
                console.error(`Failed to move ${filePath}:`, err.message);
            }
        }
    }
    console.log(`Moved ${movedCount} non-image files to uploads/files.`);
};

const fixAbsolutePaths = async () => {
    console.log('Fixing absolute paths in database...');

    // 1. User Avatars
    // Remove protocol and host: http://localhost:5001/uploads/... -> /uploads/...
    // Regex: Match http(s)://[^/]+(/uploads/...)
    // MongoDB aggregation replacement is tricky for wildcards.
    // Easier to fetch, fix in JS, save.

    const users = await User.find({ avatar: { $regex: /^http/ } });
    let fixedUsers = 0;

    for (const user of users) {
        if (user.avatar && user.avatar.includes('/uploads/')) {
             // Extract path from /uploads/ onwards
             const match = user.avatar.match(/(\/uploads\/.*)/);
             if (match) {
                 user.avatar = match[1];
                 await user.save();
                 fixedUsers++;
             }
        }
    }
    console.log(`Fixed ${fixedUsers} user avatars.`);

    // 2. Media Documents
    const medias = await Media.find({ url: { $regex: /^http/ } });
    let fixedMedia = 0;

    for (const media of medias) {
        if (media.url && media.url.includes('/uploads/')) {
            const match = media.url.match(/(\/uploads\/.*)/);
            if (match) {
                media.url = match[1];
                await media.save();
                fixedMedia++;
            }
        }
    }
    console.log(`Fixed ${fixedMedia} media URLs.`);

    // 3. Blog Posts (Content & Image)
    // Content might contain absolute URLs in img src
    const posts = await BlogPost.find({ 
        $or: [
            { image: { $regex: /^http/ } },
            { content: { $regex: /src=["']http.*\/uploads\// } }
        ]
    });
    let fixedPosts = 0;

    for (const post of posts) {
        let modified = false;

        // Fix Featured Image
        if (post.image && post.image.startsWith('http') && post.image.includes('/uploads/')) {
            const match = post.image.match(/(\/uploads\/.*)/);
            if (match) {
                post.image = match[1];
                modified = true;
            }
        }

        // Fix Content (HTML)
        // Regex to find src="http://.../uploads/..."
        // Replace with src="/uploads/..."
        const contentRegex = /src=["']http:\/\/[^/]+(\/uploads\/[^"']+)["']/g;
        if (contentRegex.test(post.content)) {
            post.content = post.content.replace(contentRegex, 'src="$1"');
            modified = true;
        }

        if (modified) {
            await post.save();
            fixedPosts++;
        }
    }
    console.log(`Fixed ${fixedPosts} blog posts.`);
};

const run = async () => {
    await connectDB();
    await moveNonImageFiles();
    await fixAbsolutePaths();
    console.log('Organization and Fixes Completed.');
    process.exit();
};

run();
