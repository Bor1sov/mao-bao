import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CatalogPage } from './pages/CatalogPage';
import { AdminPage } from './pages/AdminPage';
import { ModeratorPage } from './pages/ModeratorPage';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Header />
          <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Routes>
              {/* Доступно всем */}
              <Route path="/" element={<CatalogPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Только для авторизованных ролей */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['moderator']} />}>
                <Route path="/moderator" element={<ModeratorPage />} />
              </Route>

              {/* Если маршрут не найден — на главную */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}