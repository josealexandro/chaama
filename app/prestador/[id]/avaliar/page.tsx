'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/contexts/AuthContext'
import { getProviderById } from '@/lib/firestore/providers'
import { Provider } from '@/types'
import ReviewForm from '@/components/Reviews/ReviewForm'
import Header from '@/components/Layout/Header'

export default function ReviewPage({ params }: { params: { id: string } }) {
  const providerId = params.id
  const { currentUser } = useAuth()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const data = await getProviderById(providerId)
      if (!mounted) return
      setProvider(data)
      setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [providerId])

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="h-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse" />
          </div>
        </main>
      </>
    )
  }

  if (!provider) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
              <p className="text-gray-700 dark:text-gray-300">Prestador não encontrado.</p>
              <Link
                href="/"
                className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!currentUser) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Você precisa estar logado para avaliar um prestador.
              </p>
              <div className="flex gap-3 justify-center">
                <Link
                  href="/login"
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Fazer Login
                </Link>
                <Link
                  href={`/prestador/${providerId}`}
                  className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Voltar
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Botão voltar */}
          <Link
            href={`/prestador/${providerId}`}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 text-sm"
          >
            <span>←</span>
            <span>Voltar ao Perfil</span>
          </Link>

          {/* Formulário de avaliação */}
          <ReviewForm providerId={providerId} providerName={provider.nome} />
        </div>
      </main>
    </>
  )
}





