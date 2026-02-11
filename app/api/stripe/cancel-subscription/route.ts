import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getAdminDb } from '@/lib/firebase/adminDb'

/**
 * Agenda o cancelamento da assinatura no fim do período (cancel_at_period_end).
 * O webhook customer.subscription.deleted será disparado quando o período acabar
 * e o Firestore será atualizado (subscriptionStatus: 'canceled').
 */
export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe não configurado' }, { status: 500 })
  }

  let body: { uid: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const uid = body?.uid
  if (!uid || typeof uid !== 'string') {
    return NextResponse.json({ error: 'uid é obrigatório' }, { status: 400 })
  }

  try {
    const db = getAdminDb()
    const userSnap = await db.collection('users').doc(uid).get()
    if (!userSnap.exists) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const subscriptionId = userSnap.data()?.stripeSubscriptionId
    if (!subscriptionId || typeof subscriptionId !== 'string') {
      return NextResponse.json({ error: 'Nenhuma assinatura ativa encontrada' }, { status: 400 })
    }

    const stripe = new Stripe(secretKey, { apiVersion: '2026-01-28.clover' })
    await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Stripe cancel-subscription]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao cancelar' },
      { status: 500 }
    )
  }
}
