'use client'

import { AuthProvider } from '@/lib/contexts/AuthContext'
import { ThemeProvider } from '@/lib/contexts/ThemeContext'
import { ToastProvider } from '@/lib/contexts/ToastContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

