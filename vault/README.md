---
type: dashboard
updated: 2026-06-18
---

# PromptLabz — Knowledge Vault

> Base de conhecimento de skills e prompts, sincronizada automaticamente a cada 3 dias pela rotina `skills-prompts-sync`.

## Navegação

| Seção | Descrição |
|-------|-----------|
| [[skills/_index\|📦 Skills]] | Skills para Claude Code indexadas do GitHub |
| [[prompts/_index\|✍️ Prompts]] | Prompts curados de repositórios trending |

## Como funciona

A automação `routines/skills-prompts-sync/` roda a cada 3 dias e:

1. Varre o GitHub por novos arquivos `SKILL.md` em repositórios públicos
2. Categoriza as skills e calcula um **trending score** (stars + forks + recência)
3. Busca prompts em repositórios curados (`awesome-chatgpt-prompts`, etc.)
4. Persiste tudo no banco de dados Supabase
5. Gera/atualiza os arquivos `.md` neste vault automaticamente

## Instalar o Dataview

Para usar as consultas dinâmicas neste vault, instale o plugin **Dataview** no Obsidian:

`Settings → Community Plugins → Browse → Dataview → Install → Enable`

---

_Este arquivo é a única nota editada manualmente. Todos os outros são gerados automaticamente._
