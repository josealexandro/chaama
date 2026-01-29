'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Layout/Header'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import { useAuth } from '@/lib/contexts/AuthContext'
import { createAd } from '@/lib/firestore/ads'
import { uploadImage } from '@/lib/firebase/storage'
import { useToast } from '@/lib/contexts/ToastContext'

function CriarAnuncioPageInner() {
  const { currentUser, userData } = useAuth()
  const router = useRouter()
  const toast = useToast()

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [cidade, setCidade] = useState(userData?.cidade || '')
  const [endereco, setEndereco] = useState('')
  const [imagemFile, setImagemFile] = useState<File | null>(null)
  const [imagemPreview, setImagemPreview] = useState<string>('')
  const [saving, setSaving] = useState(false)

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagemFile(file)
      setImagemPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    if (!titulo.trim() || !descricao.trim() || !cidade.trim()) {
      toast.showToast('Preencha título, descrição e cidade.', 'error')
      return
    }
    if (!imagemFile) {
      toast.showToast('Selecione uma imagem.', 'error')
      return
    }
    setSaving(true)
    try {
      const path = `ads/${currentUser.uid}/${Date.now()}_${imagemFile.name}`
      const imagemUrl = await uploadImage(imagemFile, path)
      await createAd({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        imagemUrl,
        linkUrl: linkUrl.trim() || undefined,
        cidade: cidade.trim(),
        endereco: endereco.trim() || undefined,
        userId: currentUser.uid,
      })
      toast.showToast('Anúncio criado com sucesso!', 'success')
      router.push('/anuncios/meus')
    } catch (err) {
      console.error(err)
      toast.showToast('Erro ao criar anúncio. Tente novamente.', 'error')
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
            href="/anuncios/meus"
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline mb-4 inline-block"
          >
            ← Voltar para Meus Anúncios
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Criar Anúncio
          </h1>
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white dark:bg-gray-700"
                placeholder="Ex: Promoção de serviços"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição *
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white dark:bg-gray-700"
                placeholder="Descreva seu anúncio..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Imagem *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagemChange}
                className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white"
              />
              {imagemPreview && (
                <div className="mt-2 relative w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagemPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Link (opcional)
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white dark:bg-gray-700"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cidade *
              </label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white dark:bg-gray-700"
                placeholder="Sua cidade"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Endereço (opcional)
              </label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white dark:bg-gray-700"
                placeholder="Rua, número..."
              />
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Criar anúncio'}
              </button>
              <Link
                href="/anuncios/meus"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}

export default function CriarAnuncioPage() {
  return (
    <ProtectedRoute requireAuth>
      <CriarAnuncioPageInner />
    </ProtectedRoute>
  )
}
