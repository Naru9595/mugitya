// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // AuthProviderをインポート
import { CartProvider } from './cartcontext'; // CartProviderをインポート

// アプリケーションで使う全てのページコンポーネントをインポート
import ManageSignin from "./manage/manageSignin/page";
import ManageSignup from "./manage/manageSignup/page";
import MenuManage from './manage/menuManage/page';
import OrderManage from './manage/orderManage/page';
import SalesAnalyze from './manage/salesAnalyze/page';
import ManageSetting from './manage/manageSetting/page';
import UserSignin from './user/userSignin/page';
import UserSignup from './user/userSignup/page';
import UserMenu from './user/userMenu/page';

function App() {
  return (
    // 1. AuthProviderとCartProviderでアプリ全体をラップする
    <AuthProvider>
      <CartProvider>
        {/* 2. react-router-domのRouterでルーティング機能を有効にする */}
        <Router>
          {/* 3. Routesの中で、URLのパスと表示するコンポーネントを定義する */}
          <Routes>
            {/* 管理者向けページ */}
            <Route path="/manageSignin" element={<ManageSignin />} />
            <Route path="/manageSignup" element={<ManageSignup />} />
            <Route path="/menuManage" element={<MenuManage />} />
            <Route path="/orderManage" element={<OrderManage />} />
            <Route path="/salesAnalyze" element={<SalesAnalyze />} />
            <Route path="/manageSetting" element={<ManageSetting />} />

            {/* ユーザー向けページ */}
            <Route path="/signin" element={<UserSignin />} />
            <Route path="/userSignup" element={<UserSignup />} />
            <Route path="/userMenu" element={<UserMenu />} />
            
            {/* デフォルトのルートパス（最初に表示されるページ） */}
            <Route path="/" element={<UserSignin />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;