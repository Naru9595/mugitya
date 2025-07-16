// frontend/src/components/UserSignin.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ★ jwt-decodeをインポート

const API_URL = 'http://localhost:3000';

const UserSignin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // ★ ローディング状態を追加

  const navigate = useNavigate(); // ★ 画面遷移用のフック

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true); // ★ ローディング開始

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      console.log('ログイン成功！');

      // --- ★★★ ここからが修正部分 ★★★ ---

      // 1. トークンをデコードして、中身（ペイロード）を取り出す
      const decodedPayload = jwtDecode<{ role: string }>(access_token);

      // 2. ペイロード内のroleに応じて、遷移先を決定する
      if (decodedPayload.role === 'admin') {
        navigate('/menuManage'); // 管理者なら管理者ページへ
      } else {
        navigate('/userMenu'); // 一般ユーザーならユーザーメニューページへ
      }

    } catch (err) {
      console.error('ログイン失敗:', err);
      setError('メールアドレスまたはパスワードが正しくありません。');
    } finally {
      setIsLoading(false); // ★ 成功・失敗どちらでもローディングを終了
    }
  };
  
  // ログイン成功後は即座に画面遷移するため、成功時の表示は不要になります

  return (
    <>
      <div className="h-screen bg-gray-200">
        <div className="flex h-screen items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white rounded w-auto">
            <div className="flex justify-center text-xl text-blue-700 p-2 mx-10 font-bold">学食スマートオーダー</div>

            {error && <div className="text-xs text-red-500 text-center pb-2">{error}</div>}

            <div className="px-2 pb-2">
              <div className="text-xs">メールアドレス</div>
              <div>
                <input
                  type="email"
                  placeholder="kosentarou@gmail.com"
                  className="w-full rounded border border-gray-500 p-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="px-2 pb-2">
              <div className="text-xs">パスワード</div>
              <div>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full rounded border border-gray-500 p-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="flex justify-center text-sm text-white rounded mx-2 mt-2 mb-3 py-1 bg-blue-500 hover:bg-blue-600 w-[calc(100%-1rem)] disabled:bg-gray-400">
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>

            <div className="border-t border-dashed border-gray-500">
              <Link to="/userSignup" className="flex justify-center text-sm text-green-500 hover:text-green-600 py-2">
                新規登録はこちら
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserSignin;