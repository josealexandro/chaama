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

