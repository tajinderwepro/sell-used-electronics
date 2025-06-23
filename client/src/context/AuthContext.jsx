import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import setApiAuthenticationHeader from '../utils/setApiAuthenticationHeader';
import api from '../constants/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true); 
  const [user, setUser] = useState(null); 

  const login = async (email, password, role) => {
    try {
      const response = await api.admin.login({ email, password, role });
      if (response) {
        const { access_token, user } = response;
        setToken(access_token);
        localStorage.setItem('token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true);
        setUser(user);
        return user.role;
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const getMe = async () => {
    try {
      setLoading(true);

      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Set auth header
      setToken(storedToken);
      setApiAuthenticationHeader(storedToken);
      setIsAuthenticated(true);

      // Attempt to get user data from API
      const response = await api.auth.getMe();

      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        // If response format is wrong or failed
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setToken('');
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      delete axios.defaults.headers.common['Authorization'];
      return { ok: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { ok: false };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token, loading, user, getMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);  
