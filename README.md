# Chaama - Encontre Serviços

Plataforma para conectar pessoas que precisam de serviços com profissionais locais.

## 📚 Documentação

**👉 [Leia a documentação completa aqui](DOCUMENTACAO.md)** - Guia completo para entender e trabalhar no projeto.

## 🚀 Início Rápido

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
- Copie `.env.local.example` para `.env.local`
- Preencha com suas credenciais do Firebase
- Veja `COMO_CONFIGURAR_FIREBASE.md` para detalhes

3. Configure as regras do Firestore:
- Veja `REGRAS_FIRESTORE.md` e configure no Firebase Console

4. Execute o projeto:
```bash
npm run dev
```

## Tecnologias

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Firebase (Authentication, Firestore, Storage)

## 📁 Estrutura do Projeto

```
chaama/
├── app/              # Páginas do Next.js (App Router)
├── components/       # Componentes React reutilizáveis
├── lib/             # Utilitários e configurações
│   ├── contexts/    # Contextos React (Auth, Theme)
│   ├── firebase/    # Configuração do Firebase
│   └── firestore/   # Funções do Firestore
├── types/           # Tipos TypeScript
└── public/          # Arquivos estáticos
```

## 📖 Documentação Adicional

- **[DOCUMENTACAO.md](DOCUMENTACAO.md)** - 📚 Guia completo do projeto (LEIA PRIMEIRO!)
- **[GUIA_RAPIDO.md](GUIA_RAPIDO.md)** - ⚡ Referência rápida
- **[COMO_CONFIGURAR_FIREBASE.md](COMO_CONFIGURAR_FIREBASE.md)** - 🔥 Como configurar o Firebase
- **[REGRAS_FIRESTORE.md](REGRAS_FIRESTORE.md)** - 🔒 Regras de segurança do Firestore
- **[REGRAS_STORAGE.md](REGRAS_STORAGE.md)** - 📦 Regras de segurança do Storage