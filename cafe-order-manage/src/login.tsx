import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      // ログイン成功後の処理（例: ホームページへのリダイレクト）は
      // AuthContextの状態変更によって自動的に行われる
    } catch (err) {
      setError('ログインに失敗しました。メールアドレスまたはパスワードを確認してください。');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>ログイン</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="email">メールアドレス:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">パスワード:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">ログイン</button>
    </form>
  );
};

export default Login;
