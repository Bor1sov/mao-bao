import type { Tea, Review } from '../types';

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Загружаем данные из localStorage или берем дефолтные
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { return defaultValue; }
  }
  return defaultValue;
};

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Начальные данные (если в localStorage пусто)
const DEFAULT_TEAS: Tea[] = [
  { id: '1', name: 'Те Гуань Инь', price: 850, description: 'Классический улун с цветочным ароматом', imageUrl: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=400&q=80', createdAt: new Date().toISOString() },
  { id: '2', name: 'Да Хун Пао', price: 1200, description: 'Скальный улун с глубоким вкусом', imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80', createdAt: new Date().toISOString() },
  { id: '3', name: 'Лун Цзин', price: 600, description: 'Зелёный чай с нежным вкусом', imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=400&q=80', createdAt: new Date().toISOString() },
];

const DEFAULT_REVIEWS: Review[] = [
  { id: '1', teaId: '1', userId: 'user@test.com', text: 'Очень вкусный чай!', status: 'approved' },
  { id: '2', teaId: '1', userId: 'user@test.com', text: 'Цветочный аромат супер', status: 'pending' },
];

// Инициализация "базы данных"
let teas: Tea[] = loadFromStorage('mao_bao_teas', DEFAULT_TEAS);
let reviews: Review[] = loadFromStorage('mao_bao_reviews', DEFAULT_REVIEWS);

// --- ЧАЙ ---
export async function getTea(): Promise<Tea[]> {
  await delay();
  return [...teas];
}

export async function createTea(data: Omit<Tea, 'id' | 'createdAt'>): Promise<Tea> {
  await delay();
  const newTea: Tea = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
  teas.push(newTea);
  saveToStorage('mao_bao_teas', teas);
  return newTea;
}

export async function updateTea(id: string, data: Partial<Omit<Tea, 'id' | 'createdAt'>>): Promise<Tea> {
  await delay();
  const index = teas.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Чай не найден');
  teas[index] = { ...teas[index], ...data };
  saveToStorage('mao_bao_teas', teas);
  return teas[index];
}

export async function deleteTea(id: string): Promise<void> {
  await delay();
  teas = teas.filter((t) => t.id !== id);
  saveToStorage('mao_bao_teas', teas);
}

// --- ОТЗЫВЫ ---
export async function getReviews(): Promise<Review[]> {
  await delay();
  return [...reviews];
}

export async function createReview(teaId: string, userId: string, text: string): Promise<Review> {
  await delay();
  const newReview: Review = { id: Date.now().toString(), teaId, userId, text, status: 'pending' };
  reviews.push(newReview);
  saveToStorage('mao_bao_reviews', reviews);
  return newReview;
}

export async function approveReview(id: string): Promise<Review> {
  await delay();
  const review = reviews.find((r) => r.id === id);
  if (!review) throw new Error('Отзыв не найден');
  review.status = 'approved';
  saveToStorage('mao_bao_reviews', reviews);
  return review;
}

export async function rejectReview(id: string): Promise<Review> {
  await delay();
  const review = reviews.find((r) => r.id === id);
  if (!review) throw new Error('Отзыв не найден');
  review.status = 'rejected';
  saveToStorage('mao_bao_reviews', reviews);
  return review;
}