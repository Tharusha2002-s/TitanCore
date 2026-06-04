import User from '../models/User.js';
import Project from '../models/Project.js';
import Job from '../models/Job.js';
import Message from '../models/Message.js';
import Application from '../models/Application.js';
import mongoose from 'mongoose';

export const seedDatabase = async () => {
    try {
        // Check if seeding is already done
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            console.log('Admin account already exists. Skipping database sweep and seed.');
            return;
        }

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
            name: 'Elena Rostova (Admin)',
            email: 'admin@buildcon.com',
            password: 'password123',
            role: 'admin',
            avatar: '',
        });

        console.log('Database seeded successfully with clean accounts and no dummy data!');
    } catch (error) {
        console.error('Error seeding database:', error.message);
    }
};
