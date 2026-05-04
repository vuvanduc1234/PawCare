import React, { useState } from 'react';
import api from '../../services/api';

/**
 * ServiceRating Component
 * Hiển thị đánh giá và cho phép user submit rating
 */
const ServiceRating = ({
  serviceId,
  initialRating = 0,
  initialReviews = [],
}) => {
  const [rating, setRating] = useState(initialRating);
  const [reviews, setReviews] = useState(initialReviews || []);
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!userRating) {
      setError('Vui lòng chọn số sao');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await api.post(`/services/${serviceId}/review`, {
        rating: userRating,
        comment: comment.trim(),
      });

      if (response.data.success) {
        setSuccess('Cảm ơn bạn! Đánh giá của bạn đã được lưu');
        setUserRating(0);
        setComment('');
        // Cập nhật rating
        if (response.data.data) {
          setRating(response.data.data.averageRating || rating);
          setReviews(response.data.data.reviews || reviews);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (value, interactive = false) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : 'div'}
            onClick={() => interactive && setUserRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            style={{
              background: 'none',
              border: 'none',
              cursor: interactive ? 'pointer' : 'default',
              fontSize: '1.5rem',
              padding: 0,
              color: star <= (hoverRating || value) ? '#ffc107' : '#ddd',
              transition: 'color 0.2s',
            }}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '24px',
        marginTop: '24px',
      }}
    >
      <h3
        style={{ color: '#1a7a6e', marginBottom: '16px', fontSize: '1.2rem' }}
      >
        ⭐ Đánh giá dịch vụ
      </h3>

      {/* Current Rating */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
          padding: '16px',
          background: '#f5f5f5',
          borderRadius: '6px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1a7a6e',
            }}
          >
            {rating.toFixed(1)}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>
            {reviews.length} đánh giá
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {renderStars(Math.round(rating))}
          <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
            {rating === 0 ? 'Chưa có đánh giá' : 'Đánh giá trung bình'}
          </div>
        </div>
      </div>

      {/* Submit Rating Form */}
      <form onSubmit={handleSubmitRating} style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}
          >
            Đánh giá của bạn
          </label>
          {renderStars(userRating, true)}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}
          >
            Bình luận (tùy chọn)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '1px solid #d0e8e4',
              borderRadius: '6px',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              resize: 'vertical',
            }}
            maxLength={500}
          />
          <div
            style={{
              fontSize: '0.75rem',
              color: '#888',
              marginTop: '4px',
              textAlign: 'right',
            }}
          >
            {comment.length}/500
          </div>
        </div>

        {error && (
          <div
            style={{
              color: '#d32f2f',
              fontSize: '0.85rem',
              marginBottom: '12px',
              background: '#ffebee',
              padding: '8px 12px',
              borderRadius: '4px',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div
            style={{
              color: '#388e3c',
              fontSize: '0.85rem',
              marginBottom: '12px',
              background: '#e8f5e9',
              padding: '8px 12px',
              borderRadius: '4px',
            }}
          >
            ✓ {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !userRating}
          style={{
            background: userRating && !loading ? '#1a7a6e' : '#ccc',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: userRating && !loading ? 'pointer' : 'not-allowed',
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? '⏳ Đang lưu...' : '✓ Gửi đánh giá'}
        </button>
      </form>

      {/* Reviews List */}
      <div>
        <h4 style={{ marginBottom: '16px', color: '#333', fontSize: '1rem' }}>
          💬 Nhận xét từ khách hàng ({reviews.length})
        </h4>

        {reviews.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '32px 16px',
              color: '#888',
            }}
          >
            <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {reviews.map((review, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  background: '#fafafa',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#333' }}>
                    {review.user?.fullName || 'Ẩn danh'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        fontSize: '1rem',
                        color: star <= review.rating ? '#ffc107' : '#ddd',
                        marginRight: '2px',
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {review.comment && (
                  <p style={{ color: '#333', fontSize: '0.9rem', margin: 0 }}>
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRating;
