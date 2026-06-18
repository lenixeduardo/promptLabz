# Rotina: skills-prompts-sync

Varredura a cada **3 dias** por novas skills no GitHub e prompts trending em repositórios curados. Novos itens são persistidos no Supabase e documentados automaticamente no **Obsidian vault** em `vault/`.

## Fluxo

```
GitHub Actions (cron */3 dias, 08:00 UTC)
  │
  ├─ Step 1: POST /functions/v1/skills-prompts-sync  (Bearer SKILLS_SYNC_SECRET)
  │     ├─► GitHub Search API: filename:SKILL.md (top 50 resultados)
  │     │     └─► Parse frontmatter → mapeia categoria (en → pt)
  │     │     └─► Calcula trending_score (stars + forks + recência)
  │     │     └─► UPSERT trending_skills (deduplica por external_id)
  │     │
  │     └─► GitHub API: repos de prompts curados (5 fontes)
  │           └─► Parse prompts.csv / README.md
  │           └─► Categoriza por keywords
  │           └─► UPSERT prompts (deduplica por external_id)
  │
  └─ Step 2: node generate-vault.mjs
        ├─► Lê trending_skills e prompts do Supabase
        ├─► Gera/atualiza vault/skills/<categoria>/<skill>.md
        ├─► Gera/atualiza vault/prompts/<categoria>/<prompt>.md
        ├─► Atualiza _index.md de cada categoria
        └─► Commit automático se houver mudanças
```

## Fontes de Skills

| Fonte | Método |
|-------|--------|
| GitHub Search API | `filename:SKILL.md` nos repositórios públicos |

Skills sem `category` no frontmatter que não bata com nenhuma categoria conhecida são ignoradas.

## Fontes de Prompts

| Repositório | Arquivo |
|-------------|---------|
| f/awesome-chatgpt-prompts | prompts.csv |
| ai-boost/awesome-prompts | prompts.csv |
| PlexPt/awesome-chatgpt-prompts-zh | prompts.csv |
| yokoffing/ChatGPT-Prompts | README.md |
| linexjlin/GPTs | README.md |

## Trending Score

```
score = popularity(60%) + recency(40%)

popularity = min(100, log10(stars + forks + 1) × 30)
recency    = max(0, 100 - dias_sem_push × 0.3)
```

Skills com score ≥ 70 e prompts com score ≥ 60 são marcados como `trending: true` no vault.

## Categorias de Skills (→ Portuguese)

| SKILL.md | Banco / Vault |
|----------|---------------|
| productivity | Produtividade |
| development | Desenvolvimento |
| design | Design & UI |
| marketing | Marketing |
| ai-media | IA & Media |
| cloud | Cloud & Infra |
| agent-workflows | Agentes & Workflows |

## Vault Obsidian

Os arquivos gerados em `vault/` seguem o padrão:

```
vault/
├── README.md           (dashboard)
├── .obsidian/          (config)
├── skills/
│   ├── _index.md       (índice global + Dataview query)
│   └── <Categoria>/
│       ├── _index.md   (índice da categoria)
│       └── <skill>.md  (nota com frontmatter + especificação)
└── prompts/
    ├── _index.md
    └── <Categoria>/
        ├── _index.md
        └── <prompt>.md
```

Cada nota tem frontmatter YAML compatível com **Dataview** para consultas dinâmicas.

## Acionamento manual

```bash
export SUPABASE_URL="https://seu-projeto.supabase.co"
export SKILLS_SYNC_SECRET="seu-secret-aqui"
export SUPABASE_SERVICE_ROLE_KEY="seu-service-role-key"

./routines/skills-prompts-sync/trigger.sh
```

## Variáveis de ambiente

| Variável | Onde definir | Uso |
|----------|-------------|-----|
| `SKILLS_SYNC_SECRET` | Supabase secrets + GitHub secrets | Auth da Edge Function |
| `SUPABASE_URL` | GitHub secrets | URL do projeto |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub secrets | Gerar vault (leitura do banco) |
| `GITHUB_TOKEN` | GitHub secrets (opcional) | Aumenta rate limit da API de 10→30 req/min |
| `GIT_AUTHOR_EMAIL` | Configuração padrão do repo | Commit automático do vault |
