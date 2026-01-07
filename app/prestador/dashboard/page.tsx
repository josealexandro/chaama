'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import { useAuth } from '@/lib/contexts/AuthContext'
import { getProviderById } from '@/lib/firestore/providers'

export default function ProviderDashboardPage() {
  return (
    <ProtectedRoute requireAuth requireType="prestador">
      <ProviderDashboardInner />
    </ProtectedRoute>
  )
}

function ProviderDashboardInner() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let mounted = true
    async function go() {
      if (!currentUser) return
      try {
        const provider = await getProviderById(currentUser.uid)
        if (!mounted) return
        if (provider) router.replace(`/prestador/${currentUser.uid}`)
        else router.replace('/prestador/cadastro')
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message || 'Erro ao acessar o painel.')
      }
    }
    go()
    return () => {
      mounted = false
    }
  }, [currentUser, router])

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Erro ao abrir o painel</h1>
          <p className="text-sm text-gray-700 dark:text-gray-300 break-words">{error}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Se o erro for <b>permission-denied</b>, atualize as regras do Firestore para permitir leitura/escrita em
            <code className="mx-1">providers</code> e leitura/criação em <code className="mx-1">reviews</code>.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Voltar ao Início
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-gray-700 dark:text-gray-300">Abrindo seu painel...</p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
        >
          ← Voltar ao Início
        </Link>
      </div>
    </main>
  )
}


