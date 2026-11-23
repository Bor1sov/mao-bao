import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#2d3748', // Шапка всегда тёмная (как в Т-Банке)
      color: 'white',
      marginBottom: '20px'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          🍵 Mao Bao
        </Link>
      </div>

      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Каталог</Link>
        
        {user?.role === 'admin' && (
          <Link to="/admin" style={{ color: '#f6ad55', textDecoration: 'none', fontWeight: 'bold' }}>
            Админка
          </Link>
        )}

        {user?.role === 'moderator' && (
          <Link to="/moderator" style={{ color: '#63b3ed', textDecoration: 'none', fontWeight: 'bold' }}>
            Модерация
          </Link>
        )}

        <button 
          onClick={toggleTheme}
          style={{ background: 'none', border: '1px solid #4a5568', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              {user.email} ({user.role})
            </span>
            <button 
              onClick={handleLogout}
              style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: '#e53e3e', color: 'white' }}
            >
              Выйти
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Войти</Link>
            <Link to="/register" style={{ color: '#63b3ed', textDecoration: 'none' }}>Регистрация</Link>
          </div>
        )}
      </nav>
    </header>
  );
}