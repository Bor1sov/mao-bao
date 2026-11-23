export type Role = 'user' | 'admin' | 'moderator';

export interface User {
  email: string;
  role: Role;
}

export interface Tea {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string; // <-- Добавили
  createdAt: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  teaId: string;
  userId: string; // email пользователя
  text: string;
  status: ReviewStatus;
}