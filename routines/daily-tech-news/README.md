# Rotina: daily-tech-news

Busca diária de notícias de IA e tech nas fontes públicas **Hacker News** e **Dev.to**, categoriza automaticamente e persiste na tabela `news_articles` do Supabase.

## Fluxo

```
GitHub Actions (cron 07:00 UTC)
  └─► POST /functions/v1/daily-tech-news   (Bearer DAILY_NEWS_SECRET)
        ├─► Hacker News API  ─┐
        └─► Dev.to API        ├─► filtra por keywords de IA
                              ├─► categoriza por empresa (OpenAI / Anthropic / Google / ...)
                              ├─► deduplica por external_id (hn_<id> / devto_<id>)
                              └─► INSERT news_articles (apenas registros novos)
```

## Fontes

| Fonte | URL | Limite por execução |
|-------|-----|---------------------|
| Hacker News | `hacker-news.firebaseio.com` | 15 artigos |
| Dev.to | `dev.to/api/articles` | 15 artigos |

Nenhuma chave de API é necessária para essas fontes.

## Categorias reconhecidas

| Categoria | Keywords principais |
|-----------|---------------------|
| OpenAI | openai, gpt-4, gpt-5, sora, dall-e, whisper |
| Anthropic | anthropic, claude |
| Google | google ai, gemini, deepmind, notebooklm |
| ChatGPT | chatgpt |
| Meta | meta ai, llama 2/3/4 |
| Microsoft | microsoft copilot, github copilot, azure openai |
| General | (fallback para artigos sem match) |

## Deduplicação

Cada artigo recebe um `external_id` único (`hn_<id>` ou `devto_<id>`). Antes do insert, a função consulta os IDs já existentes e insere apenas os novos — re-execuções são idempotentes.

## Acionamento manual

```bash
# Copie e preencha com seus valores
export SUPABASE_URL="https://seu-projeto.supabase.co"
export DAILY_NEWS_SECRET="seu-secret-aqui"

./routines/daily-tech-news/trigger.sh
```

Ou pelo GitHub Actions: **Actions → Daily Tech News → Run workflow**.

## Configuração

Edite [`config.json`](./config.json) para ajustar:
- Fontes de dados
- Keywords de filtro de IA
- Mapeamento de categorias

> Após alterar `config.json`, atualize `supabase/functions/daily-tech-news/index.ts` para refletir as mudanças — o config é referência de documentação, não lido em runtime.

## Variáveis de ambiente

| Variável | Onde definir |
|----------|-------------|
| `DAILY_NEWS_SECRET` | Supabase: Project → Edge Functions → Secrets; GitHub: Settings → Secrets → Actions |
| `SUPABASE_URL` | GitHub: Settings → Secrets → Actions |
