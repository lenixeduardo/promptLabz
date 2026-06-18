# Routines

Automações recorrentes do PromptLabz. Cada rotina possui sua própria pasta com configuração e documentação.

| Rotina | Frequência | Descrição |
|--------|-----------|-----------|
| [`daily-tech-news`](./daily-tech-news/) | Diária · 07:00 UTC | Busca notícias de IA/tech e persiste no banco |

## Como funciona

Cada rotina é composta por três partes:

1. **Configuração** — `routines/<nome>/config.json` descreve fontes, filtros e mapeamentos.
2. **Edge Function** — `supabase/functions/<nome>/index.ts` é o executor serverless.
3. **Agendador** — `.github/workflows/<nome>.yml` dispara a Edge Function via cron.

## Acionamento manual

```bash
# Dispara a rotina de notícias agora (substitua as vars)
./routines/daily-tech-news/trigger.sh
```

## Variáveis de ambiente necessárias

| Variável | Onde definir | Uso |
|----------|-------------|-----|
| `DAILY_NEWS_SECRET` | Supabase Edge Function secrets + GitHub secrets | Autenticação da chamada HTTP |
| `SUPABASE_URL` | GitHub secrets | URL base do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Edge Function secrets (automático) | Acesso admin ao banco |
