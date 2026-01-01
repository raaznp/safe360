require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const BlogPost = require('../../models/BlogPost');
const User = require('../../models/User');

const migrateAuthors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find a default admin user to assign posts to
        // You might want to pick a specific user, e.g., 'admin' or create a system user
        let defaultAuthor = await User.findOne({ role: 'admin' });
        
        if (!defaultAuthor) {
            console.log('No admin user found. Please create an admin user first.');
            process.exit(1);
        }

        console.log(`Assigning posts to default author: ${defaultAuthor.username} (${defaultAuthor._id})`);

        const strPosts = await BlogPost.find({ author: { $type: "string" } });
        console.log(`Found ${strPosts.length} posts with string authors.`);

        // Also find posts where author field might be missing
        const noAuthorPosts = await BlogPost.find({ author: { $exists: false } });
        console.log(`Found ${noAuthorPosts.length} posts with no author.`);

        const allPostsToUpdate = [...strPosts, ...noAuthorPosts];

        for (const post of allPostsToUpdate) {
            // Check if the current author string matches a user's username? 
            // Or just blindly assign to default admin? 
            // Strategy: Try to matches username, fallback to defaultAdmin.
            let authorId = defaultAuthor._id;

            // If the current author is a string that looks like an ObjectId, we might want to verify it?
            // But usually, it's "Safe360 Team" or similar name.
            
            // Just update to default admin for safety in this migration
            post.author = authorId;
            await post.save();
            console.log(`Updated post "${post.title}" to author ${defaultAuthor.username}`);
        }

        console.log('Migration completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateAuthors();
