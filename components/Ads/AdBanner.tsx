'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { useAuth } from '@/lib/contexts/AuthContext'
import {
  getActiveAds,
  incrementAdClicks,
  incrementAdViews,
} from '@/lib/firestore/adCampaigns'
import type { AdCampaign } from '@/types'

/**
 * Exibe um banner de campanha ativa para a região do usuário.
 * Escolhe um anúncio aleatório, incrementa views ao exibir e clicks ao clicar.
 */
export default function AdBanner() {
  const { userData } = useAuth()
  const [campaign, setCampaign] = useState<AdCampaign | null>(null)
  const [loading, setLoading] = useState(true)
  const viewsIncremented = useRef(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      const city = userData?.cidade?.trim()
      if (!city) {
        setLoading(false)
        return
      }
      try {
        const list = await getActiveAds({
          city,
          state: (userData as { estado?: string })?.estado?.trim(),
        })
        if (!mounted) return
        if (list.length === 0) {
          setCampaign(null)
          setLoading(false)
          return
        }
        const chosen = list[Math.floor(Math.random() * list.length)]
        setCampaign(chosen)
      } catch (err) {
        console.error('Erro ao carregar banner:', err)
        if (mounted) setCampaign(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [userData?.cidade, (userData as { estado?: string })?.estado])

  // Incrementar views quando o banner for exibido (uma vez por montagem)
  useEffect(() => {
    if (!campaign || viewsIncremented.current) return
    viewsIncremented.current = true
    incrementAdViews(campaign.id).catch(() => {})
  }, [campaign?.id])

  const handleClick = () => {
    if (!campaign) return
    incrementAdClicks(campaign.id).catch(() => {})
  }

  if (loading || !campaign) return null

  const href = campaign.link || '#'
  const isExternal = href.startsWith('http')

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        className="block relative w-full aspect-[3/1] min-h-[120px] sm:min-h-[140px] bg-gray-200 dark:bg-gray-700"
      >
        <Image
          src={campaign.imageUrl}
          alt={campaign.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1024px"
        />
      </a>
      <p className="sr-only">{campaign.title}</p>
    </div>
  )
}
