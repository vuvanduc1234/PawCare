import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import serviceService from '../../services/serviceService';

/**
 * ServiceSearchPage: Halaman tìm kiếm và hiển thị danh sách dịch vụ
 * URL: /services
 * Features: Filter theo loại dịch vụ, giá, khoảng cách, đánh giá
 */
const ServiceSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  // Form state
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceMin: parseInt(searchParams.get('priceMin')) || 0,
    priceMax: parseInt(searchParams.get('priceMax')) || 5000000,
    rating: parseFloat(searchParams.get('rating')) || 0,
    lat: parseFloat(searchParams.get('lat')) || 20.8272, // Default Hà Nội
    lng: parseFloat(searchParams.get('lng')) || 106.7529,
    radius: parseInt(searchParams.get('radius')) || 10,
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    sortBy: searchParams.get('sortBy') || 'distance', // distance, price, rating
  });

  const [showFilters, setShowFilters] = useState(false);

  // Service categories
  const categories = [
    { value: '', label: 'Tất cả dịch vụ' },
    { value: 'spa', label: '🛁 Spa / Grooming' },
    { value: 'clinic', label: '🏥 Phòng khám' },
    { value: 'hotel', label: '🏨 Khách sạn thú cưng' },
    { value: 'grooming', label: '✂️ Cắt tỉa' },
  ];

  // Fetch services
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [filters]);

  // Update URL when filters change
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

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  // Handle navigate to detail
  const handleServiceClick = (serviceId) => {
    navigate(`/services/${serviceId}`);
  };

  // Render rating stars
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={
            i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
          }
        >
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  // Format currency VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="service-search-page min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto p-4 max-w-7xl">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition text-sm"
            >
              ← Quay lại
            </button>
            <h1 className="text-3xl font-bold">🐾 Tìm kiếm dịch vụ</h1>
          </div>
          <p className="text-gray-600">
            Khám phá các dịch vụ chất lượng cho pet yêu của bạn
          </p>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div
            className={`${showFilters ? 'block' : 'hidden'} md:block md:w-64 flex-shrink-0`}
          >
            <div className="bg-white p-4 rounded shadow sticky top-4">
              <div className="flex justify-between items-center mb-4 md:block">
                <h2 className="text-lg font-semibold">🔍 Bộ lọc</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden text-gray-500"
                >
                  ✕
                </button>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">Loại dịch vụ</label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange('category', e.target.value)
                  }
                  className="input-field w-full"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">
                  💰 Khoảng giá
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Giá tối thiểu"
                    value={filters.priceMin}
                    onChange={(e) =>
                      handleFilterChange('priceMin', parseInt(e.target.value))
                    }
                    className="input-field w-full text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Giá tối đa"
                    value={filters.priceMax}
                    onChange={(e) =>
                      handleFilterChange('priceMax', parseInt(e.target.value))
                    }
                    className="input-field w-full text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    {formatPrice(filters.priceMin)} -{' '}
                    {formatPrice(filters.priceMax)}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">
                  ⭐ Đánh giá tối thiểu
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) =>
                    handleFilterChange('rating', parseFloat(e.target.value))
                  }
                  className="input-field w-full"
                >
                  <option value={0}>Tất cả</option>
                  <option value={1}>1+</option>
                  <option value={2}>2+</option>
                  <option value={3}>3+</option>
                  <option value={4}>4+</option>
                  <option value={5}>5 sao</option>
                </select>
              </div>

              {/* Radius / Distance */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">
                  📍 Bán kính tìm kiếm: {filters.radius} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={filters.radius}
                  onChange={(e) =>
                    handleFilterChange('radius', parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">📊 Sắp xếp</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="distance">Gần nhất</option>
                  <option value="price_asc">Giá: Thấp → Cao</option>
                  <option value="price_desc">Giá: Cao → Thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>

              {/* Reset Button */}
              <button
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
                className="btn-secondary w-full"
              >
                🔄 Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn-secondary mb-4 w-full"
            >
              🔍 Mở bộ lọc
            </button>

            {/* Results Header */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Tìm thấy <span className="font-semibold">{totalResults}</span>{' '}
                dịch vụ
              </p>
              <p className="text-sm text-gray-500">Trang {filters.page}</p>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin text-4xl mb-2">⏳</div>
                <p>Đang tải dịch vụ...</p>
              </div>
            ) : services.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      onClick={() => handleServiceClick(service._id)}
                      className="bg-white rounded shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                    >
                      {/* Service Image */}
                      {service.images && service.images.length > 0 && (
                        <div className="h-40 bg-gray-200 overflow-hidden">
                          <img
                            src={service.images[0]?.url || service.images[0]}
                            alt={service.name}
                            className="w-full h-full object-cover hover:scale-110 transition"
                          />
                        </div>
                      )}

                      {/* Service Info */}
                      <div className="p-4">
                        {/* Category Badge */}
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {service.category}
                          </span>
                        </div>

                        {/* Service Name */}
                        <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                          {service.name}
                        </h3>

                        {/* Provider */}
                        <p className="text-sm text-gray-600 mb-2">
                          👤 {service.provider?.firstName || 'Nhà cung cấp'}
                        </p>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {service.description}
                        </p>

                        {/* Rating and Reviews */}
                        <div className="mb-3">
                          {renderRating(service.rating)}
                          <p className="text-xs text-gray-500 mt-1">
                            ⭐ {service.rating.toFixed(1)} (
                            {service.reviewCount || 0} đánh giá)
                          </p>
                        </div>

                        {/* Address */}
                        <p className="text-xs text-gray-600 mb-3 line-clamp-1">
                          📍 {service.address}
                        </p>

                        {/* Price and Duration */}
                        <div className="flex justify-between items-center pt-3 border-t">
                          <div>
                            <p className="text-lg font-bold text-blue-600">
                              {formatPrice(service.price)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {service.duration} phút
                            </p>
                          </div>
                          <button
                            onClick={() => handleServiceClick(service._id)}
                            className="btn-primary text-sm"
                          >
                            Chi tiết →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() =>
                      handleFilterChange('page', Math.max(1, filters.page - 1))
                    }
                    disabled={filters.page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    ← Trang trước
                  </button>
                  <span className="px-4 py-2 text-center">
                    Trang {filters.page}
                  </span>
                  <button
                    onClick={() => handleFilterChange('page', filters.page + 1)}
                    disabled={services.length < filters.limit}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Trang sau →
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded">
                <p className="text-xl text-gray-500 mb-4">
                  😞 Không tìm thấy dịch vụ nào
                </p>
                <p className="text-gray-600 mb-4">
                  Thử thay đổi bộ lọc hoặc quay lại sau để có thêm dịch vụ
                </p>
                <button
                  onClick={() => setShowFilters(true)}
                  className="btn-primary"
                >
                  🔍 Đổi bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSearchPage;
