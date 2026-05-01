import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import serviceService from '../../services/serviceService';
import { useAuth } from '../../hooks/useAuth';

/**
 * ProviderDashboardPage: Bảng điều khiển quản lý cho provider
 * URL: /provider/dashboard
 * Features: Lịch đặt, quản lý dịch vụ, thống kê
 */
const ProviderDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || 'bookings'
  );
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    averageRating: 0,
    totalRevenue: 0,
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'provider') {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch bookings
        let bookingsRes;
        try {
          bookingsRes = await bookingService.getProviderBookings();
        } catch (e) {
          bookingsRes = { data: [] };
        }
        setBookings(bookingsRes.data || []);

        // Fetch services
        const servicesRes = await serviceService.getProviderServices(
          user._id || user.id
        );
        setServices(servicesRes.data || []);

        // Calculate statistics
        const bookingsList = bookingsRes.data || [];
        const completedBookings = bookingsList.filter(
          (b) => b.status === 'done'
        );
        setStats({
          totalBookings: bookingsList.length,
          pendingBookings: bookingsList.filter((b) => b.status === 'pending')
            .length,
          confirmedBookings: bookingsList.filter(
            (b) => b.status === 'confirmed'
          ).length,
          completedBookings: completedBookings.length,
          averageRating:
            completedBookings.length > 0
              ? completedBookings.reduce(
                  (sum, b) => sum + (b.review?.rating || 0),
                  0
                ) / completedBookings.length
              : 0,
          totalRevenue: completedBookings.reduce(
            (sum, b) => sum + (b.totalAmount || 0),
            0
          ),
        });
      } catch (err) {
        setError('Lỗi khi tải dữ liệu: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  // Filter bookings by status
  const filteredBookings = statusFilter
    ? bookings.filter((b) => b.status === statusFilter)
    : bookings;

  // Handle confirm booking
  const handleConfirmBooking = async (bookingId) => {
    try {
      await bookingService.updateBookingStatus(bookingId, 'confirmed');
      setBookings(
        bookings.map((b) =>
          b._id === bookingId ? { ...b, status: 'confirmed' } : b
        )
      );
      alert('✅ Đã xác nhận lịch đặt!');
    } catch (err) {
      alert('❌ Lỗi: ' + err.message);
    }
  };

  // Handle reject booking
  const handleRejectBooking = async (bookingId) => {
    if (!window.confirm('Bạn chắc chắn muốn từ chối lịch đặt này?')) return;
    try {
      await bookingService.updateBookingStatus(bookingId, 'cancelled');
      setBookings(
        bookings.map((b) =>
          b._id === bookingId ? { ...b, status: 'cancelled' } : b
        )
      );
      alert('✅ Đã từ chối lịch đặt!');
    } catch (err) {
      alert('❌ Lỗi: ' + err.message);
    }
  };

  // Handle complete booking
  const handleCompleteBooking = async (bookingId) => {
    try {
      await bookingService.updateBookingStatus(bookingId, 'done');
      setBookings(
        bookings.map((b) =>
          b._id === bookingId ? { ...b, status: 'done' } : b
        )
      );
      alert('✅ Đã đánh dấu hoàn thành!');
    } catch (err) {
      alert('❌ Lỗi: ' + err.message);
    }
  };

  // Handle delete service
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Bạn chắc chắn muốn xoá dịch vụ này?')) return;
    try {
      await serviceService.deleteService(serviceId);
      setServices(services.filter((s) => s._id !== serviceId));
      alert('✅ Đã xoá dịch vụ!');
    } catch (err) {
      alert('❌ Lỗi: ' + err.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        label: '⏳ Chờ duyệt',
        class: 'bg-yellow-100 text-yellow-800',
      },
      confirmed: { label: '✓ Đã xác nhận', class: 'bg-blue-100 text-blue-800' },
      done: { label: '✅ Hoàn thành', class: 'bg-green-100 text-green-800' },
      cancelled: { label: '✕ Đã hủy', class: 'bg-red-100 text-red-800' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span
        className={`px-3 py-1 rounded text-sm font-semibold ${badge.class}`}
      >
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (!user || user.role !== 'provider') {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="mb-4">❌ Bạn không có quyền truy cập trang này</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              ← Quay lại
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              📊 Bảng điều khiển Provider
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-semibold">📅 Tổng lịch</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.totalBookings}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-semibold">⏳ Chờ duyệt</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {stats.pendingBookings}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-semibold">✅ Hoàn thành</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.completedBookings}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-semibold">
              ⭐ Đánh giá TB
            </p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.averageRating.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg shadow mb-6">
          <p className="text-sm opacity-90">
            💰 Doanh thu (từ các dịch vụ hoàn thành)
          </p>
          <p className="text-4xl font-bold mt-2">
            {formatPrice(stats.totalRevenue)}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 p-4 font-semibold text-center transition ${activeTab === 'bookings' ? 'border-b-4 border-teal-500 text-teal-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              📅 Lịch đặt ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 p-4 font-semibold text-center transition ${activeTab === 'services' ? 'border-b-4 border-teal-500 text-teal-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              🛍️ Dịch vụ ({services.length})
            </button>
          </div>

          {/* Content */}
          {activeTab === 'bookings' && (
            <div className="p-6">
              <div className="flex gap-2 mb-6">
                {['pending', 'confirmed', 'done', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg transition ${statusFilter === status ? 'bg-teal-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {status === 'pending' &&
                      `⏳ Chờ (${bookings.filter((b) => b.status === 'pending').length})`}
                    {status === 'confirmed' &&
                      `✓ Xác nhận (${bookings.filter((b) => b.status === 'confirmed').length})`}
                    {status === 'done' &&
                      `✅ Hoàn thành (${bookings.filter((b) => b.status === 'done').length})`}
                    {status === 'cancelled' &&
                      `✕ Hủy (${bookings.filter((b) => b.status === 'cancelled').length})`}
                  </button>
                ))}
              </div>

              {filteredBookings.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Không có lịch đặt nào
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border rounded-lg p-4 hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-lg">
                            📋 {booking.service?.name || 'Dịch vụ'}
                          </p>
                          <p className="text-gray-600 text-sm">
                            👤 {booking.user?.fullName || 'Khách hàng'}
                          </p>
                          <p className="text-gray-600 text-sm">
                            🐾 {booking.pet?.name || 'Thú cưng'}
                          </p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-sm text-gray-600">
                        <p>
                          📅{' '}
                          {booking.bookingDate
                            ? new Date(booking.bookingDate).toLocaleDateString(
                                'vi-VN'
                              )
                            : 'N/A'}
                        </p>
                        <p>🕐 {booking.startTime || 'N/A'}</p>
                        <p>💰 {formatPrice(booking.totalAmount || 0)}</p>
                        <p>⏱️ {booking.service?.duration || 'N/A'} phút</p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirmBooking(booking._id)}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            >
                              ✓ Xác nhận
                            </button>
                            <button
                              onClick={() => handleRejectBooking(booking._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                              ✕ Từ chối
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCompleteBooking(booking._id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                          >
                            ✅ Hoàn thành
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="p-6">
              <button
                onClick={() => navigate('/provider/services/new')}
                className="mb-6 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                ➕ Thêm dịch vụ mới
              </button>

              {services.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Bạn chưa có dịch vụ nào.{' '}
                  <button
                    onClick={() => navigate('/provider/services/new')}
                    className="text-teal-500 underline"
                  >
                    Tạo ngay
                  </button>
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="border rounded-lg p-4 hover:shadow-lg transition"
                    >
                      {service.images && service.images[0] && (
                        <img
                          src={service.images[0].url}
                          alt={service.name}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {service.description?.substring(0, 100)}...
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <p>
                          <strong>💰</strong> {formatPrice(service.price)}
                        </p>
                        <p>
                          <strong>⏱️</strong> {service.duration} phút
                        </p>
                        <p>
                          <strong>📍</strong> {service.city}
                        </p>
                        <p>
                          <strong>⭐</strong>{' '}
                          {service.rating?.toFixed(1) || 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/services/${service._id}`)}
                          className="flex-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          👁️ Xem
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          🗑️ Xoá
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboardPage;
