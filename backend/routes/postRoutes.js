const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { upload } = require('../utils/multer');
const postController = require('../controllers/postController');

// Public routes
router.get('/', postController.getFeed);
router.get('/:id', postController.getPost);
router.get('/:id/comments', postController.getComments);

// Protected routes
router.post('/', auth, upload.array('images', 10), postController.createPost);
router.put('/:id', auth, upload.array('images', 10), postController.updatePost);
router.delete('/:id', auth, postController.deletePost);

// Like/Unlike
router.post('/:id/like', auth, postController.toggleLike);

// Comments
router.post('/:id/comments', auth, postController.addComment);
router.delete('/:postId/comments/:commentId', auth, postController.deleteComment);
router.put('/:postId/comments/:commentId', auth, postController.updateComment);
router.post('/:postId/comments/:commentId/like', auth, postController.toggleCommentLike);

module.exports = router;
