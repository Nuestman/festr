import { Navigate, Route, Routes } from 'react-router-dom'
import {
  AccountPageLayout,
  AuthPageLayout,
} from './layouts/AuthLayouts'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { Landing } from './pages/Landing'
import { Privacy } from './pages/Privacy'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/app" element={<Home />} />
      <Route path="/auth/:path" element={<AuthPageLayout />} />
      <Route path="/account/:path" element={<AccountPageLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
