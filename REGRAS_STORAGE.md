# 🔒 Regras do Firebase Storage - Configuração Simples

## Como Configurar

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. No menu lateral, clique em **Storage**
4. Vá na aba **Regras** (Rules)
5. Cole as regras abaixo
6. Clique em **Publicar** (Publish)

## Regras Simples

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Pasta de prestadores
    match /providers/{userId}/{allPaths=**} {
      allow read: if true; // Qualquer um pode ver
      allow write: if request.auth != null && request.auth.uid == userId; // Só o próprio prestador pode fazer upload
    }
    
    // Pasta de anúncios
    match /ads/{allPaths=**} {
      allow read: if true; // Qualquer um pode ver
      allow write: if request.auth != null; // Usuário logado pode fazer upload
    }
    
  }
}
```

## Explicação Rápida

- **providers/**: Qualquer um pode ver, mas só o próprio prestador pode fazer upload
- **ads/**: Qualquer um pode ver, usuários logados podem fazer upload

## ⚠️ Importante

Após alterar as regras, pode levar alguns segundos para aplicar. Se ainda der erro, aguarde 10-20 segundos e tente novamente.




