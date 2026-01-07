'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { listProviders } from '@/lib/firestore/providers'
import { Provider } from '@/types'

function onlyDigits(value: string | undefined) {
  if (!value) return ''
  return value.replace(/\D+/g, '')
}

export default function ResultsPage() {
  const params = useSearchParams()
  const servico = params.get('servico') || 'Todos'
  const cidade = params.get('cidade') || 'Sua região'

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [providers, setProviders] = useState<Provider[]>([])

  const filters = useMemo(() => {
    return {
      servico: servico === 'Todos' ? undefined : servico,
      cidade: cidade === 'Sua região' ? undefined : cidade,
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
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {servico.charAt(0).toUpperCase() + servico.slice(1)} em {cidade}
          </h1>
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-700">
            Nova busca
          </Link>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-white rounded-xl border border-red-200 shadow-sm p-4">
              <p className="text-red-700 text-sm break-words">{error}</p>
              <p className="text-gray-600 text-sm mt-2">
                Se aparecer <b>permission-denied</b>, ajuste as regras do Firestore para permitir leitura em
                <code className="mx-1">providers</code>.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse h-24" />
          )}

          {!loading && !error && providers.map((p) => {
            const phone = onlyDigits(p.whatsapp)
            const waHref = phone
              ? `https://wa.me/${phone}?text=${encodeURIComponent('Olá, vim pelo Chaama e gostaria de um orçamento.')}`
              : undefined
            return (
            <div key={p.userId} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/prestador/${p.userId}`} className="text-base font-semibold text-gray-900 hover:text-blue-600">
                      {p.nome}
                    </Link>
                    {p.premium && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{p.servico}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-sm text-gray-600">{(p.notaMedia ?? 0).toFixed(1)}</span>
                  </div>
                </div>
                {waHref && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Chamar no WhatsApp
                  </a>
                )}
              </div>
            </div>
          )})}

          {!loading && !error && providers.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-600">
              Nenhum prestador encontrado para sua busca.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}


