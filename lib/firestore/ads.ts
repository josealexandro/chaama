import { db } from '@/lib/firebase/config'
import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { normalizeText } from '@/lib/utils/normalize'
import { Ad } from '@/types'

const ADS = 'ads'

export async function listAds(cidade?: string): Promise<Ad[]> {
  if (!db) return []
  const col = collection(db, ADS)
  const constraints = [where('ativo', '==', true)]
  
  if (cidade) {
    constraints.push(where('cidadeLower', '==', normalizeText(cidade)))
  }
  
  const q = query(col, ...constraints)
  const res = await getDocs(q)
  
  const items: Ad[] = []
  res.forEach((d) => {
    const data = d.data()
    items.push({
      id: d.id,
      titulo: data.titulo,
      descricao: data.descricao,
      imagemUrl: data.imagemUrl,
      linkUrl: data.linkUrl,
      cidade: data.cidade,
      endereco: data.endereco,
      userId: data.userId,
      ativo: data.ativo,
      criadoEm: data.criadoEm?.toDate() || new Date(),
    })
  })
  
  return items
}

export async function createAd(data: {
  titulo: string
  descricao: string
  imagemUrl: string
  linkUrl?: string
  cidade: string
  endereco?: string
  userId: string
}): Promise<string> {
  if (!db) throw new Error('Firebase não disponível')
  const col = collection(db, ADS)
  const payload: any = {
    titulo: data.titulo,
    descricao: data.descricao,
    imagemUrl: data.imagemUrl,
    linkUrl: data.linkUrl || null,
    cidade: data.cidade,
    cidadeLower: normalizeText(data.cidade),
    userId: data.userId,
    ativo: true,
    criadoEm: serverTimestamp(),
  }
  
  if (data.endereco && data.endereco.trim()) {
    payload.endereco = data.endereco.trim()
  }
  
  const docRef = await addDoc(col, payload)
  return docRef.id
}

export async function getAdById(adId: string): Promise<Ad | null> {
  if (!db) return null
  const docRef = doc(db, ADS, adId)
  const snap = await getDoc(docRef)
  
  if (!snap.exists()) return null
  
  const data = snap.data()
  return {
    id: snap.id,
    titulo: data.titulo,
    descricao: data.descricao,
    imagemUrl: data.imagemUrl,
    linkUrl: data.linkUrl,
    cidade: data.cidade,
    endereco: data.endereco,
    userId: data.userId,
    ativo: data.ativo,
    criadoEm: data.criadoEm?.toDate() || new Date(),
  }
}

export async function updateAd(adId: string, data: {
  titulo: string
  descricao: string
  imagemUrl: string
  linkUrl?: string
  cidade: string
  endereco?: string
}): Promise<void> {
  if (!db) throw new Error('Firebase não disponível')
  const docRef = doc(db, ADS, adId)
  const payload: any = {
    titulo: data.titulo,
    descricao: data.descricao,
    imagemUrl: data.imagemUrl,
    linkUrl: data.linkUrl || null,
    cidade: data.cidade,
    cidadeLower: normalizeText(data.cidade),
  }
  
  if (data.endereco && data.endereco.trim()) {
    payload.endereco = data.endereco.trim()
  } else {
    payload.endereco = null
  }
  
  await updateDoc(docRef, payload)
}

export async function getUserAds(userId: string): Promise<Ad[]> {
  if (!db) return []
  const col = collection(db, ADS)
  const q = query(col, where('userId', '==', userId))
  const res = await getDocs(q)
  
  const items: Ad[] = []
  res.forEach((d) => {
    const data = d.data()
    items.push({
      id: d.id,
      titulo: data.titulo,
      descricao: data.descricao,
      imagemUrl: data.imagemUrl,
      linkUrl: data.linkUrl,
      cidade: data.cidade,
      endereco: data.endereco,
      userId: data.userId,
      ativo: data.ativo,
      criadoEm: data.criadoEm?.toDate() || new Date(),
    })
  })
  
  return items
}

