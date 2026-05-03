import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import serviceService from '../../services/serviceService';
import { Header } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';

const ServiceSearchPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceMin: parseInt(searchParams.get('priceMin')) || 0,
    priceMax: parseInt(searchParams.get('priceMax')) || 5000000,
    rating: parseFloat(searchParams.get('rating')) || 0,
    lat: parseFloat(searchParams.get('lat')) || 20.8272,
    lng: parseFloat(searchParams.get('lng')) || 106.7529,
    radius: parseInt(searchParams.get('radius')) || 10,
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    sortBy: searchParams.get('sortBy') || 'distance',
  });

  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: '', label: 'Tất cả dịch vụ' },
    { value: 'spa', label: '🛁 Spa / Grooming' },
    { value: 'clinic', label: '🏥 Phòng khám' },
    { value: 'hotel', label: '🏨 Khách sạn thú cưng' },
    { value: 'grooming', label: '✂️ Cắt tỉa' },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await serviceService.searchServices(filters);
        setServices(response.data || []);
        setTotalResults(response.total || 0);
      } catch (err) {
        setError('Không thể tải danh sách dịch vụ. ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [filters]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.priceMin) params.set('priceMin', filters.priceMin);
    if (filters.priceMax) params.set('priceMax', filters.priceMax);
    if (filters.rating) params.set('rating', filters.rating);
    params.set('lat', filters.lat);
    params.set('lng', filters.lng);
    params.set('radius', filters.radius);
    if (filters.page > 1) params.set('page', filters.page);
    if (filters.sortBy !== 'distance') params.set('sortBy', filters.sortBy);
    setSearchParams(params);
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handleServiceClick = (serviceId) => navigate(`/services/${serviceId}`);

  const renderRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          style={{ color: i < Math.round(rating) ? '#f59e0b' : '#d1d5db' }}
        >
          ★
        </span>
      );
    }
    return <div style={{ display: 'flex' }}>{stars}</div>;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf9' }}>
      <Header />

      <style>{`
        .search-filter-panel {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          padding: 20px;
          position: sticky;
          top: 20px;
        }
        .filter-section { margin-bottom: 20px; }
        .filter-label { font-size: 0.82rem; font-weight: 700; color: var(--teal-dark); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
        .filter-select { width: 100%; border: 1.5px solid #d9eded; border-radius: 10px; padding: 9px 12px; font-size: 0.83rem; color: var(--text-mid); outline: none; background: #f8faf9; font-family: Nunito, sans-serif; }
        .filter-input { width: 100%; border: 1.5px solid #d9eded; border-radius: 10px; padding: 8px 12px; font-size: 0.83rem; color: var(--text-mid); outline: none; background: #f8faf9; font-family: Nunito, sans-serif; margin-bottom: 6px; }
        .filter-input:focus, .filter-select:focus { border-color: var(--teal); }
        .service-card { background: #fff; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; cursor: pointer; transition: all 0.2s; border: 1.5px solid transparent; }
        .service-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.1); border-color: var(--teal-pale); }
        .service-img { height: 160px; background: var(--teal-pale); overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
        .category-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; background: var(--teal-pale); color: var(--teal); }
        .reset-btn { width: 100%; background: #f0f5f4; color: var(--teal-dark); border: none; border-radius: 10px; padding: 10px; font-size: 0.83rem; font-weight: 700; cursor: pointer; font-family: Nunito, sans-serif; transition: background 0.2s; }
        .reset-btn:hover { background: var(--teal-pale); }
        .add-pet-banner { background: linear-gradient(135deg, var(--teal) 0%, #4da898 100%); border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
      `}</style>

      {/* Page Header */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #e0eeec',
          padding: '16px 0',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'var(--teal-pale)',
                color: 'var(--teal)',
                border: 'none',
                borderRadius: '10px',
                padding: '7px 14px',
                fontSize: '0.83rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ← Quay lại
            </button>
            <div>
              <h1
                style={{
                  fontFamily: 'Quicksand, sans-serif',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: 'var(--teal-dark)',
                }}
              >
                🐾 Tìm kiếm dịch vụ
              </h1>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                Khám phá các dịch vụ chất lượng cho pet yêu của bạn
              </p>
            </div>
          </div>
          {/* Add pet button for user role */}
          {isAuthenticated && user?.role === 'user' && (
            <Link
              to="/pets"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--coral)',
                color: '#fff',
                borderRadius: '12px',
                padding: '9px 18px',
                fontSize: '0.83rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(224,112,85,0.3)',
              }}
            >
              🐾 Thú cưng của tôi
            </Link>
          )}
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '24px',
          display: 'flex',
          gap: 24,
          alignItems: 'flex-start',
        }}
      >
        {/* Sidebar */}
        <div
          className={`${showFilters ? '' : 'hidden'} md:block`}
          style={{ width: 240, flexShrink: 0 }}
        >
          <div className="search-filter-panel">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontFamily: 'Quicksand, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--teal-dark)',
                }}
              >
                🔍 Bộ lọc
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="md:hidden"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  color: 'var(--text-light)',
                }}
              >
                ✕
              </button>
            </div>

            <div className="filter-section">
              <div className="filter-label">Loại dịch vụ</div>
              <select
                className="filter-select"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <div className="filter-label">💰 Khoảng giá</div>
              <input
                className="filter-input"
                type="number"
                placeholder="Giá tối thiểu"
                value={filters.priceMin}
                onChange={(e) =>
                  handleFilterChange('priceMin', parseInt(e.target.value))
                }
              />
              <input
                className="filter-input"
                type="number"
                placeholder="Giá tối đa"
                value={filters.priceMax}
                onChange={(e) =>
                  handleFilterChange('priceMax', parseInt(e.target.value))
                }
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                0 đ - {formatPrice(filters.priceMax)}
              </p>
            </div>

            <div className="filter-section">
              <div className="filter-label">⭐ Đánh giá tối thiểu</div>
              <select
                className="filter-select"
                value={filters.rating}
                onChange={(e) =>
                  handleFilterChange('rating', parseFloat(e.target.value))
                }
              >
                <option value={0}>Tất cả</option>
                <option value={3}>3+ sao</option>
                <option value={4}>4+ sao</option>
                <option value={4.5}>4.5+ sao</option>
              </select>
            </div>

            <div className="filter-section">
              <div className="filter-label">
                📍 Bán kính tìm kiếm: {filters.radius} km
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={filters.radius}
                onChange={(e) =>
                  handleFilterChange('radius', parseInt(e.target.value))
                }
                style={{ width: '100%', accentColor: 'var(--teal)' }}
              />
            </div>

            <div className="filter-section">
              <div className="filter-label">📊 Sắp xếp</div>
              <select
                className="filter-select"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="distance">Gần nhất</option>
                <option value="price_asc">Giá: Thấp → Cao</option>
                <option value="price_desc">Giá: Cao → Thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>

            <button
              className="reset-btn"
              onClick={() =>
                setFilters({
                  category: '',
                  priceMin: 0,
                  priceMax: 5000000,
                  rating: 0,
                  lat: 20.8272,
                  lng: 106.7529,
                  radius: 10,
                  page: 1,
                  limit: 12,
                  sortBy: 'distance',
                })
              }
            >
              🔄 Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Add pet banner for user */}
          {isAuthenticated && user?.role === 'user' && (
            <div className="add-pet-banner">
              <div>
                <p
                  style={{
                    color: '#fff',
                    fontFamily: 'Quicksand, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    marginBottom: '3px',
                  }}
                >
                  🐾 Thêm thú cưng để đặt lịch nhanh hơn!
                </p>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.78rem',
                  }}
                >
                  Quản lý thú cưng và lịch sử chăm sóc của bé
                </p>
              </div>
              <Link
                to="/pets"
                style={{
                  background: '#fff',
                  color: 'var(--teal)',
                  borderRadius: '10px',
                  padding: '8px 18px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                + Thêm thú cưng
              </Link>
            </div>
          )}

          {/* Mobile filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
            style={{
              width: '100%',
              background: 'var(--teal)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '11px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              marginBottom: 16,
            }}
          >
            🔍 {showFilters ? 'Ẩn bộ lọc' : 'Mở bộ lọc'}
          </button>

          {/* Results header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-mid)',
                fontWeight: 600,
              }}
            >
              Tìm thấy{' '}
              <span style={{ color: 'var(--teal)', fontWeight: 800 }}>
                {totalResults}
              </span>{' '}
              dịch vụ
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
              Trang {filters.page}
            </p>
          </div>

          {error && (
            <div
              style={{
                background: '#fdecea',
                color: '#c62828',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: 16,
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div
                style={{
                  fontSize: '3rem',
                  animation: 'spin 1s linear infinite',
                }}
              >
                🐾
              </div>
              <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>
                Đang tải dịch vụ...
              </p>
            </div>
          ) : services.length > 0 ? (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="service-card"
                    onClick={() => handleServiceClick(service._id)}
                  >
                    <div className="service-img">
                      {service.images?.length > 0 ? (
                        <img
                          src={service.images[0]?.url || service.images[0]}
                          alt={service.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <span>🐾</span>
                      )}
                    </div>
                    <div style={{ padding: '14px' }}>
                      <div style={{ marginBottom: 8 }}>
                        <span className="category-badge">
                          {service.category}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: 'var(--teal-dark)',
                          marginBottom: 6,
                          lineHeight: 1.3,
                        }}
                        className="line-clamp-2"
                      >
                        {service.name}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-light)',
                          marginBottom: 6,
                        }}
                      >
                        👤 {service.provider?.firstName || 'Nhà cung cấp'}
                      </p>
                      <p
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-mid)',
                          marginBottom: 8,
                          lineHeight: 1.5,
                        }}
                        className="line-clamp-2"
                      >
                        {service.description}
                      </p>
                      <div style={{ marginBottom: 6 }}>
                        {renderRating(service.rating)}
                        <p
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-light)',
                          }}
                        >
                          ⭐ {service.rating?.toFixed(1)} (
                          {service.reviewCount || 0} đánh giá)
                        </p>
                      </div>
                      <p
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-light)',
                          marginBottom: 10,
                        }}
                        className="line-clamp-1"
                      >
                        📍 {service.address}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: 10,
                          borderTop: '1px solid #f0f5f4',
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: '1rem',
                              fontWeight: 800,
                              color: 'var(--coral)',
                            }}
                          >
                            {formatPrice(service.price)}
                          </p>
                          <p
                            style={{
                              fontSize: '0.72rem',
                              color: 'var(--text-light)',
                            }}
                          >
                            {service.duration} phút
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleServiceClick(service._id);
                          }}
                          style={{
                            background: 'var(--teal)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '7px 14px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Chi tiết →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <button
                  onClick={() =>
                    handleFilterChange('page', Math.max(1, filters.page - 1))
                  }
                  disabled={filters.page === 1}
                  style={{
                    background: filters.page === 1 ? '#f0f5f4' : 'var(--teal)',
                    color: filters.page === 1 ? 'var(--text-light)' : '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '9px 18px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: filters.page === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ← Trang trước
                </button>
                <span
                  style={{
                    padding: '9px 14px',
                    background: '#fff',
                    borderRadius: '10px',
                    fontWeight: 700,
                    color: 'var(--teal-dark)',
                    fontSize: '0.82rem',
                  }}
                >
                  Trang {filters.page}
                </span>
                <button
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                  disabled={services.length < filters.limit}
                  style={{
                    background:
                      services.length < filters.limit
                        ? '#f0f5f4'
                        : 'var(--teal)',
                    color:
                      services.length < filters.limit
                        ? 'var(--text-light)'
                        : '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '9px 18px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor:
                      services.length < filters.limit
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  Trang sau →
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 0',
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😞</div>
              <p
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--teal-dark)',
                  marginBottom: '0.5rem',
                }}
              >
                Không tìm thấy dịch vụ nào
              </p>
              <p
                style={{
                  color: 'var(--text-light)',
                  fontSize: '0.85rem',
                  marginBottom: '1.5rem',
                }}
              >
                Thử thay đổi bộ lọc hoặc quay lại sau
              </p>
              <button
                onClick={() => setShowFilters(true)}
                style={{
                  background: 'var(--teal)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 24px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🔍 Đổi bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceSearchPage;
