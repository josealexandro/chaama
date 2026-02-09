# 🔥 Como Configurar o Firebase

## Passo 1: Obter as Credenciais

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto
3. Clique no **ícone de engrenagem** ⚙️ ao lado de "Project Overview"
4. Vá em **"Project settings"**
5. Role até a seção **"Your apps"**
6. Se não tiver um app Web, clique no ícone `</>` para criar um
7. Você verá um código JavaScript com as credenciais

## Passo 2: Mapear os Valores

No Firebase Console você verá algo assim:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "meu-projeto-abc123.firebaseapp.com",
  projectId: "meu-projeto-abc123",
  storageBucket: "meu-projeto-abc123.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Passo 3: Preencher o .env.local

Abra o arquivo `.env.local` na raiz do projeto e preencha:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=meu-projeto-abc123.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=meu-projeto-abc123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=meu-projeto-abc123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

## Passo 4: Reiniciar o Servidor

Após preencher o `.env.local`:
1. Pare o servidor (Ctrl+C)
2. Execute `npm run dev` novamente

## Passo 5: Configurar Regras do Firestore

Para que o sistema de avaliações funcione, você precisa configurar as regras de segurança do Firestore:

1. No Firebase Console, vá em **Firestore Database** > **Regras**
2. Cole as regras do arquivo `REGRAS_FIRESTORE.md`
3. Clique em **Publicar**

📄 **Veja o arquivo `REGRAS_FIRESTORE.md` para as regras completas**

## Passo 6: Configurar Regras do Storage

Para que o upload de imagens funcione, você precisa configurar as regras de segurança do Storage:

1. No Firebase Console, vá em **Storage** > **Regras**
2. Cole as regras do arquivo `REGRAS_STORAGE.md`
3. Clique em **Publicar**

📄 **Veja o arquivo `REGRAS_STORAGE.md` para as regras completas**

## Campanhas de anúncio (banners)

A collection **adCampaigns** usa uma query com `status`, `region.city` e (opcional) `region.state`. Na primeira vez que um anúncio for exibido, o Firestore pode pedir para criar um **índice composto**. Se aparecer um erro com link, abra o link no navegador e crie o índice (leva alguns minutos).

## Cloud Functions (expiração de campanhas)

Para marcar campanhas expiradas automaticamente (a cada 1 hora):

1. Instale o Firebase CLI: `npm i -g firebase-tools`
2. Faça login: `firebase login`
3. No projeto: `cd functions`, depois `npm install`
4. Na raiz do projeto: `firebase deploy --only functions`

Requer plano Blaze (pay-as-you-go) no Firebase. O agendamento usa o fuso `America/Sao_Paulo`.

## ⚠️ Importante

- **NÃO** compartilhe o arquivo `.env.local` (ele já está no .gitignore)
- **NÃO** commite suas credenciais no Git
- Os valores devem estar **sem aspas** no arquivo `.env.local`

