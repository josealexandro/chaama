'use client'

import LoginForm from '@/components/Auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">Chaama</h1>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Faça login na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Entre para encontrar ou oferecer serviços
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

