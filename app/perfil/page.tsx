'use client'

import Link from 'next/link'
import Header from '@/components/Layout/Header'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import { useAuth } from '@/lib/contexts/AuthContext'

function PerfilPageInner() {
  const { userData } = useAuth()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Meu Perfil
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-4">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Nome</span>
              <p className="text-gray-900 dark:text-white font-medium">
                {userData?.nome || '—'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Tipo</span>
              <p className="text-gray-900 dark:text-white font-medium capitalize">
                {userData?.tipo || '—'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Telefone</span>
              <p className="text-gray-900 dark:text-white font-medium">
                {userData?.telefone || '—'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Cidade</span>
              <p className="text-gray-900 dark:text-white font-medium">
                {userData?.cidade || '—'}
              </p>
            </div>
            <div className="pt-4 flex flex-wrap gap-3">
              {userData?.tipo === 'prestador' && (
                <Link
                  href="/prestador/dashboard"
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Dashboard do Prestador
                </Link>
              )}
              <Link
                href="/anuncios/meus"
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Meus Anúncios
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default function PerfilPage() {
  return (
    <ProtectedRoute requireAuth>
      <PerfilPageInner />
    </ProtectedRoute>
  )
}
