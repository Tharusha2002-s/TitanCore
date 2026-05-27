import express from 'express';
import { sendMessage, getMessages, updateMessageStatus } from '../controllers/messageController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', sendMessage);
router.get('/', protect, authorize('admin'), getMessages);
router.put('/:id', protect, authorize('admin'), updateMessageStatus);

export default router;
