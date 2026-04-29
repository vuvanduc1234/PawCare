import React from 'react';
import { useForm } from 'react-hook-form';
import { bookingService } from '../../services/bookingService';

/**
 * BookingForm: Form đặt lịch dịch vụ
 * Người dùng chọn dịch vụ, thời gian, thú cưng
 */
const BookingForm = ({ provider, onBookingSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  /**
   * Xử lý submit form đặt lịch
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const bookingData = {
        provider: provider?._id,
        pet: data.pet,
        service: {
          name: data.serviceName,
          price: data.servicePrice,
          duration: data.serviceDuration,
        },
        bookingDate: data.bookingDate,
        startTime: data.startTime,
        notes: data.notes,
      };

      const response = await bookingService.createBooking(bookingData);

      if (response.success) {
        onBookingSuccess?.(response.data);
        // Reset form
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đặt lịch thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-6 rounded-lg"
    >
      <h3 className="text-xl font-bold mb-4">Đặt Lịch Dịch Vụ</h3>

      {/* Select Pet */}
      <div>
        <label htmlFor="pet" className="block text-sm font-medium mb-1">
          Chọn thú cưng
        </label>
        <select
          id="pet"
          className="input-field"
          {...register('pet', { required: 'Vui lòng chọn thú cưng' })}
        >
          <option value="">-- Chọn thú cưng --</option>
          {/* Map pets here */}
        </select>
        {errors.pet && (
          <p className="text-red-500 text-sm">{errors.pet.message}</p>
        )}
      </div>

      {/* Select Service */}
      <div>
        <label htmlFor="serviceName" className="block text-sm font-medium mb-1">
          Chọn dịch vụ
        </label>
        <select
          id="serviceName"
          className="input-field"
          {...register('serviceName', { required: 'Vui lòng chọn dịch vụ' })}
        >
          <option value="">-- Chọn dịch vụ --</option>
          {provider?.services?.map((service) => (
            <option key={service._id} value={service.name}>
              {service.name} - {service.price} VND
            </option>
          ))}
        </select>
        {errors.serviceName && (
          <p className="text-red-500 text-sm">{errors.serviceName.message}</p>
        )}
      </div>

      {/* Booking Date */}
      <div>
        <label htmlFor="bookingDate" className="block text-sm font-medium mb-1">
          Ngày đặt lịch
        </label>
        <input
          id="bookingDate"
          type="date"
          className="input-field"
          {...register('bookingDate', { required: 'Vui lòng chọn ngày' })}
        />
        {errors.bookingDate && (
          <p className="text-red-500 text-sm">{errors.bookingDate.message}</p>
        )}
      </div>

      {/* Start Time */}
      <div>
        <label htmlFor="startTime" className="block text-sm font-medium mb-1">
          Giờ bắt đầu
        </label>
        <input
          id="startTime"
          type="time"
          className="input-field"
          {...register('startTime', { required: 'Vui lòng chọn giờ' })}
        />
        {errors.startTime && (
          <p className="text-red-500 text-sm">{errors.startTime.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Ghi chú (tùy chọn)
        </label>
        <textarea
          id="notes"
          placeholder="Ghi chú thêm về pets hoặc dịch vụ..."
          className="input-field"
          rows="3"
          {...register('notes')}
        />
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Đang đặt lịch...' : 'Đặt Lịch'}
      </button>
    </form>
  );
};

export default BookingForm;
