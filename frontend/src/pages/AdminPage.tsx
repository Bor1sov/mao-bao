import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Tea, User, Role } from '../types';
import { getTea, createTea, updateTea, deleteTea } from '../api/mockService';
import { useAuth } from '../context/AuthContext';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'teas' | 'users'>('teas');
  const { getAllUsers, changeUserRole } = useAuth();

  // --- Состояния для товаров ---
  const [teas, setTeas] = useState<Tea[]>([]);
  const [loadingTeas, setLoadingTeas] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // --- Состояния для пользователей ---
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const loadTeas = async () => {
    setLoadingTeas(true);
    const data = await getTea();
    setTeas(data);
    setLoadingTeas(false);
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (activeTab === 'teas') loadTeas();
    else loadUsers();
  }, [activeTab]);

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setName('');
    setPrice('');
    setDescription('');
    setImageUrl('');
  };

  const handleEditClick = (tea: Tea) => {
    setIsEditing(true);
    setCurrentId(tea.id);
    setName(tea.name);
    setPrice(tea.price.toString());
    setDescription(tea.description);
    setImageUrl(tea.imageUrl || '');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить этот чай?')) return;
    await deleteTea(id);
    loadTeas();
  };

  const handleSubmitTea = async (e: FormEvent) => {
    e.preventDefault();
    const teaData = { name, price: Number(price), description, imageUrl };
    if (isEditing && currentId) await updateTea(currentId, teaData);
    else await createTea(teaData);
    resetForm();
    loadTeas();
  };

  const handleRoleChange = async (email: string, newRole: Role) => {
    await changeUserRole(email, newRole);
    loadUsers();
  };

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Панель управления</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveTab('teas')}
          style={{ padding: '8px 16px', background: activeTab === 'teas' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'teas' ? 'white' : 'var(--text-color)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Управление чаем
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          style={{ padding: '8px 16px', background: activeTab === 'users' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'users' ? 'white' : 'var(--text-color)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Пользователи
        </button>
      </div>

      {activeTab === 'teas' && (
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {loadingTeas ? <div>Загрузка...</div> : (
            <div style={{ flex: '1 1 500px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--card-bg)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '10px', borderBottom: '2px solid var(--border-color)' }}>Фото</th>
                    <th style={{ padding: '10px', borderBottom: '2px solid var(--border-color)' }}>Название</th>
                    <th style={{ padding: '10px', borderBottom: '2px solid var(--border-color)' }}>Цена</th>
                    <th style={{ padding: '10px', borderBottom: '2px solid var(--border-color)' }}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {teas.map((tea) => (
                    <tr key={tea.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px' }}>
                        {tea.imageUrl && <img src={tea.imageUrl} alt={tea.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />}
                      </td>
                      <td style={{ padding: '10px' }}>{tea.name}</td>
                      <td style={{ padding: '10px' }}>{tea.price} ₽</td>
                      <td style={{ padding: '10px', display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleEditClick(tea)} style={{ cursor: 'pointer', color: 'var(--primary-color)', background: 'none', border: 'none' }}>Ред.</button>
                        <button onClick={() => handleDelete(tea.id)} style={{ cursor: 'pointer', color: '#e53e3e', background: 'none', border: 'none' }}>Удал.</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ flex: '1 1 300px', backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ marginTop: 0 }}>{isEditing ? 'Редактировать чай' : 'Добавить чай'}</h3>
            <form onSubmit={handleSubmitTea} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }} />
              <input type="number" placeholder="Цена" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }} />
              <input type="text" placeholder="URL изображения" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }} />
              <textarea placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)', minHeight: '80px' }} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  {isEditing ? 'Сохранить' : 'Создать'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} style={{ padding: '10px', backgroundColor: 'var(--border-color)', color: 'var(--text-color)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Отмена</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          {loadingUsers ? <div>Загрузка...</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--card-bg)' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '10px', borderBottom: '2px solid var(--border-color)' }}>Email</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid var(--border-color)' }}>Текущая роль</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid var(--border-color)' }}>Изменить роль</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.email} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px' }}>{u.email}</td>
                    <td style={{ padding: '10px' }}><strong>{u.role}</strong></td>
                    <td style={{ padding: '10px' }}>
                      <select 
                        value={u.role} 
                        onChange={(e) => handleRoleChange(u.email, e.target.value as Role)}
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)' }}
                      >
                        <option value="user">user</option>
                        <option value="moderator">moderator</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}