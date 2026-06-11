# PromptLabz â€” CLAUDE.md

## Checklist de Qualidade para Todo Projeto Desenvolvido

Use esta lista como guia obrigatÃ³rio ao desenvolver, revisar ou finalizar qualquer projeto de portfÃ³lio.

---

### 1) Ideia e Escopo com Cara de Produto

- [ ] Problema real descrito em 1 frase: "Ajuda X a fazer Y sem Z"
- [ ] UsuÃ¡rio-alvo definido (ex: dono de restaurante / estudante / freelancer)
- [ ] MVP fechado: 3â€“5 funcionalidades principais (nÃ£o 20)
- [ ] Regras de negÃ³cio explÃ­citas (ex: limites, validaÃ§Ãµes, estados, permissÃµes)
- [ ] Casos de borda mapeados (ex: sem internet, erro de API, dado invÃ¡lido)

---

### 2) UX/UI Minimamente "de ProduÃ§Ã£o"

- [ ] Layout consistente (spacing, tipografia, cores, estados)
- [ ] Estados completos: loading / empty state / erro / sucesso
- [ ] Feedback rÃ¡pido (toasts, skeletons, disable em botÃ£o durante submit)
- [ ] Responsivo (mobile/desktop)
- [ ] Acessibilidade bÃ¡sica: labels, foco visÃ­vel, contraste aceitÃ¡vel, navegaÃ§Ã£o por teclado

---

### 3) Funcionalidades que Provam Maturidade

Escolha algumas â€” nÃ£o precisa todas:

- [ ] AutenticaÃ§Ã£o (email/senha ou OAuth)
- [ ] CRUD completo com validaÃ§Ã£o real
- [ ] Busca + filtro + ordenaÃ§Ã£o (nÃ£o sÃ³ "listar")
- [ ] PaginaÃ§Ã£o ou infinite scroll
- [ ] Upload (imagem/arquivo) com validaÃ§Ã£o
- [ ] PermissÃµes (ex: admin vs user) ou ao menos "meus dados"
- [ ] Logs/Auditoria simples (ex: "Ãºltima atualizaÃ§Ã£o", "criado por")
- [ ] NotificaÃ§Ãµes (email ou in-app) se fizer sentido

---

### 4) Qualidade de CÃ³digo

- [ ] Estrutura de pastas clara e coerente
- [ ] Componentes reutilizÃ¡veis (sem "copiar e colar UI")
- [ ] Tipagem consistente (se TS) e sem gambiarra pra "calar erro"
- [ ] Tratamento de erro padronizado (API + UI)
- [ ] ConvenÃ§Ãµes: lint + format (ESLint/Prettier) configurados
- [ ] Commits com mensagens decentes (padrÃ£o: feat/fix/refactor/docs)

---

### 5) Back-end/API com PadrÃ£o Real

- [ ] Rotas REST/GraphQL bem definidas
- [ ] ValidaÃ§Ã£o de input no servidor (Zod/Joi/class-validator etc)
- [ ] PaginaÃ§Ã£o/filters no back (nÃ£o filtrar tudo no front)
- [ ] Camadas mÃ­nimas (controller/service/repo) ou organizaÃ§Ã£o equivalente
- [ ] Banco com migraÃ§Ãµes (Prisma migrate / SQL migrations)
- [ ] Seeds/dados de exemplo pra rodar local

---

### 6) SeguranÃ§a BÃ¡sica

- [ ] Senhas com hash (nunca salvar puro)
- [ ] Tokens/sessÃµes seguros (cookie httpOnly quando aplicÃ¡vel)
- [ ] VariÃ¡veis de ambiente em `.env.example` (nunca commitar segredo)
- [ ] Rate limit simples em login/rotas crÃ­ticas (se tiver backend)
- [ ] ProteÃ§Ã£o contra acesso indevido (checar dono do recurso no servidor)
- [ ] CORS/configs corretas em produÃ§Ã£o (se for API separada)

---

### 7) Testes

Recrutador nÃ£o quer 200 testes; quer prova de que vocÃª sabe testar:

- [ ] Pelo menos 5â€“10 testes Ãºteis
- [ ] 2â€“3 testes de unidade (funÃ§Ã£o/regra de negÃ³cio)
- [ ] 2â€“3 testes de integraÃ§Ã£o (API + DB ou service)
- [ ] 1â€“2 testes de UI (fluxo de formulÃ¡rio/erro/sucesso)
- [ ] Rodar em CI (GitHub Actions) mesmo que simples

---

### 8) Observabilidade e Confiabilidade

- [ ] Logs claros no backend (sem logar dados sensÃ­veis)
- [ ] Tratamento de falhas (retry/backoff onde faz sentido)
- [ ] Monitoramento leve: Sentry/Logtail ou similar (opcional, mas chama atenÃ§Ã£o)
- [ ] Health check (se API)

---

### 9) Deploy e Ambiente

- [ ] URL pÃºblica funcionando (Vercel/Render/Fly/Railway etc)
- [ ] Build sem erros e sem "gambi pra deployar"
- [ ] Banco em produÃ§Ã£o configurado corretamente
- [ ] README com instruÃ§Ãµes 100% reproduzÃ­veis
- [ ] Se tiver Docker: `docker-compose` pra subir local

---

### 10) README "de Recrutador"

Seu README tem que permitir avaliar em 60 segundos:

- [ ] Resumo do projeto (o que Ã© e pra quem Ã©)
- [ ] Funcionalidades principais (bullet points)
- [ ] Stack e por quÃª (1 linha por escolha)
- [ ] Arquitetura (diagrama simples ou explicaÃ§Ã£o curta)
- [ ] Como rodar local (passo a passo)
- [ ] Credenciais demo (se tiver ambiente de teste)
- [ ] Screenshots/GIF curto (ou vÃ­deo de 1 min)
- [ ] Roadmap (2â€“5 itens) mostrando visÃ£o e priorizaÃ§Ã£o

---

### 11) "Provas" de Autoria (Anti-Tutorial)

Isso Ã© o que mais tira vocÃª do "copiei do YouTube":

- [ ] DecisÃµes registradas: "Por que usei X e nÃ£o Y"
- [ ] Issues abertas e fechadas (mesmo sendo vocÃª)
- [ ] Pull Requests (atÃ© em repo prÃ³prio) mostrando revisÃ£o e descriÃ§Ã£o
- [ ] Um doc curto: "trade-offs e prÃ³ximos passos"
- [ ] Changelog de versÃµes (v0.1, v0.2â€¦)

