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

import { Link } from 'react-router-dom'

function TopPage() {
  return (
    <div className="relative w-screen h-screen bg-white">
      {/* 表示用の背景やテキスト */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div>
          <div className="text-2xl text-blue-700 font-bold">学食スマートオーダー</div>
          <div className="flex items-center justify-center mt-2">タップしてログイン</div>
        </div>
      </div>

      {/* 全画面リンク */}
      <Link
        to="/Signin"
        className="absolute inset-0 z-10"
      >
        {/* 中身は空でOK、全画面クリック用 */}
      </Link>
    </div>
  )
}

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
            <Route path="/" element={<TopPage/>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;