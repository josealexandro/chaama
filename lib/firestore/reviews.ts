import { db } from '@/lib/firebase/config'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { Review } from '@/types'

const REVIEWS = 'reviews'
const PROVIDERS = 'providers'

export async function addReview(providerId: string, userId: string, nota: number, comentario: string) {
  const review: Omit<Review, 'criadoEm'> & { criadoEm: any } = {
    providerId,
    userId,
    nota,
    comentario,
    criadoEm: serverTimestamp(),
  }
  await addDoc(collection(db, REVIEWS), review)

  // Atualizar nota média do prestador (transação para consistência simples)
  const providerRef = doc(db, PROVIDERS, providerId)
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(providerRef)
    if (!snap.exists()) return
    const data = snap.data() as any
    const num = (data.numAvaliacoes ?? 0) + 1
    const media = ((data.notaMedia ?? 0) * (num - 1) + nota) / num
    tx.update(providerRef, { numAvaliacoes: num, notaMedia: Number(media.toFixed(2)) })
  })
}

export async function listProviderReviews(providerId: string) {
  const q = query(collection(db, REVIEWS), where('providerId', '==', providerId))
  const res = await getDocs(q)
  return res.docs.map((d) => ({ id: d.id, ...d.data() }))
}


