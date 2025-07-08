import React, { createContext, useState, useContext, useEffect } from 'react'; //何かしら不要やけどめんどくさいので未修正
import type { ReactNode } from 'react';
import apiClient from './api';

// --- ★ここから変更 ---
// Userの型定義をこのファイル内に直接記述する
interface User {
  id: number;
  email: string;
  role: 'customer' | 'staff' | 'admin';
  createdAt: string;
  updatedAt: string;
}
// --- ★ここまで変更 ---

// コンテキストが提供する値の型定義
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// コンテキストを提供するプロバイダーコンポーネント
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffectや他のロジックは変更なし...
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await apiClient.get<User>('/users/me'); // APIレスポンスの型を指定
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('accessToken');
        }
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { access_token } = response.data;
      
      localStorage.setItem('accessToken', access_token);

      const userResponse = await apiClient.get<User>('/users/me'); // APIレスポンスの型を指定
      setUser(userResponse.data);

    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const value = { user, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// コンテキストを簡単に利用するためのカスタムフック
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
