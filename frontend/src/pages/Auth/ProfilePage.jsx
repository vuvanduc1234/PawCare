import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';

/**
 * ProfilePage: Trang profile của user
 * Hiển thị và cho phép chỉnh sửa thông tin cá nhân
 */
const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState(user);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  /**
   * Xử lý thay đổi input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Xử lý submit cập nhật profile
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await userService.updateProfile(formData);
      if (response.success) {
        updateUser(response.data);
        setMessage('Cập nhật profile thành công');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Chưa đăng nhập</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hồ Sơ Cá Nhân</h1>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.includes('thành công')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div className="card">
        {!isEditing ? (
          <div className="space-y-4">
            <p>
              <strong>Tên:</strong> {user.fullName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {user.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong>{' '}
              {user.address?.street || 'Chưa cập nhật'}
            </p>
            <p>
              <strong>Vai trò:</strong> {user.role}
            </p>

            <button onClick={() => setIsEditing(true)} className="btn-primary">
              Chỉnh Sửa
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Địa chỉ</label>
              <input
                type="text"
                name="street"
                value={formData.address?.street || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      street: e.target.value,
                    },
                  })
                }
                className="input-field"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                className="input-field"
                rows="3"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary flex-1"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
