import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './cartcontext';

// 各ページコンポーネントのインポート
import ManageSignin from "./manage/manageSignin/page";
import ManageSignup from "./manage/manageSignup/page";
import MenuManage from './manage/menuManage/page';
import OrderManage from './manage/orderManage/page';
import SalesAnalyze from './manage/salesAnalyze/page';
import ManageSetting from './manage/manageSetting/page';
import UserSignin from './user/userSignin/page';
import UserSignup from './user/userSignup/page';
import UserMenu from './user/userMenu/page';

// TopPageコンポーネント
function TopPage() {
  return (
    <div className="relative w-screen h-screen bg-white">
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div>
          <div className="text-2xl text-blue-700 font-bold">学食スマートオーダー</div>
          <div className="flex items-center justify-center mt-2">タップしてログイン</div>
        </div>
      </div>
      <Link
        to="/signin" // ユーザー用のログインページへ
        className="absolute inset-0 z-10"
      />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
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
            
            {/* デフォルトのルートパス */}
            <Route path="/" element={<TopPage/>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
