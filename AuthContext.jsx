import { createContext, useContext, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('session')) || null;
    } catch {
      return null;
    }
  });

  const save = (data) => {
    setSession(data);
    localStorage.setItem('session', JSON.stringify(data));
  };

  const login = async (email, password) =>
    save(await api('/auth/login', { method: 'POST', body: { email, password } }));
  const register = async (name, email, password) =>
    save(await api('/auth/register', { method: 'POST', body: { name, email, password } }));
  const logout = () => {
    setSession(null);
    localStorage.removeItem('session');
  };

  return (
    <AuthContext.Provider
      value={{ user: session?.user, token: session?.token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
