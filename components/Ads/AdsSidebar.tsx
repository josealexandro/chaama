'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { listAds } from '@/lib/firestore/ads'
import { Ad } from '@/types'
import AdCard from './AdCard'

interface AdsSidebarProps {
  cidade?: string
}

export default function AdsSidebar({ cidade }: AdsSidebarProps) {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const items = await listAds(cidade)
        if (!mounted) return
        setAds(items)
      } catch (error) {
        console.error('Erro ao carregar anúncios:', error)
        if (!mounted) return
        setAds([])
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [cidade])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <div className="space-y-3">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (ads.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 sticky top-4">
      <div className="space-y-3">
        {ads.map((ad) => (
          <div key={ad.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {ad.imagemUrl && (
              <div className="relative w-full h-24 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <Image
                  src={ad.imagemUrl}
                  alt={ad.titulo}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
            )}
            <div className="p-3">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
                {ad.titulo}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {ad.descricao}
              </p>
              {ad.linkUrl && (
                <a
                  href={ad.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Ver mais →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

