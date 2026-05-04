import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common';
import Footer from '../../components/common/Footer';
import productService from '../../services/productService';
import { useAuth } from '../../hooks/useAuth';

const ManageProductsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Fetch seller's products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Get all products and filter by seller
        const response = await productService.getProducts({});
        const sellerProducts = response.data.filter(
          (p) => p.seller?._id === user?._id || p.seller === user?._id
        );
        setProducts(sellerProducts);
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
        setMessage('❌ Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProducts();
  }, [user]);

  // Delete product
  const handleDelete = async (productId) => {
    if (window.confirm('⚠️ Bạn chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.deleteProduct(productId);
        setProducts(products.filter((p) => p._id !== productId));
        setMessage('✅ Xóa sản phẩm thành công');
      } catch (error) {
        setMessage('❌ Lỗi khi xóa sản phẩm');
      }
    }
  };

  // Start edit
  const startEdit = (product) => {
    setEditingId(product._id);
    setEditData(product);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Save edit
  const saveEdit = async () => {
    try {
      const response = await productService.updateProduct(editingId, editData);
      setProducts(
        products.map((p) => (p._id === editingId ? response.data : p))
      );
      setEditingId(null);
      setMessage('✅ Cập nhật sản phẩm thành công');
    } catch (error) {
      setMessage('❌ Lỗi khi cập nhật sản phẩm');
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#1a7a6e',
                marginBottom: '0.5rem',
              }}
            >
              📦 Quản lý sản phẩm
            </h1>
            <p style={{ color: '#888', fontSize: '0.95rem' }}>
              Thêm, chỉnh sửa hoặc xóa sản phẩm của bạn trên PawShop
            </p>
          </div>
          <button
            onClick={() => navigate('/provider/products/new')}
            style={{
              background: '#1a7a6e',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ➕ Thêm sản phẩm mới
          </button>
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

        {/* Products Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>⏳ Đang tải sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <p
              style={{
                fontSize: '1.1rem',
                color: '#888',
                marginBottom: '1rem',
              }}
            >
              😢 Bạn chưa có sản phẩm nào
            </p>
            <button
              onClick={() => navigate('/provider/products/new')}
              style={{
                background: '#1a7a6e',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem 1.5rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ➕ Thêm sản phẩm đầu tiên
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1a7a6e', color: '#fff' }}>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: 700,
                    }}
                  >
                    Sản phẩm
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: 700,
                    }}
                  >
                    Danh mục
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: 700,
                    }}
                  >
                    Giá
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: 700,
                    }}
                  >
                    Tồn kho
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: 700,
                    }}
                  >
                    Rating
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontWeight: 700,
                    }}
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <React.Fragment key={product._id}>
                    <tr
                      style={{
                        background: idx % 2 === 0 ? '#fff' : '#f8faf9',
                        borderBottom: '1px solid #e0eeec',
                      }}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'center',
                          }}
                        >
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '50px',
                                height: '50px',
                                background: '#f0f5f4',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              📦
                            </div>
                          )}
                          <div>
                            <p
                              style={{
                                fontWeight: 600,
                                color: '#1a7a6e',
                                marginBottom: '0.25rem',
                              }}
                            >
                              {product.name}
                            </p>
                            <p style={{ fontSize: '0.8rem', color: '#888' }}>
                              SKU: {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: '#666' }}>
                        {product.category}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          textAlign: 'center',
                          fontWeight: 700,
                          color: '#e07b5a',
                        }}
                      >
                        ₫{product.price.toLocaleString()}
                        {product.discount > 0 && (
                          <div style={{ fontSize: '0.8rem', color: '#888' }}>
                            -{product.discount}%
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span
                          style={{
                            background:
                              product.stock > 0 ? '#e8f5e9' : '#fdecea',
                            color: product.stock > 0 ? '#2e7d32' : '#c62828',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                          }}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{ color: '#e6a020', fontWeight: 700 }}>
                          ⭐ {product.rating?.toFixed(1) || 0} (
                          {product.reviewCount || 0})
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => startEdit(product)}
                          style={{
                            background: '#4da898',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem 0.75rem',
                            marginRight: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                          }}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          style={{
                            background: '#e07b5a',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem 0.75rem',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                          }}
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>

                    {/* Edit Form - Row */}
                    {editingId === product._id && (
                      <tr
                        style={{
                          background: '#fff9f0',
                          borderBottom: '2px solid #1a7a6e',
                        }}
                      >
                        <td colSpan="6" style={{ padding: '1.5rem' }}>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(3, 1fr)',
                              gap: '1rem',
                              marginBottom: '1rem',
                            }}
                          >
                            <div>
                              <label
                                style={{
                                  fontSize: '0.85rem',
                                  fontWeight: 600,
                                  display: 'block',
                                  marginBottom: '0.35rem',
                                }}
                              >
                                Tên
                              </label>
                              <input
                                type="text"
                                value={editData.name || ''}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    name: e.target.value,
                                  })
                                }
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #d9eded',
                                  borderRadius: '6px',
                                  fontSize: '0.85rem',
                                  boxSizing: 'border-box',
                                }}
                              />
                            </div>
                            <div>
                              <label
                                style={{
                                  fontSize: '0.85rem',
                                  fontWeight: 600,
                                  display: 'block',
                                  marginBottom: '0.35rem',
                                }}
                              >
                                Giá
                              </label>
                              <input
                                type="number"
                                value={editData.price || ''}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    price: parseFloat(e.target.value),
                                  })
                                }
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #d9eded',
                                  borderRadius: '6px',
                                  fontSize: '0.85rem',
                                  boxSizing: 'border-box',
                                }}
                              />
                            </div>
                            <div>
                              <label
                                style={{
                                  fontSize: '0.85rem',
                                  fontWeight: 600,
                                  display: 'block',
                                  marginBottom: '0.35rem',
                                }}
                              >
                                Tồn kho
                              </label>
                              <input
                                type="number"
                                value={editData.stock || ''}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    stock: parseInt(e.target.value),
                                  })
                                }
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #d9eded',
                                  borderRadius: '6px',
                                  fontSize: '0.85rem',
                                  boxSizing: 'border-box',
                                }}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={saveEdit}
                              style={{
                                background: '#1a7a6e',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                              }}
                            >
                              💾 Lưu
                            </button>
                            <button
                              onClick={cancelEdit}
                              style={{
                                background: '#f0f5f4',
                                color: '#1a7a6e',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                              }}
                            >
                              ❌ Hủy
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ManageProductsPage;
