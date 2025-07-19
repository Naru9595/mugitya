// src/AuthContext.tsx の最終解決コード

import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './api';

// ユーザー情報の型定義 (変更なし)
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
  const navigate = useNavigate();

  // アプリケーション起動時のユーザーチェック
  useEffect(() => {
    const checkUser = async () => {
      // ★★★【最終修正】'access_token' (スネークケース) でトークンを読み込みます
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // インターセプターがヘッダーを付与するので、ここでの直接操作は不要です
          const response = await apiClient.get<User>('/users/profile');
          setUser(response.data);
        } catch (error) {
          console.error('起動時のユーザー情報取得に失敗。トークンを削除します。', error);
          localStorage.removeItem('access_token');
        }
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  // ログイン処理
  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { access_token } = response.data;

      if (!access_token || typeof access_token !== 'string') {
        throw new Error('サーバーから有効なトークンが返されませんでした。');
      }

      // ★★★【最終修正】'access_token' (スネークケース) でトークンを保存します
      localStorage.setItem('access_token', access_token);

      const userResponse = await apiClient.get<User>('/users/profile');
      setUser(userResponse.data);
      
      navigate('/userMenu');
      return userResponse.data;

    } catch (error) {
      console.error('ログインに失敗しました:', error);
      localStorage.removeItem('access_token');
      setUser(null);
      throw error;
    }
  };

  // ログアウト処理
  const logout = () => {
    // ★★★【最終修正】'access_token' (スネークケース) でトークンを削除します
    localStorage.removeItem('access_token');
    setUser(null);
    navigate('/');
  };

  const value = { user, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// カスタムフック (変更なし)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
