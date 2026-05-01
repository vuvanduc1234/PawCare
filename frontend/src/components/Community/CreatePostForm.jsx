import React, { useState } from 'react';
import postService from '../../services/postService';

const CreatePostForm = ({ onSuccess, onCancel }) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      const tagList = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      await postService.createPost({
        content,
        tags: tagList,
        images,
      });

      setContent('');
      setTags('');
      setImages([]);
      onSuccess?.();
    } catch (error) {
      alert(`Lỗi tạo bài đăng: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Bạn đang nghĩ gì về thú cưng của mình?"
        rows={4}
        className="w-full border rounded p-3 focus:outline-none focus:ring"
      />

      <div className="mt-3">
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (cách nhau bằng dấu phẩy)"
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mt-3">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files || []))}
        />
      </div>

      {images.length > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          Đã chọn {images.length} ảnh
        </div>
      )}

      <div className="mt-4 flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Đang đăng...' : 'Đăng bài'}
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;
