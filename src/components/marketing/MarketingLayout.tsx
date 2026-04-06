import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type MarketingLayoutProps = {
  children?: ReactNode
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="marketing">
      <a href="#main-content" className="marketing-skip">
        Skip to content
      </a>
      <header className="marketing-header">
        <div className="marketing-header__inner">
          <Link to="/" className="marketing-logo">
            <span className="marketing-logo__mark" aria-hidden />
            <span className="marketing-logo__text">FESTR</span>
          </Link>
          <nav className="marketing-nav" aria-label="Primary">
            <Link to="/about" className="marketing-nav__link">
              About
            </Link>
            <Link to="/contact" className="marketing-nav__link">
              Contact
            </Link>
            <Link to="/app" className="marketing-nav__cta">
              Open app
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="marketing-footer">
        <div className="marketing-footer__inner">
          <div className="marketing-footer__brand">
            <span className="marketing-logo__mark marketing-logo__mark--sm" aria-hidden />
            <span>FESTR</span>
          </div>
          <nav className="marketing-footer__nav" aria-label="Footer">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
          </nav>
          <p className="marketing-footer__note">
            First Emergency Support &amp; Trained Response
          </p>
        </div>
      </footer>
    </div>
  )
}
