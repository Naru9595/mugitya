import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ManageSignin from './manage/manageSinin/page'
import ManageSignup from './manage/manageSinup/page'
import ManageSidebar from './component/manageSidebar'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ManageSignin /> */}
    {/* <ManageSignup /> */}
    <ManageSidebar/>
  </StrictMode>,
)
