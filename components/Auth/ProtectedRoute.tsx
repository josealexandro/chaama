'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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
  const pathname = usePathname()

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

    // Prestador sem assinatura ativa (subscriptionStatus === 'pending'): redireciona para assinatura Stripe.
    // Quando REQUIRE_STRIPE_SUBSCRIPTION=false, novos prestadores recebem 'active' no finalize-prestador-signup e não caem aqui.
    if (
      requireType === 'prestador' &&
      userData?.tipo === 'prestador' &&
      userData?.subscriptionStatus === 'pending' &&
      !pathname?.startsWith('/prestador/assinatura')
    ) {
      router.push('/prestador/assinatura')
      return
    }
  }, [currentUser, userData, loading, requireAuth, requireType, router, pathname])

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

  // Prestador pendente de pagamento: mostra conteúdo só na página de assinatura
  if (
    requireType === 'prestador' &&
    userData?.subscriptionStatus === 'pending' &&
    !pathname?.startsWith('/prestador/assinatura')
  ) {
    return null
  }

  return <>{children}</>
}

