# Deploy na Vercel

Guia para publicar o Chaama na [Vercel](https://vercel.com).

---

## Pré-requisitos

1. **Conta na Vercel** – Crie em [vercel.com/signup](https://vercel.com/signup) (pode usar GitHub, GitLab ou e-mail).
2. **Projeto no Git** – O código deve estar em um repositório (GitHub, GitLab ou Bitbucket).
3. **Variáveis de ambiente** – Tenha os valores do Firebase prontos (mesmos do `.env.local`).

---

## Passo 1: Subir o código para o Git

Se ainda não fez:

```bash
git init
git add .
git commit -m "Preparar deploy"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/chaama.git
git push -u origin main
```

Substitua `SEU_USUARIO/chaama` pelo seu repositório real.

---

## Passo 2: Conectar o projeto na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login.
2. Clique em **Add New…** → **Project**.
3. **Import** o repositório do Chaama (GitHub/GitLab/Bitbucket).
4. Se for a primeira vez, autorize a Vercel a acessar sua conta do Git.
5. Na tela de configuração:
   - **Framework Preset:** Next.js (deve ser detectado).
   - **Root Directory:** deixe em branco.
   - **Build Command:** `npm run build` (padrão).
   - **Output Directory:** padrão (não altere).
   - **Install Command:** `npm install` (padrão).

---

## Passo 3: Configurar variáveis de ambiente

Antes de dar **Deploy**, vá em **Environment Variables** e adicione:

| Nome | Valor | Ambiente |
|------|--------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Sua API Key do Firebase | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `seu-projeto.firebaseapp.com` | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ID do projeto Firebase | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `seu-projeto.appspot.com` | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | Production, Preview |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID do Firebase | Production, Preview |

Use os mesmos valores do seu `.env.local`. Marque **Production** e **Preview** para cada variável.

Depois clique em **Deploy**.

---

## Passo 4: Aguardar o build

- A Vercel vai instalar dependências e rodar `npm run build`.
- Se o build passar, você recebe um link do tipo:  
  `https://chaama-xxxx.vercel.app`
- Em **Deployments** você vê o status e os logs.

---

## Passo 5: Domínio próprio (opcional)

1. No projeto na Vercel, vá em **Settings** → **Domains**.
2. Adicione seu domínio (ex: `chaama.com.br`).
3. Siga as instruções para configurar DNS (CNAME ou A) no seu provedor de domínio.

---

## Deploys automáticos

- **Push em `main`** → novo deploy de **Production**.
- **Push em outra branch** ou **Pull Request** → deploy de **Preview** (URL temporária).

Cada deploy gera uma URL única, útil para testar antes de ir para produção.

---

## Problemas comuns

### Build falha

- Veja os logs em **Deployments** → clique no deploy que falhou.
- Confirme que `npm run build` roda localmente sem erro.
- Verifique se todas as variáveis de ambiente foram preenchidas na Vercel.

### Firebase não funciona em produção

- Todas as variáveis devem começar com `NEXT_PUBLIC_` para estarem disponíveis no browser.
- No [Console do Firebase](https://console.firebase.google.com), em **Authentication** → **Settings** → **Authorized domains**, adicione:
  - `seu-projeto.vercel.app`
  - E seu domínio customizado, se usar.

### Imagens do Storage não carregam

- O `next.config.js` já inclui `firebasestorage.googleapis.com` em `images.domains`. Se mudar para `remotePatterns` no futuro, atualize conforme a doc do Next.js.

---

## Resumo rápido

1. Código no Git (GitHub/GitLab/Bitbucket).
2. Vercel → **Add New** → **Project** → importar repositório.
3. Adicionar **Environment Variables** (Firebase).
4. Clicar em **Deploy**.
5. Adicionar o domínio da Vercel em **Authorized domains** no Firebase.

Depois disso, cada push em `main` gera um novo deploy automaticamente.
