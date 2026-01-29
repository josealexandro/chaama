import { db } from '@/lib/firebase/config'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { Provider } from '@/types'
import { normalizeText } from '@/lib/utils/normalize'

const PROVIDERS = 'providers'

export async function upsertProvider(userId: string, data: Omit<Provider, 'userId' | 'notaMedia' | 'ativo'>) {
  if (!db) throw new Error('Firebase não disponível')
  const providerDoc = doc(db, PROVIDERS, userId)
  const payload: any = {
    userId,
    nome: data.nome,
    servico: data.servico,
    descricao: data.descricao,
    cidade: data.cidade,
    whatsapp: data.whatsapp,
    precoMedio: data.precoMedio,
    premium: data.premium ?? false,
    notaMedia: 0,
    numAvaliacoes: 0,
    ativo: true,
    servicoLower: normalizeText(data.servico),
    cidadeLower: normalizeText(data.cidade),
  }
  
  // Só adiciona fotoUrl se não for undefined
  if (data.fotoUrl) {
    payload.fotoUrl = data.fotoUrl
  }
  
  await setDoc(providerDoc, payload, { merge: true })
  return userId
}

export async function getProviderById(providerId: string): Promise<Provider | null> {
  if (!db) return null
  const ref = doc(db, PROVIDERS, providerId)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as Provider) : null
}

export interface ListProvidersFilters {
  servico?: string
  cidade?: string
}

export async function listProviders(filters: ListProvidersFilters): Promise<Provider[]> {
  if (!db) return []
  const col = collection(db, PROVIDERS)
  const constraints = []
  if (filters.servico) constraints.push(where('servicoLower', '==', normalizeText(filters.servico)))
  if (filters.cidade) constraints.push(where('cidadeLower', '==', normalizeText(filters.cidade)))
  const q = constraints.length ? query(col, ...constraints) : query(col)
  const res = await getDocs(q)
  const items: Provider[] = []
  res.forEach((d) => items.push(d.data() as Provider))
  return items
}


