import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario logueado al cargar la aplicación
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Error al cerrar sesión' };
    }
  };

  const hasRole = (role) => {
    return user && user.rol === role;
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext }