import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user data on startup — always verify token with server
    useEffect(() => {
        const fetchMe = async () => {
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) {
                try {
                    const parsed = JSON.parse(storedUser);
                    // Verify session with backend before trusting localStorage
                    const { data } = await API.get('/auth/me');
                    if (data.success) {
                        const verifiedUser = { ...parsed, ...data };
                        setUser(verifiedUser);
                        localStorage.setItem('userInfo', JSON.stringify(verifiedUser));
                    } else {
                        // Server rejected the session
                        localStorage.removeItem('userInfo');
                        setUser(null);
                    }
                } catch (err) {
                    console.error('Session expired or server unavailable:', err);
                    // Token expired or invalid — clear everything
                    localStorage.removeItem('userInfo');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        fetchMe();
    }, []);

    // Login handler
    const login = async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            const { data } = await API.post('/auth/login', { email, password });
            if (data.success) {
                setUser(data);
                localStorage.setItem('userInfo', JSON.stringify(data));
                setLoading(false);
                return { success: true, user: data };
            } else {
                setLoading(false);
                const msg = data.message || 'Login failed. Please try again.';
                setError(msg);
                return { success: false, message: msg };
            }
        } catch (err) {
            setLoading(false);
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
            return { success: false, message: msg };
        }
    };

    // Logout handler
    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                logout,
                isLoggedIn: !!user,
                isAdmin: user?.role === 'admin',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
