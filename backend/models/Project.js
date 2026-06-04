import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a project title'],
            trim: true,
        },
        type: {
            type: String,
            required: [true, 'Please add a project type/category'],
            enum: [
                'Residential Construction',
                'Commercial Buildings',
                'Renovation',
                'Interior Design',
                'Road Construction',
                'Steel Structure Work',
                'Architecture Planning',
            ],
        },
        status: {
            type: String,
            required: [true, 'Please specify status'],
            enum: ['ongoing', 'completed'],
            default: 'ongoing',
        },
        budget: {
            type: String, // e.g., "$1.2M" or standard string description
            required: [true, 'Please add a budget'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        images: {
            type: [String],
            default: [],
        },
        timeline: {
            type: String, // e.g., "12 Months", "Jan 2025 - Dec 2026"
            required: [true, 'Please add a timeline'],
        },
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
