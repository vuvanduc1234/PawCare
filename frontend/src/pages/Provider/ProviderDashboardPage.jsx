import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import serviceService from '../../services/serviceService';
import { useAuth } from '../../hooks/useAuth';

/**
 * ProviderDashboardPage: Bảng điều khiển quản lý đặt lịch cho nhà cung cấp
 * URL: /provider/dashboard
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
        const bookingsRes = await bookingService
          .getProviderBookings()
          .catch(() => ({ data: [] }));
        setBookings(bookingsRes.data || []);

        // Fetch services
        const servicesRes = await serviceService.getProviderServices(
          user._id || user.id
        );
        setServices(servicesRes.data || []);

        // Calculate statistics
        const bookingsList = bookingsRes.data || [];

        setStats({
          totalBookings: bookingsList.length,
          pendingBookings: bookingsList.filter((b) => b.status === 'pending')
            .length,
          confirmedBookings: bookingsList.filter(
            (b) => b.status === 'confirmed'
          ).length,
          completedBookings: bookingsList.filter((b) => b.status === 'done')
            .length,
          averageRating:
            bookingsList.filter((b) => b.review?.rating).length > 0
              ? bookingsList
                  .filter((b) => b.review?.rating)
                  .reduce((sum, b) => sum + b.review.rating, 0) /
                bookingsList.filter((b) => b.review?.rating).length
              : 0,
          totalRevenue: bookingsList
            .filter((b) => b.status === 'done')
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
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

  // Filter bookings
  const filteredBookings = statusFilter
    ? bookings.filter((b) => b.status === statusFilter)
    : bookings;

  // Handle booking actions
  const handleConfirmBooking = async (bookingId) => {
    try {
      await bookingService.updateBookingStatus(bookingId, 'confirmed');
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: 'confirmed' } : b
        )
      );
      alert('Đã xác nhận lịch đặt!');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    if (!window.confirm('Bạn chắc chắn muốn từ chối lịch đặt này?')) return;

    try {
      await bookingService.updateBookingStatus(bookingId, 'cancelled');
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: 'cancelled' } : b
        )
      );
      alert('Đã từ chối lịch đặt!');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await bookingService.updateBookingStatus(bookingId, 'done');
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'done' } : b))
      );
      alert('Đã đánh dấu hoàn thành!');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
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

  // Early returns
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin text-5xl">⏳</div>
      </div>
    );
  }

  if (!user || user.role !== 'provider') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600 text-lg">
            Bạn không có quyền truy cập trang này
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition flex items-center gap-2"
            >
              ← Quay lại
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              📊 Bảng điều khiển Provider
            </h1>
          </div>

          <button
            onClick={() => navigate('/provider/services/new')}
            className="px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition flex items-center gap-2"
          >
            ➕ Thêm dịch vụ mới
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-600 text-sm">📅 Tổng lịch đặt</p>
            <p className="text-4xl font-bold text-gray-800 mt-3">
              {stats.totalBookings}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-600 text-sm">⏳ Chờ duyệt</p>
            <p className="text-4xl font-bold text-yellow-600 mt-3">
              {stats.pendingBookings}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-600 text-sm">✅ Hoàn thành</p>
            <p className="text-4xl font-bold text-green-600 mt-3">
              {stats.completedBookings}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-600 text-sm">⭐ Đánh giá TB</p>
            <p className="text-4xl font-bold text-purple-600 mt-3">
              {stats.averageRating.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-3xl shadow mb-8">
          <p className="text-lg opacity-90">Doanh thu từ lịch hoàn thành</p>
          <p className="text-5xl font-bold mt-4">
            {formatPrice(stats.totalRevenue)}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow mb-8">
          <div className="flex border-b">
            {['bookings', 'services', 'statistics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 font-semibold transition ${
                  activeTab === tab
                    ? 'border-b-4 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab === 'bookings' && '📅 Lịch đặt'}
                {tab === 'services' && `🛍️ Dịch vụ (${services.length})`}
                {tab === 'statistics' && '📊 Thống kê'}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            {/* Status Filter */}
            <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3">
              {['pending', 'confirmed', 'done', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
                    statusFilter === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
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

            {/* Bookings List */}
            {filteredBookings.length > 0 ? (
              <div className="space-y-6">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-500"
                  >
                    {/* ... giữ nguyên phần render booking của bạn nếu muốn, hoặc mình sẽ bổ sung sau nếu cần ... */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-gray-500 text-sm">Khách hàng</p>
                        <p className="font-semibold">
                          {booking.user?.firstName} {booking.user?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Thú cưng</p>
                        <p className="font-semibold">{booking.pet?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Ngày</p>
                        <p className="font-semibold">
                          {new Date(booking.bookingDate).toLocaleDateString(
                            'vi-VN'
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Giờ</p>
                        <p className="font-semibold">{booking.timeSlot}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirmBooking(booking._id)}
                            className="btn-success"
                          >
                            ✓ Xác nhận
                          </button>
                          <button
                            onClick={() => handleRejectBooking(booking._id)}
                            className="btn-danger"
                          >
                            ✕ Từ chối
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCompleteBooking(booking._id)}
                          className="btn-success"
                        >
                          ✅ Hoàn thành
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow p-12 text-center">
                <p className="text-xl text-gray-500">
                  Không có lịch đặt nào theo bộ lọc
                </p>
              </div>
            )}
          </div>
        )}

        {/* Services Tab - Đã sửa gọn */}
        {activeTab === 'services' && (
          <div>
            {services.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-12 text-center">
                <p className="text-gray-500 mb-4">Bạn chưa có dịch vụ nào</p>
                <button
                  onClick={() => navigate('/provider/services/new')}
                  className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600"
                >
                  Tạo dịch vụ đầu tiên
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition"
                  >
                    {service.images?.[0] && (
                      <img
                        src={service.images[0]}
                        alt={service.name}
                        className="w-full h-48 object-cover rounded-xl mb-4"
                      />
                    )}
                    <h3 className="font-bold text-xl mb-2">{service.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex justify-between text-sm">
                      <p>
                        <strong>💰</strong> {formatPrice(service.price)}
                      </p>
                      <p>
                        <strong>⏱️</strong> {service.duration} phút
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Thống kê chi tiết</h2>
            <p className="text-gray-500">
              Phần thống kê nâng cao sẽ được phát triển sau.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboardPage;
