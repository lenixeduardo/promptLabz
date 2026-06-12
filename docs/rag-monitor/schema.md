# Schema de Referência — RAG Monitor Events

Todos os eventos são armazenados em `memory/events.json` e seguem os tipos abaixo.

---

## Campos Comuns (todos os eventos)

| Campo       | Tipo     | Obrigatório | Descrição                                        |
|-------------|----------|-------------|--------------------------------------------------|
| `id`        | string   | ✅          | Identificador único: `EVT-NNN`, `ERR-NNN`, `SOL-NNN` |
| `timestamp` | ISO 8601 | ✅          | Data/hora UTC do evento                          |
| `type`      | enum     | ✅          | `pr` \| `modification` \| `error` \| `solution` |
| `status`    | enum     | ✅          | `open` \| `resolved` \| `merged` \| `closed`    |
| `tags`      | string[] | —           | Palavras-chave para busca rápida                 |

---

## Tipo: `pr`

| Campo             | Tipo    | Descrição                                          |
|-------------------|---------|----------------------------------------------------|
| `pr_number`       | int     | Número da PR no GitHub                             |
| `branch`          | string  | Branch de origem                                   |
| `base`            | string  | Branch de destino (geralmente `main`)              |
| `author`          | string  | Autor humano ou agente                             |
| `merged_by`       | string  | Quem fez o merge                                   |
| `changed_files`   | int     | Total de arquivos modificados                      |
| `additions`       | int     | Linhas adicionadas                                 |
| `deletions`       | int     | Linhas removidas                                   |
| `classification`  | enum    | `improvement` \| `fix` \| `degradation` \| `neutral` \| `mixed` |
| `risk_level`      | enum    | `none` \| `low` \| `medium` \| `high` \| `critical` |
| `doc_ref`         | string  | Caminho para o documento detalhado da PR           |
| `related_errors`  | string[]| IDs de erros relacionados                          |

---

## Tipo: `modification`

| Campo                  | Tipo    | Descrição                                       |
|------------------------|---------|-------------------------------------------------|
| `component`            | string  | Componente afetado (índice, embedding, prompt…) |
| `changed_by`           | string  | Responsável pela mudança                        |
| `reason`               | string  | Justificativa                                   |
| `expected_impact`      | string  | Impacto esperado em qualidade/latência/custo    |
| `version_before`       | string  | Versão/valor anterior                           |
| `version_after`        | string  | Versão/valor novo                               |

---

## Tipo: `error`

| Campo                  | Tipo    | Descrição                                       |
|------------------------|---------|-------------------------------------------------|
| `severity`             | enum    | `critical` \| `high` \| `medium` \| `low`      |
| `description`          | string  | Descrição clara do erro                         |
| `context`              | string  | Onde/como ocorreu                               |
| `message`              | string  | Mensagem de erro completa                       |
| `affected_components`  | string[]| Arquivos ou módulos afetados                    |
| `frequency`            | int     | Número de ocorrências                           |
| `recommended_action`   | string  | Ação recomendada para resolução                 |
| `resolution_ref`       | string? | ID do evento de solução (null se ainda aberto)  |

---

## Tipo: `solution`

| Campo              | Tipo    | Descrição                                          |
|--------------------|---------|----------------------------------------------------|
| `error_ref`        | string  | ID do erro que esta solução resolve                |
| `root_cause`       | string  | Causa raiz identificada                            |
| `action`           | string  | Ação corretiva realizada                           |
| `validation`       | string  | Como a solução foi validada (métricas/testes)      |
| `lessons_learned`  | string  | Lição para evitar recorrência                      |

---

## Níveis de Risco

| Nível      | Critério                                                              |
|------------|-----------------------------------------------------------------------|
| `none`     | Sem impacto em build, segurança, dados ou UX                         |
| `low`      | Impacto cosmético ou em ambiente de desenvolvimento                  |
| `medium`   | Pode afetar comportamento em produção mas não quebra                  |
| `high`     | Pode causar falhas ou degradação de funcionalidades                   |
| `critical` | Pode expor segredos, quebrar o build ou comprometer integridade do repositório |
