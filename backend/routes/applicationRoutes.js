import express from 'express';
import { applyForJob, getApplications, getMyApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', applyForJob);
router.get('/', protect, authorize('admin'), getApplications);
router.get('/my', protect, getMyApplications);
router.put('/:id', protect, authorize('admin'), updateApplicationStatus);

export default router;
