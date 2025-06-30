// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import './App.css'
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

function App() {
  return (
    <>
      <Router>
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
        </Routes>
      </Router>
    </>
  )
}

export default App
