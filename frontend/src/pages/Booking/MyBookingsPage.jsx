import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/common';
/**
 * MyBookingsPage: Halaman xem danh sách lịch đặt của người dùng
 * URL: /bookings
 * Features: Xem, hủy, đánh giá, theo dõi trạng thái
 */
const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(''); // '', 'pending', 'confirmed', 'done', 'cancelled'
  const [reviewingBookingId, setReviewingBookingId] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await bookingService.getMyBookings();
        setBookings(response.data || []);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách lịch đặt. ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  // Filter bookings
  const filteredBookings = statusFilter
    ? bookings.filter((b) => b.status === statusFilter)
    : bookings;

  // Handle cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Bạn chắc chắn muốn hủy lịch đặt này?')) return;

    try {
      await bookingService.updateBookingStatus(bookingId, 'cancelled');
      const updated = bookings.map((b) =>
        b._id === bookingId ? { ...b, status: 'cancelled' } : b
      );
      setBookings(updated);
      alert('Hủy lịch đặt thành công!');
    } catch (err) {
      alert('Lỗi khi hủy lịch: ' + err.message);
    }
  };

  // Handle submit review
  const handleSubmitReview = async (bookingId) => {
    if (!reviewData.comment.trim()) {
      alert('Vui lòng nhập nội dung đánh giá');
      return;
    }

    try {
      await bookingService.addReview(
        bookingId,
        reviewData.rating,
        reviewData.comment
      );
      const updated = bookings.map((b) =>
        b._id === bookingId ? { ...b, review: reviewData } : b
      );
      setBookings(updated);
      setReviewingBookingId(null);
      setReviewData({ rating: 5, comment: '' });
      alert('Gửi đánh giá thành công!');
    } catch (err) {
      alert('Lỗi khi gửi đánh giá: ' + err.message);
    }
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        label: '⏳ Chờ duyệt',
        class: 'bg-yellow-100 text-yellow-800',
      },
      confirmed: {
        label: '✓ Đã xác nhận',
        class: 'bg-blue-100 text-blue-800',
      },
      done: {
        label: '✅ Hoàn thành',
        class: 'bg-green-100 text-green-800',
      },
      cancelled: {
        label: '✕ Đã hủy',
        class: 'bg-red-100 text-red-800',
      },
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

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="mb-4">Vui lòng đăng nhập để xem lịch đặt</p>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="my-bookings-page min-h-screen bg-gray-50">
      <Header />
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto p-4 max-w-4xl flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-800 text-lg px-2 py-1 rounded hover:bg-gray-100 transition"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-bold">📅 Lịch đặt của tôi</h1>
            <p className="text-gray-600 mt-1">
              Quản lý các lịch đặt dịch vụ cho thú cưng của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-4xl">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="bg-white rounded shadow mb-6 p-4 flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 rounded ${
              statusFilter === ''
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Tất cả ({bookings.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ⏳ Chờ duyệt (
            {bookings.filter((b) => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'confirmed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ✓ Xác nhận (
            {bookings.filter((b) => b.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setStatusFilter('done')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'done'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ✅ Hoàn thành ({bookings.filter((b) => b.status === 'done').length})
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'cancelled'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ✕ Hủy ({bookings.filter((b) => b.status === 'cancelled').length})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {booking.service?.name || 'Dịch vụ không xác định'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Mã đơn: {booking.bookingCode}
                    </p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                {/* details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pb-4 border-b">
                  {/* Date */}
                  <div>
                    <p className="text-gray-600 text-sm">📅 Ngày</p>
                    <p className="font-semibold">
                      {new Date(booking.bookingDate).toLocaleDateString(
                        'vi-VN'
                      )}
                    </p>
                  </div>

                  {/* Time */}
                  <div>
                    <p className="text-gray-600 text-sm">⏱️ Khung giờ</p>
                    <p className="font-semibold">{booking.timeSlot}</p>
                  </div>

                  {/* Pet */}
                  <div>
                    <p className="text-gray-600 text-sm">🐾 Thú cưng</p>
                    <p className="font-semibold">
                      {booking.pet?.name || 'Không xác định'}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-gray-600 text-sm">💰 Giá</p>
                    <p className="font-semibold text-blue-600">
                      {formatPrice(booking.totalPrice)}
                    </p>
                  </div>

                  {/* Provider */}
                  <div>
                    <p className="text-gray-600 text-sm">👤 Nhà cung cấp</p>
                    <p className="font-semibold">
                      {booking.service?.provider?.firstName || 'Không xác định'}
                    </p>
                  </div>

                  {/* Provider Phone */}
                  <div>
                    <p className="text-gray-600 text-sm">📞 Điện thoại</p>
                    <a
                      href={`tel:${booking.service?.provider?.phone}`}
                      className="font-semibold text-blue-500 hover:underline"
                    >
                      {booking.service?.provider?.phone}
                    </a>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-gray-600 text-sm">📝 Ghi chú</p>
                    <p className="text-gray-700">{booking.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {/* Cancel Button (pending/confirmed) */}
                  {(booking.status === 'pending' ||
                    booking.status === 'confirmed') && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="btn-danger text-sm"
                    >
                      ✕ Hủy lịch
                    </button>
                  )}

                  {/* Review Button (done, not reviewed) */}
                  {booking.status === 'done' && !booking.review && (
                    <button
                      onClick={() => setReviewingBookingId(booking._id)}
                      className="btn-success text-sm"
                    >
                      ⭐ Đánh giá
                    </button>
                  )}

                  {/* View Review */}
                  {booking.review && (
                    <button
                      onClick={() => setReviewingBookingId(booking._id)}
                      className="btn-secondary text-sm"
                    >
                      👁️ Xem đánh giá
                    </button>
                  )}

                  {/* Call/Contact */}
                  <a
                    href={`tel:${booking.service?.provider?.phone}`}
                    className="btn-secondary text-sm"
                  >
                    📞 Gọi
                  </a>
                </div>

                {/* Review Form */}
                {reviewingBookingId === booking._id && !booking.review && (
                  <div className="mt-4 p-4 bg-blue-50 rounded">
                    <h4 className="font-semibold mb-3">Đánh giá dịch vụ</h4>
                    <div className="space-y-3">
                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Đánh giá (sao): {reviewData.rating}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={reviewData.rating}
                          onChange={(e) =>
                            setReviewData({
                              ...reviewData,
                              rating: parseInt(e.target.value),
                            })
                          }
                          className="w-full"
                        />
                        <div className="flex gap-1 mt-2">
                          {'★'.repeat(reviewData.rating)}{' '}
                          {'☆'.repeat(5 - reviewData.rating)}
                        </div>
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Bình luận
                        </label>
                        <textarea
                          value={reviewData.comment}
                          onChange={(e) =>
                            setReviewData({
                              ...reviewData,
                              comment: e.target.value,
                            })
                          }
                          placeholder="Chia sẻ trải nghiệm của bạn..."
                          className="input-field w-full"
                          rows="3"
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmitReview(booking._id)}
                          className="btn-primary"
                        >
                          ✓ Gửi đánh giá
                        </button>
                        <button
                          onClick={() => setReviewingBookingId(null)}
                          className="btn-secondary"
                        >
                          ✕ Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Display review if already submitted */}
                {booking.review && (
                  <div className="mt-4 p-4 bg-green-50 rounded">
                    <h4 className="font-semibold mb-2">Đánh giá của bạn</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span>
                        {'★'.repeat(booking.review.rating)}{' '}
                        {'☆'.repeat(5 - booking.review.rating)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {new Date(booking.review.reviewDate).toLocaleDateString(
                          'vi-VN'
                        )}
                      </span>
                    </div>
                    <p className="text-gray-700">{booking.review.comment}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded shadow p-12 text-center">
            <p className="text-2xl mb-4">😔</p>
            <p className="text-xl text-gray-600 mb-4">
              {statusFilter
                ? 'Không tìm thấy lịch đặt nào'
                : 'Bạn chưa có lịch đặt nào'}
            </p>
            <p className="text-gray-500 mb-6">
              Hãy khám phá và đặt các dịch vụ tuyệt vời cho thú cưng của bạn
            </p>
            <button
              onClick={() => navigate('/services')}
              className="btn-primary"
            >
              🔍 Tìm dịch vụ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
