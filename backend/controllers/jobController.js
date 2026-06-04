import Job from '../models/Job.js';

// @desc    Get all job listings
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};
        if (type) {
            query.type = type;
        }

        const jobs = await Job.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get a single job listing
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new job listing
// @route   POST /api/jobs
// @access  Private (Admin only)
export const createJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, type, location } = req.body;

        const job = await Job.create({
            title,
            description,
            requirements,
            salary,
            type,
            location,
        });

        res.status(201).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a job listing
// @route   PUT /api/jobs/:id
// @access  Private (Admin only)
export const updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a job listing
// @route   DELETE /api/jobs/:id
// @access  Private (Admin only)
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        await job.deleteOne();
        res.json({ success: true, message: 'Job posting deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
