import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';

import './index.css'
import ManageSignin from "./manage/manageSignin/page"
import ManageSignup from "./manage/manageSignup/page"
import MenuManage from './manage/menuManage/page'
import OrderManage from './manage/orderManage/page'
import SalesAnalyze from './manage/salesAnalyze/page'
import ManageSetting from './manage/manageSetting/page'
import UserSignin from './user/userSignin/page'
import UserSignup from './user/userSignup/page'
import UserMenu from './user/userMenu/page'

function AppContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/orderManage');
      } else {
        navigate('/userMenu');
      }
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route path="/manageSignin" element={<ManageSignin/>}/>
      <Route path="/manageSignup" element={<ManageSignup/>}/>
      <Route path="/menuManage" element={<MenuManage/>}/>
      <Route path="/orderManage" element={<OrderManage/>}/>
      <Route path="/salesAnalyze" element={<SalesAnalyze/>}/>
      <Route path="/manageSetting" element={<ManageSetting/>}/>
      <Route path="/Signin" element={<UserSignin/>}/>
      <Route path="/userSignup" element={<UserSignup/>}/>
      <Route path="/userMenu" element={<UserMenu/>}/>
      <Route path="/" element={<UserSignin />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;