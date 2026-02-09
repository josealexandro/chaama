import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

const COLLECTION = 'adCampaigns'

/**
 * A cada hora, marca como "expired" as campanhas cujo endAt já passou.
 * Assim a query getActiveAds pode usar só status == "active" (sem filtro de data).
 */
export const expireAdCampaigns = functions.pubsub
  .schedule('every 1 hours')
  .timeZone('America/Sao_Paulo')
  .onRun(async () => {
    const db = admin.firestore()
    const now = admin.firestore.Timestamp.now()
    const snapshot = await db
      .collection(COLLECTION)
      .where('status', '==', 'active')
      .where('endAt', '<', now)
      .get()

    const batch = db.batch()
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { status: 'expired' })
    })
    await batch.commit()
    functions.logger.info(`Expiraram ${snapshot.size} campanhas.`)
    return null
  })
