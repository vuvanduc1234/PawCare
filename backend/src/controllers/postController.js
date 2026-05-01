import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';

/**
 * GET /api/posts
 * Lấy feed bài đăng (phân trang, sort mới nhất)
 * Query params: page, limit, tag
 */
export const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let filter = { isDeleted: false };
    if (tag) {
      filter.tags = tag;
    }

    const posts = await Post.find(filter)
      .populate('author', 'fullName avatar phone')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'fullName avatar',
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Post.countDocuments(filter);

    res.json({
      data: posts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/posts
 * Tạo bài đăng mới (có thể upload nhiều ảnh)
 */
export const createPost = async (req, res) => {
  try {
    const { content, tags } = req.body;
    const author = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Nội dung bài đăng không được trống' });
    }

    // Upload images if provided
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadImage(file.buffer, 'posts');
          imageUrls.push(result.secure_url || result.url);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
        }
      }
    }

    const post = new Post({
      author,
      content,
      images: imageUrls,
      tags: tags ? (typeof tags === 'string' ? [tags] : tags) : [],
    });

    await post.save();
    await post.populate('author', 'fullName avatar phone');

    res.status(201).json({
      message: 'Bài đăng đã được tạo',
      data: post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/posts/:id
 * Lấy chi tiết bài đăng
 */
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('author', 'fullName avatar phone')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'fullName avatar',
        },
      });

    if (!post) {
      return res.status(404).json({ message: 'Bài đăng không tìm thấy' });
    }

    // Increment views
    post.views = (post.views || 0) + 1;
    await post.save();

    res.json({ data: post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/posts/:id
 * Sửa bài đăng (chỉ chủ bài)
 */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, tags } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Bài đăng không tìm thấy' });
    }

    // Check ownership
    if (post.author.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền sửa bài đăng này' });
    }

    if (content) post.content = content;
    if (tags) post.tags = tags;

    // Handle new images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadImage(file, 'posts');
          post.images.push(result.url);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
        }
      }
    }

    await post.save();
    await post.populate('author', 'fullName avatar phone');

    res.json({
      message: 'Bài đăng đã được cập nhật',
      data: post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/posts/:id
 * Xoá bài (chỉ chủ bài hoặc admin)
 */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Bài đăng không tìm thấy' });
    }

    // Check ownership
    if (post.author.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xoá bài đăng này' });
    }

    // Delete images from Cloudinary
    for (const imageUrl of post.images) {
      try {
        await deleteImage(imageUrl);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Delete associated comments
    await Comment.deleteMany({ post: id });

    // Soft delete
    post.isDeleted = true;
    await post.save();

    res.json({ message: 'Bài đăng đã được xoá' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/posts/:id/like
 * Like/Unlike bài đăng (toggle)
 */
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Bài đăng không tìm thấy' });
    }

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      // Unlike
      post.likes = post.likes.filter(uid => uid.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: hasLiked ? 'Bỏ thích bài đăng' : 'Thích bài đăng',
      data: {
        postId: id,
        liked: !hasLiked,
        likeCount: post.likes.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/posts/:id/comments
 * Lấy bình luận của bài đăng
 */
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Bài đăng không tìm thấy' });
    }

    const comments = await Comment.find({ post: id, isDeleted: false })
      .populate('author', 'fullName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments({ post: id, isDeleted: false });

    res.json({
      data: comments,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/posts/:id/comments
 * Thêm bình luận
 */
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const author = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Nội dung bình luận không được trống' });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Bài đăng không tìm thấy' });
    }

    const comment = new Comment({
      post: id,
      author,
      content,
    });

    await comment.save();
    await comment.populate('author', 'fullName avatar');

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({
      message: 'Bình luận đã được thêm',
      data: comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/posts/:postId/comments/:commentId
 * Xoá bình luận (chỉ chủ bình luận hoặc admin)
 */
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Bình luận không tìm thấy' });
    }

    // Check ownership
    if (comment.author.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xoá bình luận này' });
    }

    comment.isDeleted = true;
    await comment.save();

    res.json({ message: 'Bình luận đã được xoá' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/comments/:id
 * Sửa bình luận
 */
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Bình luận không tìm thấy' });
    }

    // Check ownership
    if (comment.author.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền sửa bình luận này' });
    }

    if (content) comment.content = content;

    await comment.save();
    await comment.populate('author', 'fullName avatar');

    res.json({
      message: 'Bình luận đã được cập nhật',
      data: comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/comments/:id/like
 * Like/Unlike bình luận
 */
export const toggleCommentLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Bình luận không tìm thấy' });
    }

    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      comment.likes = comment.likes.filter(uid => uid.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      message: hasLiked ? 'Bỏ thích bình luận' : 'Thích bình luận',
      data: {
        commentId: id,
        liked: !hasLiked,
        likeCount: comment.likes.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
