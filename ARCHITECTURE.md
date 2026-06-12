# PromptLabz — Arquitetura do Sistema

## Visão Geral

PromptLabz é uma SPA (Single Page Application) React com backend gerenciado pelo Supabase. Não há servidor próprio — toda a lógica de negócio do lado servidor fica em Edge Functions e Row-Level Security do Postgres.

```
┌─────────────────────────────────────────┐
│              Browser (React SPA)         │
│  Pages → Hooks → lib/db → Supabase JS   │
└──────────────────┬──────────────────────┘
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
│   └── CircleTransition # Animação de entrada nas telas
│
├── contexts/            # Estado global via React Context
│   ├── AuthContext      # Sessão do usuário (user, loading, error)
│   ├── LivesContext     # Sistema de vidas (gamificação)
│   └── AchievementsContext  # Conquistas desbloqueadas
│
├── hooks/               # Lógica de negócio reutilizável
│   ├── useAuth          # Login, signup, logout, OAuth, reset
│   ├── useAchievements  # Acesso ao AchievementsContext
│   └── useFavorites     # Favoritos em localStorage
│
├── pages/               # Componentes de rota (1:1 com URL)
│   ├── Hero             # Landing page (/)
│   ├── Login / Signup / ForgotPassword / ResetPassword / AuthCallback
│   ├── Home             # Dashboard do usuário (/home)
│   ├── LearningLab      # Seleção de trilha (/learn)
│   ├── Lesson           # Lição interativa (/lesson)
│   ├── MissionComplete  # Tela de conclusão (/mission)
│   ├── Skills           # Central de skills (/skills)
│   ├── SkillDetail      # Detalhe de uma skill (/skill/:name)
│   ├── Profile          # Perfil do usuário (/profile)
│   ├── AvatarScreen     # Seleção de avatar (/avatars)
│   └── Achievements     # Conquistas [DEV only] (/achievements)
│
├── lib/
│   ├── supabase.ts      # Instância do Supabase Client
│   ├── db.ts            # Operações de perfil e progresso
│   ├── achievements.ts  # Lógica e definições de conquistas
│   ├── icons.ts         # Re-exportações de Lucide icons
│   └── utils.ts         # Utilitários gerais (cn, etc.)
│
└── data/                # Conteúdo estático (migrar para DB na v0.3)
    ├── lessonsData.ts   # Módulos e lições de todas as trilhas
    ├── promptsData.ts   # Biblioteca de prompts
    ├── trendingSkillsData.ts  # Skills catalogadas
    └── avatarsData.ts   # Opções de avatar
```

---

## Fluxo de Dados

### Autenticação

```
User → Login Form
     → useAuth.login()
     → supabase.auth.signInWithPassword()
     → JWT salvo no localStorage (gerenciado pelo Supabase)
     → AuthContext.onAuthStateChange() dispara
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

---

## Banco de Dados

### Diagrama de Tabelas

```
public.users                    public.user_progress
─────────────────────           ──────────────────────────────
id           UUID PK            id               UUID PK
email        TEXT               user_id          UUID FK→users.id
full_name    TEXT               category_id      TEXT
avatar_url   TEXT               completed_lessons TEXT[]
premium_status ENUM             current_module_index INT
stripe_customer_id TEXT         current_lesson_index INT
trial_ends_at TIMESTAMPTZ       created_at       TIMESTAMPTZ
created_at   TIMESTAMPTZ        updated_at       TIMESTAMPTZ
updated_at   TIMESTAMPTZ
                                UNIQUE(user_id, category_id)
```

### Row-Level Security

Ambas as tabelas têm RLS habilitado. As políticas garantem:

```sql
-- users: só pode ver e editar a própria linha
SELECT: auth.uid() = id
UPDATE: auth.uid() = id (exceto campos premium_status, stripe_customer_id, trial_ends_at)

-- user_progress: só pode ver e editar o próprio progresso
SELECT: auth.uid() = user_id
INSERT/UPDATE: auth.uid() = user_id
```

### Trigger de Criação de Perfil

```sql
-- Ao criar usuário no Auth, cria automaticamente em public.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

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

## Decisões de Arquitetura

### Context API vs Zustand/Redux
Optamos por Context API nativo para evitar dependência de estado externo. Os 3 contextos (Auth, Lives, Achievements) têm escopo bem definido e não compartilham estado entre si.

### Dados Estáticos em TypeScript
Todo o conteúdo de lições e skills está em arquivos `.ts` em `src/data`. Isso acelera o MVP mas tem dois custos: bundle maior e necessidade de redeploy para atualizar conteúdo. A migração para Supabase está prevista na v0.3.

### Offline-First com localStorage
O progresso do usuário é salvo imediatamente no `localStorage` antes de sincronizar com o Supabase. Isso garante que erros de rede não apagam o progresso.

### Lazy Loading de Páginas
Todas as páginas são carregadas com `React.lazy()`. O bundle principal contém apenas o App shell; cada página é carregada sob demanda.

---

## Variáveis de Ambiente

| Variável | Obrigatória | Onde Usar |
|----------|-------------|-----------|
| `VITE_SUPABASE_URL` | Frontend | Sim | 
| `VITE_SUPABASE_ANON_KEY` | Frontend | Sim |
| `APP_URL` | Edge Function | Sim |
| `APP_NAME` | Edge Function | Sim |
| `RESEND_API_KEY` | Edge Function | Para emails |
| `RESEND_FROM_EMAIL` | Edge Function | Para emails |
| `SEND_EMAIL_HOOK_SECRET` | Edge Function | Para webhook |
| `VITE_SENTRY_DSN` | Frontend | Opcional (monitoramento) |
