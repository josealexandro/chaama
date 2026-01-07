# Chaama - Encontre Serviços

Plataforma para conectar pessoas que precisam de serviços com profissionais locais.

## Tecnologias

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Firebase (Authentication, Firestore, Storage)

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
- Copie `.env.local.example` para `.env.local`
- Preencha com suas credenciais do Firebase

3. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
chaama/
├── app/              # App Router do Next.js
├── components/       # Componentes React
├── lib/             # Utilitários e configurações
│   └── firebase/    # Configuração do Firebase
├── types/           # Tipos TypeScript
└── public/          # Arquivos estáticos
```

