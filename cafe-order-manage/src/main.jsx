import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ManageSignin from './manage/manageSignin/page'
import ManageSignup from './manage/manageSignup/page'
import ManageSidebar from './manage/component/manageSidebar'
import MenuManage from './manage/menuManage/page'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
    <ManageSignin />
    {/* <ManageSignup /> */}
    {/* <ManageSidebar/> */}
  </StrictMode>,
)
