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

## ⚠️ Importante

- **NÃO** compartilhe o arquivo `.env.local` (ele já está no .gitignore)
- **NÃO** commite suas credenciais no Git
- Os valores devem estar **sem aspas** no arquivo `.env.local`

