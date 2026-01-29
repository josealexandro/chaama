'use client'

import { useEffect, useState } from 'react'
import { listAds } from '@/lib/firestore/ads'
import { Ad } from '@/types'
import AdCard from './AdCard'

interface AdsListProps {
  cidade?: string
}

export default function AdsList({ cidade }: AdsListProps) {
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

  if (loading) return null

  if (ads.length === 0) return null

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  )
}

