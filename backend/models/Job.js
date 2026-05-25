import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a job title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a job description'],
        },
        requirements: {
            type: [String],
            required: [true, 'Please add requirements'],
        },
        salary: {
            type: String, // e.g., "$60,000 - $80,000 / year"
            required: [true, 'Please add a salary range'],
        },
        type: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
            default: 'Full-time',
        },
        location: {
            type: String,
            default: 'On-site',
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
