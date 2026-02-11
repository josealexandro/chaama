import { db } from '@/lib/firebase/config'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import type { SubscriptionStatus } from '@/types'

const USERS = 'users'

/** Busca uid do usuário pelo ID da assinatura Stripe (para webhook de cancelamento). */
export async function getUidByStripeSubscriptionId(subscriptionId: string): Promise<string | null> {
  if (!db) return null
  const q = query(
    collection(db, USERS),
    where('stripeSubscriptionId', '==', subscriptionId)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  return snap.docs[0].id
}

export async function updateUser(
  uid: string,
  data: { nome?: string; telefone?: string; cidade?: string }
): Promise<void> {
  if (!db) throw new Error('Firebase não disponível')
  const userRef = doc(db, USERS, uid)
  const payload: Record<string, string> = {}
  if (data.nome !== undefined) payload.nome = data.nome.trim()
  if (data.telefone !== undefined) payload.telefone = data.telefone.trim()
  if (data.cidade !== undefined) payload.cidade = data.cidade.trim()
  if (Object.keys(payload).length === 0) return
  await updateDoc(userRef, payload)
}

/**
 * Atualiza dados da assinatura Stripe do usuário (chamado pelo webhook).
 * Usado para marcar prestador como ativo após pagamento ou cancelado.
 */
export async function updateUserSubscription(
  uid: string,
  data: {
    subscriptionStatus: SubscriptionStatus
    stripeCustomerId?: string
    stripeSubscriptionId?: string
  }
): Promise<void> {
  if (!db) throw new Error('Firebase não disponível')
  const userRef = doc(db, USERS, uid)
  const payload: Record<string, string> = {
    subscriptionStatus: data.subscriptionStatus,
  }
  if (data.stripeCustomerId !== undefined) payload.stripeCustomerId = data.stripeCustomerId
  if (data.stripeSubscriptionId !== undefined) payload.stripeSubscriptionId = data.stripeSubscriptionId
  await updateDoc(userRef, payload)
}
