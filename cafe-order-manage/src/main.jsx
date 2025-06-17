import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ManageSignin from './manageSignin'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ManageSignin />
  </StrictMode>,
)
