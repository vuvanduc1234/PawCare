import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import vaccineService from '../../services/vaccineService';

/**
 * VaccineForm: Form thêm/sửa lịch tiêm
 * Props:
 * - petId: ID thú cưng
 * - vaccine: (optional) vaccine data nếu edit
 * - onSuccess: callback sau khi submit thành công
 */
const VaccineForm = ({ petId, vaccine = null, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: vaccine || {
      name: '',
      description: '',
      manufacturer: '',
      batchNumber: '',
      dueDate: '',
      notes: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (vaccine) {
        // Edit existing vaccine
        await vaccineService.updateVaccine(vaccine._id, data);
        setSuccess('Cập nhật lịch tiêm thành công!');
      } else {
        // Create new vaccine
        await vaccineService.createVaccine(petId, data);
        setSuccess('Thêm lịch tiêm thành công!');
        reset();
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu lịch tiêm');
    } finally {
      setLoading(false);
    }
  };

  // Common vaccine names
  const commonVaccines = [
    'Rabies (Bệnh dại)',
    'DHPP (5-in-1)',
    'FVRCP (Mèo)',
    'Leukemia (Mèo)',
    'Booster',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="vaccine-form space-y-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded">{success}</div>
      )}

      {/* Vaccine Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Tên vaccine *
        </label>
        <select
          id="name"
          {...register('name', {
            required: 'Vui lòng chọn hoặc nhập tên vaccine',
          })}
          className="input-field"
        >
          <option value="">-- Chọn hoặc nhập tên --</option>
          {commonVaccines.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
          Ngày tiêm dự kiến *
        </label>
        <input
          id="dueDate"
          type="date"
          {...register('dueDate', { required: 'Vui lòng chọn ngày tiêm' })}
          className="input-field"
        />
        {errors.dueDate && (
          <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Manufacturer */}
      <div>
        <label
          htmlFor="manufacturer"
          className="block text-sm font-medium mb-1"
        >
          Nhà sản xuất
        </label>
        <input
          id="manufacturer"
          type="text"
          placeholder="vd: Pfizer, Merck"
          {...register('manufacturer')}
          className="input-field"
        />
      </div>

      {/* Batch Number */}
      <div>
        <label htmlFor="batchNumber" className="block text-sm font-medium mb-1">
          Lô sản xuất
        </label>
        <input
          id="batchNumber"
          type="text"
          placeholder="vd: 20230615"
          {...register('batchNumber')}
          className="input-field"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Mô tả
        </label>
        <textarea
          id="description"
          placeholder="Thêm thông tin về vaccine..."
          {...register('description')}
          className="input-field"
          rows="2"
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Ghi chú
        </label>
        <textarea
          id="notes"
          placeholder="Ghi chú thêm về lịch tiêm..."
          {...register('notes')}
          className="input-field"
          rows="2"
        />
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading
          ? 'Đang lưu...'
          : vaccine
            ? 'Cập nhật lịch tiêm'
            : 'Thêm lịch tiêm'}
      </button>
    </form>
  );
};

export default VaccineForm;
