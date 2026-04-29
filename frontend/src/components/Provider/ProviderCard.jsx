import React from 'react';

/**
 * ProviderCard: Component hiển thị card thông tin provider
 * Dùng trong danh sách provider
 */
const ProviderCard = ({ provider }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-sm text-gray-600">({provider.rating.count})</span>
      </div>
    );
  };

  return (
    <div className="card cursor-pointer">
      {/* Logo & Cover */}
      <div className="mb-4">
        {provider.coverImage && (
          <img
            src={provider.coverImage}
            alt={provider.businessName}
            className="w-full h-40 object-cover rounded-lg"
          />
        )}
      </div>

      {/* Tên doanh nghiệp */}
      <h3 className="text-lg font-bold mb-2">{provider.businessName}</h3>

      {/* Danh mục */}
      <p className="text-sm text-gray-500 mb-2">{provider.category}</p>

      {/* Địa chỉ */}
      <p className="text-sm text-gray-600 mb-3">
        📍 {provider.address?.city || 'Không rõ'}
      </p>

      {/* Đánh giá */}
      <div className="mb-3">{renderStars(provider.rating.average || 0)}</div>

      {/* Nút action */}
      <button className="btn-primary w-full text-sm">Xem Chi Tiết</button>
    </div>
  );
};

export default ProviderCard;
