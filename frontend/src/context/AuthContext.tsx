import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, role: Role) => Promise<User>;
  logout: () => void;
  getAllUsers: () => Promise<User[]>;
  changeUserRole: (email: string, newRole: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Структура для хранения паролей в мок-базе
interface MockUser extends User {
  password?: string;
}

const DEFAULT_USERS: MockUser[] = [
  { email: 'user@test.com', password: 'user123', role: 'user' },
  { email: 'admin@test.com', password: 'admin123', role: 'admin' },
  { email: 'moderator@test.com', password: 'mod123', role: 'moderator' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Читаем текущего пользователя при старте
  useEffect(() => {
    const storedUser = localStorage.getItem('mao_bao_user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (e) { localStorage.removeItem('mao_bao_user'); }
    }
    
    // Инициализируем базу пользователей, если ее нет
    if (!localStorage.getItem('mao_bao_users')) {
      localStorage.setItem('mao_bao_users', JSON.stringify(DEFAULT_USERS));
    }
    
    setIsLoading(false);
  }, []);

  const getUsersFromStorage = (): MockUser[] => {
    const saved = localStorage.getItem('mao_bao_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_USERS; }
    }
    return DEFAULT_USERS;
  };

  const login = async (email: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const users = getUsersFromStorage();
    const found = users.find((u) => u.email === email && u.password === password);
    
    if (!found) throw new Error('Неверный email или пароль');
    
    const loggedInUser: User = { email: found.email, role: found.role };
    setUser(loggedInUser);
    localStorage.setItem('mao_bao_user', JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  const register = async (email: string, password: string, role: Role = 'user'): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const users = getUsersFromStorage();
    if (users.some(u => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser: MockUser = { email, password, role };
    users.push(newUser);
    localStorage.setItem('mao_bao_users', JSON.stringify(users));

    const loggedInUser: User = { email: newUser.email, role: newUser.role };
    setUser(loggedInUser);
    localStorage.setItem('mao_bao_user', JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mao_bao_user');
  };

  const getAllUsers = async (): Promise<User[]> => {
    const users = getUsersFromStorage();
    return users.map(u => ({ email: u.email, role: u.role }));
  };

  const changeUserRole = async (email: string, newRole: Role): Promise<void> => {
    const users = getUsersFromStorage();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].role = newRole;
      localStorage.setItem('mao_bao_users', JSON.stringify(users));
      
      // Если меняем роль текущему пользователю, обновляем стейт и сессию
      if (user?.email === email) {
        const updatedUser = { ...user, role: newRole };
        setUser(updatedUser);
        localStorage.setItem('mao_bao_user', JSON.stringify(updatedUser));
      }
    }
  };

  if (isLoading) return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка...</div>;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getAllUsers, changeUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth должен использоваться внутри AuthProvider');
  return context;
}