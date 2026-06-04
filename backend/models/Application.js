import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        cv: {
            type: String, // URL of the uploaded CV
            required: [true, 'Please upload your CV'],
        },
        status: {
            type: String,
            enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
            default: 'Pending',
        },
        coverLetter: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
