# RAG Monitor — Agente de Documentação e Observabilidade

Agente especialista responsável por manter a memória viva do ecossistema
PromptLabz: registra modificações, erros, soluções e documenta cada PR/release
com rastreabilidade total.

---

## Estrutura de Diretórios

```
docs/rag-monitor/
├── README.md               ← este arquivo
├── schema.md               ← referência dos campos de cada tipo de evento
└── memory/
    ├── events.json         ← índice central de todos os eventos
    └── pr-docs/
        └── PR-{NNN}.md     ← documentação individual de cada PR
```

---

## Template — Documento de PR (`PR-{NNN}.md`)

```markdown
# PR-{NNN} — {Título}

| Campo              | Valor                        |
|--------------------|------------------------------|
| ID do Evento       | EVT-{NNN}                    |
| Timestamp          | YYYY-MM-DDTHH:MM:SSZ         |
| Tipo               | PR                           |
| PR Number          | #{NNN}                       |
| Branch             | {head} → {base}              |
| Autor              | {login}                      |
| Merged por         | {login}                      |
| Status             | merged / open / closed       |
| Arquivos alterados | N                            |
| Additions / Deletions | +N / -N                   |

## Resumo

{Descrição em 2–3 frases do que a PR faz e por quê.}

## Arquivos Alterados

### `{caminho/arquivo}` — {Classificação: Melhoria | Correção | Degradação | Neutro | ⚠️ Crítico}

- **O que mudou:** {descrição}
- **Impacto:** {latência / segurança / build / UX / nenhum}
- **Risco:** {Nenhum | Baixo | Médio | Alto | Crítico}

## Riscos e Observações

{Lista de riscos identificados, regressões potenciais ou alertas de segurança.}

## Lições Aprendidas

{O que este evento ensina sobre o pipeline, padrões de desenvolvimento ou
comportamento de ferramentas automáticas.}

## Referências Cruzadas

- Evento: EVT-{NNN}
- PR anterior: PR-{NNN-1}
- Erros relacionados: ERR-{NNN} (se houver)
```

---

## Template — Evento de Erro

```json
{
  "id": "ERR-001",
  "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
  "type": "error",
  "severity": "critical | high | medium | low",
  "description": "Descrição clara do erro",
  "context": "Onde/como ocorreu",
  "message": "Mensagem de erro completa",
  "affected_components": ["arquivo ou módulo"],
  "status": "open | resolved",
  "resolution_ref": "SOL-001"
}
```

---

## Template — Evento de Solução

```json
{
  "id": "SOL-001",
  "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
  "type": "solution",
  "error_ref": "ERR-001",
  "root_cause": "Causa raiz identificada",
  "action": "Ação corretiva realizada",
  "validation": "Como a solução foi validada",
  "lessons_learned": "Lição para evitar recorrência"
}
```
