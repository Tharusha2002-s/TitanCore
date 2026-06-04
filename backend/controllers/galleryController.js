import Gallery from '../models/Gallery.js';

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
export const getGalleryItems = async (req, res) => {
    try {
        const items = await Gallery.find().sort({ createdAt: -1 });
        res.json({ success: true, count: items.length, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new gallery item
// @route   POST /api/gallery
// @access  Private (Admin only)
export const createGalleryItem = async (req, res) => {
    try {
        const { title, category, url } = req.body;

        if (!title || !category || !url) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields (title, category, url)' });
        }

        const item = await Gallery.create({
            title,
            category,
            url,
        });

        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private (Admin only)
export const deleteGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Gallery item not found' });
        }

        await item.deleteOne();
        res.json({ success: true, message: 'Gallery item removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
