// frontend/src/components/UserSignup.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:3000'; // バックエンドのURL

const UserSignup: React.FC = () => {
  // ★ nameのstateを削除
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      setIsLoading(false);
      return;
    }

    try {
      // ★ バックエンドにはemailの値をnameとしても渡す
      await axios.post(`${API_URL}/users/register`, {
        name: email, // nameとしてemailを渡す
        email: email,
        password: password,
      });

      setSuccess('登録が完了しました！自動的にログインします...');

      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      localStorage.setItem('access_token', loginResponse.data.access_token);

      setTimeout(() => {
        navigate('/userMenu');
      }, 2000);

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || '登録中にエラーが発生しました。');
      } else {
        setError('登録中に予期せぬエラーが発生しました。');
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen bg-gray-200">
        <div className="flex h-screen items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white rounded">
            <div className="text-xl text-blue-700 p-2 mx-16 font-bold">アカウント登録</div>

            {error && <div className="text-xs text-red-500 text-center pb-2">{error}</div>}
            {success && <div className="text-xs text-green-500 text-center pb-2">{success}</div>}
            
            {/* ★ お名前の入力欄をここから削除しました */}

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
            <div className="px-2 pb-2">
              <div className="text-xs">パスワード（確認用）</div>
              <div>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full rounded border border-gray-500 p-1"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="flex justify-center text-sm text-white rounded mx-2 mt-2 mb-3 py-1 bg-green-500 hover:bg-green-600 w-[calc(100%-1rem)] disabled:bg-gray-400">
              {isLoading ? '登録中...' : '新規登録'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserSignup;