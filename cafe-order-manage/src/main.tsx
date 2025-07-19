// src/main.tsx の最終解決コード

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// AuthProviderの呼び出しをここから削除します。
// プロバイダーの管理はApp.tsxに一元化します。

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
