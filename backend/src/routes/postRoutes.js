import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import * as postController from '../controllers/postController.js';

const router = express.Router();

// Public routes
router.get('/', postController.getFeed);
router.get('/:id', postController.getPost);
router.get('/:id/comments', postController.getComments);

// Protected routes
router.post('/', authenticate, upload.array('images', 10), postController.createPost);
router.put('/:id', authenticate, upload.array('images', 10), postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);

// Like/Unlike
router.post('/:id/like', authenticate, postController.toggleLike);

// Comments
router.post('/:id/comments', authenticate, postController.addComment);
router.delete('/:postId/comments/:commentId', authenticate, postController.deleteComment);
router.put('/:postId/comments/:commentId', authenticate, postController.updateComment);
router.post('/:postId/comments/:commentId/like', authenticate, postController.toggleCommentLike);

export default router;
