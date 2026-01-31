import { db } from '@/lib/firebase/config'
import { doc, updateDoc } from 'firebase/firestore'

const USERS = 'users'

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
