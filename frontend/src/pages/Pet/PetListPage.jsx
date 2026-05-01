import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import petService from '../../services/petService';
import { useAuth } from '../../hooks/useAuth';
import { Header } from '../../components/common';

const PET_TYPES = [
  { value: 'dog', label: 'Chó', icon: '🐶' },
  { value: 'cat', label: 'Mèo', icon: '🐱' },
  { value: 'bird', label: 'Chim', icon: '🐦' },
  { value: 'rabbit', label: 'Thỏ', icon: '🐰' },
  { value: 'other', label: 'Khác', icon: '🐾' },
];

const GENDERS = [
  { value: 'male', label: 'Đực' },
  { value: 'female', label: 'Cái' },
  { value: 'unknown', label: 'Không rõ' },
];

const EMPTY_FORM = {
  name: '',
  type: 'dog',
  breed: '',
  age: '',
  weight: '',
  color: '',
  gender: 'unknown',
  notes: '',
};

const PetListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null); // null = thêm mới
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Delete confirm
  const [deletingId, setDeletingId] = useState(null);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const result = await petService.getPets();
      setPets(result?.data || []);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách thú cưng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const openAddModal = () => {
    setEditingPet(null);
    setFormData(EMPTY_FORM);
    setAvatarFile(null);
    setAvatarPreview(null);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name || '',
      type: pet.type || 'dog',
      breed: pet.breed || '',
      age: pet.age ?? '',
      weight: pet.weight ?? '',
      color: pet.color || '',
      gender: pet.gender || 'unknown',
      notes: pet.notes || '',
    });
    setAvatarFile(null);
    setAvatarPreview(pet.avatar || null);
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPet(null);
    setFormError(null);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim())
      return setFormError('Vui lòng nhập tên thú cưng');
    if (!formData.breed.trim()) return setFormError('Vui lòng nhập giống');
    if (formData.age === '' || isNaN(formData.age) || Number(formData.age) < 0)
      return setFormError('Tuổi không hợp lệ');
    if (
      formData.weight === '' ||
      isNaN(formData.weight) ||
      Number(formData.weight) <= 0
    )
      return setFormError('Cân nặng phải lớn hơn 0');

    try {
      setSubmitting(true);
      if (editingPet) {
        await petService.updatePet(editingPet._id, formData, avatarFile);
      } else {
        await petService.createPet(formData, avatarFile);
      }
      closeModal();
      await fetchPets();
    } catch (err) {
      setFormError(err?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await petService.deletePet(id);
      setDeletingId(null);
      await fetchPets();
    } catch (err) {
      alert('Xóa thất bại: ' + (err?.message || 'Lỗi không xác định'));
    }
  };

  const typeInfo = (type) =>
    PET_TYPES.find((t) => t.value === type) || PET_TYPES[4];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Header bar */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-800 text-lg"
            >
              ←
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              🐾 Thú cưng của tôi
            </h1>
          </div>
          <button
            onClick={openAddModal}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <span className="text-lg leading-none">+</span> Thêm thú cưng
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20 text-4xl animate-pulse">
            🐾
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
        )}

        {/* Empty state */}
        {!loading && !error && pets.length === 0 && (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">🐾</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có thú cưng nào
            </h2>
            <p className="text-gray-500 mb-6">
              Thêm thú cưng đầu tiên của bạn để bắt đầu đặt lịch dịch vụ!
            </p>
            <button
              onClick={openAddModal}
              className="btn-primary px-8 py-3 text-base"
            >
              + Thêm thú cưng ngay
            </button>
          </div>
        )}

        {/* Pet grid */}
        {!loading && pets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pets.map((pet) => (
              <div
                key={pet._id}
                className="bg-white rounded-xl shadow hover:shadow-md transition p-5 flex gap-4"
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center text-4xl border-2 border-blue-100">
                  {pet.avatar ? (
                    <img
                      src={pet.avatar}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{typeInfo(pet.type).icon}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight">
                        {pet.name}
                      </h3>
                      <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-0.5">
                        {typeInfo(pet.type).icon} {typeInfo(pet.type).label}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEditModal(pet)}
                        className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition text-sm"
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeletingId(pet._id)}
                        className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition text-sm"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-gray-600 space-y-0.5">
                    <p>
                      <span className="text-gray-400">Giống:</span> {pet.breed}
                    </p>
                    <p>
                      <span className="text-gray-400">Tuổi:</span> {pet.age}{' '}
                      tuổi &nbsp;·&nbsp;
                      <span className="text-gray-400">Nặng:</span> {pet.weight}{' '}
                      kg
                    </p>
                    {pet.color && (
                      <p>
                        <span className="text-gray-400">Màu:</span> {pet.color}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/pets/${pet._id}/vaccines`)}
                      className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-100 transition"
                    >
                      💉 Vaccine
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-800">
                {editingPet ? '✏️ Chỉnh sửa thú cưng' : '🐾 Thêm thú cưng mới'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Avatar upload */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-5xl">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{typeInfo(formData.type).icon}</span>
                  )}
                </div>
                <label className="cursor-pointer text-sm text-blue-600 hover:underline">
                  📷 Chọn ảnh đại diện
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              {/* Loại thú cưng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại thú cưng *
                </label>
                <div className="flex gap-2 flex-wrap">
                  {PET_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, type: t.value }))
                      }
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm transition ${
                        formData.type === t.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên thú cưng *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Vd: Mimi, Cún, Bông..."
                  className="input-field"
                  required
                />
              </div>

              {/* Giống */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giống *
                </label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  placeholder="Vd: Corgi, Mèo Anh lông ngắn..."
                  className="input-field"
                  required
                />
              </div>

              {/* Tuổi & Cân nặng */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tuổi (năm) *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.5"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cân nặng (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="0.0"
                    min="0.1"
                    step="0.1"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Màu & Giới tính */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Màu lông
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Vd: Vàng, Trắng đen..."
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {GENDERS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Dị ứng, thói quen, ghi chú sức khỏe..."
                  className="input-field"
                  rows={3}
                />
              </div>

              {/* Form error */}
              {formError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                  ⚠️ {formError}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 py-3 font-semibold"
                >
                  {submitting
                    ? 'Đang lưu...'
                    : editingPet
                      ? '💾 Lưu thay đổi'
                      : '✅ Thêm thú cưng'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary flex-1 py-3"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="text-5xl mb-3">🗑️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Xóa thú cưng?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Hành động này không thể hoàn tác. Toàn bộ dữ liệu của thú cưng sẽ
              bị xóa vĩnh viễn.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deletingId)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 transition font-semibold"
              >
                Xóa
              </button>
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 btn-secondary py-2.5"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetListPage;
