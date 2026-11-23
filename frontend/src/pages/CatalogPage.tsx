import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Tea, Review } from '../types';
import { getTea, getReviews, createReview } from '../api/mockService';

export function CatalogPage() {
  const { user } = useAuth();
  const [teas, setTeas] = useState<Tea[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewText, setReviewText] = useState('');
  const [activeTeaId, setActiveTeaId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [teasData, reviewsData] = await Promise.all([getTea(), getReviews()]);
      setTeas(teasData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Ошибка загрузки', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !activeTeaId) return;
    try {
      await createReview(activeTeaId, user.email, reviewText);
      setReviewText('');
      setActiveTeaId(null);
      alert('Отзыв отправлен на модерацию!');
      loadData();
    } catch (err) {
      alert('Ошибка при создании отзыва');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка каталога...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Каталог чая Mao Bao</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {teas.map((tea) => {
          const approvedReviews = reviews.filter((r) => r.teaId === tea.id && r.status === 'approved');

          return (
            <div key={tea.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '15px', backgroundColor: 'var(--card-bg)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
              
              {tea.imageUrl && (
                <img 
                  src={tea.imageUrl} 
                  alt={tea.name} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px', marginBottom: '15px' }} 
                />
              )}

              <h3 style={{ margin: '0 0 10px 0' }}>{tea.name}</h3>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: 'var(--primary-color)' }}>{tea.price} ₽</p>
              <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', opacity: 0.8, flexGrow: 1 }}>{tea.description}</p>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginBottom: '10px' }}>
                <strong style={{ fontSize: '0.9rem', opacity: 0.7 }}>Отзывы ({approvedReviews.length}):</strong>
                {approvedReviews.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', opacity: 0.5, margin: '5px 0 0 0' }}>Пока нет отзывов</p>
                ) : (
                  <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', margin: '5px 0 0 0' }}>
                    {approvedReviews.map((r) => (
                      <li key={r.id} style={{ marginBottom: '5px' }}>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{r.userId}:</span> {r.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {user && (
                <div style={{ marginTop: 'auto' }}>
                  {activeTeaId === tea.id ? (
                    <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <textarea 
                        value={reviewText} 
                        onChange={(e) => setReviewText(e.target.value)} 
                        placeholder="Ваш отзыв..."
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)', resize: 'vertical', minHeight: '60px' }}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ padding: '5px 15px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Отправить</button>
                        <button type="button" onClick={() => setActiveTeaId(null)} style={{ padding: '5px 15px', backgroundColor: 'var(--border-color)', color: 'var(--text-color)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Отмена</button>
                      </div>
                    </form>
                  ) : (
                    <button 
                      onClick={() => { setActiveTeaId(tea.id); setReviewText(''); }}
                      style={{ padding: '5px 10px', backgroundColor: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', width: '100%' }}
                    >
                      + Оставить отзыв
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}