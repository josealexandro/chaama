/**
 * Normaliza texto para busca (remove acentos, lowercase, trim)
 * Ex: "São Paulo" → "sao paulo"
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim()
}

