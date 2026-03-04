const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Post = require('../models/postModel');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB for seeding...");

        // Clear existing data (OPTIONAL: Comment out if you want to keep your data)
        // await User.deleteMany({});
        // await Post.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 10);

        // 1. Create Users
        const users = [
            { username: 'elara.vibe', email: 'elara@vault.com', password: hashedPassword, bio: 'Digital Architect & Visual Explorer' },
            { username: 'marcus.vance', email: 'marcus@vault.com', password: hashedPassword, bio: 'Capturing light and shadow.' },
            { username: 'julian.vibe', email: 'julian@vault.com', password: hashedPassword, bio: 'Tokyo • NY • London.' },
            { username: 'crypto.king', email: 'crypto@vault.com', password: hashedPassword, bio: 'Building the future of the vault.' },
            { username: 'sky.walker', email: 'sky@vault.com', password: hashedPassword, bio: 'Clouds are my workspace.' }
        ];

        const createdUsers = await User.insertMany(users);
        console.log(`${createdUsers.length} Users created.`);

        // 2. Setup Following (Everyone follows Elara and Marcus)
        const elara = createdUsers[0];
        const marcus = createdUsers[1];

        for (let i = 2; i < createdUsers.length; i++) {
            const currentUser = createdUsers[i];

            // Current user follows Elara and Marcus
            await User.findByIdAndUpdate(currentUser._id, { $addToSet: { following: [elara._id, marcus._id] } });
            await User.findByIdAndUpdate(elara._id, { $addToSet: { followers: currentUser._id } });
            await User.findByIdAndUpdate(marcus._id, { $addToSet: { followers: currentUser._id } });
        }
        console.log("Followings established.");

        // 3. Create Posts
        const postData = [
            { user: elara._id, caption: 'The intersection of light and shadow.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800' },
            { user: elara._id, caption: 'Emerald luxury vibes.', image: 'https://images.unsplash.com/photo-1518005020250-6859b2827c17?q=80&w=800' },
            { user: marcus._id, caption: 'Tokyo nights are unmatched.', image: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fab35?q=80&w=800' },
            { user: marcus._id, caption: 'Minimalist architecture.', image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=800' },
            { user: createdUsers[2]._id, caption: 'Searching for the next vault.', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800' }
        ];

        await Post.insertMany(postData);
        console.log("Seed posts created.");

        console.log("Seeding complete! You can now log in with email: elara@vault.com, password: password123");
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedData();
