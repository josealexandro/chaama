import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getAdminDb } from '@/lib/firebase/adminDb'

/**
 * Webhook do Stripe: recebe eventos (pagamento concluído, assinatura cancelada, etc.)
 * e atualiza o Firestore (subscriptionStatus do usuário).
 * IMPORTANTE: no Next.js o body já pode vir parseado; precisamos do body raw para
 * validar a assinatura. Por isso lemos request.text() e passamos para constructEvent.
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!webhookSecret || !secretKey) {
    console.error('[Stripe webhook] STRIPE_WEBHOOK_SECRET ou STRIPE_SECRET_KEY não definidos')
    return NextResponse.json({ error: 'Webhook não configurado' }, { status: 500 })
  }

  // Body raw é necessário para o Stripe validar a assinatura
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Assinatura ausente' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const stripe = new Stripe(secretKey, { apiVersion: '2024-11-20.acacia' })
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error('[Stripe webhook] Assinatura inválida:', err)
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 })
  }

  try {
    // Pagamento da assinatura concluído no Checkout
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const uid = session.metadata?.uid || session.client_reference_id

      if (!uid) {
        console.error('[Stripe webhook] checkout.session.completed sem uid no metadata')
        return NextResponse.json({ received: true })
      }

      const db = getAdminDb()
      await db.collection('users').doc(uid).update({
        subscriptionStatus: 'active',
        ...(session.customer && { stripeCustomerId: String(session.customer) }),
        ...(session.subscription && { stripeSubscriptionId: String(session.subscription) }),
      })
      return NextResponse.json({ received: true })
    }

    // Assinatura cancelada: marca usuário como canceled
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      const db = getAdminDb()
      const snap = await db.collection('users').where('stripeSubscriptionId', '==', subscription.id).get()
      if (!snap.empty) {
        await snap.docs[0].ref.update({ subscriptionStatus: 'canceled' })
      }
      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[Stripe webhook] Erro ao processar:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
