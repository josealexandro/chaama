'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/contexts/AuthContext'
import { getProviderById } from '@/lib/firestore/providers'
import { listProviderReviews } from '@/lib/firestore/reviews'
import { Provider } from '@/types'

function formatPrice(value?: number) {
  if (value === undefined || value === null) return ''
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function onlyDigits(value: string | undefined) {
  if (!value) return ''
  return value.replace(/\D+/g, '')
}

function Stars({ value }: { value: number }) {
  const filled = Math.round(value)
  return (
    <div className="text-yellow-500" aria-label={`Nota ${value}`}>
      {'★★★★★'.split('').map((s, i) => (
        <span key={i} className={i < filled ? 'opacity-100' : 'opacity-30'}>
          {s}
        </span>
      ))}
      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{value.toFixed(1)}</span>
    </div>
  )
}

export default function ProviderProfilePage({ params }: { params: { id: string } }) {
  const providerId = params.id
  const { currentUser } = useAuth()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviewCount, setReviewCount] = useState<number>(0)
  
  // Verifica se é o próprio prestador vendo seu perfil
  const isOwner = currentUser?.uid === providerId

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const data = await getProviderById(providerId)
      const reviews = await listProviderReviews(providerId)
      if (!mounted) return
      setProvider(data)
      setReviewCount(reviews?.length ?? 0)
      setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [providerId])

  const waHref = useMemo(() => {
    const phone = onlyDigits(provider?.whatsapp)
    if (!phone) return undefined
    const msg = encodeURIComponent('Olá, vim pelo Chaama e gostaria de um orçamento.')
    return `https://wa.me/${phone}?text=${msg}`
  }, [provider?.whatsapp])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse" />
        </div>
      </main>
    )
  }

  if (!provider) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-gray-700 dark:text-gray-300">Prestador não encontrado.</p>
            <Link href="/" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Botão voltar */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 text-sm"
        >
          <span>←</span>
          <span>Voltar ao Início</span>
        </Link>

        {/* Perfil do prestador */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-4 mb-4">
              {/* Foto de perfil circular */}
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 overflow-hidden flex-shrink-0">
                {provider.fotoUrl ? (
                  <img
                    src={provider.fotoUrl}
                    alt={`Foto de ${provider.nome}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <span className="text-3xl text-gray-400">👤</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{provider.nome}</h1>
                  {provider.premium && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                      Premium
                    </span>
                  )}
                </div>

                <div className="mt-1">
                  <Stars value={provider.notaMedia || 0} />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{provider.servico}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{provider.cidade}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-gray-800 dark:text-gray-200 whitespace-pre-line">{provider.descricao}</div>

            {provider.precoMedio !== undefined && (
              <div className="mt-3 text-gray-800 dark:text-gray-200">
                <span className="font-medium">Preço médio: </span>
                {formatPrice(provider.precoMedio)} <span className="text-sm text-gray-600 dark:text-gray-400">/ dia</span>
              </div>
            )}

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              {isOwner ? (
                // Botão de edição para o próprio prestador
                <Link
                  href="/prestador/cadastro"
                  className="inline-flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ✏️ Editar Perfil
                </Link>
              ) : (
                // Botões para visitantes
                <>
                  {waHref && (
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Chamar no WhatsApp
                    </a>
                  )}
                  <Link
                    href={`/prestador/${provider.userId}/avaliar`}
                    className="inline-flex items-center justify-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    Deixar Avaliação
                  </Link>
                </>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {reviewCount > 0 ? `${reviewCount} avaliações` : 'Sem avaliações ainda'}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


