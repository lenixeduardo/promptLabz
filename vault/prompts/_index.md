---
type: prompts-index
updated: 2026-06-18
total: 0
---

# Prompts — Índice Geral

> Biblioteca de prompts curados. Sincronizada automaticamente a cada 3 dias.
> _Este arquivo será regenerado pela próxima execução da rotina `skills-prompts-sync`._

## Categorias

- Criatividade
- Marketing
- Programacao
- Educacao
- Produtividade
- Gestao de Produto

---

```dataview
TABLE title AS "Prompt", category AS "Categoria", difficulty AS "Nível", trending_score AS "Score"
FROM "prompts"
WHERE type != "prompts-index"
WHERE trending = true
SORT trending_score DESC
LIMIT 20
```
