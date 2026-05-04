import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common';
import Footer from '../components/common/Footer';
import { productService } from '../services/productService';
import { useAuth } from '../hooks/useAuth';

const PawShopPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPetType, setSelectedPetType] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('pawshop_cart')) || []
  );
  const [showCart, setShowCart] = useState(false);

  const CATEGORIES = [
    { value: '', label: 'Tất cả danh mục' },
    { value: 'food', label: '🍖 Thức ăn' },
    { value: 'toys', label: '🧸 Đồ chơi' },
    { value: 'accessories', label: '✨ Phụ kiện' },
    { value: 'grooming', label: '✂️ Chăm sóc' },
    { value: 'healthcare', label: '💊 Sức khỏe' },
    { value: 'bedding', label: '🏠 Giường/nhà' },
    { value: 'training', label: '🎯 Huấn luyện' },
  ];

  const PET_TYPES = [
    { value: '', label: 'Tất cả' },
    { value: 'dog', label: '🐕 Chó' },
    { value: 'cat', label: '🐱 Mèo' },
    { value: 'bird', label: '🐦 Chim' },
    { value: 'rabbit', label: '🐰 Thỏ' },
  ];

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          search: search || undefined,
          category: selectedCategory || undefined,
          petType: selectedPetType || undefined,
          sort,
          page,
          limit: 12,
        });
        setProducts(response.data || []);
        setTotalPages(response.pagination?.pages || 1);
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, selectedCategory, selectedPetType, sort, page]);

  // Add to cart
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    let newCart;

    if (existingItem) {
      newCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(newCart);
    localStorage.setItem('pawshop_cart', JSON.stringify(newCart));
    alert('✅ Đã thêm vào giỏ hàng!');
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item._id !== productId);
    setCart(newCart);
    localStorage.setItem('pawshop_cart', JSON.stringify(newCart));
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem('pawshop_cart', JSON.stringify(newCart));
  };

  // Calculate totals
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.price - (item.price * item.discount) / 100;
    return sum + price * item.quantity;
  }, 0);
  const cartTax = cartSubtotal * 0.1;
  const cartTotal = cartSubtotal + cartTax;

  // Checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('❌ Giỏ hàng trống');
      return;
    }
    if (!user) {
      navigate('/login');
      return;
    }
    // TODO: Redirect to checkout page
    navigate('/checkout', { state: { cart, total: cartTotal } });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf9' }}>
      <Header />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Hero Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a7a6e 0%, #4da898 100%)',
            color: '#fff',
            borderRadius: '20px',
            padding: '3rem',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
            }}
          >
            🛍️ PawShop
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Những sản phẩm chất lượng tốt nhất cho thú cưng của bạn
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Sidebar - Filters */}
          <aside style={{ width: '250px', flexShrink: 0 }}>
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  color: '#1a7a6e',
                }}
              >
                🔍 Bộ lọc
              </h3>

              {/* Search */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#666',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  Tìm kiếm
                </label>
                <input
                  type="text"
                  placeholder="Tên sản phẩm..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #e0eeec',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Category */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#666',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  Danh mục
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #e0eeec',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
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

              {/* Pet Type */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#666',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  Loại thú cưng
                </label>
                <select
                  value={selectedPetType}
                  onChange={(e) => {
                    setSelectedPetType(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #e0eeec',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                >
                  {PET_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#666',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  Sắp xếp
                </label>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #e0eeec',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="-createdAt">Mới nhất</option>
                  <option value="price">Giá: Thấp → Cao</option>
                  <option value="-price">Giá: Cao → Thấp</option>
                  <option value="-rating">Rating cao nhất</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main style={{ flex: 1 }}>
            {/* Products Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p>⏳ Đang tải sản phẩm...</p>
              </div>
            ) : products.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem',
                  background: '#fff',
                  borderRadius: '16px',
                }}
              >
                <p>😢 Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                  }}
                >
                  {products.map((product) => (
                    <div
                      key={product._id}
                      style={{
                        background: '#fff',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 24px rgba(0,0,0,0.12)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0 2px 12px rgba(0,0,0,0.06)';
                      }}
                    >
                      {/* Product Image */}
                      <div
                        style={{
                          aspectRatio: '1',
                          background: '#f0f5f4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        {product.images?.length > 0 ? (
                          <img
                            src={product.images[0]?.url}
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: '3rem' }}>📦</span>
                        )}
                        {product.discount > 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: '#e07b5a',
                              color: '#fff',
                              borderRadius: '50%',
                              width: '48px',
                              height: '48px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                            }}
                          >
                            -{product.discount}%
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div style={{ padding: '1rem' }}>
                        <h3
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: '#1a7a6e',
                            marginBottom: '0.5rem',
                            lineHeight: 1.3,
                          }}
                        >
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.75rem',
                            fontSize: '0.8rem',
                          }}
                        >
                          <span>⭐ {product.rating?.toFixed(1) || 0}</span>
                          <span style={{ color: '#888' }}>
                            ({product.reviewCount || 0})
                          </span>
                        </div>

                        {/* Price */}
                        <div style={{ marginBottom: '0.75rem' }}>
                          <span
                            style={{
                              fontSize: '1rem',
                              fontWeight: 800,
                              color: '#e07b5a',
                            }}
                          >
                            ₫
                            {(
                              product.price -
                              (product.price * product.discount) / 100
                            ).toLocaleString()}
                          </span>
                          {product.discount > 0 && (
                            <span
                              style={{
                                fontSize: '0.8rem',
                                color: '#888',
                                textDecoration: 'line-through',
                                marginLeft: '0.5rem',
                              }}
                            >
                              ₫{product.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: product.stock > 0 ? '#4da898' : '#e07b5a',
                            marginBottom: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {product.stock > 0
                            ? `✅ Còn ${product.stock} sản phẩm`
                            : '❌ Hết hàng'}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => navigate(`/shop/${product._id}`)}
                            style={{
                              flex: 1,
                              background: '#f0f5f4',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '0.6rem',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              color: '#1a7a6e',
                              cursor: 'pointer',
                            }}
                          >
                            👁️ Xem
                          </button>
                          <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            style={{
                              flex: 1,
                              background:
                                product.stock === 0 ? '#ccc' : '#1a7a6e',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '0.6rem',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor:
                                product.stock === 0 ? 'not-allowed' : 'pointer',
                            }}
                          >
                            🛒 Thêm
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginBottom: '2rem',
                    }}
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: page === p ? '#1a7a6e' : '#fff',
                            color: page === p ? '#fff' : '#1a7a6e',
                            border: '1.5px solid #1a7a6e',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </main>

          {/* Shopping Cart Sidebar */}
          <aside style={{ width: '300px', flexShrink: 0 }}>
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                position: 'sticky',
                top: '100px',
              }}
            >
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  color: '#1a7a6e',
                }}
              >
                🛒 Giỏ hàng ({cart.length})
              </h3>

              {cart.length === 0 ? (
                <p
                  style={{
                    color: '#888',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                  }}
                >
                  Giỏ hàng trống
                </p>
              ) : (
                <>
                  <div
                    style={{
                      maxHeight: '300px',
                      overflowY: 'auto',
                      marginBottom: '1rem',
                      paddingRight: '0.5rem',
                    }}
                  >
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        style={{
                          display: 'flex',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          background: '#f8faf9',
                          borderRadius: '8px',
                          marginBottom: '0.75rem',
                          fontSize: '0.85rem',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              fontWeight: 600,
                              color: '#1a7a6e',
                              marginBottom: '0.25rem',
                            }}
                          >
                            {item.name}
                          </p>
                          <p style={{ color: '#888', marginBottom: '0.5rem' }}>
                            ₫
                            {(
                              item.price -
                              (item.price * item.discount) / 100
                            ).toLocaleString()}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                          >
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              style={{
                                width: '24px',
                                height: '24px',
                                border: '1px solid #e0eeec',
                                background: '#fff',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              −
                            </button>
                            <span
                              style={{ width: '20px', textAlign: 'center' }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              style={{
                                width: '24px',
                                height: '24px',
                                border: '1px solid #e0eeec',
                                background: '#fff',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              style={{
                                marginLeft: 'auto',
                                background: '#fdecea',
                                color: '#c62828',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0.25rem 0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                              }}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      borderTop: '1.5px solid #f0f5f4',
                      paddingTop: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                      }}
                    >
                      <span>Tạm tính:</span>
                      <span>₫{cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        color: '#888',
                      }}
                    >
                      <span>VAT (10%):</span>
                      <span>₫{cartTax.toLocaleString()}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        color: '#e07b5a',
                      }}
                    >
                      <span>Tổng cộng:</span>
                      <span>₫{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    style={{
                      width: '100%',
                      background: '#1a7a6e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    💳 Thanh toán
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PawShopPage;
