'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Layout/Header'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import { useAuth } from '@/lib/contexts/AuthContext'
import { getUserAds } from '@/lib/firestore/ads'
import { Ad } from '@/types'

export default function MyAdsPage() {
  return (
    <ProtectedRoute requireAuth>
      <MyAdsPageInner />
    </ProtectedRoute>
  )
}

function MyAdsPageInner() {
  const { currentUser } = useAuth()
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!currentUser) return
      
      try {
        const items = await getUserAds(currentUser.uid)
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
  }, [currentUser])

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse" />
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Meus Anúncios
            </h1>
            <Link
              href="/anuncios/criar"
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              + Criar Anúncio
            </Link>
          </div>

          {ads.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Você ainda não criou nenhum anúncio.
              </p>
              <Link
                href="/anuncios/criar"
                className="inline-block bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Criar Primeiro Anúncio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                    <img
                      src={ad.imagemUrl}
                      alt={ad.titulo}
                      className="w-full h-full object-cover"
                    />
                    {!ad.ativo && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Inativo
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {ad.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {ad.descricao}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                      {ad.cidade}
                    </p>
                    <Link
                      href={`/anuncios/editar/${ad.id}`}
                      className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}




