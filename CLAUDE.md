# PromptLabz â€” CLAUDE.md

## Checklist de Qualidade para Todo Projeto Desenvolvido

Use esta lista como guia obrigatório ao desenvolver, revisar ou finalizar qualquer projeto de portfólio.

---

### 1) Ideia e Escopo com Cara de Produto

- [ ] Problema real descrito em 1 frase: "Ajuda X a fazer Y sem Z"
- [ ] Usuário-alvo definido (ex: dono de restaurante / estudante / freelancer)
- [ ] MVP fechado: 3â€“5 funcionalidades principais (não 20)
- [ ] Regras de negócio explícitas (ex: limites, validações, estados, permissões)
- [ ] Casos de borda mapeados (ex: sem internet, erro de API, dado inválido)

---

### 2) UX/UI Minimamente "de Produção"

- [ ] Layout consistente (spacing, tipografia, cores, estados)
- [ ] Estados completos: loading / empty state / erro / sucesso
- [ ] Feedback rápido (toasts, skeletons, disable em botão durante submit)
- [ ] Responsivo (mobile/desktop)
- [ ] Acessibilidade básica: labels, foco visível, contraste aceitável, navegação por teclado

---

### 3) Funcionalidades que Provam Maturidade

Escolha algumas â€” não precisa todas:

- [ ] Autenticação (email/senha ou OAuth)
- [ ] CRUD completo com validação real
- [ ] Busca + filtro + ordenação (não só "listar")
- [ ] Paginação ou infinite scroll
- [ ] Upload (imagem/arquivo) com validação
- [ ] Permissões (ex: admin vs user) ou ao menos "meus dados"
- [ ] Logs/Auditoria simples (ex: "última atualização", "criado por")
- [ ] Notificações (email ou in-app) se fizer sentido

---

### 4) Qualidade de Código

- [ ] Estrutura de pastas clara e coerente
- [ ] Componentes reutilizáveis (sem "copiar e colar UI")
- [ ] Tipagem consistente (se TS) e sem gambiarra pra "calar erro"
- [ ] Tratamento de erro padronizado (API + UI)
- [ ] Convenções: lint + format (ESLint/Prettier) configurados
- [ ] Commits com mensagens decentes (padrão: feat/fix/refactor/docs)

---

### 5) Back-end/API com Padrão Real

- [ ] Rotas REST/GraphQL bem definidas
- [ ] Validação de input no servidor (Zod/Joi/class-validator etc)
- [ ] Paginação/filters no back (não filtrar tudo no front)
- [ ] Camadas mínimas (controller/service/repo) ou organização equivalente
- [ ] Banco com migrações (Prisma migrate / SQL migrations)
- [ ] Seeds/dados de exemplo pra rodar local

---

### 6) Segurança Básica

- [ ] Senhas com hash (nunca salvar puro)
- [ ] Tokens/sessões seguros (cookie httpOnly quando aplicável)
- [ ] Variáveis de ambiente em `.env.example` (nunca commitar segredo)
- [ ] Rate limit simples em login/rotas críticas (se tiver backend)
- [ ] Proteção contra acesso indevido (checar dono do recurso no servidor)
- [ ] CORS/configs corretas em produção (se for API separada)

---

### 7) Testes

Recrutador não quer 200 testes; quer prova de que você sabe testar:

- [ ] Pelo menos 5â€“10 testes úteis
- [ ] 2â€“3 testes de unidade (função/regra de negócio)
- [ ] 2â€“3 testes de integração (API + DB ou service)
- [ ] 1â€“2 testes de UI (fluxo de formulário/erro/sucesso)
- [ ] Rodar em CI (GitHub Actions) mesmo que simples

---

### 8) Observabilidade e Confiabilidade

- [ ] Logs claros no backend (sem logar dados sensíveis)
- [ ] Tratamento de falhas (retry/backoff onde faz sentido)
- [ ] Monitoramento leve: Sentry/Logtail ou similar (opcional, mas chama atenção)
- [ ] Health check (se API)

---

### 9) Deploy e Ambiente

- [ ] URL pública funcionando (Vercel/Render/Fly/Railway etc)
- [ ] Build sem erros e sem "gambi pra deployar"
- [ ] Banco em produção configurado corretamente
- [ ] README com instruções 100% reproduzíveis
- [ ] Se tiver Docker: `docker-compose` pra subir local

---

### 10) README "de Recrutador"

Seu README tem que permitir avaliar em 60 segundos:

- [ ] Resumo do projeto (o que é e pra quem é)
- [ ] Funcionalidades principais (bullet points)
- [ ] Stack e por quê (1 linha por escolha)
- [ ] Arquitetura (diagrama simples ou explicação curta)
- [ ] Como rodar local (passo a passo)
- [ ] Credenciais demo (se tiver ambiente de teste)
- [ ] Screenshots/GIF curto (ou vídeo de 1 min)
- [ ] Roadmap (2â€“5 itens) mostrando visão e priorização

---

### 11) "Provas" de Autoria (Anti-Tutorial)

Isso é o que mais tira você do "copiei do YouTube":

- [ ] Decisões registradas: "Por que usei X e não Y"
- [ ] Issues abertas e fechadas (mesmo sendo você)
- [ ] Pull Requests (até em repo próprio) mostrando revisão e descrição
- [ ] Um doc curto: "trade-offs e próximos passos"
- [ ] Changelog de versões (v0.1, v0.2â€¦)

---

## Claude Code Project Context

### Development Commands
```bash
# Development
pnpm dev                    # Start development server on http://localhost:5173
pnpm typecheck              # TypeScript type checking
pnpm lint                   # ESLint linting
pnpm test                   # Run Vitest unit tests
pnpm test:watch             # Run Vitest in watch mode
pnpm test:coverage          # Run tests with coverage report
pnpm test:e2e               # Run Playwright E2E tests
pnpm test:e2e:ui            # Run Playwright E2E tests with UI
pnpm build                  # Build for production
pnpm preview                # Preview production build
pnpm smoke:supabase         # Test Supabase connection
pnpm check                  # Run all checks (typecheck, lint, test, build, smoke)
pnpm install-deps           # Install dependencies with pnpm
pnpm clean                  # Clean node_modules and pnpm store
```

### Architecture Overview
PromptLabz follows a React SPA architecture with Supabase as backend:

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

**Key patterns:**
- **Offline-first**: Progress saved to localStorage before syncing with Supabase
- **Lazy loading**: Pages loaded on demand with React.lazy()
- **Context API**: 3 contexts (Auth, Lives, Achievements) with well-defined scope
- **RLS**: Users can only access their own data; premium fields protected at database level

### Environment Setup
1. Copy environment example: `cp .env.example .env.local`
2. Configure Supabase credentials in `.env.local`:
   - `VITE_SUPABASE_URL` - Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Supabase anon key
3. For local development (recommended):
   ```bash
   supabase start          # Start Supabase locally (requires Docker)
   supabase db reset       # Reset database to clean state
   # Copy the displayed URL and anon key to .env.local
   pnpm dev
   ```
4. Without Supabase (degraded mode):
   ```bash
   pnpm dev  # App works with localStorage only
   ```

### Testing Workflow
- **Unit tests**: Vitest + Testing Library (`pnpm test`)
- **E2E tests**: Playwright (`pnpm test:e2e`)
- **Test files** located alongside source files with `.test.tsx` suffix
- **CI**: GitHub Actions runs typecheck → lint → test → build on every PR

### Non-obvious Patterns & Gotchas
- **Offline-first behavior**: Changes are immediately saved to localStorage, then synced to Supabase when online. If sync fails, data remains in localStorage and retries automatically.
- **Context API usage**: Auth context provides user data and auth functions; Lives context manages game lives system; Achievements context tracks badge progress.
- **RLS implementation**: Database policies ensure users can only access their own records. Client-side filtering complements but doesn't replace server-side RLS.
- **Supabase configuration**: For full functionality, ensure:
  1. Email authentication is enabled in Supabase auth settings
  2. Google/OAuth providers are configured (if using social login)
  3. Edge Function `send-auth-email` is deployed with Resend configuration
  4. Database migrations are applied (`supabase db push`)