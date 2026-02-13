import { NextRequest, NextResponse } from 'next/server'
import * as admin from 'firebase-admin'
import { getAdminDb } from '@/lib/firebase/adminDb'
import type { UserType } from '@/types'

/**
 * Cria o documento do usuário na collection `users` no servidor (Firebase Admin SDK).
 * Usado após o signup para evitar "Missing or insufficient permissions" no cliente:
 * as regras do Firestore em produção podem bloquear a escrita; o Admin SDK ignora as regras.
 *
 * O cliente chama este endpoint logo após createUserWithEmailAndPassword + updateProfile,
 * enviando o token e os dados (nome, telefone, cidade, tipo).
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    return NextResponse.json({ error: 'Token de autenticação ausente' }, { status: 401 })
  }

  let uid: string
  try {
    getAdminDb()
    const decoded = await admin.auth().verifyIdToken(token)
    uid = decoded.uid
  } catch (err) {
    console.error('[create-document] Token inválido:', err)
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 })
  }

  let body: { nome: string; telefone: string; cidade: string; tipo: UserType }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const { nome, telefone, cidade, tipo } = body
  if (!nome || typeof nome !== 'string' || !telefone || typeof telefone !== 'string' || typeof cidade !== 'string' || (tipo !== 'cliente' && tipo !== 'prestador')) {
    return NextResponse.json({ error: 'nome, telefone, cidade e tipo (cliente|prestador) são obrigatórios' }, { status: 400 })
  }

  try {
    const db = getAdminDb()
    const userRef = db.collection('users').doc(uid)
    const existing = await userRef.get()

    // Só cria se ainda não existir (evita que usuário mude o próprio tipo chamando a API de novo).
    if (!existing.exists) {
      const payload: Record<string, unknown> = {
        uid,
        nome: nome.trim(),
        telefone: telefone.trim(),
        cidade: (cidade as string).trim(),
        tipo,
        criadoEm: admin.firestore.FieldValue.serverTimestamp(),
      }
      if (tipo === 'prestador') {
        payload.subscriptionStatus = 'pending'
      }
      await userRef.set(payload)
    }

    // Sempre devolve os dados atuais (criados agora ou já existentes) para o cliente atualizar o estado.
    const data = existing.exists ? existing.data() : { nome: nome.trim(), telefone: telefone.trim(), cidade: (cidade as string).trim(), tipo, subscriptionStatus: tipo === 'prestador' ? 'pending' : undefined }
    const user = {
      uid,
      nome: (data?.nome as string) ?? (nome as string).trim(),
      telefone: (data?.telefone as string) ?? (telefone as string).trim(),
      cidade: (data?.cidade as string) ?? (cidade as string).trim(),
      tipo: (data?.tipo as UserType) ?? tipo,
      subscriptionStatus: data?.subscriptionStatus as 'pending' | 'active' | 'canceled' | 'past_due' | undefined,
    }
    return NextResponse.json({ ok: true, user })
  } catch (err) {
    console.error('[create-document]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao criar documento' },
      { status: 500 }
    )
  }
}
