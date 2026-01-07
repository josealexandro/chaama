'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

export default function Header() {
  const { currentUser, userData, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Chaama"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          <nav className="flex items-center gap-4">
            <ThemeToggle />
            {currentUser ? (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  Olá, <span className="font-medium">{userData?.nome || 'Usuário'}</span>
                </span>
                {userData?.tipo === 'prestador' && (
                  <Link
                    href="/prestador/dashboard"
                    className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                  >
                    Meu Painel
                  </Link>
                )}
                <Link
                  href="/perfil"
                  className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

