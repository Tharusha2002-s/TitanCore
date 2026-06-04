import Project from '../models/Project.js';

// @desc    Get all projects with search and filters
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
    try {
        const { search, type, status } = req.query;
        let query = {};

        if (type) {
            query.type = type;
        }

        if (status) {
            query.status = status;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const projects = await Project.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin only)
export const createProject = async (req, res) => {
    try {
        const { title, type, status, budget, location, description, progress, images, timeline } = req.body;

        const project = await Project.create({
            title,
            type,
            status,
            budget,
            location,
            description,
            progress: progress || 0,
            images: images || [],
            timeline,
        });

        res.status(201).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
export const updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        await project.deleteOne();
        res.json({ success: true, message: 'Project removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
