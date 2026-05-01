import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { bookingService } from '../../services/bookingService';

const BookingForm = ({
  provider,
  pets = [], // ← Thêm props này (danh sách thú cưng)
  onBookingSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Tìm service được chọn
      const selectedService = provider?.services?.find(
        (s) => s.name === data.serviceName
      );

      if (!selectedService) {
        throw new Error('Không tìm thấy thông tin dịch vụ');
      }

      if (!data.pet) {
        throw new Error('Vui lòng chọn thú cưng');
      }

      const bookingData = {
        serviceId: selectedService._id,
        petId: data.pet,
        bookingDate: data.bookingDate,
        timeSlot: data.startTime,
        notes: data.notes || '',
      };

      const response = await bookingService.createBooking(bookingData);

      if (response?.success) {
        alert('🎉 Đặt lịch thành công!');
        onBookingSuccess?.(response.data);
        reset(); // Reset form sau khi đặt thành công
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Đặt lịch thất bại';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <h3 className="text-xl font-bold mb-4">🐾 Đặt Lịch Dịch Vụ</h3>

      {/* Chọn Thú Cưng */}
      <div>
        <label htmlFor="pet" className="block text-sm font-medium mb-1">
          Chọn thú cưng *
        </label>
        <select
          id="pet"
          className="input-field w-full"
          {...register('pet', { required: 'Vui lòng chọn thú cưng' })}
        >
          <option value="">-- Chọn thú cưng --</option>
          {pets.length > 0 ? (
            pets.map((pet) => (
              <option key={pet._id} value={pet._id}>
                {pet.name} ({pet.type || 'Chưa xác định'})
              </option>
            ))
          ) : (
            <option value="" disabled>
              Bạn chưa có thú cưng nào
            </option>
          )}
        </select>
        {errors.pet && (
          <p className="text-red-500 text-sm mt-1">{errors.pet.message}</p>
        )}
      </div>

      {/* Chọn Dịch Vụ */}
      <div>
        <label htmlFor="serviceName" className="block text-sm font-medium mb-1">
          Chọn dịch vụ *
        </label>
        <select
          id="serviceName"
          className="input-field w-full"
          {...register('serviceName', { required: 'Vui lòng chọn dịch vụ' })}
        >
          <option value="">-- Chọn dịch vụ --</option>
          {provider?.services?.map((service) => (
            <option key={service._id} value={service.name}>
              {service.name} - {service.price?.toLocaleString('vi-VN')} VND
            </option>
          ))}
        </select>
        {errors.serviceName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.serviceName.message}
          </p>
        )}
      </div>

      {/* Ngày đặt lịch */}
      <div>
        <label htmlFor="bookingDate" className="block text-sm font-medium mb-1">
          Ngày đặt lịch *
        </label>
        <input
          id="bookingDate"
          type="date"
          className="input-field w-full"
          {...register('bookingDate', { required: 'Vui lòng chọn ngày' })}
        />
        {errors.bookingDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.bookingDate.message}
          </p>
        )}
      </div>

      {/* Giờ bắt đầu */}
      <div>
        <label htmlFor="startTime" className="block text-sm font-medium mb-1">
          Giờ bắt đầu *
        </label>
        <input
          id="startTime"
          type="time"
          className="input-field w-full"
          {...register('startTime', { required: 'Vui lòng chọn giờ' })}
        />
        {errors.startTime && (
          <p className="text-red-500 text-sm mt-1">
            {errors.startTime.message}
          </p>
        )}
      </div>

      {/* Ghi chú */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Ghi chú (tùy chọn)
        </label>
        <textarea
          id="notes"
          placeholder="Ví dụ: Thú cưng sợ tiếng máy sấy, cần chăm sóc nhẹ nhàng..."
          className="input-field w-full"
          rows="3"
          {...register('notes')}
        />
      </div>

      {/* Hiển thị lỗi */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Nút đặt lịch */}
      <button
        type="submit"
        disabled={loading || pets.length === 0}
        className="btn-primary w-full py-3 disabled:opacity-50"
      >
        {loading ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
      </button>
    </form>
  );
};

export default BookingForm;
