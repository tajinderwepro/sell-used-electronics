import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import setApiAuthenticationHeader from '../utils/setApiAuthenticationHeader';
import api from '../constants/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [user, setUser] = useState(null); 

useEffect(() => {
  const storedToken = localStorage.getItem('token');
  const storedRole = localStorage.getItem('userRole');
  const storedUser = localStorage.getItem('user');

  if (storedToken) {
    setToken(storedToken);
    setApiAuthenticationHeader(storedToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    setIsAuthenticated(true);
    setUserRole(storedRole);
    setUser(storedUser);
  }

  setLoading(false);
}, []);
  const login = async (email, password, role) => {
    try {
      const response = await api.admin.login({ email, password, role });
      if (response) {
        const { access_token, user } = response;
        setToken(access_token);
        localStorage.setItem('token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setIsAuthenticated(true);
        setUserRole(user.role);
        setUser(user);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('user', JSON.stringify(user));
        return user.role;
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setToken('');
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      delete axios.defaults.headers.common['Authorization'];
      return { ok: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { ok: false };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token, userRole, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);  
