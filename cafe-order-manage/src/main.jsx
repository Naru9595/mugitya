import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ManageSignin from './manageSignin'
import ManageSignup from './manageSignup'
import ManageSidebar from './manageSidebar'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ManageSignin /> */}
    <ManageSignup />
    {/* <ManageSidebar/> */}
  </StrictMode>,
)
