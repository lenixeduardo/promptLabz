/**
 * @deprecated Content is now served from Supabase. Kept as offline fallback only.
 */

export interface PromptCard {
  title: string
  difficulty: "Iniciante" | "Intermediario" | "Avancado"
  color: "green" | "yellow" | "red"
  category: "Criatividade" | "Marketing" | "Programacao" | "Educacao" | "Produtividade" | "Gestao de Produto" | "Comunicacao" | "Analise" | "Automacao"
  promptText: string
  description: string
  exampleInput?: string
  exampleOutput?: string
}

export const PROMPTS: PromptCard[] = [
  {
    title: "Roteiro de Video Curto",
    difficulty: "Avancado",
    color: "red",
    category: "Criatividade",
    description: "Template de roteiro para vídeos curtos (Reels/TikTok/Shorts) com gancho inicial, corpo e CTA final.",
    promptText: `# Instrução
Você é um roteirista de conteúdo curto para redes sociais. Crie um roteiro estruturado para vídeo de até 60 segundos.

# Formato
- **Gancho (0-3s):** Prender atenção imediatamente.
- **Corpo (4-45s):** 1 ideia central, ritmo acelerado.
- **Encerramento (46-60s):** CTA claro (like, comentário, perfil).

# Regras
- Linguagem coloquial e direta.
- Sugira locução + indicação visual (texto na tela / B-roll).`,
    exampleInput: "Tema: Dica rapidíssima de marcação de água na edição de vídeos para iniciantes.",
    exampleOutput: "✅ Dica de ouro em 3 passos: \n1...[texto na tela: Resize antes de exportar]\n2...[exemplo visual]\n3...[CTA: Salva o tutorial para não esquecer!]"
  },
  {
    title: "Email Cold Outreach Que Funciona",
    difficulty: "Iniciante",
    color: "green",
    category: "Marketing",
    description: "Modelo curto de e-mail de prospecção fria com abertura específica, proposta de valor e single CTA.",
    promptText: `# Instrução
Escreva um e-mail de prospecção fria curto e persuasivo.

# Restrições
- Máximo de 120 palavras.
- Assunto com até 6 palavras.
- Sem "Espero que esta mensagem o encontre bem".
- Abertura com dado específico da empresa/pessoa.
- Apenas 1 pedido claro.`,
    exampleInput: "Público: Diretor de operações de uma rede de cafeterias. Oferta: App de gestão de fila e mesas.",
    exampleOutput: "Assunto: Filas mais curtas na [nome da cafeteria]\n\nOlá, [Nome], vi que a [Cafeteria] abriu um novo ponto no centro ontem..."
  },
  {
    title: "Copywriting Para Anuncios Performaticos",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Marketing",
    description: "Geração de variações de anúncios com frameworks de copy (AIDA / PAS) focados em conversão.",
    promptText: `# Instrução
Escreva 3 variações de anúncios de alta conversão para a plataforma informada.

# Estrutura das variações
- **Opção 1 PAS:** Problema | Agitação | Solução.
- **Opção 2 AIDA:** Atenção | Interesse | Desejo | Ação.
- **Opção 3 Headline-first:** Título curto e ousado + 1 linha de apoio.

# Critérios
- Linguagem adaptada ao público.
- Palavras de poder e específicas, sem jargões vazios.`,
    exampleInput: "Produto: Assinatura de pão artesanal saudável (sem glúten, fermentação natural). Canal: Meta Ads.",
    exampleOutput: "### Opção 1 PAS\n**Título:** Fome de verdade, sem culpa.\n**Texto:** Pão de fermentação natural sem glúten que deixa a massa macia..."
  },
  {
    title: "Viral Social Hooks",
    difficulty: "Iniciante",
    color: "green",
    category: "Marketing",
    description: "Geração de ganchos curtas e virais para posts de LinkedIn, Instagram e TikTok.",
    promptText: `# Instrução
Crie 8 opções de hook (primeira linha) para redes sociais, divididas por tom e plataforma.

# Formato
- **Educativo/Útil:** Insight que parece contra-intuitivo.
- **Storytelling:** Mini história em 1 frase.
- **Contrarian:** Opinião forte, porém defensável.

# Requisitos
- Cada hook deve ter no máximo 18 palavras.
- Inclua observação rápida de quando usar (ex: LinkedIn profissional).`,
    exampleInput: "Tema: Por que migração de software não é só código, e sim gestão de risco.",
    exampleOutput: "1. Educativo: “Migrar sistemas não é refatorar — é transferir risco sem parar a empresa.” (LinkedIn)"
  },
  {
    title: "Plano Semanal Otimizado",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Produtividade",
    description: "Monta rotina semanal com blocos de foco profundo, reuniões objetivas e descanso intencional.",
    promptText: `# Instrução
Crie um plano semanal de trabalho realista para o perfil informado.

# Estrutura esperada
- **Segunda a Sexta:** blocos de Deep Work (2h-4h), reuniões curtas, tarefas operacionais e check-in diário.
- **Sexta à tarde:** bloco de fechamento e planejamento da próxima semana.
- **Dica:** sugerir batch de tarefas similares para reduzir trocas de contexto.`,
    exampleInput: "Perfil: Desenvolvedor full-stack júnior que também faz suporte e reuniões diárias com equipe.",
    exampleOutput: "# Plano Semanal: Full-Stack Júnior\n## Deep Work (Manhãs)\n- Seg/Ter/Qui: 09:00–12:00 — feature X..."
  },
  {
    title: "Facilitador de Reuniao Diaria",
    difficulty: "Iniciante",
    color: "green",
    category: "Comunicacao",
    description: "Guia rápido para stand-ups/daily syncs com tempo curto e foco em bloqueios.",
    promptText: `# Instrução
Crie um roteiro de daily sync de 15 minutos.

# Fluxo sugerido
1. Abertura (1 min): objetivo da reunião.
2. Roda de participantes (10 min): cada pessoa responde Feito / Bloqueio / Próximo.
3. Fechamento (4 min): donos dos blockers definidos e alinhamento de pares.

# Regras
- Sem discussões longas: issues complexas viram follow-up.
- Tom colaborativo, sem culpa.`,
    exampleInput: "Time: 2 devs, 1 QA, 1 UX, 1 PM. Objetivo: desbloquear a homologação do checkout.",
    exampleOutput: "# Daily Sync - Checkout\n**Tempo:** 15 min\n**Regra:** bloqueios viram follow-up; não abrimos discussões longas..."
  },
  {
    title: "Apresentacao Executiva Estruturada",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Comunicacao",
    description: "Cria roteiro de apresentação executiva com enredo, slides sugeridos e perguntas de engajamento.",
    promptText: `# Instrução
Monte um roteiro de apresentação executiva curta (10-12 slides) para stakeholders.

# Estrutura
1. Contexto do problema (dados concretos).
2. Nossa Hipótese.
3. O que validamos até agora.
4. Cenários possíveis.
5. Recomendação + pedido.

# Regras
- Cada slide com 1 mensagem principal.
- Antecipo objeções e responda com dados.`,
    exampleInput: "Contexto: Time de produto pediu orçamento de experimento para reduzir no-show em telemedicina.",
    exampleOutput: "# Apresentação: No-Show Reduction\n**Slide 1:** Hoje perdemos ~18% das consultas..."
  },
  {
    title: "Analise Exploratoria de Dados Guiada",
    difficulty: "Avancado",
    color: "red",
    category: "Analise",
    description: "Plano de análise para explorar um conjunto de dados com perguntas, hipóteses e checagens.",
    promptText: `# Instrução
Escreva um plano de análise exploratória de dados para o cenário fornecido.

# Itens obrigatórios
- Perguntas de negócio que devem ser respondidas.
- Variáveis candidatas e relações esperadas.
- Checks de qualidade (valores faltantes, outliers, janela temporal).
- 3 hipóteses validadas por gráfico.
- Próximos passos para modelagem ou decisão.`,
    exampleInput: "Dataset: Vendas de e-commerce com colunas data, canal, ticket, cidade, categoria, status_entrega.",
    exampleOutput: "# EDA: Vendas E-commerce\n- **Pergunta 1:** Qual canal entrega maior ticket médio e menor tempo de entrega?"
  },
  {
    title: "Dashboard Executivo em Texto",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Analise",
    description: "Transforma métricas em painel textual com tendências, alertas e ações sugeridas.",
    promptText: `# Instrução
Transforme o conjunto de métricas em um painel textual executivo.

# Formato
- **Visão Geral:** 1 parágrafo com sentimento do negócio.
- **Métricas:** Tabela com nome, valor atual, comparação semana/mês e sinal ↗ ↘ →.
- **Alertas:** Apenas métricas fora do normal.
- **Ações:** Ações sugeridas com responsável sugerido.`,
    exampleInput: "Métricas: DAU 12.400 (-4%), receita R$ 284k (+2%), churn 1.9% (target <1.5%), NPS 42 (-3).",
    exampleOutput: "# Dashboard - Performance\n## Visão Geral\nSemana de pressão em crescimento líquido..."
  },
  {
    title: "Gerador de Copy Para Carrossel",
    difficulty: "Iniciante",
    color: "green",
    category: "Marketing",
    description: "Cria texto para carrosséis educativos com título, tópicos escaneáveis e CTA final.",
    promptText: `# Instrução
Crie o texto de um carrossel para Instagram/LinkedIn com base no tema.

# Estrutura
- Slide 1: Título ousado + promessa de resultado.
- Slides 2-6: Cada slide com frase principal + 1 explicação objetiva.
- Slide 7: Resumo ou cheatsheet visual.
- Slide 8: CTA direto.

# Regras
- Frases curtas e escaneáveis.
- Palavras de engajamento explícito (“salva”, “compartilha”).`,
    exampleInput: "Tema: 6 hábitos rápidos para dormir melhor sem mudar rotina.",
    exampleOutput: "# Carrossel: Sono Melhor\n**Slide 1:** 6 hábitos rápidos para dormir mais e rápido (sem mudar sua rotina)..."
  },
  {
    title: "Planejador de Conteudo Mensal",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Produtividade",
    description: "Gera calendário de conteúdo de 2 a 4 semanas com temas, formatos, canais e objetivos.",
    promptText: `# Instrução
Crie um calendário de conteúdo para o período informado.

# Tabela obrigatória
| Data | Tema | Canal | Formato | Gancho | Objetivo |

# Regras
- Misture conteúdo educativo, entretenimento e venda.
- Inclua datas oportunistas se relevantes.
- Não repita a ordem de tópicos iguais em dias seguidos.`,
    exampleInput: "Nicho: Produtividade para estudantes. Duração: 2 semanas. Canais: TikTok e Instagram.",
    exampleOutput: "| Data | Tema | Canal | Formato | Gancho | Objetivo |\n|---|---|---|---|---|---|"
  },
  {
    title: "Facilitador de Retrospectiva Estruturada",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Produtividade",
    description: "Roteiro para retrospectiva com dinâmicas, votação e plano de ação.",
    promptText: `# Instrução
Escreva um roteiro de retrospectiva de sprint ou projeto com duração de 45 minutos.

# Roteiro
1. Abertura e regras (3 min).
2. Coleta silenciosa de pontos (5 min).
3. Agrupamento e votação (7 min).
4. Discussão dos top 3 pontos (20 min).
5. Plano de ação com donos e prazo (10 min).

# Objetivo
- Manter tom de melhoria contínua, sem blame.
- Gerar saídas acionáveis.`,
    exampleInput: "Contexto: Sprint com atraso na API, desempenho ruim nos testes E2E, mas boa colaboração front/back.",
    exampleOutput: "# Retrospectiva - Sprint 12\n**Duração:** 45 min\n**1. Abertura:** acordar que o foco é processo, não culpa individual..."
  },
  {
    title: "Framework de Avaliacao de Saida de IA",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Checklist para auditar respostas de IA quanto a veracidade, tom, conformidade e utilidade.",
    promptText: `# Instrução
Crie um checklist de avaliação de saídas de IA para o caso de uso informado.

# Critérios obrigatórios
- **Veracidade:** Alucinações, factualidade e fontes.
- **Utilidade:** Responde o que foi pedido.
- **Segurança/Ética:** Vieses, toxicidade, PII.
- **Formato:** Segue estrutura solicitada.
- **Tom:** adequado ao público.

# Entregue como matriz de avaliação e exemplos de rerank de prompts.`,
    exampleInput: "Caso: Assistente jurídico que resume contratos e sugere cláusulas de risco.",
    exampleOutput: "# Avaliação de Saída - Assistente Jurídico\n## Critérios\n| Critério | Peso | Nota 1 | Nota 2 |"
  },
  {
    title: "Planejador de Lançamento de Produto Digital",
    difficulty: "Avancado",
    color: "red",
    category: "Gestao de Produto",
    description: "Plano de lançamento faseado com público-alvo, canais, mensagens e métricas de sucesso.",
    promptText: `# Instrução
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
- Plano de comunicação por stakeholder`,
    exampleInput: "Produto: Assinatura de pão artesanal saudável com entrega em 24h.",
    exampleOutput: "# Estratégia GTM - Pão Artesanal Saudável\n## Pré-lançamento (Semana 1-2)\n..."
  },
  {
    title: "Playbook de Automacao de Processos",
    difficulty: "Avancado",
    color: "red",
    category: "Automacao",
    description: "Desenha fluxo de automação com gatilhos, ações, validações, fallback e métricas.",
    promptText: `# Instrução
Crie um playbook de automação para o processo informado.

# Estrutura
- Mapa do processo atual (passo a passo).
- Mapa do processo automatizado.
- Ferramentas sugeridas (n8n/Zapier/Make/etc).
- Gatilhos, condições, ações e fallbacks.
- Métricas de sucesso (volume, tempo, erro).

# Regras
- Priorize simplicidade operacional.
- Inclua 3 pontos de falha prováveis e mitigação.`,
    exampleInput: "Processo: Quando chega um novo lead no site, enriquecer dados, atribuir score, enviar sequência de e-mails e notificar o responsável.",
    exampleOutput: "# Playbook: Autoqualificação de Leads\n## Mapa atual\n1. Lead entra no formulário..."
  },
  {
    title: "Gerador de Receitas com IA",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Criatividade",
    description: "Gera receitas personalizadas a partir dos ingredientes disponíveis, restrições e preferências.",
    promptText: `# Instrução
Crie uma receita criativa, prática e saborosa a partir dos ingredientes e restrições informados.

# Formato
- Nome da receita.
- Lista de ingredientes com quantidades.
- Modo de preparo passo a passo.
- Sugestão de harmonização.
- Dica de variação para reaproveitamento.`,
    exampleInput: "Ingredientes disponíveis: frango desfiado, creme de leite, batata, milho, cebola, queijo mussarela. Restrição: sem pimenta e sem glúten.",
    exampleOutput: "**Nome:** Escondidinho cremoso de frango com milho\n**Ingredientes:** ..."
  },
  {
    title: "Copy de WhatsApp e Mensagens Curtas",
    difficulty: "Iniciante",
    color: "green",
    category: "Comunicacao",
    description: "Roteiros curtos para mensagens de confirmação, lembrete e pós-venda no WhatsApp.",
    promptText: `# Instrução
Escreva a sequência de mensagens curtas de WhatsApp para o cenário informado.

# Estrutura ideal
- Mensagem 1: Confirmação inicial.
- Mensagem 2: Lembrete 1 antes do evento/prazo.
- Mensagem 3: Lembrete final 1h antes, com CTA.
- Mensagem 4: Pós-evento com pedido de avaliação.

# Regras
- Tom próximo, sem jargões.
- Emojis moderados.
- Texto no formato mobile-friendly.`,
    exampleInput: "Contexto: Agendamento de aula experimental em academia de dança.",
    exampleOutput: "**Mensagem 1:** Olá, [Nome]! Sua aula experimental de dança está confirmada para amanhã às 18h..."
  }
];