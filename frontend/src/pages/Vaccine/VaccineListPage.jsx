import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vaccineService from '../../services/vaccineService';
import VaccineForm from '../../components/Vaccine/VaccineForm';
import VaccineTimeline from '../../components/Vaccine/VaccineTimeline';

/**
 * VaccineListPage: Halaman quản lý lịch tiêm cho một thú cưng
 * URL: /pets/:petId/vaccines
 */
const VaccineListPage = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'list'

  // Fetch vaccines
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        setLoading(true);
        const response = await vaccineService.getVaccines(petId);
        setVaccines(response.data || []);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách lịch tiêm');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (petId) fetchVaccines();
  }, [petId]);

  // Handle delete vaccine
  const handleDelete = async (vaccineId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa lịch tiêm này?')) return;

    try {
      await vaccineService.deleteVaccine(vaccineId);
      setVaccines(vaccines.filter((v) => v._id !== vaccineId));
      alert('Xóa lịch tiêm thành công!');
    } catch (err) {
      alert('Lỗi khi xóa lịch tiêm: ' + err.message);
    }
  };

  // Handle mark as done
  const handleMarkDone = async (vaccineId) => {
    try {
      await vaccineService.updateVaccine(vaccineId, {
        status: 'done',
        administeredDate: new Date().toISOString().split('T')[0],
      });
      const updated = vaccines.map((v) =>
        v._id === vaccineId ? { ...v, status: 'done' } : v
      );
      setVaccines(updated);
      alert('Đã cập nhật trạng thái!');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  // Handle edit
  const handleEdit = (vaccine) => {
    setEditingVaccine(vaccine);
    setShowForm(true);
  };

  // Handle form success
  const handleFormSuccess = async () => {
    const response = await vaccineService.getVaccines(petId);
    setVaccines(response.data || []);
    setShowForm(false);
    setEditingVaccine(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin">⏳ Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="vaccine-list-page container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lịch Tiêm Chủng</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/pets/${petId}`)}
            className="btn-secondary"
          >
            ← Quay lại
          </button>
          <button
            onClick={() => {
              setEditingVaccine(null);
              setShowForm(!showForm);
            }}
            className="btn-primary"
          >
            {showForm ? '✕ Hủy' : '+ Thêm lịch tiêm'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      {/* Form Section */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6 border-2 border-blue-200">
          <h2 className="text-xl font-semibold mb-4">
            {editingVaccine ? 'Sửa lịch tiêm' : 'Thêm lịch tiêm mới'}
          </h2>
          <VaccineForm
            petId={petId}
            vaccine={editingVaccine}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}

      {/* View Mode Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode('timeline')}
          className={`px-4 py-2 rounded ${
            viewMode === 'timeline' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          📅 Xem theo lịch
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded ${
            viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          📋 Xem danh sách
        </button>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="bg-white p-6 rounded shadow">
          {vaccines.length > 0 ? (
            <VaccineTimeline vaccines={vaccines} editable={true} />
          ) : (
            <p className="text-center text-gray-500">Chưa có lịch tiêm nào</p>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {vaccines.length > 0 ? (
            vaccines.map((vaccine) => (
              <div
                key={vaccine._id}
                className="bg-white p-4 rounded shadow border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{vaccine.name}</h3>
                    <p className="text-gray-600">
                      📅 Ngày tiêm:{' '}
                      {new Date(vaccine.dueDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      vaccine.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : vaccine.status === 'done'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {vaccine.status === 'pending'
                      ? '⏳ Đang chờ'
                      : vaccine.status === 'done'
                        ? '✅ Đã tiêm'
                        : '⚠️ Quá hạn'}
                  </span>
                </div>

                {vaccine.manufacturer && (
                  <p className="text-sm text-gray-700">
                    {vaccine.manufacturer}
                  </p>
                )}

                {vaccine.notes && (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    Ghi chú: {vaccine.notes}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  {vaccine.status === 'pending' && (
                    <button
                      onClick={() => handleMarkDone(vaccine._id)}
                      className="btn-success text-sm"
                    >
                      ✓ Đã tiêm
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(vaccine)}
                    className="btn-secondary text-sm"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(vaccine._id)}
                    className="btn-danger text-sm"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              Chưa có lịch tiêm nào. Hãy thêm lịch tiêm đầu tiên!
            </p>
          )}
        </div>
      )}

      {/* Vaccine Stats */}
      {vaccines.length > 0 && (
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-yellow-50 p-4 rounded text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {vaccines.filter((v) => v.status === 'pending').length}
            </p>
            <p className="text-gray-600">Đang chờ tiêm</p>
          </div>
          <div className="bg-green-50 p-4 rounded text-center">
            <p className="text-2xl font-bold text-green-600">
              {vaccines.filter((v) => v.status === 'done').length}
            </p>
            <p className="text-gray-600">Đã tiêm</p>
          </div>
          <div className="bg-red-50 p-4 rounded text-center">
            <p className="text-2xl font-bold text-red-600">
              {vaccines.filter((v) => v.status === 'overdue').length}
            </p>
            <p className="text-gray-600">Quá hạn</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccineListPage;
