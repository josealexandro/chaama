import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getAdminDb } from '@/lib/firebase/adminDb'

/**
 * Confirma a assinatura após o checkout: busca a sessão no Stripe e, se paga e do usuário,
 * atualiza o Firestore. Usado quando o usuário cai na página de sucesso (plano B se o webhook atrasar).
 */
export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe não configurado' }, { status: 500 })
  }

  let body: { session_id: string; uid: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const { session_id, uid } = body
  if (!session_id || !uid) {
    return NextResponse.json({ error: 'session_id e uid são obrigatórios' }, { status: 400 })
  }

  try {
    const stripe = new Stripe(secretKey, { apiVersion: '2026-01-28.clover' })
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.metadata?.uid !== uid && session.client_reference_id !== uid) {
      return NextResponse.json({ error: 'Sessão não pertence a este usuário' }, { status: 403 })
    }
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Pagamento não concluído' }, { status: 400 })
    }

    const db = getAdminDb()
    await db.collection('users').doc(uid).update({
      subscriptionStatus: 'active',
      ...(session.customer && { stripeCustomerId: String(session.customer) }),
      ...(session.subscription && { stripeSubscriptionId: String(session.subscription) }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Stripe confirm-session]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao confirmar' },
      { status: 500 }
    )
  }
}
