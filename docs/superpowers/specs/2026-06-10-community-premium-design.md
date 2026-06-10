# Community Premium — Design Spec
**Data:** 2026-06-10  
**Status:** Aprovado

---

## Problema

Ajuda profissionais e estudantes de IA a se manterem atualizados e produtivos sem precisar garimpar conteúdo na internet, centralizando notícias, dicas e templates em um único lugar exclusivo.

## Usuário-alvo

Usuários do PromptLab que querem ir além das lições e ter acesso contínuo a conteúdo curado de IA.

---

## Funcionalidades do MVP

1. Acesso premium via assinatura mensal Stripe (1 mês grátis para novos membros)
2. Notícias de IA automatizadas via RSS + resumo Claude API (cron diário)
3. Dica do dia (inserida manualmente no Supabase)
4. Templates com código/texto copy-paste, por categoria (inseridos manualmente)
5. Paywall para usuários free/cancelados

---

## Arquitetura

```
Frontend (React)
  └── /community (PrivateRoute + PremiumGate)
        ├── DailyTip
        ├── NewsFeed (lista de NewsCard)
        └── TemplateLibrary (filtro por categoria + TemplateCard)

Supabase
  ├── Auth (existente)
  ├── Database
  │     ├── profiles (+ campos premium)
  │     ├── news
  │     ├── daily_tips
  │     └── templates
  └── Edge Functions
        ├── stripe-checkout
        ├── stripe-webhook
        ├── stripe-portal
        └── rss-fetcher (cron diário 08h UTC)

Stripe
  └── Product: PromptLab Premium (mensal, trial 30 dias)
```

---

## Modelo de Dados

```sql
-- Extensão em profiles
ALTER TABLE profiles ADD COLUMN
  premium_status TEXT DEFAULT 'free',    -- 'free' | 'trial' | 'active' | 'cancelled'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  premium_since TIMESTAMPTZ;

-- Notícias (populada pelo cron RSS)
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT now()
);

-- Dica do dia (inserida manualmente)
CREATE TABLE daily_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_text TEXT NOT NULL,
  category TEXT,
  scheduled_date DATE UNIQUE NOT NULL
);

-- Templates (inseridos manualmente)
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**RLS:**
- `news`, `daily_tips`, `templates`: SELECT apenas para `premium_status IN ('trial', 'active')`
- `profiles`: usuário lê/atualiza apenas o próprio row (já existente)

---

## Stripe Integration

### Edge Functions

**`stripe-checkout`**
- Input: `{ userId }`
- Cria/recupera Stripe Customer vinculado ao userId
- Cria Checkout Session com `trial_period_days: 30`
- Retorna `{ url }` para redirect

**`stripe-webhook`**
- Endpoint registrado no Stripe Dashboard
- Eventos escutados:
  - `customer.subscription.created` → `premium_status = 'trial'`
  - `customer.subscription.updated` → `premium_status = 'active'` (pós-trial) ou `'cancelled'`
  - `customer.subscription.deleted` → `premium_status = 'cancelled'`
  - `invoice.payment_failed` → `premium_status = 'cancelled'`
- Atualiza `profiles` via `service_role` key

**`stripe-portal`**
- Input: `{ stripeCustomerId }`
- Cria sessão Customer Portal
- Retorna `{ url }` para redirect (cancelamento, troca de cartão)

### Secrets necessários
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ANTHROPIC_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Automação RSS

**Edge Function `rss-fetcher` (cron: diário 08h UTC via pg_cron)**

Fontes curadas:
- OpenAI Blog
- Anthropic News
- Google AI Blog
- MIT Technology Review (AI tag)
- The Verge / AI section

Fluxo por execução:
1. Busca cada feed RSS (DOMParser nativo Deno)
2. Filtra itens novos (source_url não existe em `news`)
3. Para cada item (máx. 20 total por execução):
   - Chama `claude-haiku-4-5-20251001`: resume em 3 frases em português
   - Salva em `news`
4. Deleta `news` com `fetched_at < now() - interval '30 days'`

---

## UI / Componentes

### Novos componentes
| Componente | Responsabilidade |
|---|---|
| `pages/Community.tsx` | Página principal da comunidade |
| `components/PremiumGate.tsx` | Wrapper: exibe paywall se não-premium |
| `components/NewsCard.tsx` | Card de notícia (título, resumo, fonte, link) |
| `components/TemplateCard.tsx` | Card de template com botão "Copiar" |
| `components/DailyTip.tsx` | Card da dica do dia |
| `hooks/useSubscription.ts` | Lê `premium_status` do Supabase em real-time |

### Rota nova
```
/community  →  PrivateRoute > PremiumGate > Community
```

### Layout da página Community

```
┌─────────────────────────────┐
│ ← Home        Comunidade    │
├─────────────────────────────┤
│  👑 Badge "Membro Premium"  │
│  Válido até: MM/YYYY        │
│  [Gerenciar Assinatura]     │
├─────────────────────────────┤
│  💡 DICA DO DIA             │
│  "Use o Chain of Thought..."│
├─────────────────────────────┤
│  📰 NOTÍCIAS DE IA          │
│  (últimas 10, card por item)│
├─────────────────────────────┤
│  📁 TEMPLATES               │
│  Chips categoria + cards    │
└─────────────────────────────┘
```

### Paywall (free / cancelled)
```
┌─────────────────────────────┐
│  🔒 Conteúdo Exclusivo      │
│  Acesso à Comunidade Premium│
│                             │
│  ✓ Notícias diárias de IA   │
│  ✓ Dica do dia              │
│  ✓ Templates prontos        │
│                             │
│  1 mês grátis · depois R$XX │
│  [Ativar Premium]           │
└─────────────────────────────┘
```

---

## Regras de Negócio

- `premium_status = 'trial'`: acesso total por 30 dias
- `premium_status = 'active'`: acesso total (assinatura ativa)
- `premium_status = 'free' | 'cancelled'`: paywall em `/community`
- Verificação de acesso acontece no servidor via RLS — frontend não é fonte de verdade
- Máximo 20 artigos novos por execução do cron para controle de custo da API

---

## Casos de Borda

- Usuário cancela assinatura: webhook atualiza status → paywall aparece na próxima visita (real-time via Supabase listener)
- Falha no pagamento: `invoice.payment_failed` → `cancelled`
- Feed RSS offline: captura erro por fonte, continua com os demais, loga falha
- Artigo duplicado: deduplicação por `source_url` antes de inserir
- `daily_tips` sem entry do dia: componente mostra "Em breve" sem quebrar

---

## Testes Previstos

- `useSubscription.test.ts`: retorna status correto para cada `premium_status`
- `PremiumGate.test.tsx`: exibe paywall para free, conteúdo para active/trial
- `stripe-checkout` (integration): cria sessão com trial corretamente
- `stripe-webhook` (integration): atualiza profile para cada evento Stripe
- `rss-fetcher` (integration): deduplicação funciona, máx. 20 itens respeitado

---

## Decisões de Design

- **Supabase Edge Functions vs. backend separado**: mantém tudo no Supabase, sem infra adicional
- **Claude Haiku para resumos**: barato (~$0.0001/resumo), latência baixa, qualidade suficiente para 3 frases
- **RLS como gate de segurança**: frontend pode ser bypassado; RLS garante que dados premium nunca chegam a usuários free
- **Templates manuais no MVP**: automação de templates é complexidade desnecessária agora; admin insere via Supabase dashboard
