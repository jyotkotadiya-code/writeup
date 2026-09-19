import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('writeup_token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth state by fetching current user if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await api.getMe();
          setUser(data.user);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('writeup_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    localStorage.setItem('writeup_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('writeup_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  // Quick local update helpers for optimistic UI updates
  const updateLocalWishlist = (novelId, isAdding) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return prev;
      const currentWishlist = prev.wishlist || [];
      const updatedWishlist = isAdding
        ? [...currentWishlist, novelId]
        : currentWishlist.filter((id) => (typeof id === 'object' ? id._id !== novelId : id !== novelId));
      return { ...prev, wishlist: updatedWishlist };
    });
  };

  const updateLocalLikes = (novelId, isAdding) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return prev;
      const currentLiked = prev.likedNovels || [];
      const updatedLiked = isAdding
        ? [...currentLiked, novelId]
        : currentLiked.filter((id) => id !== novelId);
      return { ...prev, likedNovels: updatedLiked };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateLocalWishlist,
        updateLocalLikes,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
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
