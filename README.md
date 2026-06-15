# PromptLabz

**Plataforma de aprendizado de prompt engineering para estudantes e criadores que querem dominar IA sem depender de aulas soltas ou progresso manual.**

→ **[promptlabz.vercel.app](https://promptlabz.vercel.app)** · [Issues](https://github.com/lenixeduardo/promptLab/issues) · [Roadmap](./ROADMAP.md)

---

## O que é

PromptLabz ajuda estudantes em transição de carreira, criadores de conteúdo e devs iniciantes a praticar prompt engineering de forma gamificada: trilhas de lições, sistema de vidas, conquistas e uma biblioteca de 80+ skills reais do [skills.sh](https://www.skills.sh/).

---

## Funcionalidades

- **Autenticação completa** — email/senha, Google OAuth, Apple OAuth, reset de senha via email personalizado com mascote
- **Trilhas de Aprendizado** — módulos sequenciais com lições interativas, feedback imediato e progresso persistido
- **Central de Skills** — 80+ skills catalogadas com busca full-text, filtro por categoria (7 categorias), ranking por instalações e favoritos
- **Sistema de Vidas** — 5 vidas que se regeneram com o tempo; perde ao errar, incentiva foco
- **Conquistas (Achievements)** — badges desbloqueados por consistência, exploração e volume de prática
- **Perfil com Avatar** — customização de avatar, nome e acompanhamento de progresso por categoria
- **Progresso offline-first** — salvo imediatamente em `localStorage`, sincronizado com Supabase ao reconectar
- **Tela de Notificações** (`/notifications`): filtros (Todas/Não lidas/Mentions), agrupamento por data, indicador de não lido
- **Tela de Favoritos** (`/favorites`): abas (Prompts/Templates/Notícias/Trilhas), estado vazio com CTA, seção "Dicas para você"
- **Tela Premium/Paywall** (`/premium`): toggle Mensal/Anual (-40%), cards de preço com seleção rádio, grid de benefícios, trust badges, CTA com 7 dias grátis
- **Bottom Navigation Bar** (`AppBottomNav`): navegação inferior fixa com 6 ícones (Início, Trilha, Laboratório, Desafios, Notícias, Perfil)

---

## Stack

| Tecnologia | Por quê |
|------------|---------|
| React 18 + Vite | SPA rápida; Vite oferece HMR instantâneo e build otimizado |
| TypeScript | Contratos claros entre componentes, hooks e camada de dados |
| Tailwind CSS | Estilo utilitário sem CSS separado; consistência visual fácil |
| Supabase | Auth + Postgres + RLS gerenciado — sem servidor próprio |
| Resend | Emails transacionais com template HTML próprio (mascote da marca) |
| Vitest + Testing Library | Testes unitários e de UI rápidos, compatível com Vite |
| GitHub Actions | CI com typecheck → lint → test → build em todo PR |

---

## Arquitetura

```
Browser (React SPA)
  └── Pages → Hooks → lib/db → Supabase JS SDK
                                      │
                              ┌───────▼───────┐
                              │   Supabase     │
                              │  Auth (JWT)    │
                              │  Postgres+RLS  │
                              │  Edge Fns      │
                              └───────────────┘
```

**Padrões principais:**
- **Offline-first**: progresso salvo em `localStorage` antes de sincronizar com o banco
- **Lazy loading**: todas as páginas carregadas sob demanda com `React.lazy()`
- **Context API**: 3 contextos (Auth, Lives, Achievements) com escopo bem definido
- **RLS**: usuário só acessa seus próprios dados; campos premium bloqueados no cliente

→ Detalhes completos em [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Como Rodar Localmente

### Pré-requisitos
- Node.js 22+
- pnpm 9+

### Setup

```bash
# 1. Clone e instale
git clone https://github.com/lenixeduardo/promptLab.git
cd promptLab
pnpm install

# 2. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase
```

### Com Supabase Local (recomendado para desenvolver)

```bash
# Inicie o Supabase local (requer Docker)
supabase start
supabase db reset

# Copie a URL e anon key exibidas para .env.local
pnpm dev
```

### Sem Supabase (modo degradado)

```bash
# O app funciona sem env configurado — progresso salvo apenas em localStorage
pnpm dev
```

Acesse `http://localhost:5173`

---

## Validação e Testes

```bash
pnpm typecheck        # TypeScript sem erros
pnpm lint             # ESLint sem warnings
pnpm test             # Vitest (163 testes — unit + integração + UI)
pnpm build            # Build de produção (46 chunks · ~68s)
```

**Cobertura atual:** hooks, components, pages, contexts — 19 arquivos de teste.

---

## Screenshots

> 📸 Screenshots em breve — o app está em deploy ativo em **[promptlabz.vercel.app](https://promptlabz.vercel.app)**

| | |
|---|---|
| 🏠 **Home** — Progresso, streak, trilha e acesso rápido | 📚 **Trilha de Aprendizado** — Módulos sequenciais com lições interativas |
| 🏆 **Ranking** — Pódio com top 3 e lista de usuários | ⭐ **Skills** — 80+ skills com busca, filtros e favoritos |
| 🔔 **Notificações** — Filtros Todas/Não lidas/Mentions | ❤️ **Favoritos** — Abas por tipo com empty state e sugestões |
| 👑 **Premium** — Paywall com toggle de planos e benefícios | 👤 **Perfil** — Avatar, XP, gemas, conquistas e certificados |

---

## Deploy

Veja o guia completo em [DEPLOYMENT.md](./DEPLOYMENT.md).

**Resumo:**
1. Configure projeto no Supabase e rode as migrations (`supabase db push`)
2. Configure Google/Apple OAuth no painel do Supabase
3. Deploy da Edge Function `send-auth-email` com Resend configurado
4. Conecte o repo no Vercel com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

---

## Estrutura de Pastas

```
src/
├── components/   # UI reutilizável (ErrorBoundary, PrivateRoute, BrandLogo...)
├── contexts/     # Estado global (Auth, Lives, Achievements)
├── hooks/        # Lógica de negócio (useAuth, useFavorites, useAchievements)
├── pages/        # Uma página por rota
├── lib/          # Supabase client, db helpers, achievements logic, icons
└── data/         # Conteúdo estático (lições, skills, avatars, prompts)
supabase/
├── functions/    # Edge Functions (send-auth-email, stripe-checkout)
└── migrations/   # SQL versionado
```

---

## Decisões Técnicas

- **Supabase** em vez de Firebase: SQL + RLS nativo permite segurança declarativa e queries complexas para analytics futuro
- **Conteúdo em `src/data`** em vez de CMS: acelera o MVP — migração para DB planejada na v0.3
- **React SPA** em vez de Next.js: produto não é SEO-crítico; SSR traria complexidade sem benefício real
- **Campos premium no banco desde o v0.1**: evita migração futura quando o plano pago for implementado; update protegido por RLS
- **`src/lib/icons.ts`** centraliza imports de lucide-react para tree-shaking, evitando importar toda a biblioteca (700+ kB)
- **Bottom nav e componentes compartilhados** (`AppPageHeader`, `PillTabs`) foram criados como componentes opcionais e configuráveis, sem refatorar páginas existentes
- **Telas de Notificações e Favoritos** usam dados mock preparados para migração futura para Supabase (estrutura de tabelas já planejada)

---

## Demo

> 🚧 Ambiente de demonstração está sendo configurado.
>
> **Enquanto isso:**
> 1. Clone o repositório: `git clone https://github.com/lenixeduardo/promptLab.git`
> 2. Instale as dependências: `pnpm install`
> 3. Inicie o servidor: `pnpm dev`
> 4. Acesse `http://localhost:5173` — o app funciona **sem credenciais Supabase** (modo degradado com dados locais)

---

## Roadmap

| Versão | Foco | Status |
|--------|------|--------|
| **v0.1** | MVP: auth, trilhas, skills, gamificação | ✅ Publicado |
| **v0.2** | Notificações in-app, Favoritos, Premium UI, Ranking, streak | ✅ Concluído |
| **v0.3** | Stripe real, Sentry, testes E2E, comunidade | 🔨 Em desenvolvimento |
| **v1.0** | Premium real, certificados, PWA offline, mobile | 🔮 Futuro |

→ Detalhes e estimativas em [ROADMAP.md](./ROADMAP.md)

---

## Documentação

| Arquivo | Descrição |
|---------|-----------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Design do sistema, fluxo de dados, banco, decisões |
| [PRODUCT.md](./PRODUCT.md) | Requisitos, regras de negócio, casos de borda |
| [PERSONAS.md](./PERSONAS.md) | Perfis dos usuários-alvo |
| [ROADMAP.md](./ROADMAP.md) | Versões, features planejadas, trade-offs |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Guia de deploy Vercel + Supabase |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Como contribuir, convenções, testes |
