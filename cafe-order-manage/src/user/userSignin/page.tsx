// frontend/src/components/LoginForm.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // ★ a タグの代わりに Link をインポート

const API_URL = 'http://localhost:3306';

const UserSignin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { access_token } = response.data;
      setIsLoggedIn(true);
      localStorage.setItem('access_token', access_token);
      console.log('ログイン成功！ トークン:', access_token);
    } catch (err) {
      console.error('ログイン失敗:', err);
      setError('メールアドレスまたはパスワードが正しくありません。');
    }
  };

  if (isLoggedIn) {
    // ログイン成功後の表示
    return (
      <div className="h-screen bg-gray-200">
        <div className="flex h-screen items-center justify-center">
          <div className="bg-white rounded p-10 text-center">
            <h2 className="text-xl text-green-600 font-bold">ログイン成功！</h2>
            <p className="mt-2">メニューページへようこそ。</p>
          </div>
        </div>
      </div>
    );
  }

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
                  placeholder="KosenTarou-01"
                  className="w-full rounded border border-gray-500 p-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="flex justify-center text-sm text-white rounded mx-2 mt-2 mb-3 py-1 bg-blue-500 hover:bg-blue-600 w-[calc(100%-1rem)]">
              ログイン
            </button>

            <div className="border-t border-dashed border-gray-500">
              {/* ★★★ a href を Link to に変更 ★★★ */}
              <Link to="/userSignup" className="flex justify-center text-sm text-white rounded mx-2 my-3 py-1 bg-green-500 hover:bg-green-600">
                新規登録
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserSignin;