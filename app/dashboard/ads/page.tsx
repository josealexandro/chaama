'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import { useAuth } from '@/lib/contexts/AuthContext'
import { getUserCampaigns } from '@/lib/firestore/adCampaigns'
import type { AdCampaign } from '@/types'

const STATUS_LABEL: Record<AdCampaign['status'], string> = {
  active: 'Ativa',
  expired: 'Expirada',
  paused: 'Pausada',
}

function MinhasCampanhasPageInner() {
  const { currentUser } = useAuth()
  const [campanhas, setCampanhas] = useState<AdCampaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!currentUser) return
      try {
        const list = await getUserCampaigns(currentUser.uid)
        if (mounted) setCampanhas(list)
      } catch (err) {
        console.error('Erro ao carregar campanhas:', err)
        if (mounted) setCampanhas([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [currentUser])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Minhas campanhas
        </h1>
        <Link
          href="/dashboard/ads/criar"
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          + Criar campanha
        </Link>
      </div>

      {campanhas.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Você ainda não criou nenhuma campanha.
          </p>
          <Link
            href="/dashboard/ads/criar"
            className="inline-block bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Criar primeira campanha
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {campanhas.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
                <Image
                  src={c.imageUrl}
                  alt={c.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span
                  className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded ${
                    c.status === 'active'
                      ? 'bg-green-600 text-white'
                      : c.status === 'expired'
                        ? 'bg-gray-500 text-white'
                        : 'bg-amber-500 text-white'
                  }`}
                >
                  {STATUS_LABEL[c.status]}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {c.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {c.region.city} – {c.region.state}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {c.views} visualizações · {c.clicks} cliques
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  até {c.endAt.toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MinhasCampanhasPage() {
  return (
    <ProtectedRoute requireAuth>
      <MinhasCampanhasPageInner />
    </ProtectedRoute>
  )
}
