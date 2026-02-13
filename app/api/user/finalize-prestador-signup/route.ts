import { NextRequest, NextResponse } from 'next/server'
import * as admin from 'firebase-admin'
import { getAdminDb } from '@/lib/firebase/adminDb'

/**
 * Finaliza o cadastro de prestador após o signup.
 *
 * FLAG DE ASSINATURA (reversão futura):
 * - Variável de ambiente REQUIRE_STRIPE_SUBSCRIPTION:
 *   - "false" = prestador gratuito: este endpoint marca subscriptionStatus = 'active' e retorna requireSubscription: false.
 *   - ausente ou diferente de "false" = exige assinatura: retorna requireSubscription: true (cliente deve redirecionar para Stripe).
 *
 * Para REVERTER e voltar a cobrar assinatura:
 * 1. No .env.local (e na Vercel), remova REQUIRE_STRIPE_SUBSCRIPTION ou defina REQUIRE_STRIPE_SUBSCRIPTION=true.
 * 2. Faça redeploy. Novos prestadores passarão pelo fluxo de pagamento Stripe normalmente.
 * 3. Prestadores que se cadastraram no período gratuito continuarão com subscriptionStatus 'active'; defina política (ex.: aviso para assinar ou migração em massa para 'pending').
 *
 * Segurança: apenas o servidor altera subscriptionStatus para 'active' quando em modo gratuito; o cliente não pode forçar isso.
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    return NextResponse.json({ error: 'Token de autenticação ausente' }, { status: 401 })
  }

  let uid: string
  try {
    // Garante que o Firebase Admin está inicializado (mesmo app que getAdminDb usa)
    getAdminDb()
    const decoded = await admin.auth().verifyIdToken(token)
    uid = decoded.uid
  } catch (err) {
    console.error('[finalize-prestador-signup] Token inválido:', err)
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 })
  }

  // FLAG: quando "false", prestador é gratuito; caso contrário exige Stripe.
  const requireStripeSubscription = process.env.REQUIRE_STRIPE_SUBSCRIPTION !== 'false'

  if (requireStripeSubscription) {
    return NextResponse.json({ requireSubscription: true })
  }

  try {
    const db = getAdminDb()
    const userRef = db.collection('users').doc(uid)
    const userSnap = await userRef.get()
    if (!userSnap.exists) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }
    const data = userSnap.data()
    if (data?.tipo !== 'prestador') {
      return NextResponse.json({ error: 'Usuário não é prestador' }, { status: 400 })
    }
    await userRef.update({ subscriptionStatus: 'active' })
    return NextResponse.json({ requireSubscription: false })
  } catch (err) {
    console.error('[finalize-prestador-signup]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao finalizar cadastro' },
      { status: 500 }
    )
  }
}
