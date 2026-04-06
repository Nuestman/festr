import type { ReactNode } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react'
import { authClient } from '../lib/auth'

type NeonLinkProps = {
  href: string
  className?: string
  children: ReactNode
}

function NeonLink({ href, className, children }: NeonLinkProps) {
  return (
    <RouterLink to={href} className={className}>
      {children}
    </RouterLink>
  )
}

export function NeonAuthBridge({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={navigate}
      Link={NeonLink}
      social={{ providers: ['google'] }}
    >
      {children}
    </NeonAuthUIProvider>
  )
}
