import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('petRescue_user');
      if (savedUser) return JSON.parse(savedUser);
      return null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('petRescue_token') || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync token to axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Login handler
  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      const { token: receivedToken, user: receivedUser, message } = response.data;

      setUser(receivedUser);
      setToken(receivedToken);

      localStorage.setItem('petRescue_token', receivedToken);
      localStorage.setItem('petRescue_user', JSON.stringify(receivedUser));

      setLoading(false);
      return {
        success: true,
        message,
        user: receivedUser,
        redirectUrl: '/dashboard',
      };
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        'Unable to connect to the server. Please ensure the backend is running.';
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // Register handler
  const register = async (registrationData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, registrationData);

      const { token: receivedToken, user: receivedUser, message } = response.data;

      setUser(receivedUser);
      setToken(receivedToken);

      localStorage.setItem('petRescue_token', receivedToken);
      localStorage.setItem('petRescue_user', JSON.stringify(receivedUser));

      setLoading(false);
      return {
        success: true,
        message,
        user: receivedUser,
        redirectUrl: '/dashboard',
      };
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        'Registration failed. Please verify the information provided.';
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('petRescue_token');
    localStorage.removeItem('petRescue_user');
    sessionStorage.removeItem('petRescue_token');
    sessionStorage.removeItem('petRescue_user');
  };

  // Safe dashboard route resolver by role
  const getDashboardRoute = (role) => {
    return '/dashboard';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        getDashboardRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
