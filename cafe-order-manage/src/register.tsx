import React, { useState } from 'react';
import apiClient from './api';

// Loginコンポーネントからビューを切り替えるためのProps
interface RegisterProps {
  onSwitchToLogin: () => void;
}

const Register = ({ onSwitchToLogin }: RegisterProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // パスワードの確認
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }

    try {
      // NestJSのユーザー作成エンドポイントを呼び出す
      await apiClient.post('/users', { email, password });
      setSuccess('アカウントが正常に作成されました。ログインしてください。');
      
      // フォームをクリア
      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (err: any) {
      if (err.response && err.response.data) {
        // NestJSからのエラーメッセージを表示
        setError(err.response.data.message || '登録に失敗しました。');
      } else {
        setError('登録中に不明なエラーが発生しました。');
      }
    }
  };

  return (
    <div>
      <h2>アカウント新規作成</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <div>
          <label htmlFor="register-email">メールアドレス:</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="register-password">パスワード:</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirm-password">パスワード (確認用):</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">登録する</button>
      </form>
      <p>
        すでにアカウントをお持ちですか？{' '}
        <button onClick={onSwitchToLogin} style={{ all: 'unset', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
          ログインはこちら
        </button>
      </p>
    </div>
  );
};

export default Register;
