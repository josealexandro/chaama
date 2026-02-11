import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

/**
 * Cria uma sessão do Stripe Checkout para assinatura recorrente (plano prestador).
 * Só deve ser chamado para usuários que se cadastraram como prestador (uid no metadata).
 * Variáveis de ambiente: STRIPE_SECRET_KEY, STRIPE_PRICE_ID (id do preço recorrente no Stripe).
 */
export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID

  if (!secretKey || !priceId) {
    return NextResponse.json(
      { error: 'Stripe não configurado (STRIPE_SECRET_KEY ou STRIPE_PRICE_ID)' },
      { status: 500 }
    )
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
    const stripe = new Stripe(secretKey, { apiVersion: '2024-11-20.acacia' })
    const origin = request.headers.get('origin') || request.nextUrl.origin

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/prestador/assinatura?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/prestador/assinatura?canceled=1`,
      client_reference_id: uid,
      metadata: {
        uid,
      },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe não retornou URL' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[Stripe create-checkout-session]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao criar sessão' },
      { status: 500 }
    )
  }
}
