---
type: skills-index
updated: 2026-06-18
total: 0
---

# Skills — Índice Geral

> Base de conhecimento de skills para Claude Code. Sincronizada automaticamente a cada 3 dias.
> _Este arquivo será regenerado pela próxima execução da rotina `skills-prompts-sync`._

## Categorias

- Desenvolvimento
- Design & UI
- IA & Media
- Cloud & Infra
- Marketing
- Produtividade
- Agentes & Workflows

---

```dataview
TABLE icon + " " + name AS "Skill", author AS "Autor", installs AS "Instalações", trending_score AS "Score"
FROM "skills"
WHERE type != "skills-index"
SORT trending_score DESC
LIMIT 20
```
