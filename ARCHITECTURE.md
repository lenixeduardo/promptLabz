# PromptLabz — Arquitetura do Sistema

## Visão Geral

PromptLabz é uma SPA (Single Page Application) React com backend gerenciado pelo Supabase. Não há servidor próprio — toda a lógica de negócio do lado servidor fica em Edge Functions e Row-Level Security do Postgres. A aplicação também roda nativamente em Android via Capacitor.

```
┌──────────────────────────────────────────────────────┐
│              Browser / Android (React SPA)            │
│  Pages → Hooks → lib/db → Supabase JS               │
└──────────────────────┬───────────────────────────────┘
                       │ HTTPS
            ┌──────────▼──────────┐
            │      Supabase        │
            │  ┌───────────────┐  │
            │  │  Auth (JWT)   │  │
            │  ├───────────────┤  │
            │  │  Postgres+RLS │  │
            │  ├───────────────┤  │
            │  │ Edge Functions│  │
            │  └───────────────┘  │
            └─────────────────────┘

Android (Capacitor)
  └── WebView wraps o bundle React (dist/)
        └── @capacitor/android bridge → APIs nativas
```

---

## Estrutura de Pastas

```
src/
├── components/          # Componentes UI reutilizáveis
│   ├── ui/              # Primitivos (button, input, card) — Radix UI base
│   ├── ErrorBoundary    # Captura erros de renderização
│   ├── PrivateRoute     # Guard de rota autenticada
│   ├── BrandLogo        # Logo com tipografia da marca
│   ├── MascotGlow       # Wrapper animado do mascote
│   ├── LearningPathTrail # Trilha visual de progresso
│   └── CircleTransition # Animação de entrada nas telas
│
├── contexts/            # Estado global via React Context
│   ├── AuthContext      # Sessão do usuário (user, loading, error)
│   ├── LivesContext     # Sistema de vidas (gamificação)
│   ├── AchievementsContext  # Conquistas desbloqueadas
│   └── ThemeContext     # Tema dark/light com persistência em localStorage
│
│   # Providers adicionais em src/components/
│   ├── AvatarProvider   # Avatar selecionado pelo usuário (global)
│   └── PremiumProvider  # Status premium (free/trial/active/cancelled)
│
├── hooks/               # Lógica de negócio reutilizável
│   ├── useAuth          # Login, signup, logout, OAuth, reset
│   ├── useAchievements  # Acesso ao AchievementsContext
│   ├── useFavorites     # Skills favoritas em localStorage
│   ├── useFavoritePrompts  # Prompts favoritos em localStorage
│   ├── usePrompts       # Biblioteca de prompts com filtro/busca
│   ├── useDailyMissions # Estado das missões diárias
│   ├── useErrorLogging  # Hook de logging de erros estruturado
│   ├── useErrorRecovery # Retry automático em falhas de API
│   ├── useInactiveReminder  # Lembrete para usuários inativos
│   ├── useLabCategories # Categorias do PromptLab
│   ├── useRetry         # Utilitário genérico de retry com backoff
│   ├── useSkillTrailCategories  # Categorias da trilha de skills
│   ├── useTrendingSkills    # Skills em alta
│   └── useUTM           # Captura e leitura de parâmetros UTM
│
├── pages/               # Componentes de rota (1:1 com URL)
│   ├── Hero             # Landing page (/)
│   ├── Login / Signup / ForgotPassword / ResetPassword / AuthCallback / Verify
│   ├── Onboarding       # Fluxo de onboarding (/onboarding)
│   ├── Home             # Dashboard do usuário (/home)
│   ├── LearningLab      # Seleção de trilha (/learn)
│   ├── Lesson           # Lição interativa (/lesson)
│   ├── ModuleExam       # Exame de módulo (/module-exam)
│   ├── MissionComplete  # Tela de conclusão (/mission)
│   ├── LevelUp          # Tela de nível up (/level-up)
│   ├── Skills           # Central de skills (/skills)
│   ├── SkillDetail / SkillCategoryPage
│   ├── Prompts / PromptDetail / PromptCategoryPage
│   ├── PromptEnhancer   # Melhora prompts com IA (/prompt-enhancer)
│   ├── PromptAnalyzer   # Analisa prompts (/prompt-analyzer)
│   ├── PromptLab        # Laboratório de prompts (/prompt-lab)
│   ├── PromptChallenge / PromptWars  # Modos competitivos
│   ├── QuickQuiz / QuizResult  # Quiz rápido (/quiz)
│   ├── Lab / LabResult  # Laboratório de testes (/lab)
│   ├── Templates / TemplateDetail  # Banco de templates
│   ├── DailyMissions    # Missões diárias (/missions)
│   ├── Missions         # Painel de missões
│   ├── Achievements     # Conquistas (/achievements)
│   ├── Favorites        # Prompts e skills favoritos (/favorites)
│   ├── Store            # Loja de itens (/store)
│   ├── Inventory        # Inventário do usuário (/inventory)
│   ├── Premium          # Página de assinatura (/premium)
│   ├── Subscription     # Gestão de assinatura
│   ├── Certificate / Certificates  # Certificados ganhos
│   ├── Ranking          # Placar de líderes (/ranking)
│   ├── Community        # Comunidade (/community)
│   ├── News             # Novidades (/news)
│   ├── Notifications    # Notificações (/notifications)
│   ├── Roadmap          # Roadmap público (/roadmap)
│   ├── Profile          # Perfil do usuário (/profile)
│   ├── AvatarScreen     # Seleção de avatar (/avatars)
│   ├── Settings         # Configurações (/settings)
│   └── Privacy / Terms  # Páginas legais
│
├── lib/                 # Utilitários e lógica de domínio
│   ├── supabase.ts      # Instância do Supabase Client
│   ├── db.ts            # Operações de perfil e progresso
│   ├── achievements.ts  # Lógica e definições de conquistas
│   ├── achievements-db.ts  # Sincronização de conquistas com Supabase
│   ├── analytics.ts     # PostHog + Google Tag (conversões)
│   ├── certificatePdf.ts  # Geração de PDF de certificados (jsPDF + QRCode)
│   ├── dailyTip.ts      # Seleção determinística de dica diária
│   ├── errorLogging.ts  # Logger de auditoria estruturado (→ Sentry)
│   ├── icons.ts         # Re-exportações de Lucide icons
│   ├── inventory.ts     # Gestão de itens (power-ups, avatars)
│   ├── lessonContent.ts # Utilitários de conteúdo de lições
│   ├── levelTitles.ts   # Títulos por nível de XP
│   ├── missions.ts      # Missões diárias e quests especiais
│   ├── moduleProgress.ts  # Rastreamento de progresso por módulo
│   ├── promptEnhancer.ts  # Lógica de enhancement de prompts com IA
│   ├── streak.ts        # Rastreamento de sequência de dias ativos
│   ├── trail.ts         # Cálculo de status da trilha de aprendizado
│   ├── userScope.ts     # Namespacing de localStorage por user.id
│   ├── utils.ts         # Utilitários gerais (cn, etc.)
│   └── xp.ts            # Sistema de XP e gems
│
└── data/                # Conteúdo estático (migrar para DB na v0.3)
    ├── lessonsData.ts        # Módulos e lições de todas as trilhas
    ├── promptsData.ts        # Biblioteca de prompts
    ├── trendingSkillsData.ts # Skills catalogadas
    ├── avatarsData.ts        # Opções de avatar
    ├── challengeData.ts      # Dados de desafios
    ├── dailyMissionsData.ts  # Definições de missões diárias
    ├── dailyTipsData.ts      # Banco de dicas diárias
    ├── favoritesData.ts      # Estrutura de favoritos
    ├── labCategoriesData.ts  # Categorias do PromptLab
    ├── newsData.ts           # Conteúdo de novidades
    ├── notificationsData.ts  # Templates de notificação
    ├── powerUpsData.ts       # Definições de power-ups da loja
    ├── premiumData.ts        # Planos e benefícios premium
    ├── quizData.ts           # Banco de perguntas de quiz
    ├── storeItemsData.ts     # Itens disponíveis na loja
    ├── templatesData.ts      # Banco de templates de prompt
    └── trailCategorySkillsData.ts  # Skills por categoria de trilha
```

---

## Sistema de Gamificação

PromptLabz possui um sistema de gamificação completo, com múltiplas camadas que incentivam o engajamento diário:

### XP e Níveis (`lib/xp.ts`)
- **XP (Experience Points):** ganho ao completar lições, missões e quests
- **Nível:** calculado como `Math.floor(xp / 500) + 1` (500 XP por nível)
- **Gems:** moeda virtual usada para comprar itens na loja
- Ambos (XP e gems) são persistidos em `localStorage` com chave scoped por `user.id`
- Eventos customizados (`promptlabz:xp-updated`, `promptlabz:gems-updated`) disparam atualizações reativas na UI sem Context API

### Streak (`lib/streak.ts`)
- Rastreia sequências de dias consecutivos de acesso
- Armazena `count`, `longest` e `lastDay` em `localStorage`
- Reseta se o usuário ficar mais de 1 dia sem acessar
- Hook `useStreak()` incluso — detecta mudança no `storage` e `focus` da janela

### Missões Diárias (`lib/missions.ts`)
- 5 missões por dia: login, lição, favoritar skills, quiz, salvar prompt
- Ao completar todas as 5, libera o baú diário (+50 gems, +100 XP)
- **Quests Especiais:** 1 quest por período de 3 dias (selecionada deterministicamente por hash da data)
- Estado armazenado em `localStorage` com reset automático a cada novo dia

### Inventário (`lib/inventory.ts`)
- Power-ups: `boost-xp`, `protection`, `focus-total`
- Avatares desbloqueados
- Persistido em `localStorage` scoped por `user.id`

### Níveis e Títulos (`lib/levelTitles.ts`)
- Cada nível tem um título (ex: "Aprendiz", "Especialista")
- Usado na tela de perfil e ranking

### Achievements (`lib/achievements.ts`, `lib/achievements-db.ts`)
- Conquistas desbloqueadas por ações do usuário
- Sincronizadas com Supabase quando disponível

---

## Fluxo de Dados

### Autenticação

```
User → Login Form
     → useAuth.login()
     → supabase.auth.signInWithPassword()
     → JWT salvo no localStorage (gerenciado pelo Supabase)
     → AuthContext.onAuthStateChange() dispara
     → userScope.ts inicializa namespace de localStorage para o user.id
     → user state atualizado → PrivateRoute libera acesso
```

### Progresso (offline-first)

```
User completa lição
     → Lesson.tsx salva no localStorage (imediato)
     → lib/db.saveProgress() chamado
          → se Supabase configurado: upsert em user_progress
          → se offline/sem config: apenas localStorage
     → Na próxima sessão: loadProgress() mescla DB + localStorage
```

### OAuth Callback

```
User clica "Entrar com Google"
     → supabase.auth.signInWithOAuth({ provider: 'google' })
     → Redirect para Google
     → Google redireciona para /auth/callback
     → AuthCallback.tsx lê hash de URL
     → supabase.auth.getSession() confirma sessão
     → Navigate para /home
```

### Analytics

```
Evento (ex: lesson_completed)
     → lib/analytics.capture(event, props)
     → PostHog (product analytics)
     → Google Tag / GA4 (conversões e audiências de remarketing)
```

---

## Banco de Dados

O schema completo está em `schema.sql` (snapshot) e versionado em `supabase/migrations/`. As migrations são aplicadas em ordem cronológica via `supabase db push`.

### Tabelas Principais (User Data)

```
public.users                          public.user_progress
────────────────────────────          ────────────────────────────────
id             UUID PK                id               UUID PK
email          TEXT UNIQUE            user_id          UUID FK→users.id
full_name      TEXT                   category_id      TEXT (≤80 chars)
avatar_url     TEXT                   completed_lessons TEXT[] (≤500)
premium_status TEXT ('free'|          current_module_index INT
               'trial'|'active'|      current_lesson_index INT
               'cancelled')           updated_at       TIMESTAMPTZ
stripe_customer_id    TEXT UNIQUE      UNIQUE(user_id, category_id)
stripe_subscription_id TEXT UNIQUE
trial_ends_at  TIMESTAMPTZ
premium_since  TIMESTAMPTZ
xp             INT (≥0, ≤10M)
gems           INT (≥0, ≤1M)
created_at     TIMESTAMPTZ
updated_at     TIMESTAMPTZ
```

### Gamificação e Conquistas

```
public.user_achievements              public.notifications
────────────────────────────          ────────────────────────────────
id                  UUID PK           id          UUID PK
user_id             UUID FK→users.id  user_id     UUID FK→users.id
unlocked_achievements TEXT[] (≤50)    type        TEXT ('achievement'|
total_lessons_completed INT                        'mention'|'system'|
perfect_count        INT                           'reminder')
last_visit_date      DATE             title       TEXT (≤200)
consecutive_days     INT              description TEXT (≤500)
visited_categories   TEXT[]           action_label TEXT
completed_category_ids TEXT[]         href        TEXT
updated_at           TIMESTAMPTZ      mention     BOOLEAN
UNIQUE(user_id)                       read_at     TIMESTAMPTZ
                                      created_at  TIMESTAMPTZ
```

### Conteúdo (Leitura Pública)

```
public.news_articles                  public.trending_skills
────────────────────────────          ────────────────────────────────
id           UUID PK                  id           UUID PK
title        TEXT (≤300)              name         VARCHAR(255)
description  TEXT (≤800)              description  TEXT
category     TEXT ('OpenAI'|          category     VARCHAR(100)
             'Anthropic'|             author       VARCHAR(255)
             'Google'|'ChatGPT')      installs     VARCHAR(10)
image_emoji  TEXT                     installs_count INT
visible      BOOLEAN                  tags         TEXT[]
published_at TIMESTAMPTZ              icon         VARCHAR(100)
                                      sort_order   INT UNIQUE

public.prompts                        public.skill_trail_categories
────────────────────────────          ────────────────────────────────
id           UUID PK                  id           UUID PK
title        TEXT                     category_id  VARCHAR(50) UNIQUE
content      TEXT                     label        VARCHAR(255)
category     TEXT                     icon         VARCHAR(100)
tags         TEXT[]                   sort_order   INT UNIQUE
installs_count INT
visible      BOOLEAN
published_at TIMESTAMPTZ

public.lab_categories / public.lab_config / public.achievement_definitions
  ── tabelas de configuração de conteúdo, leitura pública via RLS
```

### Pagamentos e Assinatura

```
public.subscriptions
────────────────────────────────────────
id                   UUID PK
user_id              UUID FK→auth.users
paddle_subscription_id TEXT UNIQUE
paddle_customer_id   TEXT
product_id / price_id TEXT
status               TEXT ('active'|'canceled'|...)
current_period_start/end TIMESTAMPTZ
cancel_at_period_end BOOLEAN
environment          TEXT ('live'|'sandbox')
created_at / updated_at TIMESTAMPTZ
```

### Observabilidade

```
public.error_logs                     public.reviews
────────────────────────────          ────────────────────────────────
id           UUID PK                  id        UUID PK
user_id      UUID (nullable)          user_id   UUID FK→users.id
error_type   TEXT                     rating    INT (1-5)
message      TEXT                     comment   TEXT
context      JSONB                    created_at TIMESTAMPTZ
created_at   TIMESTAMPTZ
```

### Row-Level Security

Todas as tabelas têm RLS habilitado. Resumo das políticas:

```sql
-- users: autenticados veem todos os perfis (para ranking); atualizam só o próprio
SELECT: auth.uid() IS NOT NULL (leaderboard)
UPDATE: auth.uid() = id
-- Campos editáveis pelo cliente: full_name, avatar_url, xp, gems
-- Campos bloqueados ao cliente: premium_status, stripe_customer_id, trial_ends_at

-- user_progress, user_achievements, notifications: próprio registro apenas
SELECT/INSERT/UPDATE: auth.uid() = user_id

-- news_articles, trending_skills, prompts, lab_*: leitura pública (sem auth)
SELECT: true (sem restrição de auth)

-- subscriptions: própria assinatura / service_role para webhooks
SELECT: auth.uid() = user_id
ALL: service_role (para webhook Paddle)

-- error_logs: service_role + usuário insere os próprios
```

### Trigger de Criação de Perfil

```sql
-- Ao criar usuário no Auth, cria automaticamente em public.users
-- e inicializa a linha em public.user_achievements
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Histórico de Migrations

| Arquivo | Conteúdo |
|---------|----------|
| `20260610_000_initial_schema.sql` | `users`, `user_progress`, RLS, trigger |
| `20260610_001_users_premium.sql` | Campos premium/Stripe em `users` |
| `20260610_002_community_tables.sql` | Tabelas `news`, `daily_tips`, `templates` (esboço futuro) |
| `20260611_003_user_achievements.sql` | `user_achievements`, trigger de auto-criação |
| `20260612_003_user_streaks.sql` | Suporte a streaks no schema |
| `20260616_004_notifications.sql` | `notifications` + índice de performance |
| `20260616_005_news_articles.sql` | `news_articles` + seed com 10 artigos |
| `20260616_006_skills_prompts_achievements.sql` | `trending_skills`, `skill_trail_*`, `prompts`, `lab_*`, `achievement_definitions` |
| `20260618_007_news_articles_extend.sql` | Extensão de categorias no `news_articles` |
| `20260618_008_error_logs.sql` | `error_logs` para auditoria |
| `20260619_009_subscriptions.sql` | `subscriptions` (Paddle) |
| `20260619_010_trending_prompts.sql` | Extensão de prompts |
| `20260619_011_reviews.sql` | `reviews` de usuários |
| `20260621_012_users_xp_gems.sql` | Colunas `xp`/`gems` em `users`, índice de ranking |
| `20260626_013_prompts_missing_categories.sql` | Categorias faltantes em prompts |

---

## Edge Functions (Supabase)

### `send-auth-email`
- **Trigger:** Hook de email do Supabase Auth
- **Função:** Envia email de boas-vindas/recovery/magic-link com template HTML próprio
- **Dependências:** Resend API para envio, `APP_URL` para o mascote
- **Eventos cobertos:** `signup`, `recovery`, `magiclink`, `email_change`

### `stripe-checkout` (placeholder)
- **Status:** Stub — aguarda implementação da v1.0
- **Função futura:** Criar sessão de checkout Stripe

---

## Deploy Android (Capacitor)

O app React é empacotado como APK/AAB nativo via Capacitor:

```
pnpm build              # Gera dist/ (bundle Vite)
npx cap sync android    # Copia dist/ para android/app/src/main/assets/public
npx cap open android    # Abre Android Studio
./gradlew assembleRelease  # Gera APK de release (assina com release.keystore)
```

**Configuração** (`capacitor.config.ts`):
- `appId`: `com.promptlabz.app`
- `webDir`: `dist`
- `androidScheme`: `https` (garante cookies seguros no WebView)
- Keystore: `release.keystore` com alias `promptlabz`

**Scripts disponíveis:**
- `pnpm android:sync` — build + sync
- `pnpm android:open` — abre Android Studio
- `pnpm android:build:debug` — APK de debug
- `pnpm android:build:release` — APK de release

---

## Decisões de Arquitetura

### Context API vs Zustand/Redux
Optamos por Context API nativo para evitar dependência de estado externo. Os 6 providers (Theme, Auth, Avatar, Premium, Lives, Achievements) têm escopo bem definido e não compartilham estado entre si. Para estado de curta duração (XP, gems), eventos customizados do DOM (`promptlabz:xp-updated`, `promptlabz:gems-updated`) são usados para evitar re-renders globais.

### Dados Estáticos em TypeScript
Todo o conteúdo de lições, skills, prompts e missões está em arquivos `.ts` em `src/data`. Isso acelera o MVP mas tem dois custos: bundle maior e necessidade de redeploy para atualizar conteúdo. A migração para Supabase está prevista na v0.3.

### Offline-First com localStorage
O progresso do usuário é salvo imediatamente no `localStorage` antes de sincronizar com o Supabase. Isso garante que erros de rede não apagam o progresso. O módulo `userScope.ts` garante que os dados de cada usuário ficam isolados no mesmo browser.

### Lazy Loading de Páginas
Todas as páginas são carregadas com `React.lazy()`. O bundle principal contém apenas o App shell; cada página é carregada sob demanda.

### Analytics Dual-Track
PostHog cobre product analytics (funnels, retenção, feature flags futuras). Google Tag Manager / GA4 cobre conversões de ads e remarketing. A camada `lib/analytics.ts` abstrai os dois, evitando acoplamento direto nos componentes.

### Design System e UI
Tokens de cores, tipografia, componentes, animações e estratégia responsiva documentados em [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md). O sistema usa Tailwind CSS com CSS custom properties para suporte a dark/light mode sem JavaScript extra.

---

## Variáveis de Ambiente

| Variável | Contexto | Obrigatória |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Frontend | Sim |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Sim |
| `VITE_POSTHOG_KEY` | Frontend | Opcional (analytics) |
| `VITE_POSTHOG_HOST` | Frontend | Opcional (default: us.i.posthog.com) |
| `VITE_GTAG_ID` | Frontend | Opcional (Google Ads/GA4) |
| `VITE_GTAG_CONVERSION_SIGNUP` | Frontend | Opcional (conversão de signup) |
| `VITE_SENTRY_DSN` | Frontend | Opcional (monitoramento de erros) |
| `VITE_PREVIEW_MODE` | Frontend | Opcional (modo demo sem auth) |
| `APP_URL` | Edge Function | Sim |
| `APP_NAME` | Edge Function | Sim |
| `RESEND_API_KEY` | Edge Function | Para emails |
| `RESEND_FROM_EMAIL` | Edge Function | Para emails |
| `SEND_EMAIL_HOOK_SECRET` | Edge Function | Para webhook |
