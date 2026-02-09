import {
  db,
} from '@/lib/firebase/config'
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  serverTimestamp,
  increment,
  Timestamp,
} from 'firebase/firestore'
import type { AdCampaign, UserLocation } from '@/types'

const COLLECTION = 'adCampaigns'

function docToCampaign(id: string, data: Record<string, unknown>): AdCampaign {
  const region = (data.region as Record<string, string> | undefined) ?? {}
  const startAt = (data.startAt as { toDate?: () => Date } | undefined)?.toDate?.() ?? new Date()
  const endAt = (data.endAt as { toDate?: () => Date } | undefined)?.toDate?.() ?? new Date()
  const createdAt = (data.createdAt as { toDate?: () => Date } | undefined)?.toDate?.() ?? new Date()
  return {
    id,
    companyId: (data.companyId as string) ?? '',
    title: (data.title as string) ?? '',
    imageUrl: (data.imageUrl as string) ?? '',
    link: (data.link as string) ?? '',
    region: {
      city: region.city ?? '',
      state: region.state ?? '',
      country: region.country ?? 'Brasil',
    },
    startAt,
    endAt,
    status: (data.status as AdCampaign['status']) ?? 'active',
    clicks: (data.clicks as number) ?? 0,
    views: (data.views as number) ?? 0,
    createdAt,
  }
}

export async function createCampaignAd(params: {
  companyId: string
  title: string
  imageUrl: string
  link: string
  region: { city: string; state: string; country?: string }
  planDays: number
}): Promise<string> {
  if (!db) throw new Error('Firebase não disponível')
  const now = new Date()
  const endAt = new Date(now)
  endAt.setDate(endAt.getDate() + params.planDays)

  const ref = collection(db, COLLECTION)
  const payload = {
    companyId: params.companyId,
    title: params.title.trim(),
    imageUrl: params.imageUrl,
    link: params.link.trim(),
    region: {
      city: params.region.city.trim(),
      state: params.region.state.trim(),
      country: (params.region.country ?? 'Brasil').trim(),
    },
    startAt: Timestamp.fromDate(now),
    endAt: Timestamp.fromDate(endAt),
    status: 'active',
    clicks: 0,
    views: 0,
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(ref, payload)
  return docRef.id
}

/**
 * Busca campanhas ativas para exibição (status = active, região = cidade/estado do usuário).
 * A expiração (endAt < now) é feita por Cloud Function; aqui só filtramos por status.
 */
export async function getActiveAds(userLocation: UserLocation): Promise<AdCampaign[]> {
  if (!db) return []
  const col = collection(db, COLLECTION)
  const constraints = [
    where('status', '==', 'active'),
    where('region.city', '==', userLocation.city.trim()),
  ]
  if (userLocation.state?.trim()) {
    constraints.push(where('region.state', '==', userLocation.state.trim()))
  }
  const q = query(col, ...constraints)
  const snapshot = await getDocs(q)
  const list: AdCampaign[] = []
  snapshot.forEach((d) => {
    list.push(docToCampaign(d.id, d.data() as Record<string, unknown>))
  })
  return list
}

/** Lista campanhas criadas pela empresa (companyId = uid do usuário). */
export async function getUserCampaigns(companyId: string): Promise<AdCampaign[]> {
  if (!db) return []
  const col = collection(db, COLLECTION)
  const q = query(col, where('companyId', '==', companyId))
  const snapshot = await getDocs(q)
  const list: AdCampaign[] = []
  snapshot.forEach((d) => {
    list.push(docToCampaign(d.id, d.data() as Record<string, unknown>))
  })
  list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  return list
}

export async function incrementAdClicks(adId: string): Promise<void> {
  if (!db) return
  const docRef = doc(db, COLLECTION, adId)
  await updateDoc(docRef, { clicks: increment(1) })
}

export async function incrementAdViews(adId: string): Promise<void> {
  if (!db) return
  const docRef = doc(db, COLLECTION, adId)
  await updateDoc(docRef, { views: increment(1) })
}
