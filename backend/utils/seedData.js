import User from '../models/User.js';
import Project from '../models/Project.js';
import Job from '../models/Job.js';
import Message from '../models/Message.js';
import Application from '../models/Application.js';
import Gallery from '../models/Gallery.js';
import mongoose from 'mongoose';

export const seedDatabase = async () => {
    try {
        // Target admin settings
        const targetAdminName = 'Systems Administrator';
        const targetAdminEmail = 'admin@titancore.com';

        // Check if seeding is already done
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            console.log('Sweeping database clean...');

            // Delete all documents in all collections
            await User.deleteMany({});
            await Project.deleteMany({});
            await Job.deleteMany({});
            await Message.deleteMany({});
            await Application.deleteMany({});

            // Delete workers and hire requests from native collection to handle deleted models
            try {
                if (mongoose.connection.db) {
                    await mongoose.connection.db.collection('workers').deleteMany({});
                    await mongoose.connection.db.collection('hirerequests').deleteMany({});
                }
            } catch (e) {
                console.log('Workers/HireRequests collections clean error (maybe they do not exist yet):', e.message);
            }

            console.log('Seeding clean administrator account...');

            // 1. Create Admin
            await User.create({
                name: targetAdminName,
                email: targetAdminEmail,
                password: 'password123',
                role: 'admin',
                avatar: '',
            });

            console.log('Database seeded successfully with clean accounts and no dummy data!');
        } else {
            console.log('Admin account already exists. Syncing administrator name to target...');
            // Keep admin user's name in sync with the config
            if (adminExists.name !== targetAdminName || adminExists.email !== targetAdminEmail) {
                adminExists.name = targetAdminName;
                adminExists.email = targetAdminEmail;
                await adminExists.save();
                console.log('Admin name updated successfully in database.');
            }
        }

        // Seed gallery if empty
        const galleryCount = await Gallery.countDocuments();
        if (galleryCount === 0) {
            console.log('Seeding default gallery items...');
            await Gallery.insertMany([
                { category: 'residential', title: 'Skyline Residences Penthouse', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800' },
                { category: 'commercial', title: 'Corporate Glass Atrium', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800' },
                { category: 'interior', title: 'Bespoke Wooden Dining Lounge', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800' },
                { category: 'commercial', title: 'Modern Office Tower Exterior', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800' },
                { category: 'residential', title: 'Green Valley Smart Townhouse', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' },
                { category: 'interior', title: 'Luxury Marble Master Bathroom', url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800' },
                { category: 'steel', title: 'Erecting Heavy Steel Frame', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800' }
            ]);
            console.log('Default gallery items seeded successfully!');
        }
    } catch (error) {
        console.error('Error seeding database:', error.message);
    }
};
