'use client'

import { ReviewWithUser } from '@/lib/firestore/reviews'

interface ReviewListProps {
  reviews: ReviewWithUser[]
  loading?: boolean
}

function StarDisplay({ value }: { value: number }) {
  const filled = Math.round(value)
  return (
    <div className="text-yellow-400 flex items-center gap-1" aria-label={`Nota ${value}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= filled ? 'opacity-100' : 'opacity-30'}>
          ★
        </span>
      ))}
      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{value.toFixed(1)}</span>
    </div>
  )
}

function formatDate(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) {
    return `${years} ano${years > 1 ? 's' : ''} atrás`
  } else if (months > 0) {
    return `${months} mês${months > 1 ? 'es' : ''} atrás`
  } else if (days > 0) {
    return `${days} dia${days > 1 ? 's' : ''} atrás`
  } else {
    return 'Hoje'
  }
}

export default function ReviewList({ reviews, loading }: ReviewListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Nenhuma avaliação ainda. Seja o primeiro a avaliar!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">👤</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {review.userName || 'Usuário Anônimo'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(review.criadoEm)}
                  </p>
                </div>
              </div>
            </div>
            <div className="self-start sm:self-center">
              <StarDisplay value={review.nota} />
            </div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mt-3">
            {review.comentario}
          </p>
        </div>
      ))}
    </div>
  )
}


