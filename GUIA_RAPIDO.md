# ⚡ Guia Rápido - Chaama

Referência rápida para não quebrar nada.

## 🚨 ANTES DE FAZER QUALQUER MUDANÇA

1. ✅ Leia `DOCUMENTACAO.md` primeiro
2. ✅ Entenda o que você vai mexer
3. ✅ Teste localmente antes de commitar

## 📋 Checklist de Segurança

Antes de commitar, verifique:

- [ ] Código compila sem erros (`npm run dev` funciona)
- [ ] Não quebrou funcionalidades existentes
- [ ] Não mexeu nas regras do Firestore sem necessidade
- [ ] Não removeu validações importantes
- [ ] Não commitei arquivos sensíveis (`.env.local`)
- [ ] Testei com usuário logado e não logado
- [ ] Testei em modo claro e escuro

## 🔑 Regras de Ouro

1. **Mantenha simples** - Não crie complexidade desnecessária
2. **Use TypeScript** - Sempre defina tipos
3. **Siga a estrutura** - Componentes em `components/`, páginas em `app/`
4. **Teste sempre** - Antes de commitar, teste tudo
5. **Documente mudanças** - Se adicionar algo novo, atualize a documentação

## 📁 Onde Colocar Cada Coisa

| O que criar | Onde colocar |
|------------|--------------|
| Nova página | `app/minha-rota/page.tsx` |
| Novo componente | `components/MeuComponente/MeuComponente.tsx` |
| Função do Firestore | `lib/firestore/minhaColecao.ts` |
| Novo tipo | `types/index.ts` |
| Função utilitária | `lib/utils/minhaFuncao.ts` |

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## 🆘 Problemas Comuns

| Erro | Solução |
|------|--------|
| "Missing permissions" | Verifique `REGRAS_FIRESTORE.md` |
| "Cannot read property" | Use `?.` (optional chaining) |
| Página não atualiza | Reinicie o servidor |
| Erro de importação | Use `@/` para imports da raiz |

## 📞 Quando Estiver em Dúvida

1. Leia `DOCUMENTACAO.md`
2. Veja código similar no projeto
3. Mantenha simples
4. Teste antes de commitar

---

**Lembre-se:** Simples é melhor que complexo! 🎯





