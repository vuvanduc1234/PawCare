import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import AdminLayout from './AdminLayout';

const AdminPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAdminPosts({ limit: 50 });
      setPosts(response.data || []);
    } catch (error) {
      console.error('Failed to load posts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <AdminLayout title="Quản lý bài đăng">
      <div className="bg-white rounded-xl border p-4">
        {loading ? (
          <div className="text-slate-500">Đang tải dữ liệu...</div>
        ) : posts.length === 0 ? (
          <div className="text-slate-500">Chưa có bài đăng.</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-3 py-2">Tác giả</th>
                  <th className="text-left px-3 py-2">Nội dung</th>
                  <th className="text-left px-3 py-2">Ngày tạo</th>
                  <th className="text-left px-3 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="border-t">
                    <td className="px-3 py-2">
                      {post.author?.fullName || 'Unknown'}
                    </td>
                    <td className="px-3 py-2 max-w-md truncate">
                      {post.content}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={async () => {
                          if (!window.confirm('Xóa bài đăng này?')) return;
                          await adminService.deletePost(post._id);
                          loadPosts();
                        }}
                        className="text-sm px-3 py-1 rounded border hover:bg-slate-50"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPostsPage;
