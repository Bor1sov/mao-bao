import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();

  // Если не залогинен — на страницу входа
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если роли не совпадают — на главную
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Если всё ок — рендерим вложенный маршрут
  return <Outlet />;
}