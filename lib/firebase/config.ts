import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

// Só inicializa no cliente (navegador). No servidor/build (Vercel, next build) não roda Firebase.
let app: FirebaseApp | null = null
let _auth: Auth | null = null
let _db: Firestore | null = null
let _storage: FirebaseStorage | null = null

if (typeof window !== 'undefined') {
  const requiredKeys = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ]
  const missing = requiredKeys.filter((key) => !process.env[key]?.trim())
  if (missing.length > 0) {
    console.warn(
      '[Chaama] Firebase não inicializado: variáveis faltando (ou faça um novo deploy na Vercel):',
      missing.join(', ')
    )
  } else {
    try {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : (getApps()[0] as FirebaseApp)
      _auth = getAuth(app)
      _db = getFirestore(app)
      _storage = getStorage(app)
    } catch (err) {
      console.error('[Chaama] Erro ao inicializar Firebase:', err)
    }
  }
}

export const auth = _auth
export const db = _db
export const storage = _storage
export default app
