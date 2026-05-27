import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private
export const applyForJob = async (req, res) => {
    try {
        const { jobId, cv, coverLetter } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job posting not found' });
        }

        // Check if user already applied
        const alreadyApplied = await Application.findOne({ userId: req.user._id, jobId });
        if (alreadyApplied) {
            return res.status(400).json({ success: false, message: 'You have already applied for this position' });
        }

        const application = await Application.create({
            userId: req.user._id,
            jobId,
            cv, // In production, this would be the Cloudinary or upload URL
            coverLetter: coverLetter || '',
        });

        res.status(201).json({ success: true, data: application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private (Admin only)
export const getApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('userId', 'name email avatar')
            .populate('jobId', 'title type location')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user's own applications
// @route   GET /api/applications/my
// @access  Private
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user._id })
            .populate('jobId', 'title type location salary')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Admin only)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Reviewed', 'Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        let application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        application.status = status;
        await application.save();

        const updated = await Application.findById(application._id)
            .populate('userId', 'name email avatar')
            .populate('jobId', 'title type');

        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
