import { Link } from 'react-router-dom'
import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@neondatabase/neon-js/auth/react'
import { authConfigured } from '../lib/auth'
import '../App.css'

export function Home() {
  return (
    <div className="app-shell">
      {!authConfigured && (
        <aside className="env-banner" role="status">
          Set <code>VITE_NEON_AUTH_URL</code> in <code>.env</code> (Auth Base URL
          from Neon Console → Auth → Configuration). See{' '}
          <code>.env.example</code>.
        </aside>
      )}

      <header className="app-header">
        <div className="brand">
          <Link to="/" className="brand-home-link">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-name">FESTR</span>
          </Link>
        </div>
        <nav className="app-nav" aria-label="Main">
          <Link className="nav-link" to="/">
            Marketing site
          </Link>
          <SignedOut>
            <Link className="nav-link" to="/auth/sign-in">
              Sign in
            </Link>
            <Link className="nav-link nav-link--primary" to="/auth/sign-up">
              Sign up
            </Link>
          </SignedOut>
          <SignedIn>
            <Link className="nav-link" to="/account/settings">
              Account
            </Link>
            <UserButton />
          </SignedIn>
        </nav>
      </header>

      <main className="app-main">
        <h1>Operations</h1>
        <p className="app-lede">
          App shell at <code>/app</code> — incident tools, map, and learn will live here as you
          build them. Signed-in flows use the header above.
        </p>
      </main>
    </div>
  )
}
