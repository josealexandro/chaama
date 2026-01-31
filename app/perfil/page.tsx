'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import Header from '@/components/Layout/Header'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useToast } from '@/lib/contexts/ToastContext'
import { updateUser } from '@/lib/firestore/users'
import { auth } from '@/lib/firebase/config'
import { updateProfile } from 'firebase/auth'

function PerfilPageInner() {
  const { userData, currentUser, refreshUserData } = useAuth()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [nome, setNome] = useState(userData?.nome ?? '')
  const [telefone, setTelefone] = useState(userData?.telefone ?? '')
  const [cidade, setCidade] = useState(userData?.cidade ?? '')

  const startEditing = () => {
    setNome(userData?.nome ?? '')
    setTelefone(userData?.telefone ?? '')
    setCidade(userData?.cidade ?? '')
    setEditing(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    setSaving(true)
    try {
      await updateUser(currentUser.uid, {
        nome: nome.trim(),
        telefone: telefone.trim(),
        cidade: cidade.trim(),
      })
      if (auth?.currentUser) {
        await updateProfile(auth.currentUser, { displayName: nome.trim() })
      }
      await refreshUserData()
      toast.showToast('Dados atualizados com sucesso!', 'success')
      setEditing(false)
    } catch (err) {
      console.error(err)
      toast.showToast('Erro ao atualizar. Tente novamente.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 text-sm"
          >
            <span>←</span>
            <span>Voltar ao Início</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Meu Perfil
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white dark:bg-gray-700"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white dark:bg-gray-700"
                    placeholder="Sua cidade"
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-4">
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
                </div>
                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={startEditing}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Editar dados
                  </button>
                  {userData?.tipo === 'prestador' && (
                    <Link
                      href="/prestador/dashboard"
                      className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
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
              </>
            )}
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
