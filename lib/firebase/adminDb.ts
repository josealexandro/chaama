/**
 * Firebase Admin SDK: usado apenas no servidor (webhook Stripe) para atualizar
 * o Firestore sem autenticação de usuário. O Admin SDK ignora as regras de segurança
 * quando usa credenciais de serviço.
 * Configure GOOGLE_APPLICATION_CREDENTIALS com o caminho do JSON da conta de serviço
 * ou, na Vercel, use FIREBASE_SERVICE_ACCOUNT_JSON com o conteúdo do JSON.
 */
import * as admin from 'firebase-admin'

let _adminDb: admin.firestore.Firestore | null = null

export function getAdminDb(): admin.firestore.Firestore {
  if (_adminDb) return _adminDb
  if (admin.apps.length === 0) {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    if (key) {
      try {
        const cred = JSON.parse(key)
        admin.initializeApp({ credential: admin.credential.cert(cred) })
      } catch (e) {
        console.error('[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_JSON inválido:', e)
        throw new Error('Firebase Admin: credenciais inválidas')
      }
    } else {
      admin.initializeApp({ credential: admin.credential.applicationDefault() })
    }
  }
  _adminDb = admin.firestore()
  return _adminDb
}
