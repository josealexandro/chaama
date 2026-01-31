'use client'

import { useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import { upsertProvider, getProviderById } from '@/lib/firestore/providers'
import { uploadImage } from '@/lib/firebase/storage'

const CATEGORIES = [
  'Pedreiro',
  'Encanador',
  'Pintor',
  'Eletricista',
  'Cuidador',
  'Enfermeira',
  'Doméstica',
  'Faz Tudo',
  'Outra',
]

export default function ProviderSignupPage() {
  const { currentUser, userData, loading } = useAuth()
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [servico, setServico] = useState(CATEGORIES[0])
  const [servicoCustom, setServicoCustom] = useState('')
  const [cidade, setCidade] = useState('')
  const [descricao, setDescricao] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [precoMedio, setPrecoMedio] = useState<number | ''>('')
  const [linkMapa, setLinkMapa] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string>('')
  const [fotoUrlExistente, setFotoUrlExistente] = useState<string | undefined>(undefined)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Carrega dados existentes se já for prestador
  useEffect(() => {
    async function loadProvider() {
      if (!currentUser) return
      const existing = await getProviderById(currentUser.uid)
      if (existing) {
        setIsEditing(true)
        setNome(existing.nome)
        // Se o serviço não está na lista, é personalizado
        if (CATEGORIES.includes(existing.servico)) {
          setServico(existing.servico)
        } else {
          setServico('Outra')
          setServicoCustom(existing.servico)
        }
        setCidade(existing.cidade)
        setDescricao(existing.descricao)
        setWhatsapp(existing.whatsapp || '')
        setPrecoMedio(existing.precoMedio || '')
        setLinkMapa(existing.linkMapa || '')
        if (existing.fotoUrl) {
          setFotoPreview(existing.fotoUrl)
          setFotoUrlExistente(existing.fotoUrl)
        }
      } else {
        setNome(userData?.nome || currentUser?.displayName || '')
        setCidade(userData?.cidade || '')
      }
    }
    loadProvider()
  }, [currentUser, userData])

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace('/login')
    }
  }, [loading, currentUser, router])

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFoto(file)
      // Preview da imagem
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    setError('')
    
    // Determina o serviço final (personalizado ou da lista)
    const servicoFinal = servico === 'Outra' ? servicoCustom.trim() : servico
    
    if (!nome || !servicoFinal || !cidade || !descricao) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }
    
    if (servico === 'Outra' && !servicoCustom.trim()) {
      setError('Digite sua profissão no campo "Qual profissão?"')
      return
    }
    setSaving(true)
    setError('')
    try {
      let fotoUrl: string | undefined = fotoUrlExistente // Mantém a foto existente se não tiver nova
      
      // Se tiver foto nova selecionada, faz upload
      if (foto) {
        try {
          console.log('Iniciando upload da foto...')
          const path = `providers/${currentUser.uid}/profile.jpg`
          fotoUrl = await uploadImage(foto, path)
          console.log('Upload concluído:', fotoUrl)
        } catch (uploadErr: any) {
          console.error('Erro ao fazer upload da foto:', uploadErr)
          setError(`Erro ao fazer upload da foto: ${uploadErr?.message || 'Verifique as permissões do Storage'}`)
          setSaving(false)
          return
        }
      }

      console.log('Salvando dados do prestador...')
      const servicoFinalValue = servico === 'Outra' ? servicoCustom.trim() : servico
      await upsertProvider(currentUser.uid, {
        nome,
        servico: servicoFinalValue,
        cidade,
        descricao,
        whatsapp,
        precoMedio: typeof precoMedio === 'number' ? precoMedio : undefined,
        premium: false,
        fotoUrl,
        linkMapa: linkMapa.trim() || undefined,
      })
      console.log('Dados salvos com sucesso!')
      router.push(`/prestador/${currentUser.uid}`)
    } catch (err: any) {
      console.error('Erro ao salvar:', err)
      setError(err?.message || 'Erro ao salvar cadastro do prestador.')
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <span>←</span>
            <span>Voltar ao Início</span>
          </Link>
          {isEditing && currentUser && (
            <>
              <span className="text-gray-400 dark:text-gray-500">|</span>
              <button
                type="button"
                onClick={() => router.push(`/prestador/${currentUser.uid}`)}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Voltar ao Perfil
              </button>
            </>
          )}
        </div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          {isEditing ? 'Editar Perfil' : 'Cadastro de Prestador'}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {isEditing ? 'Atualize suas informações.' : 'Preencha suas informações para ser encontrado.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label htmlFor="servico" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria de Serviço
            </label>
            <select
              id="servico"
              value={servico}
              onChange={(e) => {
                setServico(e.target.value)
                if (e.target.value !== 'Outra') {
                  setServicoCustom('')
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black dark:text-white dark:bg-gray-700"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {servico === 'Outra' && (
            <div>
              <label htmlFor="servicoCustom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Qual profissão?
              </label>
              <input
                id="servicoCustom"
                value={servicoCustom}
                onChange={(e) => setServicoCustom(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black dark:text-white dark:bg-gray-700"
                placeholder="Ex: Marceneiro, Jardineiro, Personal Trainer..."
              />
            </div>
          )}

          <div>
            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cidade
            </label>
            <input
              id="cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              placeholder="Sua cidade"
            />
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              placeholder="Fale sobre sua experiência, serviços oferecidos, diferenciais..."
            />
          </div>

          <div>
            <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-2">
              Foto de Perfil
            </label>
            <div className="flex items-center gap-4">
              {fotoPreview && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoPreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                  />
                </>
              )}
              <input
                id="foto"
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="flex-1 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Formatos aceitos: JPG, PNG, GIF (máx. 5MB)</p>
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp
            </label>
            <input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label htmlFor="linkMapa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Link do Google Maps (opcional)
            </label>
            <input
              id="linkMapa"
              type="url"
              value={linkMapa}
              onChange={(e) => setLinkMapa(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black dark:text-white dark:bg-gray-700"
              placeholder="https://maps.google.com/..."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Cole o link do endereço no Google Maps para que clientes possam abrir no mapa.</p>
          </div>

          <div>
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preço médio (R$ / dia)
            </label>
            <input
              id="preco"
              type="number"
              min={0}
              step="1"
              value={precoMedio}
              onChange={(e) => setPrecoMedio(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              placeholder="150"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={() => router.push(`/prestador/${currentUser?.uid}`)}
                className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Cadastrar')}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}


