import Message from '../models/Message.js';

// @desc    Send a new message / contact query
// @route   POST /api/messages
// @access  Public
export const sendMessage = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const newMessage = await Message.create({
            name,
            email,
            phone: phone || '',
            subject,
            message,
        });

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (Admin only)
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id
// @access  Private (Admin only)
export const updateMessageStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Read', 'Unread'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        message.status = status;
        await message.save();

        res.json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
