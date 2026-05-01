import React, { useEffect, useState } from 'react';
import vaccineService from '../../services/vaccineService';
import './VaccineTimeline.css';

/**
 * VaccineTimeline: Hiển thị danh sách lịch tiêm dạng timeline
 * Props:
 * - petId: ID thú cưng
 * - onEdit: callback khi edit
 * - onDelete: callback khi delete
 */
const VaccineTimeline = ({ petId, onEdit, onDelete }) => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVaccines();
  }, [petId]);

  const loadVaccines = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vaccineService.getVaccinesByPet(petId);
      setVaccines(response.data);
    } catch (err) {
      setError(err.message || 'Lỗi tải danh sách vaccine');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xoá lịch tiêm này?')) {
      try {
        await vaccineService.deleteVaccine(id);
        setVaccines(vaccines.filter((v) => v._id !== id));
        if (onDelete) onDelete(id);
      } catch (err) {
        setError(err.message || 'Lỗi xoá vaccine');
      }
    }
  };

  const handleMarkDone = async (id) => {
    try {
      await vaccineService.updateVaccine(id, {
        status: 'done',
        completedDate: new Date(),
      });
      loadVaccines();
    } catch (err) {
      setError(err.message || 'Lỗi cập nhật vaccine');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'skipped':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Chưa tiêm',
      done: 'Đã tiêm',
      overdue: 'Quá hạn',
      skipped: 'Bỏ qua',
    };
    return labels[status] || status;
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-4">{error}</div>;
  }

  if (vaccines.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>Chưa có lịch tiêm nào. Thêm lịch tiêm mới để bắt đầu!</p>
      </div>
    );
  }

  return (
    <div className="vaccine-timeline">
      {vaccines.map((vaccine, index) => (
        <div key={vaccine._id} className="vaccine-item">
          {/* Timeline indicator */}
          <div className="timeline-indicator">
            <div
              className={`timeline-dot ${getStatusColor(vaccine.status)}`}
            ></div>
            {index < vaccines.length - 1 && (
              <div className="timeline-line"></div>
            )}
          </div>

          {/* Vaccine content */}
          <div className="vaccine-content">
            <div className="vaccine-header">
              <div>
                <h4 className="vaccine-name">{vaccine.name}</h4>
                <p className="vaccine-date">
                  📅{new Date(vaccine.dueDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <span
                className={`vaccine-status ${getStatusColor(vaccine.status)}`}
              >
                {getStatusLabel(vaccine.status)}
              </span>
            </div>

            {vaccine.manufacturer && (
              <p className="vaccine-info">
                <strong>Nhà sản xuất:</strong> {vaccine.manufacturer}
              </p>
            )}

            {vaccine.batchNumber && (
              <p className="vaccine-info">
                <strong>Lô sản xuất:</strong> {vaccine.batchNumber}
              </p>
            )}

            {vaccine.description && (
              <p className="vaccine-info">{vaccine.description}</p>
            )}

            {vaccine.notes && (
              <p className="vaccine-notes">
                <strong>Ghi chú:</strong> {vaccine.notes}
              </p>
            )}

            {vaccine.completedDate && (
              <p className="vaccine-info text-green-600">
                ✅ Tiêm vào:{' '}
                {new Date(vaccine.completedDate).toLocaleDateString('vi-VN')}
              </p>
            )}

            {/* Actions */}
            <div className="vaccine-actions">
              {vaccine.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleMarkDone(vaccine._id)}
                    className="btn-small btn-success"
                  >
                    ✓ Đã tiêm
                  </button>
                  <button
                    onClick={() => onEdit && onEdit(vaccine)}
                    className="btn-small btn-primary"
                  >
                    ✎ Sửa
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(vaccine._id)}
                className="btn-small btn-danger"
              >
                🗑 Xoá
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VaccineTimeline;
