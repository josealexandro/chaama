// Tipos de usuário
export type UserType = 'cliente' | 'prestador'

// Interface do usuário
export interface User {
  uid: string
  nome: string
  tipo: UserType
  telefone: string
  cidade: string
  criadoEm: Date
}

// Interface do prestador
export interface Provider {
  userId: string
  nome: string
  servico: string
  descricao: string
  cidade: string
  whatsapp?: string
  fotoUrl?: string
  precoMedio?: number
  premium?: boolean
  linkMapa?: string
  notaMedia: number
  numAvaliacoes?: number
  ativo: boolean
  // campos normalizados para busca
  servicoLower?: string
  cidadeLower?: string
}

// Interface de avaliação
export interface Review {
  providerId: string
  userId: string
  nota: number // 1 a 5
  comentario: string
  criadoEm: Date
}

// Região para campanhas de anúncio (banner)
export interface AdRegion {
  city: string
  state: string
  country: string
}

export type AdCampaignStatus = 'active' | 'expired' | 'paused'

// Campanha de anúncio (banner com prazo, região e métricas)
export interface AdCampaign {
  id: string
  companyId: string
  title: string
  imageUrl: string
  link: string
  region: AdRegion
  startAt: Date
  endAt: Date
  status: AdCampaignStatus
  clicks: number
  views: number
  createdAt: Date
}

export interface UserLocation {
  city: string
  state?: string
}