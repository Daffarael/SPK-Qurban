'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Cek token di localStorage saat pertama load
        const token = localStorage.getItem('token');
        const savedAdmin = localStorage.getItem('admin');

        if (token && savedAdmin) {
            setAdmin(JSON.parse(savedAdmin));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        const { token, admin: adminData } = response.data.data;

        localStorage.setItem('token', token);
        localStorage.setItem('admin', JSON.stringify(adminData));
        setAdmin(adminData);

        router.push('/admin/dashboard');
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setAdmin(null);
        router.push('/gfb-panel');
    };

    return (
        <AuthContext.Provider value={{ admin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider');
    return context;
}
