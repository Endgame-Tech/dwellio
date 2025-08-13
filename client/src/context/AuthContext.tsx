import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi } from '../services/api';
import type { User, LoginCredentials, SignupData } from '../types';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateUserContext: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authApi.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.token && response.user) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      const response = await authApi.signup(userData);
      if (response.success && response.token && response.user) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Invalid signup response');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserContext = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUserContext
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
