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
 * ログイン後に取得したトークンをlocalStorageから読み込み、
 * すべてのリクエストに 'Authorization: Bearer <token>' を付与します。
 */
apiClient.interceptors.request.use(
  (config) => {
    // localStorageからトークンを取得
    const token = localStorage.getItem('accessToken');
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
