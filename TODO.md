# TODO — Telas Pendentes MVP

Rastreia os itens identificados na auditoria de telas (2026-06-16).
Legenda: ✅ concluído · 🔄 em andamento · ⏳ pendente · 🔮 futuro (v1.0+)

---

## Ponto 1 — Notificações persistidas no Supabase `[v0.2]` ✅

> **Problema:** `/notifications` usava 100% mock data hardcoded, sem persistência.

- [x] Criar migration `20260616_004_notifications.sql` com tabela `notifications` + RLS
- [x] Adicionar `getNotifications()`, `markNotificationsRead()` e `insertNotification()` em `src/lib/db.ts`
- [x] Atualizar `Notifications.tsx` para buscar do Supabase (empty state real, sem mock)
- [x] Inserir notificação no Supabase ao desbloquear conquista (`AchievementsContext.tsx`)
- [ ] Mark-as-read individual por item (click na notificação) ⏳
- [ ] Badge de contagem no ícone do sino no `AppBottomNav` ⏳

---

## Ponto 2 — News com dados reais `[v0.2]` ✅

> **Problema:** `/news` usava mock data estático em `newsData.ts`, sem integração externa.
> **Decisão:** tabela Supabase com seed — elimina deploy obrigatório para curar artigos, sem dependências externas. Fallback para mock estático se Supabase estiver offline.

- [x] Criar migration `20260616_005_news_articles.sql` com tabela `news_articles` + RLS pública de leitura
- [x] Seed com os 10 artigos atuais via `INSERT ON CONFLICT DO NOTHING`
- [x] Adicionar `getNewsArticles()` em `src/lib/db.ts`
- [x] Atualizar `News.tsx` para buscar do Supabase (loading skeleton + fallback para `NEWS_ARTICLES` se offline)
- [ ] Integração RSS/API (OpenAI blog, Anthropic blog) via Edge Function ⏳ v0.3
- [ ] Cron job para refresh automático de artigos ⏳ v0.3

---

## Ponto 3 — LabResult integrado ao PromptChallenge `[MVP]` ✅

> **Problema:** `/lab-result` exibia resultado hardcoded (`DEFAULT_RESULT`), desconectado de qualquer fluxo real.

- [x] Criar função `buildLabResultState()` no `PromptChallenge.tsx` que mapeia `FeedbackScore → LabResult state`
- [x] Ao concluir o último desafio, navegar para `/lab-result` com dados reais do prompt analisado
- [x] `LabResult.tsx` já lê `location.state` — funciona sem alteração adicional
- [ ] Botão "Salvar Resultado" no LabResult (persistir no Supabase) ⏳
- [ ] QR Code de verificação no `Certificate.tsx` (link real ou UUID verificável) ⏳

---

## Ponto 4 — Premium / Subscription sem Stripe `[v1.0]` 🔮

> **Status:** Visual completo. CTAs exibem toast "Em breve". Aceitável até integração de pagamento.

- [ ] Integrar Stripe Checkout (webhook + portal de assinante)
- [ ] Conectar `premium_status` no DB ao plano ativo
- [ ] Bloquear conteúdo exclusivo com guard de premium nos componentes

---

## Pendências menores dentro de telas prontas

| Tela | Item | Prioridade |
|------|------|-----------|
| `/store` | Pacotes de gems (requer Stripe) | v1.0 🔮 |
| `/inventory` | Seção "Outros Itens" vazia | v0.3 ⏳ |
| `/certificate` | QR Code real (UUID verificável) | v0.3 ⏳ |
| `/notifications` | Configurações de preferências persistidas | v0.3 ⏳ |
| `/lab-result` | Botão "Salvar Resultado" funcional | v0.2 ⏳ |

## Pendências de Merge e Layout

| Tela | Item | Status |
|------|------|--------|
| `/certificate` | Certificado não está com a nova interface mergeada — precisa integrar o redesign visual ao componente de certificado | ⏳
| `/home` | Homepage quebra em telas grandes — limitar responsividade (max-width) para não esticar conteúdo em monitores largos | ⏳
| `/laboratory` | Laboratório (LearningLab) não exibe os 3 itens (Prompts, Skills e Templates) unificados em uma única página como definido anteriormente no Lovable | ⏳ |
