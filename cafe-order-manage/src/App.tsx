// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import './App.css'
import './index.css'
import ManageSignin from "../../cafe-order-manage/src/manage/manageSignin/page"
import ManageSignup from "../../cafe-order-manage/src/manage/manageSignup/page"
import MenuManage from '../../cafe-order-manage/src/manage/menuManage/page'
import OrderManage from '../../cafe-order-manage/src/manage/orderManage/page'
import SalesAnalyze from '../../cafe-order-manage/src/manage/salesAnalyze/page'
import ManageSetting from '../../cafe-order-manage/src/manage/manageSetting/page'
import UserSignin from '../../cafe-order-manage/src/user/userSignin/page'
import UserSignup from '../../cafe-order-manage/src/user/userSignup/page'
import UserMenu from '../../cafe-order-manage/src/user/userMenu/page'

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
          <Route path="/userSignin" element={<UserSignin/>}/>
          <Route path="/userSignup" element={<UserSignup/>}/>
          <Route path="/userMenu" element={<UserMenu/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
