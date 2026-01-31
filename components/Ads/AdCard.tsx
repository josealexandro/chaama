'use client'

import { Ad } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

interface AdCardProps {
  ad: Ad
}

export default function AdCard({ ad }: AdCardProps) {
  const content = (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {ad.imagemUrl && (
        <div className="relative w-full h-32 sm:h-40 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <Image
            src={ad.imagemUrl}
            alt={ad.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
          {ad.titulo}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {ad.descricao}
        </p>
        <div className="mt-2 space-y-1">
          {ad.endereco && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              📍 {ad.endereco}
            </p>
          )}
          {ad.cidade && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {ad.endereco ? '' : '📍 '}{ad.cidade}
            </p>
          )}
          {(ad.endereco || ad.cidade) && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([ad.endereco, ad.cidade].filter(Boolean).join(', '))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
            >
              Ver no mapa
            </a>
          )}
        </div>
      </div>
    </div>
  )

  if (ad.linkUrl) {
    return (
      <Link href={ad.linkUrl} target="_blank" rel="noopener noreferrer">
        {content}
      </Link>
    )
  }

  return content
}

