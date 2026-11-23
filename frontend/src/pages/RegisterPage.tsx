import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Пароли не совпадают');
    }
    if (password.length < 6) {
      return setError('Пароль должен быть не менее 6 символов');
    }

    setIsLoading(true);
    try {
      await register(email, password, 'user'); // По умолчанию 'user'
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--card-bg)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Регистрация</h2>
      
      {error && <div style={{ backgroundColor: '#fed7d7', color: '#c53030', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Пароль</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Повторите пароль</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }} />
        </div>
        <button type="submit" disabled={isLoading} style={{ padding: '10px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '1rem' }}>
          {isLoading ? 'Создание...' : 'Зарегистрироваться'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
        Уже есть аккаунт? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Войти</Link>
      </p>
    </div>
  );
}