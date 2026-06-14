# PromptLabz — Guia de Deploy

## Stack de Produção

| Serviço | Plataforma | Uso |
|---------|-----------|-----|
| Frontend | Vercel | Hospedagem do SPA |
| Backend | Supabase | Auth + Postgres + Edge Functions |
| Email | Resend | Emails transacionais |
| Monitoramento | Sentry (opcional) | Rastreamento de erros |

---

## 1. Configuração do Supabase

### Criar Projeto

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Anote a **Project URL** e a **anon key** (Dashboard → Settings → API)

### Rodar Migrations

```bash
# Instale o Supabase CLI
npm install -g supabase

# Faça login
supabase login

# Vincule ao projeto remoto
supabase link --project-ref SEU_PROJECT_REF

# Rode as migrations em produção
supabase db push
```

As migrations em `supabase/migrations/` serão aplicadas em ordem:
- `20260610_000_initial_schema.sql` — tabelas base, RLS, trigger
- `20260610_001_users_premium.sql` — campos premium, indexes Stripe
- `20260610_002_community_tables.sql` — tabelas de comunidade (futuro)

### Configurar Auth Providers

No painel do Supabase → Authentication → Providers:

**Email:** habilitado por padrão. Configure "Confirm email" conforme necessidade.

**Google OAuth:**
1. Crie credenciais em [console.cloud.google.com](https://console.cloud.google.com)
2. Authorized redirect URI: `https://SEU_PROJECT.supabase.co/auth/v1/callback`
3. Copie Client ID e Client Secret para o Supabase

**Apple OAuth:**
1. Requer Apple Developer Account ($99/ano)
2. Configure: Service ID, Team ID, Key ID, Private Key
3. Siga a [documentação do Supabase](https://supabase.com/docs/guides/auth/social-login/auth-apple)

### Configurar URLs de Redirect

Dashboard → Authentication → URL Configuration:

```
Site URL: https://seu-dominio.vercel.app
Redirect URLs:
  https://seu-dominio.vercel.app/auth/callback
  https://seu-dominio.vercel.app/login
  https://seu-dominio.vercel.app/reset-password
```

---

## 2. Deploy das Edge Functions

### Configurar Secrets

```bash
# Crie um arquivo .env.production com as variáveis das functions
supabase secrets set \
  APP_URL=https://seu-dominio.vercel.app \
  APP_NAME=PromptLabz \
  RESEND_API_KEY=re_... \
  RESEND_FROM_EMAIL=no-reply@seudominio.com \
  SEND_EMAIL_HOOK_SECRET=v1,...
```

### Deploy das Functions

```bash
# Deploy da function de email
supabase functions deploy send-auth-email --no-verify-jwt

# Verifique se está ativa
supabase functions list
```

### Configurar Hook de Email no Supabase

Dashboard → Authentication → Hooks → **Send Email Hook**:
1. Selecione: HTTPS
2. URL: `https://SEU_PROJECT.supabase.co/functions/v1/send-auth-email`
3. Gere o secret e salve como `SEND_EMAIL_HOOK_SECRET`

### Verificar Domínio no Resend

1. Acesse [resend.com](https://resend.com) e adicione seu domínio
2. Adicione os registros DNS fornecidos
3. `RESEND_FROM_EMAIL` deve ser um email do domínio verificado

---

## 3. Deploy no Vercel

### Via Dashboard

1. Acesse [vercel.com](https://vercel.com) e conecte o repositório
2. Framework Preset: **Vite**
3. Build Command: `pnpm build:prod`
4. Output Directory: `dist`
5. Instale o projeto

### Variáveis de Ambiente no Vercel

No painel do projeto → Settings → Environment Variables:

```
VITE_SUPABASE_URL      = https://SEU_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc...
```

> ⚠️ Variáveis com prefixo `VITE_` são expostas no bundle do cliente. Nunca coloque secrets do servidor aqui.

### Preview Deployments

O Vercel cria automaticamente previews para cada PR. Para que o auth funcione nos previews:

1. Adicione o padrão de URL de preview nas Redirect URLs do Supabase:
   ```
   https://*-lenixeduardo.vercel.app/auth/callback
   ```

---

## 4. Monitoramento (Opcional)

### Sentry

```bash
pnpm add @sentry/react
```

Configure `src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
})
```

Adicione `VITE_SENTRY_DSN` no Vercel com o DSN do seu projeto Sentry.

### Health Check

Para verificar se o banco está acessível, acesse:

```
GET /api/health  (não implementado — ver ROADMAP v0.2)
```

Por enquanto, monitore o status pelo [Supabase Status Page](https://status.supabase.com).

---

## 5. Checklist Pré-Deploy

```
[ ] supabase db push rodou sem erros
[ ] Edge Function send-auth-email deployada e testada
[ ] Hook de email configurado no Supabase Auth
[ ] VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY configurados no Vercel
[ ] Redirect URLs configuradas no Supabase (incluindo preview)
[ ] pnpm build:prod roda sem erros localmente
[ ] Login com email, Google testados no preview
[ ] Reset de senha testado (email chega com template personalizado)
[ ] Progresso salva e sincroniza com DB
```

---

## 6. Rollback

Em caso de problema após deploy:

```bash
# Via Vercel CLI
vercel rollback

# Via Dashboard: Deployments → clique no deploy anterior → Redeploy
```

Para rollback de migrations no Supabase, execute o SQL inverso manualmente via SQL Editor no Dashboard (não há rollback automático).

---

## Variáveis de Ambiente — Referência Completa

| Variável | Ambiente | Obrigatória | Descrição |
|----------|----------|-------------|-----------|
| `VITE_SUPABASE_URL` | Frontend | ✅ | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Frontend | ✅ | Chave pública do Supabase |
| `VITE_SENTRY_DSN` | Frontend | ❌ | DSN do Sentry para monitoramento |
| `APP_URL` | Edge Function | ✅ | URL do frontend (para links em emails) |
| `APP_NAME` | Edge Function | ✅ | Nome do app nos emails |
| `RESEND_API_KEY` | Edge Function | ✅ | Chave da API do Resend |
| `RESEND_FROM_EMAIL` | Edge Function | ✅ | Email remetente verificado |
| `SEND_EMAIL_HOOK_SECRET` | Edge Function | ✅ | Secret do webhook de email do Supabase |
