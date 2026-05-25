import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
        },
        phone: {
            type: String,
            default: '',
        },
        subject: {
            type: String,
            required: [true, 'Please add a subject'],
        },
        message: {
            type: String,
            required: [true, 'Please add a message'],
        },
        status: {
            type: String,
            enum: ['Unread', 'Read'],
            default: 'Unread',
        },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
