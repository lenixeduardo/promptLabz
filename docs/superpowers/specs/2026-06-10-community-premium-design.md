# Community Premium â€” Design Spec
**Data:** 2026-06-10  
**Status:** Aprovado

---

## Problema

Ajuda profissionais e estudantes de IA a se manterem atualizados e produtivos sem precisar garimpar conteÃºdo na internet, centralizando notÃ­cias, dicas e templates em um Ãºnico lugar exclusivo.

## UsuÃ¡rio-alvo

UsuÃ¡rios do PromptLabz que querem ir alÃ©m das liÃ§Ãµes e ter acesso contÃ­nuo a conteÃºdo curado de IA.

---

## Funcionalidades do MVP

1. Acesso premium via assinatura mensal Stripe (1 mÃªs grÃ¡tis para novos membros)
2. NotÃ­cias de IA automatizadas via RSS + resumo Claude API (cron diÃ¡rio)
3. Dica do dia (inserida manualmente no Supabase)
4. Templates com cÃ³digo/texto copy-paste, por categoria (inseridos manualmente)
5. Paywall para usuÃ¡rios free/cancelados

---

## Arquitetura

```
Frontend (React)
  â””â”€â”€ /community (PrivateRoute + PremiumGate)
        â”œâ”€â”€ DailyTip
        â”œâ”€â”€ NewsFeed (lista de NewsCard)
        â””â”€â”€ TemplateLibrary (filtro por categoria + TemplateCard)

Supabase
  â”œâ”€â”€ Auth (existente)
  â”œâ”€â”€ Database
  â”‚     â”œâ”€â”€ profiles (+ campos premium)
  â”‚     â”œâ”€â”€ news
  â”‚     â”œâ”€â”€ daily_tips
  â”‚     â””â”€â”€ templates
  â””â”€â”€ Edge Functions
        â”œâ”€â”€ stripe-checkout
        â”œâ”€â”€ stripe-webhook
        â”œâ”€â”€ stripe-portal
        â””â”€â”€ rss-fetcher (cron diÃ¡rio 08h UTC)

Stripe
  â””â”€â”€ Product: PromptLabz Premium (mensal, trial 30 dias)
```

---

## Modelo de Dados

```sql
-- ExtensÃ£o em profiles
ALTER TABLE profiles ADD COLUMN
  premium_status TEXT DEFAULT 'free',    -- 'free' | 'trial' | 'active' | 'cancelled'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  premium_since TIMESTAMPTZ;

-- NotÃ­cias (populada pelo cron RSS)
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
- `profiles`: usuÃ¡rio lÃª/atualiza apenas o prÃ³prio row (jÃ¡ existente)

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
  - `customer.subscription.created` â†’ `premium_status = 'trial'`
  - `customer.subscription.updated` â†’ `premium_status = 'active'` (pÃ³s-trial) ou `'cancelled'`
  - `customer.subscription.deleted` â†’ `premium_status = 'cancelled'`
  - `invoice.payment_failed` â†’ `premium_status = 'cancelled'`
- Atualiza `profiles` via `service_role` key

**`stripe-portal`**
- Input: `{ stripeCustomerId }`
- Cria sessÃ£o Customer Portal
- Retorna `{ url }` para redirect (cancelamento, troca de cartÃ£o)

### Secrets necessÃ¡rios
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ANTHROPIC_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## AutomaÃ§Ã£o RSS

**Edge Function `rss-fetcher` (cron: diÃ¡rio 08h UTC via pg_cron)**

Fontes curadas:
- OpenAI Blog
- Anthropic News
- Google AI Blog
- MIT Technology Review (AI tag)
- The Verge / AI section

Fluxo por execuÃ§Ã£o:
1. Busca cada feed RSS (DOMParser nativo Deno)
2. Filtra itens novos (source_url nÃ£o existe em `news`)
3. Para cada item (mÃ¡x. 20 total por execuÃ§Ã£o):
   - Chama `claude-haiku-4-5-20251001`: resume em 3 frases em portuguÃªs
   - Salva em `news`
4. Deleta `news` com `fetched_at < now() - interval '30 days'`

---

## UI / Componentes

### Novos componentes
| Componente | Responsabilidade |
|---|---|
| `pages/Community.tsx` | PÃ¡gina principal da comunidade |
| `components/PremiumGate.tsx` | Wrapper: exibe paywall se nÃ£o-premium |
| `components/NewsCard.tsx` | Card de notÃ­cia (tÃ­tulo, resumo, fonte, link) |
| `components/TemplateCard.tsx` | Card de template com botÃ£o "Copiar" |
| `components/DailyTip.tsx` | Card da dica do dia |
| `hooks/useSubscription.ts` | LÃª `premium_status` do Supabase em real-time |

### Rota nova
```
/community  â†’  PrivateRoute > PremiumGate > Community
```

### Layout da pÃ¡gina Community

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ â† Home        Comunidade    â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  ðŸ‘‘ Badge "Membro Premium"  â”‚
â”‚  VÃ¡lido atÃ©: MM/YYYY        â”‚
â”‚  [Gerenciar Assinatura]     â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  ðŸ’¡ DICA DO DIA             â”‚
â”‚  "Use o Chain of Thought..."â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  ðŸ“° NOTÃCIAS DE IA          â”‚
â”‚  (Ãºltimas 10, card por item)â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  ðŸ“ TEMPLATES               â”‚
â”‚  Chips categoria + cards    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Paywall (free / cancelled)
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  ðŸ”’ ConteÃºdo Exclusivo      â”‚
â”‚  Acesso Ã  Comunidade Premiumâ”‚
â”‚                             â”‚
â”‚  âœ“ NotÃ­cias diÃ¡rias de IA   â”‚
â”‚  âœ“ Dica do dia              â”‚
â”‚  âœ“ Templates prontos        â”‚
â”‚                             â”‚
â”‚  1 mÃªs grÃ¡tis Â· depois R$XX â”‚
â”‚  [Ativar Premium]           â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## Regras de NegÃ³cio

- `premium_status = 'trial'`: acesso total por 30 dias
- `premium_status = 'active'`: acesso total (assinatura ativa)
- `premium_status = 'free' | 'cancelled'`: paywall em `/community`
- VerificaÃ§Ã£o de acesso acontece no servidor via RLS â€” frontend nÃ£o Ã© fonte de verdade
- MÃ¡ximo 20 artigos novos por execuÃ§Ã£o do cron para controle de custo da API

---

## Casos de Borda

- UsuÃ¡rio cancela assinatura: webhook atualiza status â†’ paywall aparece na prÃ³xima visita (real-time via Supabase listener)
- Falha no pagamento: `invoice.payment_failed` â†’ `cancelled`
- Feed RSS offline: captura erro por fonte, continua com os demais, loga falha
- Artigo duplicado: deduplicaÃ§Ã£o por `source_url` antes de inserir
- `daily_tips` sem entry do dia: componente mostra "Em breve" sem quebrar

---

## Testes Previstos

- `useSubscription.test.ts`: retorna status correto para cada `premium_status`
- `PremiumGate.test.tsx`: exibe paywall para free, conteÃºdo para active/trial
- `stripe-checkout` (integration): cria sessÃ£o com trial corretamente
- `stripe-webhook` (integration): atualiza profile para cada evento Stripe
- `rss-fetcher` (integration): deduplicaÃ§Ã£o funciona, mÃ¡x. 20 itens respeitado

---

## DecisÃµes de Design

- **Supabase Edge Functions vs. backend separado**: mantÃ©m tudo no Supabase, sem infra adicional
- **Claude Haiku para resumos**: barato (~$0.0001/resumo), latÃªncia baixa, qualidade suficiente para 3 frases
- **RLS como gate de seguranÃ§a**: frontend pode ser bypassado; RLS garante que dados premium nunca chegam a usuÃ¡rios free
- **Templates manuais no MVP**: automaÃ§Ã£o de templates Ã© complexidade desnecessÃ¡ria agora; admin insere via Supabase dashboard

