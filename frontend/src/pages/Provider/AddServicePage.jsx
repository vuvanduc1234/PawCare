import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import serviceService from '../../services/serviceService';
import { useAuth } from '../../hooks/useAuth';
import { Header } from '../../components/common';

/**
 * AddServicePage: Trang tạo dịch vụ cho provider
 * URL: /provider/services/new
 * Form: name, category, description, price, duration, address, city, petTypes, workingHours, etc.
 */
const AddServicePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'grooming',
    description: '',
    price: '',
    duration: '60',
    address: '',
    latitude: '21.0285',
    longitude: '105.8542',
    city: 'Hà Nội',
    district: '',
    petTypes: [],
    phone: '',
    email: user?.email || '',
    website: '',
    tags: '',
  });

  const categories = [
    { value: 'grooming', label: '💇 Spa & Grooming' },
    { value: 'hotel', label: '🏨 Khách sạn thú cưng' },
    { value: 'clinic', label: '🏥 Phòng khám' },
    { value: 'training', label: '🎓 Huấn luyện' },
    { value: 'daycare', label: '🌅 Dịch vụ giữ ngày' },
    { value: 'walking', label: '🚶 Dạo bộ thú cưng' },
    { value: 'other', label: '⭐ Khác' },
  ];

  const petTypesList = ['dog', 'cat', 'bird', 'rabbit', 'other'];
  const petTypeLabels = {
    dog: '🐕 Chó',
    cat: '🐱 Mèo',
    bird: '🦜 Chim',
    rabbit: '🐰 Thỏ',
    other: '⭐ Khác',
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('Tối đa 5 ảnh');
      return;
    }

    setImages([...images, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    setError(null);
  };

  // Remove image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'petTypes') {
        setFormData((prev) => ({
          ...prev,
          petTypes: checked
            ? [...prev.petTypes, value]
            : prev.petTypes.filter((p) => p !== value),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên dịch vụ');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Vui lòng nhập mô tả dịch vụ');
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setError('Vui lòng nhập giá hợp lệ');
      return false;
    }
    if (!formData.duration || formData.duration < 15) {
      setError('Thời lượng phải ít nhất 15 phút');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Vui lòng nhập địa chỉ');
      return false;
    }
    if (!formData.city.trim()) {
      setError('Vui lòng nhập thành phố');
      return false;
    }
    if (images.length === 0) {
      setError('Vui lòng chọn ít nhất 1 ảnh');
      return false;
    }
    return true;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const response = await serviceService.createService(
        {
          ...formData,
          tags: tagsArray,
        },
        images
      );

      if (response.success) {
        alert('✅ Tạo dịch vụ thành công!');
        navigate('/provider/dashboard', { state: { activeTab: 'services' } });
      } else {
        setError(response.message || 'Lỗi khi tạo dịch vụ');
      }
    } catch (err) {
      setError(err.message || 'Lỗi hệ thống. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              ← Quay lại
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              ➕ Thêm dịch vụ mới
            </h1>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-lg p-8 space-y-6"
          >
            {/* Basic Info */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📋 Thông tin cơ bản
              </h2>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên dịch vụ *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="VD: Tắm & cắt lông chuyên nghiệp"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Danh mục *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả dịch vụ *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết về dịch vụ của bạn..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá (VND) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="100000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Thời lượng (phút) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="60"
                    min="15"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📍 Thông tin địa chỉ
              </h2>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="VD: 123 Đường Lê Lợi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* City & District */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Thành phố *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Hà Nội"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Trung Hòa, Cầu Giấy"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Latitude & Longitude */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vĩ độ (Latitude)
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    step="0.00001"
                    placeholder="21.0285"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kinh độ (Longitude)
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    step="0.00001"
                    placeholder="105.8542"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Pet Types */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🐾 Loại thú cưng được chăm sóc
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {petTypesList.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="petTypes"
                      value={type}
                      checked={formData.petTypes.includes(type)}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-teal-500 rounded"
                    />
                    <span className="text-gray-700">{petTypeLabels[type]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📞 Thông tin liên hệ
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0912345678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📸 Hình ảnh dịch vụ (Tối đa 5 ảnh) *
              </h2>

              {/* Image preview */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              {images.length < 5 && (
                <div className="mb-4">
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50">
                      <div className="text-4xl mb-2">📤</div>
                      <p className="text-gray-700 font-semibold">
                        Chọn ảnh ({images.length}/5)
                      </p>
                      <p className="text-gray-500 text-sm">
                        Tối đa 5 ảnh, JPEG/PNG
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <p className="text-sm text-gray-500">
                💡 Ảnh chất lượng cao sẽ giúp thu hút khách hàng
              </p>
            </div>

            {/* Tags */}
            <div className="pb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🏷️ Tags (Tùy chọn)
              </h2>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="VD: chuyên nghiệp, nhanh, sạch sẽ (cách nhau bằng dấu phẩy)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-6 bg-teal-500 text-white font-semibold rounded-lg transition ${
                  loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-teal-600'
                }`}
              >
                {loading ? '⏳ Đang tạo...' : '✅ Tạo dịch vụ'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 px-6 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition"
              >
                ❌ Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddServicePage;
