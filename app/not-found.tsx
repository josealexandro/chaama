import Link from 'next/link'
import Header from '@/components/Layout/Header'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl sm:text-8xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Página não encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Link
            href="/"
            className="inline-block bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Voltar ao Início
          </Link>
        </div>
      </main>
    </>
  )
}




