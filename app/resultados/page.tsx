'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { listProviders } from '@/lib/firestore/providers'
import { Provider } from '@/types'
import AdsSidebar from '@/components/Ads/AdsSidebar'
import Header from '@/components/Layout/Header'

function onlyDigits(value: string | undefined) {
  if (!value) return ''
  return value.replace(/\D+/g, '')
}

function ResultsPageContent() {
  const params = useSearchParams()
  const servico = params.get('servico') || ''
  const cidade = params.get('cidade') || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [providers, setProviders] = useState<Provider[]>([])

  const filters = useMemo(() => {
    return {
      servico: servico?.trim() || undefined,
      cidade: cidade?.trim() || undefined,
    }
  }, [servico, cidade])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const items = await listProviders(filters)
        if (!mounted) return
        setProviders(items)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message || 'Erro ao carregar resultados.')
        setProviders([])
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [filters])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Conteúdo principal - Lista de prestadores */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {servico 
                    ? `${servico.charAt(0).toUpperCase() + servico.slice(1)}${cidade ? ` em ${cidade}` : ''}`
                    : cidade 
                      ? `Prestadores em ${cidade}`
                      : 'Todos os prestadores'}
                </h1>
                <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Nova busca
                </Link>
              </div>

              <div className="space-y-4">
                {error && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800 shadow-sm p-4">
                    <p className="text-red-700 dark:text-red-400 text-sm break-words">{error}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                      Se aparecer <b>permission-denied</b>, ajuste as regras do Firestore para permitir leitura em
                      <code className="mx-1">providers</code>.
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 animate-pulse h-24" />
                )}

                {!loading && !error && providers.map((p) => {
                  const phone = onlyDigits(p.whatsapp)
                  const waHref = phone
                    ? `https://wa.me/${phone}?text=${encodeURIComponent('Olá, vim pelo Chaama e gostaria de um orçamento.')}`
                    : undefined
                  return (
                  <div key={p.userId} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link href={`/prestador/${p.userId}`} className="text-base font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 break-words">
                            {p.nome}
                          </Link>
                          {p.premium && (
                            <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 shrink-0">
                              Premium
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{p.servico}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-yellow-500">★★★★★</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{(p.notaMedia ?? 0).toFixed(1)}</span>
                        </div>
                      </div>
                      {waHref && (
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm text-center shrink-0"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                )})}

                {!loading && !error && providers.length === 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center text-gray-600 dark:text-gray-400">
                    Nenhum prestador encontrado para sua busca.
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Anúncios (só aparece em telas grandes e se houver cidade) */}
            {cidade && (
              <aside className="w-full lg:w-80 shrink-0">
                <AdsSidebar cidade={cidade} />
              </aside>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="h-24 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse" />
            </div>
          </main>
        </>
      }
    >
      <ResultsPageContent />
    </Suspense>
  )
}
