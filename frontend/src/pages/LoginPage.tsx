import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    const target = user.role === 'admin' ? '/admin' : user.role === 'moderator' ? '/moderator' : '/';
    return <div style={{ padding: '20px' }}>Вы уже вошли. <a href={target} style={{ color: 'var(--primary-color)' }}>Перейти в кабинет</a></div>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') navigate('/admin');
      else if (loggedUser.role === 'moderator') navigate('/moderator');
      else navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--card-bg)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Вход в Mao Bao</h2>
      
      {error && (
        <div style={{ backgroundColor: '#fed7d7', color: '#c53030', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }}
            placeholder="Введите email"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }}
            placeholder="Введите пароль"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px',
            backgroundColor: isLoading ? '#a0aec0' : 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
        Нет аккаунта? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Зарегистрироваться</Link>
      </p>
    </div>
  );
}