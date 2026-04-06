import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@neondatabase/neon-js/ui/css'
import './styles/neon-brand.css'
import './styles/auth-shell.css'
import './index.css'
import { NeonAuthBridge } from './providers/NeonAuthBridge'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NeonAuthBridge>
        <App />
      </NeonAuthBridge>
    </BrowserRouter>
  </StrictMode>,
)
