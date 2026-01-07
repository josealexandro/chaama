import { storage } from '@/lib/firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

/**
 * Faz upload de uma imagem para o Firebase Storage
 * @param file - Arquivo de imagem
 * @param path - Caminho no Storage (ex: 'providers/uid123')
 * @returns URL pública da imagem
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return url
}

