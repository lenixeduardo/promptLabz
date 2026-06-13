# Guia de Skills — mattpocock/skills

> Use as skills digitando `/nome-da-skill` no Claude Code. Estão organizadas por categoria.

---

## Engenharia

### `/diagnose`
**Quando usar:** bug difícil de reproduzir, regressão de performance, erro intermitente.

Loop disciplinado em 6 fases:
1. Monta feedback loop (teste falhando, curl, CLI, fuzz)
2. Reproduz o bug de forma confiável
3. Gera 3–5 hipóteses falsificáveis e rankeadas
4. Instrumenta o código para testar cada hipótese
5. Corrige + adiciona teste de regressão
6. Limpa e faz post-mortem

```
/diagnose
→ "O botão de submit trava após 2 cliques rápidos"
```

---

### `/tdd`
**Quando usar:** implementar feature nova com cobertura desde o início.

Segue red-green-refactor com fatias verticais (tracer bullets), não horizontais. Testa comportamento público, não implementação.

```
/tdd
→ "Preciso de um módulo de autenticação JWT"
```

---

### `/prototype`
**Quando usar:** validar uma ideia antes de commitar com a arquitetura real.

Dois modos:
- **LOGIC** — app terminal interativo para testar máquinas de estado / regras de negócio
- **UI** — variações radicalmente diferentes de uma mesma interface

Código descartável desde o dia 1. Quando responder a pergunta, absorva ou delete.

```
/prototype
→ "Quero testar 3 shapes diferentes para meu carrinho de compras"
```

---

### `/improve-codebase-architecture`
**Quando usar:** codebase cresceu e está ficando difícil de navegar ou extender.

Explora o repo, lê o glossário de domínio e ADRs, apresenta um relatório HTML com:
- Candidatos a refatoração (problema / solução / benefícios)
- Diagramas Mermaid de before/after
- Recomendação top

Depois entra em loop de grilling para decidir cada candidato.

```
/improve-codebase-architecture
```

---

### `/review`
**Quando usar:** antes de merge, validar que o diff está correto em dois eixos.

Roda dois sub-agentes em paralelo:
- **Standards** — o código segue os padrões documentados do repo?
- **Spec** — o código implementa fielmente a issue/PRD de origem?

```
/review
```

---

### `/zoom-out`
**Quando usar:** você está fundo em um módulo e perdeu o contexto geral.

Sobe um nível de abstração e mostra o mapa de todos os módulos relevantes e seus callers, usando o vocabulário do domínio do projeto.

```
/zoom-out
→ "Estou em UserService, quero entender quem depende disso"
```

---

## Planejamento e Design

### `/grill-me`
**Quando usar:** você tem um plano ou decisão arquitetural e quer stress-testá-lo.

Entrevista você exaustivamente, resolvendo cada galho da árvore de decisões um por vez. Se uma pergunta puder ser respondida pelo codebase, ela explora antes de perguntar.

```
/grill-me
→ "Quero migrar de REST para GraphQL no backend"
```

---

### `/grill-with-docs`
**Quando usar:** como o `/grill-me`, mas com consciência do domínio documentado no projeto.

Desafia seu plano contra o `CONTEXT.md` existente, afina terminologia, atualiza a documentação inline conforme as decisões se cristalizam. Oferece ADRs só para decisões difíceis de reverter.

```
/grill-with-docs
→ "Planejo extrair o módulo de pagamentos como microsserviço"
```

---

### `/to-prd`
**Quando usar:** a conversa tem contexto suficiente e você quer transformar em documento formal.

Sintetiza o contexto atual em um PRD estruturado (problema, solução, user stories, decisões de implementação, out of scope) e publica no issue tracker com label `ready-for-agent`.

```
/to-prd
```

---

### `/to-issues`
**Quando usar:** você tem um plano ou PRD e quer quebrá-lo em issues independentes.

Gera fatias verticais (tracer bullets) — cada issue é fina, completa e demonstrável. Entrevista sobre granularidade e dependências antes de publicar.

```
/to-issues
→ "Tenho esse PRD de sistema de notificações..."
```

---

### `/request-refactor-plan`
**Quando usar:** refatoração grande que precisa ser feita em commits pequenos e seguros.

Entrevista você em detalhe, mapeia cobertura de testes, quebra em commits mínimos (princípio Martin Fowler), e cria uma issue com plano completo + decisões + out-of-scope.

```
/request-refactor-plan
→ "Quero extrair a lógica de domínio dos controllers"
```

---

### `/design-an-interface`
**Quando usar:** você precisa projetar a API/interface de um módulo e quer explorar opções antes de decidir.

Spawna 3+ sub-agentes com constraints diferentes, cada um propõe um design radicalmente diferente com assinatura + exemplos de uso. Compara nos eixos: simplicidade, flexibilidade, eficiência de implementação.

```
/design-an-interface
→ "Módulo de cache com suporte a TTL e invalidação por tag"
```

---

### `/ubiquitous-language`
**Quando usar:** o projeto está crescendo e termos estão sendo usados de forma inconsistente.

Extrai um glossário DDD da conversa, flagra ambiguidades e sinônimos, propõe termos canônicos, salva em `UBIQUITOUS_LANGUAGE.md`.

```
/ubiquitous-language
```

---

## Qualidade e Processo

### `/triage`
**Quando usar:** gerenciar fila de issues ou preparar issues para serem pegas por um agente.

Máquina de estados: `needs-triage → needs-info / ready-for-agent / ready-for-human / wontfix`. Para cada issue: reproduce (bugs), grilla se necessário, aplica outcome com agent brief ou fecha com link para `.out-of-scope/`.

```
/triage
→ "Revisa as últimas 5 issues abertas"
```

---

### `/qa`
**Quando usar:** sessão interativa de reporte de bugs.

Você relata problemas conversacionalmente. A skill explora o codebase em background para entender o domínio e abre issues no GitHub com linguagem de domínio correta (sem file paths ou line numbers que ficam obsoletos após refactor).

```
/qa
→ "O filtro de datas não funciona quando o mês tem 31 dias"
```

---

### `/setup-pre-commit`
**Quando usar:** configurar hooks de qualidade no repo pela primeira vez.

Instala e configura: Husky + lint-staged (Prettier), typecheck, tests. Detecta o package manager automaticamente.

```
/setup-pre-commit
```

---

### `/git-guardrails-claude-code`
**Quando usar:** adicionar proteção contra comandos git destrutivos no Claude Code.

Cria um hook `PreToolUse` que bloqueia: `git push`, `git reset --hard`, `git clean -f`, `git branch -D`, `git checkout .`. Você escolhe escopo (projeto ou global).

```
/git-guardrails-claude-code
```

---

## Setup e Configuração

### `/setup-matt-pocock-skills`
**Quando usar:** primeiro uso das skills num repo novo — configura tudo de uma vez.

Configura: issue tracker (GitHub/GitLab/markdown local), labels de triage, docs de domínio. Escreve templates em `CLAUDE.md`/`AGENTS.md` + `docs/agents/`.

```
/setup-matt-pocock-skills
```

---

### `/write-a-skill`
**Quando usar:** criar uma skill nova para seu projeto ou uso pessoal.

Entrevista sobre requisitos, cria a estrutura (`SKILL.md`, arquivos de referência, scripts utilitários se necessário), revisa com você. Segue checklist: triggers na description, SKILL.md < 100 linhas, sem info time-sensitive.

```
/write-a-skill
→ "Quero uma skill para fazer deploy no meu servidor"
```

---

## TypeScript

### `/migrate-to-shoehorn`
**Quando usar:** remover `as` type assertions de arquivos de teste.

Substitui padrões em código de **teste apenas** (nunca produção):
- `as Type` → `fromPartial<Type>()`
- `as unknown as Type` → `fromAny<Type>()`
- Para dados obrigatoriamente completos: `fromExact<Type>()`

```
/migrate-to-shoehorn
```

---

## Ensino e Conteúdo

### `/teach`
**Quando usar:** aprender algo novo de forma estruturada e progressiva ao longo de várias sessões.

Mantém estado via workspace files: missão, cheat sheets, recursos externos, registro de aprendizados, lições e notas de preferência. Lições são curtas, belas, completáveis e vinculadas à sua missão real.

```
/teach
→ "Quero aprender Rust focado em CLIs"
```

---

### `/scaffold-exercises`
**Quando usar:** criar estrutura de exercícios de um curso ou treinamento.

Gera seções numeradas `XX-section-name/` com exercícios `XX.YY-exercise-name/`, cada um com variantes `problem/`, `solution/`, `explainer/`. Roda lint automaticamente e corrige erros.

```
/scaffold-exercises
→ "Preciso de 3 seções sobre React Hooks"
```

---

## Escrita

### `/writing-fragments`
**Quando usar:** desenvolver ideias antes de impor estrutura — modo diário de romancista.

Sessão de grilling que extrai fragmentos heterogêneos (afirmações, vinhetas, frases afiadas, meios-pensamentos, listas). Sem estrutura imposta. Fragmentos separados por `---` num arquivo markdown.

```
/writing-fragments
→ "Quero desenvolver ideias sobre arquitetura de software"
```

---

### `/writing-beats`
**Quando usar:** você tem material bruto e quer transformar em narrativa beat a beat.

Loop choose-your-own-adventure: escreve 2–3 beats candidatos, você escolhe, ele escreve apenas aquele no arquivo, oferece os próximos. Beat = um movimento na jornada (estabelece cena, pousa ponto, levanta questão, torce o ângulo).

```
/writing-beats
→ "Tenho esse rascunho de post técnico..."
```

---

### `/writing-shape`
**Quando usar:** você tem uma pilha de notas/fragmentos e quer transformar em artigo publicável.

Loop conversacional: lê o material, propõe 2–3 aberturas com teses diferentes, você escolhe, cresce parágrafo a parágrafo discutindo formato (prosa/lista/tabela/callout/código) em cada etapa.

```
/writing-shape
→ (aponta para o arquivo com seus fragmentos)
```

---

### `/edit-article`
**Quando usar:** revisar e melhorar um artigo já escrito.

Divide em seções, reescreve cada uma para clareza, coerência e fluidez. Máximo 240 chars por parágrafo.

```
/edit-article
→ (aponta para o arquivo do artigo)
```

---

## Utilitários

### `/caveman`
**Quando usar:** reduzir tokens em ~75% em sessões longas onde você já entende o contexto.

Ativa modo ultra-comprimido permanentemente: sem artigos, sem preenchimento, sem cortesias. Termos técnicos e código ficam intactos. Exceção automática para avisos de segurança e sequências multi-step.

```
/caveman
```

---

### `/handoff`
**Quando usar:** passar o contexto da conversa atual para outro agente ou sessão.

Compacta a conversa em documento de handoff salvo no temp dir. Inclui seção "suggested skills". Não duplica conteúdo já em PRDs/ADRs/issues — referencia por path/URL. Redige informações sensíveis.

```
/handoff
```

---

### `/obsidian-vault`
**Quando usar:** gerenciar notas no Obsidian (buscar, criar, organizar).

Configurado para vault em `/mnt/d/Obsidian Vault/AI Research/`. Convenções: notas de índice, title case, sem pastas (usa wikilinks). Suporta busca por nome/conteúdo e criação com `[[wikilinks]]`.

```
/obsidian-vault
→ "Busca notas sobre RAG"
```

---

## Referência Rápida

| Skill | Acionar quando... |
|---|---|
| `/diagnose` | Bug difícil / regressão |
| `/tdd` | Feature nova com testes |
| `/prototype` | Validar ideia antes de commitar |
| `/improve-codebase-architecture` | Codebase com fricção arquitetural |
| `/review` | Antes de merge |
| `/zoom-out` | Perdeu contexto geral |
| `/grill-me` | Stress-test de plano |
| `/grill-with-docs` | Grilling com consciência do domínio |
| `/to-prd` | Conversa → PRD formal |
| `/to-issues` | Plano → issues independentes |
| `/request-refactor-plan` | Refatoração grande e segura |
| `/design-an-interface` | Explorar opções de API/módulo |
| `/ubiquitous-language` | Termos inconsistentes no projeto |
| `/triage` | Gerenciar fila de issues |
| `/qa` | Sessão de reporte de bugs |
| `/setup-pre-commit` | Configurar hooks de qualidade |
| `/git-guardrails-claude-code` | Proteger contra git destrutivo |
| `/setup-matt-pocock-skills` | Setup inicial no repo |
| `/write-a-skill` | Criar skill nova |
| `/migrate-to-shoehorn` | Remover `as` de testes TS |
| `/teach` | Aprender algo novo em sessões |
| `/scaffold-exercises` | Criar estrutura de curso |
| `/writing-fragments` | Desenvolver ideias sem estrutura |
| `/writing-beats` | Material bruto → narrativa |
| `/writing-shape` | Notas → artigo publicável |
| `/edit-article` | Revisar artigo existente |
| `/caveman` | Reduzir tokens em sessão longa |
| `/handoff` | Passar contexto para outro agente |
| `/obsidian-vault` | Gerenciar notas no Obsidian |
