'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useToast } from '@/lib/contexts/ToastContext'
import { addReview, getUserReview } from '@/lib/firestore/reviews'

interface ReviewFormProps {
  providerId: string
  providerName: string
}

export default function ReviewForm({ providerId, providerName }: ReviewFormProps) {
  const { currentUser } = useAuth()
  const toast = useToast()
  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [existingReview, setExistingReview] = useState<{ nota: number; comentario: string } | null>(null)

  useEffect(() => {
    async function load() {
      if (!currentUser) return
      const review = await getUserReview(providerId, currentUser.uid)
      if (review) {
        setExistingReview({ nota: review.nota, comentario: review.comentario })
        setNota(review.nota)
        setComentario(review.comentario)
      }
      setLoading(false)
    }
    load()
  }, [providerId, currentUser])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    if (!comentario.trim()) {
      toast.showToast('Digite um comentário.', 'error')
      return
    }
    setSaving(true)
    try {
      await addReview(providerId, currentUser.uid, nota, comentario.trim())
      setExistingReview({ nota, comentario: comentario.trim() })
      toast.showToast(existingReview ? 'Avaliação atualizada!' : 'Avaliação enviada!', 'success')
    } catch (err) {
      console.error(err)
      toast.showToast('Erro ao enviar avaliação. Tente novamente.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        Avaliar {providerName}
      </h2>
      {existingReview && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Você já avaliou este prestador. Envie novamente para atualizar.
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nota (1 a 5)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNota(n)}
                className={`w-10 h-10 rounded-lg border-2 text-lg transition-colors ${
                  nota === n
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400'
                }`}
                aria-label={`Nota ${n}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Comentário *
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white dark:bg-gray-700"
            placeholder="Conte como foi sua experiência..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Enviando...' : existingReview ? 'Atualizar avaliação' : 'Enviar avaliação'}
        </button>
      </form>
    </div>
  )
}
