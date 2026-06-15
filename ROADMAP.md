# PromptLabz — Roadmap

## Versão Atual: v0.1 (MVP)

**Status: Publicado**

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

## v0.2 — Engajamento e Qualidade (M · 2–3 semanas)

**Foco:** Tornar a experiência mais rica e monitorável em produção

### Features
- [ ] **Notificações in-app**: sino de notificações com histórico persistido (conquistas desbloqueadas, streaks, atualizações de conteúdo)
- [ ] **Streak semanal**: exibir sequência de dias consecutivos de estudo no perfil
- [ ] **Paginação no histórico de lições**: carregar mais ao rolar (infinite scroll)
- [ ] **Compartilhamento de skills**: link direto para uma skill específica (`/skill/nome`)
- [ ] **Sentry/Logtail**: monitoramento de erros em produção

### Melhorias Técnicas
- [ ] Adicionar `sentry` para rastreamento de erros de produção
- [ ] TypeScript strict mode habilitado
- [ ] Adicionar testes de integração com Supabase local (RLS + migrations)
- [ ] Demo user/seed para demonstrações

### Estimativa de Esforço
| Item | Tamanho |
|------|---------|
| Notificações in-app | M |
| Streak semanal | S |
| Paginação | S |
| Compartilhamento | XS |
| Sentry | XS |
| TypeScript strict | M |
| Testes integração | M |

---

## v0.3 — Crescimento e Comunidade (L · 4–6 semanas)

**Foco:** Ampliar conteúdo e gerar retenção via comunidade

### Features
- [ ] **Submissão de skills pela comunidade**: formulário para sugerir nova skill (vai para fila de revisão)
- [ ] **Comentários em skills**: usuários podem comentar e votar em skills
- [ ] **Progresso detalhado**: dashboard com gráfico de evolução semanal
- [ ] **Novos módulos de conteúdo**: pelo menos 2 novas trilhas temáticas
- [ ] **Busca avançada**: filtro por nível de dificuldade, tempo de lição, popularidade
- [ ] **Prompt Optimizer**: ferramenta guiada para melhorar prompts existentes

### Melhorias Técnicas
- [ ] Migrar conteúdo de `src/data` para tabelas do Supabase com seeds
- [ ] CMS leve para edição de lições sem deploy (Supabase Studio ou similar)
- [ ] Internacionalização base (i18n) para inglês
- [ ] Cache de skills no Service Worker (PWA)

### Estimativa de Esforço
| Item | Tamanho |
|------|---------|
| Submissão comunidade | L |
| Comentários | M |
| Dashboard progresso | M |
| Novos módulos | XL |
| Busca avançada | M |
| Prompt Optimizer | L |
| Migrar conteúdo para DB | L |

---

## v1.0 — Monetização e Escala (XL · 2–3 meses)

**Foco:** Produto sustentável com base de usuários pagantes

### Features
- [ ] **Plano Premium**: plano pago com acesso a conteúdo exclusivo e sem anúncios
- [ ] **Integração Stripe completa**: webhook de pagamento, portal de assinante, upgrades/downgrades
- [ ] **Certificados de conclusão**: PDF gerado ao completar uma trilha
- [ ] **Modo Offline (PWA)**: estudar sem internet, sincroniza ao reconectar
- [ ] **App Mobile nativo**: React Native ou Expo com suporte a notificações push
- [ ] **Analytics de uso**: painel admin com métricas de engajamento por trilha/skill
- [ ] **API pública**: para integrações com ferramentas externas (Zapier, Make)

### Requisitos não-funcionais para v1.0
- SLA 99.9% uptime
- Tempo de resposta P95 < 500ms
- Suporte a 10.000 usuários ativos simultâneos
- LGPD: política de privacidade, exportação e deleção de dados

### Estimativa de Esforço
| Item | Tamanho |
|------|---------|
| Stripe completo | XL |
| Certificados | M |
| PWA offline | L |
| App Mobile | XL |
| Admin analytics | L |
| API pública | XL |

---

## Trade-offs e Decisões

### Por que não começar com CMS?
Conteúdo em `src/data` acelera o MVP mas cria acoplamento. A migração para DB está planejada na v0.3 quando houver conteúdo suficiente para justificar a infraestrutura.

### Por que Supabase e não Firebase?
SQL + RLS nativo permitem regras de segurança declarativas e queries complexas para analytics futuro. Firebase exigiria mais código client-side para as mesmas garantias.

### Por que React + Vite e não Next.js?
O produto é uma SPA com auth. SSR traz complexidade sem benefício real para o conteúdo (não é SEO-crítico como blog). Vite oferece DX superior para SPAs.

### Por que não mobile-first com React Native desde o início?
Validar o produto na web é mais rápido. Migrar para RN depois que o produto for validado reduz o risco de construir o app errado.
