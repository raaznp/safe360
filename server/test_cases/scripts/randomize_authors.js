require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const BlogPost = require('../../models/BlogPost');
const User = require('../../models/User');

const randomizeAuthors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Fetch all users
        const users = await User.find({});
        if (users.length === 0) {
            console.log('No users found.');
            process.exit(1);
        }
        console.log(`Found ${users.length} users.`);

        // Fetch all blog posts
        const posts = await BlogPost.find({});
        console.log(`Found ${posts.length} posts.`);

        for (const post of posts) {
            // Pick a random user
            const randomUser = users[Math.floor(Math.random() * users.length)];
            post.author = randomUser._id;
            await post.save();
            console.log(`Assigned post "${post.title}" to ${randomUser.username}`);
        }

        console.log('Randomization completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Randomization failed:', error);
        process.exit(1);
    }
};

randomizeAuthors();
