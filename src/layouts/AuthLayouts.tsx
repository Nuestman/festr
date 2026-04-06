import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AuthView, AccountView } from '@neondatabase/neon-js/auth/react'

type AuthChromeProps = {
  subtitle: string
  children: ReactNode
  wide?: boolean
}

function AuthChrome({ subtitle, children, wide }: AuthChromeProps) {
  return (
    <div className="auth-shell">
      <div className="auth-shell__aurora" aria-hidden />
      <div
        className={
          wide
            ? 'auth-shell__inner auth-shell__inner--wide'
            : 'auth-shell__inner'
        }
      >
        <header className="auth-shell__header">
          <Link to="/" className="auth-shell__headlink">
            <span className="auth-shell__logo" aria-hidden />
            <h1 className="auth-shell__title">FESTR</h1>
            <span className="sr-only"> — back to home</span>
          </Link>
          <p className="auth-shell__subtitle">{subtitle}</p>
        </header>
        <div className="auth-shell__panel">{children}</div>
      </div>
    </div>
  )
}

export function AuthPageLayout() {
  return (
    <AuthChrome subtitle="Secure access for field operations">
      <AuthView />
    </AuthChrome>
  )
}

export function AccountPageLayout() {
  return (
    <AuthChrome subtitle="Your account and security" wide>
      <AccountView />
    </AuthChrome>
  )
}
