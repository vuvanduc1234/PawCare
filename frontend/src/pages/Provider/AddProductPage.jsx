import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common';
import Footer from '../../components/common/Footer';
import productService from '../../services/productService';
import { useAuth } from '../../hooks/useAuth';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: 0,
    category: 'food',
    petTypes: ['dog', 'cat'],
    stock: '',
    sku: '',
    tags: '',
  });

  const CATEGORIES = [
    { value: 'food', label: '🍖 Thức ăn' },
    { value: 'toys', label: '🧸 Đồ chơi' },
    { value: 'accessories', label: '✨ Phụ kiện' },
    { value: 'grooming', label: '✂️ Chăm sóc' },
    { value: 'healthcare', label: '💊 Sức khỏe' },
    { value: 'bedding', label: '🏠 Giường/nhà' },
    { value: 'training', label: '🎯 Huấn luyện' },
  ];

  const PET_TYPES = [
    { value: 'dog', label: '🐕 Chó' },
    { value: 'cat', label: '🐱 Mèo' },
    { value: 'bird', label: '🐦 Chim' },
    { value: 'rabbit', label: '🐰 Thỏ' },
    { value: 'hamster', label: '🐹 Chuột Hamster' },
    { value: 'fish', label: '🐠 Cá' },
    { value: 'other', label: '🦎 Khác' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePetTypeChange = (petType) => {
    setFormData((prev) => ({
      ...prev,
      petTypes: prev.petTypes.includes(petType)
        ? prev.petTypes.filter((t) => t !== petType)
        : [...prev.petTypes, petType],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.stock
    ) {
      setMessage('❌ Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setLoading(true);
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount),
        stock: parseInt(formData.stock),
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t),
      };

      const response = await productService.createProduct(productData);

      if (response.success) {
        setMessage('✅ Thêm sản phẩm thành công!');
        setTimeout(() => {
          navigate('/provider/products');
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      setMessage(`❌ Lỗi: ${error.message || 'Không thể thêm sản phẩm'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'provider') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p>❌ Bạn phải là Seller để truy cập trang này</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf9' }}>
      <Header />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/provider/products')}
            style={{
              background: 'none',
              border: 'none',
              color: '#1a7a6e',
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '1rem',
              fontWeight: 600,
            }}
          >
            ← Quay lại
          </button>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#1a7a6e',
              marginBottom: '0.5rem',
            }}
          >
            ➕ Thêm sản phẩm mới
          </h1>
          <p style={{ color: '#888', fontSize: '0.95rem' }}>
            Tạo sản phẩm để bán trên PawShop
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            style={{
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              background: message.includes('✅') ? '#e8f5e9' : '#fdecea',
              color: message.includes('✅') ? '#2e7d32' : '#c62828',
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            {/* Thông tin cơ bản */}
            <h2
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#1a7a6e',
                marginBottom: '1.5rem',
              }}
            >
              📋 Thông tin cơ bản
            </h2>

            {/* Name */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#333',
                }}
              >
                Tên sản phẩm *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="VD: Cám chó dinh dưỡng cao..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1.5px solid #d9eded',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  fontFamily: 'Nunito, sans-serif',
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#333',
                }}
              >
                Mô tả sản phẩm *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả chi tiết về sản phẩm..."
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1.5px solid #d9eded',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  fontFamily: 'Nunito, sans-serif',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Price & Discount */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    color: '#333',
                  }}
                >
                  Giá (₫) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="50000"
                  min="0"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #d9eded',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    color: '#333',
                  }}
                >
                  Giảm giá (%) - Tùy chọn
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #d9eded',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Category & Stock */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    color: '#333',
                  }}
                >
                  Danh mục *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #d9eded',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    color: '#333',
                  }}
                >
                  Tồn kho (số lượng) *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="100"
                  min="0"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #d9eded',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* SKU */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#333',
                }}
              >
                SKU (Mã sản phẩm) - Tùy chọn
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="SKU-001"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1.5px solid #d9eded',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                }}
              />
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#888',
                  marginTop: '0.25rem',
                }}
              >
                Để trống để tự động tạo
              </p>
            </div>

            {/* Pet Types */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  color: '#333',
                }}
              >
                🐾 Loại thú cưng phù hợp
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                }}
              >
                {PET_TYPES.map((pet) => (
                  <label
                    key={pet.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      background: '#f8faf9',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: formData.petTypes.includes(pet.value)
                        ? '1.5px solid #1a7a6e'
                        : '1.5px solid #e0eeec',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.petTypes.includes(pet.value)}
                      onChange={() => handlePetTypeChange(pet.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>{pet.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#333',
                }}
              >
                Thẻ (Tags) - Tùy chọn
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="chất lượng cao, hữu cơ, ... (cách nhau bằng dấu phẩy)"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1.5px solid #d9eded',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  background: '#1a7a6e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? '⏳ Đang xử lý...' : '✅ Thêm sản phẩm'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/provider/products')}
                style={{
                  flex: 1,
                  background: '#f0f5f4',
                  color: '#1a7a6e',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                ❌ Hủy
              </button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AddProductPage;
