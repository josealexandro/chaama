/**
 * Firestore no servidor (API routes, webhooks).
 * Só inicializa em ambiente Node (typeof window === 'undefined').
 * Usado pelo webhook do Stripe para atualizar subscriptionStatus no Firestore.
 */
import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'

let _serverDb: Firestore | null = null

function getServerDb(): Firestore {
  if (_serverDb) return _serverDb
  if (typeof window !== 'undefined') {
    throw new Error('serverDb só deve ser usado no servidor (API routes)')
  }
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  if (!projectId) throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID não definido')
  const app: FirebaseApp =
    getApps().length === 0
      ? initializeApp({
          projectId,
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        })
      : (getApps()[0] as FirebaseApp)
  _serverDb = getFirestore(app)
  return _serverDb
}

export { getServerDb }
