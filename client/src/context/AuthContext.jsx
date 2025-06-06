
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import setApiAuthenticationHeader from '../utils/setApiAuthenticationHeader';
import api from '../constants/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setApiAuthenticationHeader(token);
            setIsAuthenticated(true);
        }
    }, [token]);

    const login = async (email, password, role) => {
        try {
            // const response = await axios.post("http://localhost:8000/api/v1/auth/login", {email:email,password: password, role:role});
            const response =await api.admin.login({email:email,password: password, role:role});
            console.log(response,'dd')
            if (response && response.data) {
                const { access_token,user } = response.data;
                setToken(access_token);
                localStorage.setItem('token', access_token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                setIsAuthenticated(true);
                setUserRole(user.role);
                localStorage.setItem('userRole', user.role);
                return user.role;
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try{
            setToken('');
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            delete axios.defaults.headers.common['Authorization'];
            return { ok: true }; 
        }
        catch(error){
            console.error("Logout error:", error);
            return { ok: false };
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, token,userRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};
