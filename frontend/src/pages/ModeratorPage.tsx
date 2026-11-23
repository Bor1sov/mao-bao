import { useState, useEffect } from 'react';
import type { Review, Tea } from '../types';
import { getReviews, approveReview, rejectReview, getTea } from '../api/mockService';

export function ModeratorPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [teas, setTeas] = useState<Tea[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [reviewsData, teasData] = await Promise.all([getReviews(), getTea()]);
    setReviews(reviewsData);
    setTeas(teasData);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleApprove = async (id: string) => {
    await approveReview(id);
    loadData();
  };

  const handleReject = async (id: string) => {
    await rejectReview(id);
    loadData();
  };

  if (loading) return <div>Загрузка...</div>;

  const pendingReviews = reviews.filter((r) => r.status === 'pending');

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Модерация отзывов</h1>
      
      {pendingReviews.length === 0 ? (
        <div style={{ padding: '20px', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          Нет отзывов, ожидающих модерации. Отличная работа! 🎉
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {pendingReviews.map((review) => {
            const tea = teas.find((t) => t.id === review.teaId);
            return (
              <div key={review.id} style={{ backgroundColor: 'var(--card-bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                    От: <strong>{review.userId}</strong> | Чай: <strong>{tea?.name || 'Удалён'}</strong>
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#dd6b20', backgroundColor: 'rgba(221, 107, 32, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                    На модерации
                  </span>
                </div>
                
                <p style={{ margin: '0 0 15px 0', fontSize: '1.05rem' }}>«{review.text}»</p>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleApprove(review.id)} style={{ padding: '6px 15px', backgroundColor: '#38a169', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Одобрить</button>
                  <button onClick={() => handleReject(review.id)} style={{ padding: '6px 15px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Отклонить</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}