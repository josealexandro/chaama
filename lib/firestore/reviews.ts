import { db } from '@/lib/firebase/config'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  where,
  serverTimestamp,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { Review } from '@/types'
import { User } from '@/types'

const REVIEWS = 'reviews'
const PROVIDERS = 'providers'
const USERS = 'users'

// Interface estendida para incluir dados do usuário e ID
export interface ReviewWithUser extends Review {
  id: string
  userName?: string
  userPhoto?: string
}

export async function addReview(providerId: string, userId: string, nota: number, comentario: string) {
  if (!db) throw new Error('Firebase não disponível')
  // Verificar se o usuário já avaliou este prestador
  const existingReview = await getUserReview(providerId, userId)
  
  const providerRef = doc(db, PROVIDERS, providerId)
  
  // Atualizar nota média do prestador e criar/atualizar avaliação em uma transação
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(providerRef)
    if (!snap.exists()) throw new Error('Prestador não encontrado')
    
    const data = snap.data() as any
    let num = data.numAvaliacoes ?? 0
    let media = data.notaMedia ?? 0

    if (existingReview) {
      // Atualizando avaliação existente
      const oldNota = existingReview.nota
      if (num > 0) {
        const totalNotas = media * num
        const newTotal = totalNotas - oldNota + nota
        media = newTotal / num
      } else {
        // Caso edge: não deveria acontecer, mas prevenir divisão por zero
        num = 1
        media = nota
      }
      
      // Atualizar avaliação existente
      const reviewRef = doc(db, REVIEWS, existingReview.id)
      tx.update(reviewRef, {
        nota,
        comentario,
        criadoEm: serverTimestamp(),
      })
    } else {
      // Nova avaliação
      num = num + 1
      media = num === 1 ? nota : (media * (num - 1) + nota) / num
      
      // Criar nova avaliação
      const reviewRef = doc(collection(db, REVIEWS))
      tx.set(reviewRef, {
        providerId,
        userId,
        nota,
        comentario,
        criadoEm: serverTimestamp(),
      })
    }

    // Atualizar prestador
    tx.update(providerRef, {
      numAvaliacoes: num,
      notaMedia: Number(media.toFixed(2)),
    })
  })
}

export async function listProviderReviews(providerId: string): Promise<ReviewWithUser[]> {
  if (!db) return []
  const q = query(
    collection(db, REVIEWS),
    where('providerId', '==', providerId),
    orderBy('criadoEm', 'desc')
  )
  const res = await getDocs(q)
  
  const reviews: ReviewWithUser[] = []
  
  for (const docSnap of res.docs) {
    const data = docSnap.data()
    const review: ReviewWithUser = {
      id: docSnap.id,
      providerId: data.providerId,
      userId: data.userId,
      nota: data.nota,
      comentario: data.comentario,
      criadoEm: data.criadoEm?.toDate() || new Date(),
    }

    // Buscar dados do usuário
    try {
      const userDoc = await getDoc(doc(db, USERS, data.userId))
      if (userDoc.exists()) {
        const userData = userDoc.data() as User
        review.userName = userData.nome
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
    }

    reviews.push(review)
  }

  return reviews
}

// Verificar se o usuário já avaliou um prestador
export async function getUserReview(providerId: string, userId: string): Promise<ReviewWithUser | null> {
  if (!db) return null
  const q = query(
    collection(db, REVIEWS),
    where('providerId', '==', providerId),
    where('userId', '==', userId)
  )
  const res = await getDocs(q)
  
  if (res.empty) return null

  const docSnap = res.docs[0]
  const data = docSnap.data()
  
  return {
    id: docSnap.id,
    providerId: data.providerId,
    userId: data.userId,
    nota: data.nota,
    comentario: data.comentario,
    criadoEm: data.criadoEm?.toDate() || new Date(),
  }
}


