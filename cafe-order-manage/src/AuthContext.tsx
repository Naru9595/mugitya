import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import apiClient from './api';

interface User {
  id: number;
  email: string;
  role: 'customer' | 'staff' | 'admin';
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await apiClient.get<User>('/users/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('accessToken');
          delete apiClient.defaults.headers.common['Authorization'];
        }
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { access_token } = response.data;
      
      localStorage.setItem('accessToken', access_token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      const userResponse = await apiClient.get<User>('/users/profile');
      setUser(userResponse.data);
      return userResponse.data;

    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = { user, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};