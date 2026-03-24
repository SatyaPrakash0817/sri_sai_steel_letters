import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Decode JWT to extract admin flag
const decodeToken = (token: string): { is_admin?: boolean } | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (e) {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      const decoded = decodeToken(token);
      setIsAdmin(decoded?.is_admin || false);
    } else {
      localStorage.removeItem('authToken');
      setIsAdmin(false);
    }
  }, [token]);

  const login = (t: string) => setToken(t);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
