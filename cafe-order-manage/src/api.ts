// src/api.ts の最終解決コード

import axios from 'axios';

// NestJSサーバーのベースURL
const API_URL = 'http://localhost:3000';

// Axiosのインスタンスを作成
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * JWTトークンをリクエストヘッダーに自動的に追加するインターセプター
 */
apiClient.interceptors.request.use(
  (config) => {
    // ★★★【最終修正】localStorageから 'access_token' (スネークケース) でトークンを取得します
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // トークンが存在すれば、Authorizationヘッダーを設定
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
