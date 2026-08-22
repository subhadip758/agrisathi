import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token') || localStorage.getItem('agrisathi_token');
      const cachedUser = localStorage.getItem('agrisathi_user');
      
      if (cachedUser) {
        try { setUser(JSON.parse(cachedUser)); } catch (_) {}
      }

      if (storedToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          setToken(storedToken);
          localStorage.setItem('token', storedToken);
          localStorage.setItem('agrisathi_user', JSON.stringify(userData));
        } catch (error) {
          console.warn('Auth initialization fallback to cached user:', error);
          if (!cachedUser) {
            setToken(storedToken);
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('agrisathi_token', response.token);
        localStorage.setItem('agrisathi_user', JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        toast.success('Login successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('agrisathi_token', response.token);
        localStorage.setItem('agrisathi_user', JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        toast.success('Registration successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('agrisathi_token');
      localStorage.removeItem('agrisathi_user');
      setToken(null);
      setUser(null);
      toast.info('Logged out successfully');
      return { success: true };
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await authService.updateDetails(userData);
      const updated = response.user || response.data || userData;
      setUser(updated);
      localStorage.setItem('agrisathi_user', JSON.stringify(updated));
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      // Fallback: save profile changes locally when API call fails
      setUser(prev => {
        const updated = { ...prev, ...userData };
        localStorage.setItem('agrisathi_user', JSON.stringify(updated));
        return updated;
      });
      toast.success('Profile updated locally');
      return { success: true };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await authService.updatePassword(currentPassword, newPassword);
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // NEW: Update user role for marketplace feature
  const updateUserRole = async (role) => {
    try {
      const response = await authService.updateRole(role);
      setUser(response.user);
      toast.success(`Role updated to ${role} successfully`);
      return { success: true, user: response.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Role update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    updatePassword,
    updateUserRole, // Added for marketplace integration
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};