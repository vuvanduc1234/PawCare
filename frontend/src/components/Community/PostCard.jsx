import React, { useState } from 'react';
import postService from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';

/**
 * PostCard: Component hiển thị một bài đăng
 * Props:
 * - post: object post từ API
 * - onPostUpdated: callback khi bài đăng được update
 */
const PostCard = ({ post, onPostUpdated }) => {
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentUserId = user?._id || user?.id;
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(currentUserId) || false
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [loading, setLoading] = useState(false);

  // Handle like/unlike
  const handleLike = async () => {
    try {
      await postService.toggleLike(post._id);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Handle comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const response = await postService.addComment(post._id, commentText);
      setComments([response.data, ...comments]);
      setCommentText('');
    } catch (error) {
      alert('Lỗi khi thêm bình luận: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete post
  const handleDeletePost = async () => {
    if (!window.confirm('Bạn chắc chắn muốn xóa bài đăng này?')) return;

    try {
      await postService.deletePost(post._id);
      onPostUpdated();
    } catch (error) {
      alert('Lỗi khi xóa bài đăng: ' + error.message);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa bình luận này?')) return;

    try {
      await postService.deleteComment(post._id, commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      alert('Lỗi khi xóa bình luận: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          {post.author?.avatar && (
            <img
              src={post.author.avatar}
              alt={post.author.firstName}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold">
              {post.author?.fullName || 'Người dùng'}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>

        {/* Delete button */}
        {post.author && currentUserId === post.author._id && (
          <button
            onClick={handleDeletePost}
            className="text-red-500 hover:text-red-700 text-lg"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-3">
            <div className="relative bg-gray-200 rounded overflow-hidden h-96">
              <img
                src={post.images[currentImageIndex]}
                alt={`Post image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {post.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(Math.max(0, currentImageIndex - 1))
                    }
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded"
                    disabled={currentImageIndex === 0}
                  >
                    ◀
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        Math.min(post.images.length - 1, currentImageIndex + 1)
                      )
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded"
                    disabled={currentImageIndex === post.images.length - 1}
                  >
                    ▶
                  </button>
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {post.images.length}
                  </span>
                </>
              )}
            </div>

            {/* Image indicators */}
            {post.images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {post.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 ${
                      idx === currentImageIndex
                        ? 'border-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 py-2 text-sm text-gray-500 border-t border-b">
        <span>👁️ {post.views || 0} lượt xem</span>
        <span className="mx-3">💬 {comments.length} bình luận</span>
        <span>❤️ {likeCount} lượt thích</span>
      </div>

      {/* Actions */}
      <div className="p-4 border-b flex gap-4">
        <button
          onClick={handleLike}
          className={`flex-1 py-2 rounded hover:bg-gray-100 font-semibold ${
            isLiked ? 'text-red-500' : 'text-gray-700'
          }`}
        >
          {isLiked ? '❤️' : '🤍'} Thích
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 py-2 rounded hover:bg-gray-100 font-semibold text-gray-700"
        >
          💬 Bình luận
        </button>
        <button
          onClick={() =>
            navigator.share?.({
              title: 'Bài đăng PawCare',
              text: post.content,
              url: window.location.href,
            })
          }
          className="flex-1 py-2 rounded hover:bg-gray-100 font-semibold text-gray-700"
        >
          📤 Chia sẻ
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 bg-gray-50">
          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Viết bình luận..."
                className="input-field flex-1"
              />
              <button
                type="submit"
                disabled={loading || !commentText.trim()}
                className="btn-primary"
              >
                {loading ? '...' : 'Gửi'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="bg-white p-3 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm">
                        {comment.author?.fullName || 'Người dùng'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString(
                          'vi-VN'
                        )}
                      </p>
                    </div>
                    {comment.author && currentUserId === comment.author._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm">
                Chưa có bình luận nào
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
