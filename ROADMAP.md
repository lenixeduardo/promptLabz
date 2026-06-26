# PromptLabz — Roadmap

## Versão Atual: v0.3 (em andamento)

---

## v0.1 — MVP

**Status: ✅ Publicado**

### Entregues
- ✅ Autenticação completa (email/senha, Google OAuth, Apple OAuth)
- ✅ Trilhas de aprendizado com módulos e lições
- ✅ Central de Skills com 80+ skills catalogadas
- ✅ Busca, filtro por categoria e ranking
- ✅ Sistema de vidas (gamificação)
- ✅ Sistema de conquistas (achievements)
- ✅ Perfil com avatar customizável
- ✅ Progresso salvo localmente e sincronizado com Supabase
- ✅ Email de boas-vindas personalizado com mascote
- ✅ CI/CD com GitHub Actions (typecheck + lint + test + build)
- ✅ Cobertura de testes (unit, integração, UI)

---

## v0.2 — Engajamento e Qualidade

**Status: ✅ Concluída**

### Entregues
- ✅ **Notificações in-app**: sino de notificações com histórico persistido (conquistas desbloqueadas, streaks, atualizações de conteúdo)
- ✅ **Streak semanal**: sequência de dias consecutivos de estudo exibida no perfil com `StreakWidget` e `StreakFlame`
- ✅ **Compartilhamento de skills**: link direto para skill específica (`/skill/nome`)
- ✅ **Monitoramento de erros**: `errorLogging.ts` + `ErrorTrackingDashboard` + `ErrorBoundary` com recuperação
- ✅ **TypeScript**: tipagem consistente em todos os módulos principais

### Melhorias Técnicas Entregues
- ✅ Modo dark/light com `ThemeProvider` e `ThemeToggle`
- ✅ SEO básico com `PageSEO` por página
- ✅ `ErrorBoundary` global com painel de recuperação

---

## v0.3 — Prompt Tools e Expansão de Conteúdo

**Status: Em andamento (PR #80–#97 merged)**

### Features Entregues nesta Versão
- ✅ **Suite de Prompt Tools**:
  - `PromptLab`: laboratório livre de experimentação
  - `PromptAnalyzer`: análise de qualidade de prompt com pontuação
  - `PromptEnhancer`: melhoria guiada de prompts existentes
  - `PromptChallenge`: desafios com critérios de aceitação e pontuação
  - `PromptWars`: batalha de prompts entre usuários
- ✅ **App Android via Capacitor**: build nativo com GitHub Actions (`android-build.yml`)
- ✅ **Feed de Notícias**: página `News` com workflow diário automatizado (`daily-tech-news.yml`)
- ✅ **Sistema de Templates**: catálogo navegável com `Templates` + `TemplateDetail`
- ✅ **Loja e Inventário**: `Store` com power-ups + `Inventory` de itens adquiridos
- ✅ **Missões Diárias**: `DailyMissions` com objetivos renováveis a cada 24h
- ✅ **Sistema de XP e Gems**: moeda dupla para progressão e loja (lib `xp.ts`)
- ✅ **Certificados**: geração de certificado em PDF ao concluir trilha (`Certificate`, `Certificates`, `certificatePdf.ts`)
- ✅ **Comunidade**: página `Community` com feed social
- ✅ **Ranking com Pódio**: tela `Ranking` redesenhada com avatares no top-3
- ✅ **Módulo de Exame**: `ModuleExam` e `QuickQuiz` com resultado em `QuizResult`
- ✅ **Onboarding**: fluxo guiado de primeiro acesso (`Onboarding`)
- ✅ **Assinatura Premium**: fluxo completo em `Subscription` e `Premium`

### Melhorias Técnicas
- ✅ Workflow GitHub Actions para Android build
- ✅ Workflow diário de geração de notícias tech (`daily-tech-news.yml`)
- ✅ `lib/missions.ts`, `lib/xp.ts`, `lib/inventory.ts`, `lib/streak.ts` como módulos isolados e testáveis
- ✅ Migração de progresso legado com chave antiga (`promptlab_progress`)

### Pendente nesta Versão
- [ ] Paginação/infinite scroll no histórico de lições
- [ ] Testes de integração com Supabase local (RLS + migrations para novas tabelas)
- [ ] Seeds/dados de demonstração para novas features (loja, missões, ranking)

---

## v0.4 — Qualidade, Observabilidade e Comunidade

**Foco:** Estabilizar a base técnica, expandir comunidade e adicionar observabilidade real em produção

### Features
- [ ] **Submissão de conteúdo pela comunidade**: formulário para sugerir nova skill ou template (fila de revisão)
- [ ] **Comentários em skills e prompts**: usuários comentam e votam
- [ ] **Dashboard de progresso**: gráfico semanal de evolução (XP, lições, streak)
- [ ] **Busca avançada**: filtro por nível de dificuldade, tempo estimado, popularidade
- [ ] **Notificações push (mobile)**: via Capacitor + FCM para Android
- [ ] **Paginação no histórico de lições**: infinite scroll

### Melhorias Técnicas
- [ ] Integrar Sentry em produção (substituir `errorLogging.ts` por SDK oficial)
- [ ] Migrar conteúdo de `src/data` para tabelas do Supabase com seeds
- [ ] TypeScript strict mode habilitado
- [ ] CMS leve para edição de lições sem deploy (Supabase Studio ou similar)
- [ ] Internacionalização base (i18n) para inglês
- [ ] Cache no Service Worker (PWA) para skills e trilhas

### Estimativa de Esforço
| Item | Tamanho |
|------|---------|
| Submissão comunidade | L |
| Comentários | M |
| Dashboard progresso | M |
| Busca avançada | M |
| Push notifications | M |
| Paginação | S |
| Sentry | XS |
| Migrar conteúdo para DB | L |
| TypeScript strict | M |

---

## v1.0 — Monetização e Escala

**Foco:** Produto sustentável com base de usuários pagantes

### Features
- [ ] **Stripe completo**: webhook de pagamento, portal de assinante, upgrades/downgrades
- [ ] **Modo Offline (PWA)**: estudar sem internet, sincroniza ao reconectar
- [ ] **Notificações push iOS**: via Capacitor + APNs
- [ ] **Analytics de uso**: painel admin com métricas de engajamento por trilha/skill/prompt
- [ ] **API pública**: para integrações externas (Zapier, Make)
- [ ] **Leaderboard sazonal**: rankings por temporada com recompensas
- [ ] **PromptWars ao vivo**: batalhas em tempo real com WebSocket

### Requisitos Não-Funcionais para v1.0
- SLA 99.9% uptime
- Tempo de resposta P95 < 500ms
- Suporte a 10.000 usuários ativos simultâneos
- LGPD: política de privacidade, exportação e deleção de dados

### Estimativa de Esforço
| Item | Tamanho |
|------|---------|
| Stripe completo | XL |
| PWA offline | L |
| Push iOS | M |
| Admin analytics | L |
| API pública | XL |
| Leaderboard sazonal | M |
| PromptWars ao vivo | XL |

---

## Trade-offs e Decisões

### Por que não começar com CMS?
Conteúdo em `src/data` acelera o MVP mas cria acoplamento. A migração para DB está planejada na v0.4 quando houver conteúdo suficiente para justificar a infraestrutura.

### Por que Supabase e não Firebase?
SQL + RLS nativo permitem regras de segurança declarativas e queries complexas para analytics futuro. Firebase exigiria mais código client-side para as mesmas garantias.

### Por que React + Vite e não Next.js?
O produto é uma SPA com auth. SSR traz complexidade sem benefício real para o conteúdo (não é SEO-crítico como blog). Vite oferece DX superior para SPAs.

### Por que Capacitor e não React Native?
O app web já existe e está validado. Capacitor reutiliza 100% do código React existente para gerar o APK Android, sem bifurcar a codebase. React Native seria reescrever tudo — custo alto antes de validar tração mobile.

### Por que moeda dupla (XP + Gems)?
XP representa progresso não-monetizável (não pode ser comprado), preservando a integridade do ranking. Gems são a moeda da loja, podendo ser ganhas ou futuramente adquiridas via IAP sem distorcer o leaderboard.
