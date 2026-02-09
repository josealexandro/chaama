'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import { useAuth } from '@/lib/contexts/AuthContext'
import { createCampaignAd } from '@/lib/firestore/adCampaigns'
import { uploadImage } from '@/lib/firebase/storage'
import { useToast } from '@/lib/contexts/ToastContext'

const PLAN_DAYS = [3, 7, 30] as const

function CriarCampanhaPageInner() {
  const { currentUser, userData } = useAuth()
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [planDays, setPlanDays] = useState<number>(7)
  const [city, setCity] = useState(userData?.cidade ?? '')
  const [state, setState] = useState('')
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
    if (!title.trim()) {
      toast.showToast('Preencha o título.', 'error')
      return
    }
    if (!city.trim()) {
      toast.showToast('Preencha a cidade.', 'error')
      return
    }
    if (!state.trim()) {
      toast.showToast('Preencha o estado.', 'error')
      return
    }
    if (!imagemFile) {
      toast.showToast('Selecione uma imagem.', 'error')
      return
    }
    setSaving(true)
    try {
      const path = `adCampaigns/${currentUser.uid}/${Date.now()}_${imagemFile.name}`
      const imageUrl = await uploadImage(imagemFile, path)
      await createCampaignAd({
        companyId: currentUser.uid,
        title: title.trim(),
        imageUrl,
        link: link.trim() || '#',
        region: { city: city.trim(), state: state.trim(), country: 'Brasil' },
        planDays,
      })
      toast.showToast('Campanha criada! Seu anúncio já está ativo.', 'success')
      setTitle('')
      setLink('')
      setImagemFile(null)
      setImagemPreview('')
    } catch (err: unknown) {
      console.error('Erro ao criar campanha:', err)
      const msg = err && typeof err === 'object' && 'code' in err
        ? (err as { code: string }).code === 'permission-denied'
          ? 'Permissão negada. Atualize as regras do Firestore (veja REGRAS_FIRESTORE.md).'
          : (err as { message?: string }).message
        : null
      toast.showToast(msg || 'Erro ao criar campanha. Tente novamente.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard/ads"
        className="text-sm text-gray-600 dark:text-gray-400 hover:underline mb-4 inline-block"
      >
        ← Voltar para Minhas campanhas
      </Link>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        Criar campanha de anúncio
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
        Seu banner aparecerá para usuários da região escolhida durante o período do plano.
      </p>

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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white dark:bg-gray-700"
            placeholder="Ex: Promoção de serviços"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Imagem do banner *
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
            Link (para onde o clique leva)
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white dark:bg-gray-700"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Plano (dias em exibição) *
          </label>
          <div className="flex gap-3">
            {PLAN_DAYS.map((days) => (
              <label
                key={days}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="planDays"
                  checked={planDays === days}
                  onChange={() => setPlanDays(days)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700 dark:text-gray-300">{days} dias</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cidade *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white dark:bg-gray-700"
              placeholder="Sua cidade"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Estado (UF) *
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white dark:bg-gray-700"
              placeholder="Ex: SP, MG"
              required
              maxLength={2}
            />
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Criando...' : 'Criar campanha'}
          </button>
          <Link
            href="/dashboard/ads"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

export default function CriarCampanhaPage() {
  return (
    <ProtectedRoute requireAuth>
      <CriarCampanhaPageInner />
    </ProtectedRoute>
  )
}
