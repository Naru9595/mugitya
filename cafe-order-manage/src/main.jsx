import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ManageSignin from './manage/manageSignin'
import ManageSignup from './manage/manageSignup'
import ManageSidebar from './manage/manageSidebar'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ManageSignin /> */}
    {/* <ManageSignup /> */}
    <ManageSidebar/>
  </StrictMode>,
)
