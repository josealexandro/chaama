'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/contexts/AuthContext'
import Header from '@/components/Layout/Header'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

/**
 * Página de assinatura do prestador:
 * - success=1: pagamento concluído, pode acessar o painel
 * - canceled=1: usuário cancelou no Stripe, pode tentar de novo
 * - sem params e subscriptionStatus pending: mostra botão para ir ao pagamento
 */
function AssinaturaPageInner() {
  const searchParams = useSearchParams()
  const { userData, refreshUserData } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const success = searchParams.get('success') === '1'
  const canceled = searchParams.get('canceled') === '1'
  const sessionId = searchParams.get('session_id')
  const [confirming, setConfirming] = useState(false)

  const handleIrParaPagamento = useCallback(async () => {
    if (!userData?.uid) return
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: userData.uid }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.url) {
        window.location.href = data.url
        return
      }
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }, [userData?.uid])

  // Pagamento concluído: confirma a sessão no backend (atualiza Firestore) e vai ao painel
  const handleIrParaPainel = useCallback(async () => {
    if (!userData?.uid) return
    setConfirming(true)
    try {
      if (sessionId) {
        await fetch('/api/stripe/confirm-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, uid: userData.uid }),
        })
      }
      await refreshUserData()
      router.push('/prestador/dashboard')
    } catch {
      await refreshUserData()
      router.push('/prestador/dashboard')
    } finally {
      setConfirming(false)
    }
  }, [userData?.uid, sessionId, refreshUserData, router])

  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Pagamento confirmado</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Sua assinatura está ativa. Clique abaixo para acessar seu painel.
            </p>
            <button
              onClick={handleIrParaPainel}
              disabled={confirming}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {confirming ? 'Abrindo painel...' : 'Ir para o painel'}
            </button>
          </div>
        </main>
      </>
    )
  }

  // Cancelou no Stripe ou ainda não pagou
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {canceled ? 'Pagamento cancelado' : 'Assinatura necessária'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {canceled
              ? 'Você cancelou o pagamento. Para acessar o painel do prestador, conclua a assinatura.'
              : 'Para oferecer serviços como prestador, assine o plano por R$ 19,99/mês.'}
          </p>
          <button
            onClick={handleIrParaPagamento}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Abrindo...' : 'Assinar e pagar'}
          </button>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-gray-500 dark:text-gray-400 hover:underline"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
    </>
  )
}

export default function AssinaturaPage() {
  return (
    <ProtectedRoute requireAuth requireType="prestador">
      <AssinaturaPageInner />
    </ProtectedRoute>
  )
}
