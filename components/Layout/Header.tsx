'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

export default function Header() {
  const { currentUser, userData, logout } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/')
    setMenuOpen(false)
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
              className="h-10 sm:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {currentUser ? (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  Olá, <span className="font-medium">{userData?.nome || 'Usuário'}</span>
                </span>
                <Link
                  href="/anuncios/meus"
                  className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                >
                  Meus Anúncios
                </Link>
                <Link
                  href="/anuncios/criar"
                  className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                >
                  Criar Anúncio
                </Link>
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-700 dark:text-gray-200"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4 space-y-3">
            {currentUser ? (
              <>
                <div className="px-2 py-1 text-sm text-gray-700 dark:text-gray-200">
                  Olá, <span className="font-medium">{userData?.nome || 'Usuário'}</span>
                </div>
                <Link
                  href="/anuncios/meus"
                  onClick={() => setMenuOpen(false)}
                  className="block px-2 py-2 text-sm text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                >
                  Meus Anúncios
                </Link>
                <Link
                  href="/anuncios/criar"
                  onClick={() => setMenuOpen(false)}
                  className="block px-2 py-2 text-sm text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                >
                  Criar Anúncio
                </Link>
                {userData?.tipo === 'prestador' && (
                  <Link
                    href="/prestador/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-2 py-2 text-sm text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                  >
                    Meu Painel
                  </Link>
                )}
                <Link
                  href="/perfil"
                  onClick={() => setMenuOpen(false)}
                  className="block px-2 py-2 text-sm text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-2 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-2 py-2 text-sm text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  onClick={() => setMenuOpen(false)}
                  className="block px-2 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

