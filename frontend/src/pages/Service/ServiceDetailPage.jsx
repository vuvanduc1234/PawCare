// ServiceDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import serviceService from '../../services/serviceService';
import bookingService from '../../services/bookingService';
import petService from '../../services/petService'; // ← Import đúng cách
import ServiceRating from '../../components/Service/ServiceRating';
import { useAuth } from '../../hooks/useAuth';
import { Header } from '../../components/common';

/**
 * ServiceDetailPage: Trang chi tiết dịch vụ + Đặt lịch
 * Có back button để quay lại /services
 */
const ServiceDetailPage = () => {
  const { id: serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [userPets, setUserPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(false);

  const [bookingData, setBookingData] = useState({
    petId: '',
    bookingDate: '',
    timeSlot: '',
    notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch chi tiết dịch vụ
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await serviceService.getServiceById(serviceId);
        setService(response.data || response);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) fetchService();
  }, [serviceId]);

  // Fetch danh sách thú cưng của user khi mở form đặt lịch
  // Fetch user's pets
  // Fetch danh sách thú cưng
  useEffect(() => {
    const fetchUserPets = async () => {
      if (!user) {
        console.log('Chưa đăng nhập, không fetch pets');
        return;
      }

      console.log('Đang fetch pets...');

      try {
        setPetsLoading(true);
        const result = await petService.getPets();

        console.log('Kết quả từ petService.getPets():', result);

        const pets = result?.data || result || [];
        console.log('Danh sách pets nhận được:', pets);

        setUserPets(pets);
      } catch (err) {
        console.error('❌ Lỗi khi tải danh sách thú cưng:', err);
        if (err.message) console.error('Error message:', err.message);
        if (err.response) console.error('Response data:', err.response.data);
        setUserPets([]);
      } finally {
        setPetsLoading(false);
      }
    };

    if (showBookingForm) {
      fetchUserPets();
    }
  }, [user, showBookingForm]);
  // Xử lý đặt lịch
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (
      !bookingData.petId ||
      !bookingData.bookingDate ||
      !bookingData.timeSlot
    ) {
      alert('Vui lòng chọn thú cưng, ngày và khung giờ');
      return;
    }

    try {
      setBookingLoading(true);

      // timeSlot format: "08:00-09:00" → chỉ lấy startTime "08:00" để gửi backend
      const startTime = bookingData.timeSlot.split('-')[0];

      await bookingService.createBooking(
        serviceId,
        bookingData.petId,
        bookingData.bookingDate,
        startTime,
        bookingData.notes
      );

      alert('Đặt lịch thành công! Vui lòng chờ nhà cung cấp xác nhận.');
      navigate('/bookings');
    } catch (err) {
      console.error('Full error:', err);
      const msg =
        err?.message || err?.response?.data?.message || 'Lỗi không xác định';
      const details = err?.errors || err?.response?.data?.errors;
      console.error('Validation errors:', details);
      alert(
        'Đặt lịch thất bại: ' +
          msg +
          (details ? '\n' + JSON.stringify(details) : '')
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Render sao đánh giá
  const renderRating = (rating = 0) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <button
          onClick={() => navigate('/services')}
          className="btn-secondary mb-4"
        >
          ← Quay lại
        </button>
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error || 'Không tìm thấy dịch vụ'}
        </div>
      </div>
    );
  }

  const timeSlots = [
    '08:00-09:00',
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
  ];

  return (
    <div className="service-detail-page bg-gray-50 min-h-screen pb-10">
      <Header />
      {/* Sub Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto p-4 max-w-4xl">
          <button
            onClick={() => navigate('/services')}
            className="btn-secondary text-sm"
          >
            ← Quay lại danh sách dịch vụ
          </button>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Phần trái: Hình ảnh + Thông tin */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {service.images?.length > 0 && (
              <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
                <div className="relative h-96 bg-gray-200">
                  <img
                    src={
                      service.images[currentImageIndex]?.url ||
                      service.images[currentImageIndex]
                    }
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  {service.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex(
                            Math.max(0, currentImageIndex - 1)
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-4 py-2 rounded-full hover:bg-black/80"
                      >
                        ◀
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIndex(
                            Math.min(
                              service.images.length - 1,
                              currentImageIndex + 1
                            )
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-4 py-2 rounded-full hover:bg-black/80"
                      >
                        ▶
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {service.images.length > 1 && (
                  <div className="flex gap-3 p-4 overflow-x-auto">
                    {service.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          idx === currentImageIndex
                            ? 'border-blue-500'
                            : 'border-transparent'
                        }`}
                      >
                        <img
                          src={img?.url || img}
                          alt={`thumb-${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Thông tin dịch vụ */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  {service.category}
                </span>
                {service.isApproved && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    ✓ Đã xác minh
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-2">{service.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-2xl">
                  {renderRating(service.rating)}
                </div>
                <p className="text-lg font-medium">
                  {service.rating?.toFixed(1)} ({service.reviewCount || 0} đánh
                  giá)
                </p>
              </div>

              {/* Nhà cung cấp */}
              <div className="mb-6 pb-6 border-b">
                <p className="text-gray-600 mb-2">Nhà cung cấp</p>
                <div className="flex items-center gap-3">
                  {service.provider?.avatar && (
                    <img
                      src={service.provider.avatar}
                      alt="provider"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold">
                      {service.provider?.firstName} {service.provider?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {service.provider?.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Mô tả</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm">Địa chỉ</p>
                  <p className="font-medium">{service.address}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Thời lượng</p>
                  <p className="font-medium">{service.duration} phút</p>
                </div>
              </div>
            </div>
          </div>

          {/* Phần phải: Đặt lịch */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-6">
              <div className="mb-6">
                <p className="text-gray-600 text-sm">Giá dịch vụ</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatPrice(service.price)}
                </p>
              </div>

              {!showBookingForm ? (
                <button
                  onClick={() => {
                    if (!user) navigate('/login');
                    else setShowBookingForm(true);
                  }}
                  className="btn-primary w-full py-3 text-lg"
                >
                  📅 Đặt lịch ngay
                </button>
              ) : (
                <form onSubmit={handleBooking} className="space-y-5">
                  <h3 className="font-semibold text-lg">Đặt lịch dịch vụ</h3>

                  {/* Chọn thú cưng */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Chọn thú cưng *
                    </label>
                    {petsLoading ? (
                      <p className="text-sm text-gray-500">
                        Đang tải danh sách thú cưng...
                      </p>
                    ) : userPets.length === 0 ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                        <p className="font-medium mb-1">
                          ⚠️ Bạn chưa có thú cưng nào
                        </p>
                        <p className="mb-2">
                          Vui lòng thêm thú cưng trước khi đặt lịch.
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate('/pets')}
                          className="underline font-semibold hover:text-yellow-900"
                        >
                          + Thêm thú cưng ngay →
                        </button>
                      </div>
                    ) : (
                      <select
                        value={bookingData.petId}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            petId: e.target.value,
                          })
                        }
                        className="input-field w-full"
                        required
                      >
                        <option value="">-- Chọn thú cưng --</option>
                        {userPets.map((pet) => (
                          <option key={pet._id} value={pet._id}>
                            {pet.name} ({pet.type})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Ngày đặt */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ngày đặt *
                    </label>
                    <input
                      type="date"
                      value={bookingData.bookingDate}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          bookingDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field w-full"
                      required
                    />
                  </div>

                  {/* Khung giờ */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Khung giờ *
                    </label>
                    <select
                      value={bookingData.timeSlot}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          timeSlot: e.target.value,
                        })
                      }
                      className="input-field w-full"
                      required
                    >
                      <option value="">-- Chọn khung giờ --</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Ghi chú thêm cho nhà cung cấp..."
                      className="input-field w-full"
                      rows={3}
                    />
                  </div>

                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="btn-primary w-full py-3"
                    >
                      {bookingLoading ? 'Đang xử lý...' : '✓ Xác nhận đặt lịch'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="btn-secondary w-full py-3"
                    >
                      ✕ Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Rating Section */}
        {service && (
          <ServiceRating
            serviceId={service._id}
            initialRating={service.rating || 0}
            initialReviews={service.reviews || []}
          />
        )}
      </div>
    </div>
  );
};

export default ServiceDetailPage;
