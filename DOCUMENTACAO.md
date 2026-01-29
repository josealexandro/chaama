# 📚 Documentação do Chaama

Guia completo para entender e trabalhar no projeto sem quebrar nada.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Como Funciona Cada Parte](#como-funciona-cada-parte)
4. [Regras Importantes](#regras-importantes)
5. [Padrões de Código](#padrões-de-código)
6. [Como Adicionar Novas Funcionalidades](#como-adicionar-novas-funcionalidades)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

**Chaama** é uma plataforma que conecta pessoas que precisam de serviços com profissionais locais.

### Tecnologias Usadas

- **Next.js 14** (App Router) - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Firebase** - Autenticação, banco de dados (Firestore) e armazenamento

### Fluxo Principal

1. **Cliente** busca por serviço e cidade
2. **Sistema** mostra lista de prestadores
3. **Cliente** acessa perfil do prestador
4. **Cliente** pode avaliar o prestador
5. **Prestador** gerencia seu perfil no dashboard

---

## 📁 Estrutura do Projeto

```
chaama/
├── app/                    # Páginas do Next.js (App Router)
│   ├── page.tsx           # Página inicial (busca)
│   ├── login/             # Página de login
│   ├── cadastro/          # Página de cadastro
│   ├── resultados/        # Lista de prestadores encontrados
│   ├── anuncios/          # Área de anúncios
│   │   ├── criar/         # Criar novo anúncio
│   │   ├── editar/[id]/   # Editar anúncio existente
│   │   └── meus/          # Lista de anúncios do usuário
│   └── prestador/          # Área do prestador
│       ├── [id]/          # Perfil público do prestador
│       │   ├── page.tsx   # Visualização do perfil
│       │   └── avaliar/   # Página para deixar avaliação
│       ├── cadastro/      # Cadastro/edição de perfil
│       └── dashboard/     # Dashboard do prestador
│
├── components/            # Componentes React reutilizáveis
│   ├── Ads/              # Componentes de anúncios
│   ├── Auth/             # Componentes de autenticação
│   ├── Layout/           # Componentes de layout (Header)
│   ├── Reviews/          # Componentes de avaliações
│   └── Toast/            # Componentes de notificações
│
├── lib/                  # Código auxiliar
│   ├── contexts/         # Contextos React (Auth, Theme)
│   ├── firebase/         # Configuração do Firebase
│   ├── firestore/        # Funções do Firestore
│   └── utils/            # Funções utilitárias
│
├── types/                # Tipos TypeScript
│   └── index.ts          # Todas as interfaces
│
└── public/               # Arquivos estáticos (imagens, etc)
```

---

## 🔧 Como Funciona Cada Parte

### 1. Autenticação (`lib/contexts/AuthContext.tsx`)

**O que faz:** Gerencia login, logout e dados do usuário logado.

**Como usar:**
```typescript
import { useAuth } from '@/lib/contexts/AuthContext'

function MeuComponente() {
  const { currentUser, userData, loading } = useAuth()
  
  if (loading) return <div>Carregando...</div>
  if (!currentUser) return <div>Faça login</div>
  
  return <div>Olá, {userData?.nome}</div>
}
```

**Tipos de usuário:**
- `'cliente'` - Pode buscar e avaliar prestadores
- `'prestador'` - Pode criar perfil e receber avaliações

### 2. Prestadores (`lib/firestore/providers.ts`)

**Funções principais:**
- `upsertProvider()` - Cria ou atualiza perfil do prestador
- `getProviderById()` - Busca prestador por ID
- `listProviders()` - Lista prestadores com filtros

**Importante:** 
- O `userId` do prestador é sempre o mesmo `uid` do Firebase Auth
- Campos `servicoLower` e `cidadeLower` são normalizados para busca (não mexer!)

### 3. Avaliações (`lib/firestore/reviews.ts`)

**Funções principais:**
- `addReview()` - Cria ou atualiza avaliação (atualiza nota média automaticamente)
- `listProviderReviews()` - Lista avaliações de um prestador
- `getUserReview()` - Verifica se usuário já avaliou

**Importante:**
- A nota média é calculada automaticamente
- Se o usuário já avaliou, a avaliação é atualizada (não cria duplicata)

### 4. Anúncios Locais (`lib/firestore/ads.ts`)

**Funções principais:**
- `listAds(cidade?)` - Lista anúncios ativos, opcionalmente filtrados por cidade
- `createAd()` - Cria novo anúncio (requer `userId`)
- `getAdById()` - Busca anúncio por ID
- `updateAd()` - Atualiza anúncio existente
- `getUserAds()` - Lista anúncios de um usuário específico

**Como usar:**
```typescript
import { listAds, createAd } from '@/lib/firestore/ads'

// Listar anúncios de uma cidade
const ads = await listAds('São Paulo')

// Criar anúncio
const adId = await createAd({
  titulo: 'Loja de Materiais',
  descricao: 'Materiais de construção',
  imagemUrl: 'https://...',
  cidade: 'São Paulo',
  userId: currentUser.uid,
})
```

**Importante:**
- Anúncios são filtrados automaticamente pela cidade do usuário na página inicial
- Na página de resultados, aparecem na sidebar quando há cidade na busca
- Campo `cidadeLower` é normalizado para busca (não mexer!)
- Campo `userId` identifica o criador do anúncio
- Apenas o criador pode editar seu próprio anúncio

### 5. Autenticação - Recuperação de Senha (`lib/contexts/AuthContext.tsx`)

**Funcionalidade:**
- `resetPassword(email)` - Envia e-mail de recuperação de senha
- Disponível no formulário de login (botão "Esqueci minha senha")
- Firebase envia o e-mail automaticamente (sem custo adicional)

**Como usar:**
```typescript
const { resetPassword } = useAuth()

try {
  await resetPassword('usuario@email.com')
  // E-mail enviado com sucesso
} catch (error) {
  // Tratar erro
}
```

**Recursos adicionais:**
- Ícone de olho para mostrar/ocultar senha nos formulários
- Validação de senha (mínimo 6 caracteres)
- Confirmação de senha no cadastro

### 6. Páginas (`app/`)

**Estrutura:**
- Cada pasta = uma rota
- `page.tsx` = componente da página
- `[id]` = rota dinâmica (ex: `/prestador/abc123`)

**Exemplo:**
```
app/prestador/[id]/page.tsx
→ Rota: /prestador/abc123
→ params.id = "abc123"
```

**Páginas principais:**
- `/` - Página inicial com busca e anúncios filtrados por cidade do usuário
- `/resultados` - Lista de prestadores com sidebar de anúncios (se houver cidade na busca)
- `/anuncios/criar` - Criar novo anúncio (requer autenticação)
- `/anuncios/meus` - Lista de anúncios do usuário logado
- `/anuncios/editar/[id]` - Editar anúncio existente (só o criador pode editar)

---

## ⚠️ Regras Importantes

### ✅ O QUE FAZER

1. **Sempre use TypeScript**
   - Defina tipos para tudo
   - Use as interfaces em `types/index.ts`

2. **Mantenha componentes simples**
   - Um componente = uma responsabilidade
   - Se ficar muito grande, quebre em menores

3. **Use os contextos existentes**
   - `useAuth()` para dados do usuário e autenticação
   - `useToast()` para mostrar notificações de sucesso/erro
   - `useTheme()` para tema claro/escuro
   - Não crie novos contextos sem necessidade

4. **Siga a estrutura de pastas**
   - Componentes em `components/`
   - Páginas em `app/`
   - Funções do Firestore em `lib/firestore/`

5. **Teste antes de commitar**
   - Rode `npm run dev` e teste a funcionalidade
   - Verifique se não quebrou nada existente

### ❌ O QUE NÃO FAZER

1. **NÃO mexa nas regras do Firestore sem entender**
   - As regras estão em `REGRAS_FIRESTORE.md`
   - Se mudar, pode quebrar tudo

2. **NÃO crie regras complexas**
   - Mantenha tudo simples
   - Se precisar de algo complexo, simplifique primeiro

3. **NÃO mexa nos campos normalizados**
   - `servicoLower` e `cidadeLower` são gerados automaticamente
   - Não tente criar ou editar manualmente

4. **NÃO remova validações existentes**
   - As validações protegem o sistema
   - Se precisar mudar, entenda o motivo primeiro

5. **NÃO commite arquivos sensíveis**
   - `.env.local` está no `.gitignore` (não commitar!)
   - Credenciais do Firebase nunca no código

6. **NÃO use `any` no TypeScript**
   - Sempre defina tipos corretos
   - Se não souber o tipo, use `unknown` e faça type guard

---

## 📝 Padrões de Código

### Componentes React

```typescript
'use client' // Sempre use isso em componentes que usam hooks

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'

export default function MeuComponente() {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Lógica aqui
    setLoading(false)
  }, [])
  
  if (loading) return <div>Carregando...</div>
  
  return <div>Conteúdo</div>
}
```

### Funções do Firestore

```typescript
import { db } from '@/lib/firebase/config'
import { collection, doc, getDoc } from 'firebase/firestore'

const MINHA_COLECAO = 'minhaColecao'

export async function minhaFuncao(id: string) {
  const docRef = doc(db, MINHA_COLECAO, id)
  const snap = await getDoc(docRef)
  
  if (!snap.exists()) return null
  
  return snap.data()
}
```

### Estilização (Tailwind)

```typescript
// Sempre use classes do Tailwind
<div className="bg-white dark:bg-gray-800 rounded-xl p-4">
  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
    Título
  </h1>
</div>

// Padrão de cores:
// - bg-white / dark:bg-gray-800 (fundo)
// - text-gray-900 / dark:text-white (texto)
// - border-gray-200 / dark:border-gray-700 (bordas)
```

### Tratamento de Erros

```typescript
try {
  await minhaFuncao()
} catch (error: any) {
  console.error('Erro:', error)
  setError(error?.message || 'Erro desconhecido')
}
```

---

## 🚀 Como Adicionar Novas Funcionalidades

### Passo a Passo

1. **Defina o tipo** (se necessário)
   ```typescript
   // types/index.ts
   export interface MinhaNovaInterface {
     id: string
     nome: string
   }
   ```

2. **Crie função no Firestore**
   ```typescript
   // lib/firestore/minhaColecao.ts
   export async function criarItem(data: MinhaNovaInterface) {
     // Implementação
   }
   ```

3. **Crie o componente** (se necessário)
   ```typescript
   // components/MinhaColecao/MeuComponente.tsx
   export default function MeuComponente() {
     // Implementação
   }
   ```

4. **Crie a página** (se necessário)
   ```typescript
   // app/minha-rota/page.tsx
   export default function MinhaRota() {
     // Implementação
   }
   ```

5. **Atualize as regras do Firestore** (se necessário)
   - Veja `REGRAS_FIRESTORE.md`
   - Mantenha simples!

6. **Teste tudo**
   - Teste criar, ler, atualizar, deletar
   - Teste com usuário logado e não logado
   - Teste em modo claro e escuro

---

## 🔍 Troubleshooting

### Erro: "Missing or insufficient permissions"

**Causa:** Regras do Firestore não permitem a operação.

**Solução:**
1. Verifique se está logado
2. Verifique as regras em `REGRAS_FIRESTORE.md`
3. Certifique-se de que publicou as regras no Firebase Console

### Erro: "Cannot read property of undefined"

**Causa:** Tentando acessar propriedade de objeto que não existe.

**Solução:**
```typescript
// ❌ ERRADO
const nome = user.nome

// ✅ CORRETO
const nome = user?.nome || 'Sem nome'
```

### Erro: "Hydration error"

**Causa:** Diferença entre HTML do servidor e cliente.

**Solução:**
- Use `'use client'` no componente
- Evite usar `window` ou `document` diretamente no render

### Página não atualiza após mudança

**Solução:**
1. Pare o servidor (Ctrl+C)
2. Rode `npm run dev` novamente
3. Limpe o cache do navegador (Ctrl+Shift+R)

### Erro de importação

**Causa:** Caminho incorreto ou arquivo não existe.

**Solução:**
- Use sempre `@/` para imports da raiz
- Exemplo: `import { useAuth } from '@/lib/contexts/AuthContext'`

### Anúncios não aparecem

**Causa:** Pode ser filtro de cidade ou permissões.

**Solução:**
1. Verifique se há anúncios ativos no Firestore
2. Verifique se a cidade do anúncio corresponde à cidade pesquisada
3. Verifique as regras do Firestore em `REGRAS_FIRESTORE.md`
4. Anúncios só aparecem na sidebar se houver cidade na busca

---

## 📖 Arquivos de Referência

- **`COMO_CONFIGURAR_FIREBASE.md`** - Como configurar o Firebase
- **`REGRAS_FIRESTORE.md`** - Regras de segurança do Firestore
- **`REGRAS_STORAGE.md`** - Regras de segurança do Firebase Storage
- **`types/index.ts`** - Todas as interfaces TypeScript
- **`README.md`** - Informações básicas do projeto

---

## 💡 Dicas Finais

1. **Sempre leia o código existente antes de criar algo novo**
   - Pode já existir algo similar
   - Mantenha o padrão do projeto

2. **Mantenha tudo simples**
   - Código simples = menos bugs
   - Fácil de entender e manter

3. **Teste em diferentes cenários**
   - Usuário logado vs não logado
   - Cliente vs prestador
   - Modo claro vs escuro

4. **Documente mudanças importantes**
   - Se adicionar algo novo, atualize esta documentação
   - Comente código complexo

5. **Quando em dúvida, pergunte ou pesquise**
   - Melhor perguntar do que quebrar
   - Use a documentação do Next.js e Firebase

---

**Última atualização:** 
- ✅ Sistema de avaliações
- ✅ Anúncios locais com filtro por cidade
- ✅ Recuperação de senha
- ✅ Edição de anúncios
- ✅ Sidebar de anúncios na página de resultados
- ✅ Notificações toast (sucesso/erro)
- ✅ Firebase inicializado apenas no cliente (deploy Vercel)

---

## Deploy na Vercel

Para publicar a aplicação na Vercel, siga o guia em **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)**. Em resumo: suba o código para o Git, conecte o repositório na Vercel, configure as variáveis de ambiente do Firebase e faça o deploy. Não esqueça de adicionar o domínio da Vercel em **Authorized domains** no Firebase (Authentication).

