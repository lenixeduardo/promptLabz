# Backend TODO - PromptLabz

Auditoria feita com agentes em 2026-06-10. Status atualizado apos correcoes.

## Concluido

- [x] Bloquear autopromocao premium via RLS/grants.
  - Implementado em `schema.sql` e `supabase/migrations/20260610_001_users_premium.sql`.
  - Cliente autenticado so recebe `UPDATE` em `full_name` e `avatar_url`.

- [x] Corrigir fluxo de reset de senha.
  - `resetPasswordForEmail` redireciona para `/reset-password`.
  - `/reset-password` nao fica mais bloqueada por `PrivateRoute`.

- [x] Remover fallback silencioso de credenciais Supabase.
  - `src/lib/supabase.ts` falha explicitamente fora de teste quando envs estao ausentes.

- [x] Criar migration inicial versionada.
  - `supabase/migrations/20260610_000_initial_schema.sql`.

- [x] Tornar constraint premium idempotente.
  - `premium_status_check` agora checa `pg_constraint` antes de criar.

- [x] Fixar `search_path` em funcoes SQL.
  - `handle_new_user()` e `set_updated_at()` usam `SET search_path = public, pg_temp`.

- [x] Adicionar `WITH CHECK` explicito em policies de update.
  - Aplicado em `users` e `user_progress`.

- [x] Adicionar constraints de validade em `user_progress`.
  - Indices nao negativos, limite de `category_id`, limite de lessons concluidas.

- [x] Indexar campos Stripe.
  - Unique indexes parciais para `stripe_customer_id` e `stripe_subscription_id`.

- [x] Mover `updated_at` para trigger no banco.
  - Triggers para `users` e `user_progress`; cliente nao envia mais `updated_at`.

- [x] Persistir `full_name` no signup.
  - `Signup.tsx` passa nome para `useAuth.signup`; hook envia `options.data.full_name`.

- [x] Unificar perfil em `public.users`.
  - `Profile.tsx` usa `updateUserProfile()` em vez de `auth.updateUser()`.

- [x] Evitar `SELECT *` em dados de perfil/progresso.
  - `src/lib/db.ts` usa colunas explicitas.

- [x] Tratar erro de sessao no `AuthProvider`.
  - `error` agora e preenchido em falha de `getSession`.

- [x] Configurar redirect OAuth.
  - Google e Apple usam redirect para `/home`.

- [x] Ativar login/cadastro com Google e Apple na UI.
  - Botoes Apple em `Login.tsx` e `Signup.tsx` agora chamam OAuth Supabase.

- [x] Propagar erros da camada `db`.
  - Helpers principais retornam `{ data, error }` ou `{ error }`.

- [x] Criar CI.
  - `.github/workflows/ci.yml`.

- [x] Padronizar scripts sem install embutido.
  - `dev`, `build`, `lint`, `preview` nao rodam `pnpm install`.

- [x] Escolher um lockfile.
  - Projeto padronizado em `pnpm-lock.yaml`; `package-lock.json` removido.

- [x] Adicionar comando `check`.
  - `pnpm check` agrega typecheck, lint, test, build e smoke Supabase.

- [x] Documentar setup completo de backend.
  - README refeito com Supabase CLI, migrations, envs, deploy e providers OAuth.

- [x] Adicionar seed placeholder.
  - `supabase/seed.sql` documenta que cursos ainda ficam no front.

- [x] Criar health/smoke check.
  - `scripts/smoke-supabase.mjs`.

- [x] Atualizar README de recrutador.
  - README agora descreve produto, stack, arquitetura, setup, validacao, deploy, decisoes e roadmap.

## Pendente fora do codigo

- [ ] Configurar Google provider no Supabase Dashboard.
- [ ] Configurar Apple provider no Supabase Dashboard e Apple Developer.
  - Requer Service ID, Team ID, Key ID e private key.
- [ ] Rodar migrations contra ambiente Supabase real.
- [ ] Preencher envs reais no deploy.
- [ ] Criar testes de integracao contra Supabase local/CI com Docker disponivel.
- [ ] Integrar Sentry/Logtail se quiser observabilidade externa.

## Validacao executada

- [x] `npx.cmd tsc -b --pretty false`
- [x] `npm.cmd run lint`
- [x] `npm.cmd run test -- --reporter=dot` - 9 arquivos, 59 testes.
- [x] `npm.cmd run build`
- [x] `npm.cmd run smoke:supabase` - pula corretamente sem envs reais.

