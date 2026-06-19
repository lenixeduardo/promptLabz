-- Migration: Adiciona prompts em alta no PromptLab
-- Date: 2026-06-19
-- Author: PromptLab
-- Description: Insere 15 novos prompts distribuidos nas categorias existentes
--              com base em tendencias atuais de uso na internet.

-- ───────────────────────────────────────────────────────────────────────────────
-- 1. Prompts novos (sort_order 81..95)
-- ───────────────────────────────────────────────────────────────────────────────

INSERT INTO prompts (sort_order, title, difficulty, color, category, description, prompt_text, example_input, example_output) VALUES
(
  81,
  'Roteiro de Video Curto',
  'Avancado',
  'red',
  'Criatividade',
  'Template de roteiro para vídeos curtos (Reels/TikTok/Shorts) com gancho inicial, corpo e CTA final.',
  $$# Instrução
Você é um roteirista de conteúdo curto para redes sociais. Crie um roteiro estruturado para vídeo de até 60 segundos.

# Formato
- **Gancho (0-3s):** Prender atenção imediatamente.
- **Corpo (4-45s):** 1 ideia central, ritmo acelerado.
- **Encerramento (46-60s):** CTA claro (like, comentário, perfil).

# Regras
- Linguagem coloquial e direta.
- Sugira locução + indicação visual (texto na tela / B-roll).$$,
  'Tema: Dica rapidíssima de marcação de água na edição de vídeos para iniciantes.',
  '✅ Dica de ouro em 3 passos: \n1...[texto na tela: Resize antes de exportar]\n2...[exemplo visual]\n3...[CTA: Salva o tutorial para não esquecer!]'
),
(
  82,
  'Email Cold Outreach Que Funciona',
  'Iniciante',
  'green',
  'Marketing',
  'Modelo curto de e-mail de prospecção fria com abertura específica, proposta de valor e single CTA.',
  $$# Instrução
Escreva um e-mail de prospecção fria curto e persuasivo.

# Restrições
- Máximo de 120 palavras.
- Assunto com até 6 palavras.
- Sem "Espero que esta mensagem o encontre bem".
- Abertura com dado específico da empresa/pessoa.
- Apenas 1 pedido claro.$$,
  'Público: Diretor de operações de uma rede de cafeterias. Oferta: App de gestão de fila e mesas.',
  'Assunto: Filas mais curtas na [nome da cafeteria]\n\nOlá, [Nome], vi que a [Cafeteria] abriu um novo ponto no centro ontem...'
),
(
  83,
  'Copywriting Para Anuncios Performaticos',
  'Intermediario',
  'yellow',
  'Marketing',
  'Geração de variações de anúncios com frameworks de copy (AIDA / PAS) focados em conversão.',
  $$# Instrução
Escreva 3 variações de anúncios de alta conversão para a plataforma informada.

# Estrutura das variações
- **Opção 1 PAS:** Problema | Agitação | Solução.
- **Opção 2 AIDA:** Atenção | Interesse | Desejo | Ação.
- **Opção 3 Headline-first:** Título curto e ousado + 1 linha de apoio.

# Critérios
- Linguagem adaptada ao público.
- Palavras de poder e específicas, sem jargões vazios.$$,
  'Produto: Assinatura de pão artesanal saudável (sem glúten, fermentação natural). Canal: Meta Ads.',
  '### Opção 1 PAS\n**Título:** Fome de verdade, sem culpa.\n**Texto:** Pão de fermentação natural sem glúten que deixa a massa macia...'
),
(
  84,
  'Viral Social Hooks',
  'Iniciante',
  'green',
  'Marketing',
  'Geração de ganchos curtas e virais para posts de LinkedIn, Instagram e TikTok.',
  $$# Instrução
Crie 8 opções de hook (primeira linha) para redes sociais, divididas por tom e plataforma.

# Formato
- **Educativo/Útil:** Insight que parece contra-intuitivo.
- **Storytelling:** Mini história em 1 frase.
- **Contrarian:** Opinião forte, porém defensável.

# Requisitos
- Cada hook deve ter no máximo 18 palavras.
- Inclua observação rápida de quando usar (ex: LinkedIn profissional).$$,
  'Tema: Por que migração de software não é só “código”, e sim gestão de risco.',
  '1. Educativo: “Migrar sistemas não é refatorar — é transferir risco sem parar a empresa.” (LinkedIn)'
),
(
  85,
  'Plano Semanal Otimizado',
  'Intermediario',
  'yellow',
  'Produtividade',
  'Monta rotina semanal com blocos de foco profundo, reuniões objetivas e descanso intencional.',
  $$# Instrução
Crie um plano semanal de trabalho realista para o perfil informado.

# Estrutura esperada
- **Segunda a Sexta:** blocos de Deep Work (2h-4h), reuniões curtas, tarefas operacionais e check-in diário.
- **Sexta à tarde:** bloco de fechamento e planejamento da próxima semana.
- **Dica:** sugerir batch de tarefas similares para reduzir trocas de contexto.$$,
  'Perfil: Desenvolvedor full-stick júnior que também faz suporte e reuniões diárias com equipe.',
  '# Plano Semanal: Full-Stack Júnior\n## Deep Work (Manhãs)\n- Seg/Ter/Qui: 09:00–12:00 — feature X...'
),
(
  86,
  'Facilitador de Reuniao Diaria',
  'Iniciante',
  'green',
  'Comunicacao',
  'Guia rápido para stand-ups/daily syncs com tempo curto e foco em bloqueios.',
  $$# Instrução
Crie um roteiro de daily sync de 15 minutos.

# Fluxo sugerido
1. Abertura (1 min): objetivo da reunião.
2. Roda de participantes (10 min): cada pessoa responde Feito / Bloqueio / Próximo.
3. Fechamento (4 min): donos dos blockers definidos e alinhamento de pares.

# Regras
- Sem discussões longas: issues complexas viram follow-up.
- Tom colaborativo, sem culpa.$$,
  'Time: 2 devs, 1 QA, 1 UX, 1 PM. Objetivo: desbloquear a homologação do checkout.',
  '# Daily Sync - Checkout\n**Tempo:** 15 min\n**Regra:** bloqueios viram follow-up; não abrimos discussões longas...'
),
(
  87,
  'Apresentacao Executiva',
  'Intermediario',
  'yellow',
  'Comunicacao',
  'Roteiro de apresentação executiva com enredo, slides sugeridos e perguntas de engajamento.',
  $$# Instrução
Monte um roteiro de apresentação executiva curta (10-12 slides) para stakeholders.

# Estrutura
1. Contexto do problema (dados concretos).
2. Nossa Hipótese.
3. O que validamos até agora.
4. Cenários possíveis.
5. Recomendação + pedido.

# Regras
- Cada slide com 1 mensagem principal.
- Anticipo objeções e responda com dados.$$,
  'Contexto: Time de produto pediu orçamento de experimento para reduzir no-show em telemedicina.',
  '# Apresentação: No-Show Reduction\n**Slide 1:** Hoje perdemos ~18% das consultas...'
),
(
  88,
  'Analise Exploratoria Guiada',
  'Avancado',
  'red',
  'Analise',
  'Sugere plano de análise, perguntas, checks e hipóteses para explorar um conjunto de dados.',
  $$# Instrução
Escreva um plano de análise exploratória de dados para o cenário fornecido.

# Itens obrigatórios
- Perguntas de negócio que devem ser respondidas.
- Variáveis candidatas e relações esperadas.
- Checks de qualidade (valores faltantes, outliers, janela temporal).
- 3 hipóteses validadas por gráfico.
- Próximos passos para modelagem ou decisão.$$,
  'Dataset: Vendas de e-commerce com colunas data, canal, ticket, cidade, categoria, status_entrega.',
  '# EDA: Vendas E-commerce\n- **Pergunta 1:** Qual canal entrega maior ticket médio e menor tempo de entrega?'
),
(
  89,
  'Dashboard Textual de Metricas',
  'Intermediario',
  'yellow',
  'Analise',
  'Transforma dados em painel visível em texto com tendências, alertas e ações sugeridas.',
  $$# Instrução
Transforme o conjunto de métricas em um painel textual executivo.

# Formato
- **Visão Geral:** 1 parágrafo com sentimento do negócio.
- **Métricas:** Tabela com nome, valor atual, comparação semana/mês e sinal ↗ ↘ →.
- **Alertas:** Apenas métricas fora do normal.
- **Ações:** Ações sugeridas com responsável sugerido.$$,
  'Métricas: DAU 12.400 (-4%), receita R$ 284k (+2%), churn 1.9% (target <1.5%), NPS 42 (-3).',
  '# Dashboard - Performance\n## Visão Geral\nSemana de pressão em crescimento líquido...'
),
(
  90,
  'Gerador de Copy Para Carrossel',
  'Iniciante',
  'green',
  'Marketing',
  'Cria texto para carrosséis educativos com título, 5 a 7 tópicos e CTA final.',
  $$# Instrução
Crie o texto de um carrossel para Instagram/LinkedIn com base no tema.

# Estrutura
- Slide 1: Título ousado + promessa de resultado.
- Slides 2-6: Cada slide com frase principal + 1 explicação objetiva.
- Slide 7: Resumo ou cheatsheet visual.
- Slide 8: CTA direto.

# Regras
- Frases curtas e escaneáveis.
- Palavras de engajamento explícito (“salva”, “compartilha”).$$,
  'Tema: 6 hábitos rápidos para dormir melhor sem mudar rotina.',
  '# Carrossel: Sono Melhor\n**Slide 1:** 6 hábitos rápidos para dormir mais e rápido (sem mudar sua rotina)...'
),
(
  91,
  'Planejador de Conteudo Mensal',
  'Intermediario',
  'yellow',
  'Produtividade',
  'Gera calendário de conteúdo de 2-4 semanas com temas, formatos, canais e objetivos.',
  $$# Instrução
Crie um calendário de conteúdo para o período informado.

# Tabela obrigatória
| Data | Tema | Canal | Formato | Gancho | Objetivo | Responsável |

# Regras
- Misture conteúdo educativo, entretenimento e venda.
- Inclua datas oportunistas se relevantes.
- Não repita a ordem de tópicos iguais em dias seguintes.$$,
  'Nicho: Produtividade para estudantes. Duração: 2 semanas. Canais: TikTok e Instagram.',
  '| Data | Tema | Canal | Formato | Gancho | Objetivo |\n|---|---|---|---|---|---|'
),
(
  92,
  'Facilitador de Retrospectiva Estruturada',
  'Intermediario',
  'yellow',
  'Produtividade',
  'Roteiro para retrospectiva com dinâmicas, votação e plano de ação.',
  $$# Instrução
Escreva um roteiro de retrospectiva de sprint ou projeto com duração de 45 minutos.

# Roteiro
1. Abertura e regras (3 min).
2. Coleta silenciosa de pontos (5 min).
3. Agrupamento e votação (7 min).
4. Discussão dos top 3 pontos (20 min).
5. Plano de ação com donos e prazo (10 min).

# Objetivo
- Manter tom de melhoria contínua, sem blame.
- Gerar saídas acionáveis.$$,
  'Contexto: Sprint com atraso na API, desempenho ruim nos testes E2E, mas boa colaboração front/back.',
  '# Retrospectiva - Sprint 12\n**Duração:** 45 min\n**1. Abertura:** acordar que o foco é processo, não culpa individual...'
),
(
  93,
  'Prompt Para Avaliacao De Saida De IA',
  'Intermediario',
  'yellow',
  'Gestao de Produto',
  'Framework para auditar respostas de IA quanto a veracidade, tom, conformidade e utilidade.',
  $$# Instrução
Crie um checklist de avaliação de saídas de IA para o caso de uso informado.

# Critérios obrigatórios
- **Veracidade:** Alucinações, factualidade e fontes.
- **Utilidade:** Responde o que foi pedido.
- **Segurança/Ética:** Vieses, toxicidade, PII.
- **Formato:** Segue estrutura solicitada.
- **Tom:** adequado ao público.

# Entregue como matriz de avaliação e exemplos de rerank de prompts.$$,
  'Caso: Assistente jurídico que resume contratos e sugere cláusulas de risco.',
  '# Avaliação de Saída - Assistente Jurídico\n## Critérios\n| Critério | Peso | Nota 1 | Nota 2 |'
),
(
  94,
  'Estrategia De Lancamento De Produto',
  'Avancado',
  'red',
  'Gestao de Produto',
  'Plano de lançamento faseado com público, canais, mensagens e métricas de sucesso.',
  $$# Instrução
Desenvolva uma estratégia de lançamento de produto faseada.

# Fases
1. **Pré-lançamento:** Lista de espera, teasers e early adopters.
2. **Soft launch:** Grupo fechado e proof points.
3. **Lançamento geral:** Aquisição, conteúdo, PR e suporte.

# Itens por fase
- Objetivo da fase
- Ações concretas
- Métricas de sucesso e thresholds

# Saída
- Timeline semanal
- Plano de comunicação por stakeholder$$,
  'Produto: Assinatura de pão artesanal saudável com entrega em 24h.',
  '# Estratégia GTM - Pão Artesanal Saudável\n## Pré-lançamento (Semana 1-2)\n...'
),
(
  95,
  'Playbook De Automacao De Processos',
  'Avancado',
  'red',
  'Automacao',
  'Desenha fluxo de automação com gatilhos, ações, validações, fallback e métricas.',
  $$# Instrução
Crie um playbook de automação para o processo informado.

# Estrutura
- Mapa do processo atual (passo a passo).
- Mapa do processo automatizado.
- Ferramentas sugeridas (n8n/Zapier/Make/etc).
- Gatilhos, condições, ações e fallbacks.
- Métricas de sucesso (volume, tempo, erro).

# Regras
- Priorize simplicidade operacional.
- Inclua 3 pontos de falha prováveis e mitigação.$$,
  'Processo: Quando chega um novo lead no site, enriquecer dados, atribuir score, enviar sequência de e-mails e notificar o responsável.',
  '# Playbook: Autoqualificação de Leads\n## Mapa atual\n1. Lead entra no formulário...'
)
ON CONFLICT DO NOTHING;
