# Regras do Firestore

Cole as regras no Firebase Console: **Firestore Database** > **Regras** > **Publicar**.

Se você já tiver regras para outras collections, adicione apenas o bloco `adCampaigns` dentro de `match /databases/{database}/documents { ... }`.

## Regras completas (exemplo)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuários: só o próprio usuário pode ler/escrever
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Prestadores: leitura pública; escrita pelo dono
    match /providers/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Avaliações: leitura pública; escrita por usuário logado
    match /reviews/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Campanhas de anúncio (banners com prazo/região)
    match /adCampaigns/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Só o bloco adCampaigns (se o resto já existir)

```javascript
    match /adCampaigns/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
```
