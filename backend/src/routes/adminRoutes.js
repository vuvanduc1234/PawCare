import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getOverviewStats,
  getPendingProviders,
  approveProvider,
  rejectProvider,
  getAdminPosts,
  getReports,
} from '../controllers/adminController.js';
import { deletePost } from '../controllers/postController.js';

const router = express.Router();

router.use(authenticate, authorize('admin'));

// Overview stats
router.get('/overview', getOverviewStats);

// Provider approvals
router.get('/providers/pending', getPendingProviders);
router.patch('/providers/:id/approve', approveProvider);
router.patch('/providers/:id/reject', rejectProvider);

// Posts moderation
router.get('/posts', getAdminPosts);
router.delete('/posts/:id', deletePost);

// Reports
router.get('/reports', getReports);

export default router;
