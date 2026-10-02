// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

/**
 * Normalizes user object to guarantee presence of both name and fullName
 */
const normalizeUser = (u) => {
  if (!u) return null;
  const name = u.name || u.fullName || 'Job Seeker';
  return {
    ...u,
    name,
    fullName: name
  };
};

/**
 * AuthProvider component that wraps the application to supply authentication state,
 * token persistence in localStorage, and authentication helper methods.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? normalizeUser(JSON.parse(stored)) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Validate or synchronize authentication session on startup
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success && res.user) {
            const normalized = normalizeUser(res.user);
            setUser(normalized);
            localStorage.setItem('user', JSON.stringify(normalized));
          }
        } catch (err) {
          console.warn('Authentication token expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  /**
   * Log in user with credentials
   * @param {string} email 
   * @param {string} password 
   */
  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    if (data.success && data.token) {
      const normalized = normalizeUser(data.user);
      setToken(data.token);
      setUser(normalized);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(normalized));
    }
    return data;
  };

  /**
   * Register a new user account
   * @param {object} userData - { name, email, password, targetRole }
   */
  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data.success && data.token) {
      const normalized = normalizeUser(data.user);
      setToken(data.token);
      setUser(normalized);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(normalized));
    }
    return data;
  };

  /**
   * Clear current session and remove stored tokens
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  /**
   * Update active user profile state
   * @param {object} updated - partial or full updated user object
   */
  const updateUser = (updated) => {
    setUser(prev => {
      const next = normalizeUser({ ...prev, ...updated });
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
