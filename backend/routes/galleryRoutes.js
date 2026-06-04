import express from 'express';
import { getGalleryItems, createGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getGalleryItems);
router.post('/', protect, authorize('admin'), createGalleryItem);
router.delete('/:id', protect, authorize('admin'), deleteGalleryItem);

export default router;
