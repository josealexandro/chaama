'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireType?: 'cliente' | 'prestador'
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireType,
}: ProtectedRouteProps) {
  const { currentUser, userData, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (requireAuth && !currentUser) {
      router.push('/login')
      return
    }

    if (requireType && userData?.tipo !== requireType) {
      router.push('/')
      return
    }
  }, [currentUser, userData, loading, requireAuth, requireType, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !currentUser) {
    return null
  }

  if (requireType && userData?.tipo !== requireType) {
    return null
  }

  return <>{children}</>
}

