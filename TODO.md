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

## Ponto 2 — News com dados reais `[decisão pendente]` ⏳

> **Problema:** `/news` usa mock data estático em `newsData.ts`, sem integração externa.

- [ ] **Decisão:** manter mock curado (aceitável para MVP) ou integrar feed RSS/API de notícias de IA?
- [ ] Se integrar: criar Edge Function Supabase que consome feed (ex: TechCrunch AI, OpenAI blog)
- [ ] Se manter mock: documentar como "curado manualmente" e criar processo de atualização

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
