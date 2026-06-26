-- ───────────────────────────────────────────────────────────────────────────────
-- Migration: Add missing prompt data so every lab_category has prompts
--
-- Root cause: lab_categories has 12 categories but the prompts table only had
-- data for 6 of them (Criatividade, Marketing, Programacao, Educacao,
-- Produtividade, Gestao de Produto). Clicking on Analise, Comunicacao,
-- Automacao, Negocios, Design, Suporte or RH from the prompts page returned
-- an empty result set, triggering the "Nenhum prompt encontrado" empty state.
--
-- Additionally, Gestao de Produto had 22 prompts in the DB but no matching
-- lab_category row, making those prompts unreachable from the UI.
-- ───────────────────────────────────────────────────────────────────────────────

-- 1. Add Gestao de Produto to lab_categories so its 22 existing prompts are
--    reachable from the category grid.
INSERT INTO lab_categories (sort_order, category_id, label, icon, prompt_count)
VALUES (13, 'Gestao de Produto', 'Gestão de Produto', 'Briefcase', 22)
ON CONFLICT DO NOTHING;

-- 2. Seed prompts for the 6 categories that currently have none.
--    sort_order starts at 101 to avoid collisions with the original 80 rows.
INSERT INTO prompts (sort_order, title, difficulty, color, category, description, prompt_text, example_input, example_output) VALUES

-- ── Analise ──────────────────────────────────────────────────────────────────
(101, 'Exploracao de Dataset', 'Iniciante', 'green', 'Analise',
  'Guia passo a passo para entender um dataset desconhecido: tipos, distribuições e qualidade dos dados.',
  $$# Instrução
Você é um Cientista de Dados. Realize uma análise exploratória inicial de um dataset.

# Passos obrigatórios
1. Liste as colunas e seus tipos de dado.
2. Identifique valores ausentes e duplicados.
3. Calcule estatísticas descritivas básicas (média, mediana, desvio padrão).
4. Aponte as 3 perguntas de negócio que esse dataset pode responder.$$,
  'Dataset: Planilha de vendas com colunas: data, produto, região, quantidade, valor_total.',
  '# Análise Exploratória\n**Colunas:** data (date), produto (string), região (string)...'
),

(102, 'Dashboard de KPIs em Texto', 'Iniciante', 'green', 'Analise',
  'Transforma métricas brutas em um painel textual com tendências, alertas e recomendações.',
  $$# Instrução
Converta as métricas fornecidas em um dashboard textual executivo.

# Formato obrigatório
- **Resumo:** sentimento geral (1 parágrafo).
- **Tabela de KPIs:** métrica | valor | variação | status (↗ ↘ →).
- **Alertas:** apenas métricas fora da meta.
- **Próximas ações:** 3 recomendações priorizadas.$$,
  'KPIs: Receita R$ 180k (+5% mês), Churn 2.1% (meta <1.5%), CAC R$ 320 (-8%).',
  '# Dashboard de Performance\n**Resumo:** Semana positiva em receita mas churn acima da meta...'
),

(103, 'Analise de Causa Raiz', 'Intermediario', 'yellow', 'Analise',
  'Framework 5 Porquês + Diagrama de Ishikawa para identificar causas-raiz de problemas.',
  $$# Instrução
Conduza uma análise de causa raiz do problema informado usando o método dos 5 Porquês e o Diagrama de Ishikawa.

# Estrutura
1. **Problema:** descrição objetiva.
2. **5 Porquês:** cadeia de causalidade.
3. **Ishikawa:** categorias Máquina, Método, Mão de obra, Material, Meio ambiente, Medição.
4. **Causa raiz provável** e plano de ação com responsável e prazo.$$,
  'Problema: Taxa de abandono de carrinho aumentou 15% na última semana.',
  '# Análise de Causa Raiz\n**Problema:** Abandono de carrinho +15%\n\n**5 Porquês:**\n1. Por quê? Usuários saem na tela de pagamento...'
),

-- ── Comunicacao ──────────────────────────────────────────────────────────────
(104, 'Script de Pitch de Vendas', 'Iniciante', 'green', 'Comunicacao',
  'Roteiro de abordagem de vendas consultiva de 5 minutos com perguntas de descoberta e proposta de valor.',
  $$# Instrução
Escreva um script de pitch de vendas consultivo de 5 minutos.

# Estrutura
1. **Abertura (30s):** rapport e permissão.
2. **Descoberta (2min):** 3 perguntas abertas sobre dores.
3. **Proposta de Valor (1,5min):** conexão entre dor e solução.
4. **Próximo Passo (1min):** CTA específico, sem pressão.

# Regras
- Tom consultivo, não de vendedor.
- Sem monólogo: alternância de fala.$$,
  'Produto: Software de gestão de ponto para PMEs. Persona: Dono de empresa com 20 colaboradores.',
  '**Abertura:** "Obrigado pelo tempo, [Nome]. Antes de falar de produto, posso fazer 2 perguntas rápidas?"'
),

(105, 'Comunicado Interno de Mudanca', 'Iniciante', 'green', 'Comunicacao',
  'Modelo de comunicado interno claro e empático para mudanças organizacionais ou de processo.',
  $$# Instrução
Escreva um comunicado interno para a mudança descrita.

# Estrutura
- **Assunto:** direto e sem alarmismo.
- **Contexto:** por que a mudança é necessária.
- **O que muda:** lista clara de impactos.
- **O que não muda:** tranquilizar a equipe.
- **Próximos passos:** datas e responsáveis.
- **Canal de dúvidas:** a quem recorrer.$$,
  'Mudança: Migração do sistema de ponto de papel para app mobile a partir de 01/08.',
  '**Assunto:** Atualização no registro de ponto a partir de agosto\n\nOlá, time...'
),

(106, 'Feedback Construtivo', 'Intermediario', 'yellow', 'Comunicacao',
  'Framework SBI (Situação-Comportamento-Impacto) para dar feedback direto, respeitoso e acionável.',
  $$# Instrução
Escreva um feedback construtivo usando o modelo SBI.

# Modelo SBI
- **Situação:** contexto específico (quando/onde).
- **Comportamento:** o que foi observado (fatos, não julgamentos).
- **Impacto:** efeito no time, projeto ou cliente.
- **Convite:** pergunta aberta para ouvir a perspectiva da pessoa.
- **Próximo Passo:** combinado de melhoria.

# Tom: direto, respeitoso e focado em crescimento.$$,
  'Contexto: Desenvolvedor entregou código sem testes duas vezes seguidas, causando regressão em produção.',
  '**Situação:** "Na entrega da semana passada e nessa também..."'
),

-- ── Automacao ────────────────────────────────────────────────────────────────
(107, 'Mapeamento de Processo para Automacao', 'Iniciante', 'green', 'Automacao',
  'Documentação do processo atual (AS-IS) como base para identificar etapas automatizáveis.',
  $$# Instrução
Mapeie o processo descrito no formato AS-IS e identifique os candidatos à automação.

# Entregáveis
1. **Fluxo AS-IS:** passo a passo numerado com responsável e tempo estimado.
2. **Pontos de dor:** gargalos, retrabalho ou tarefas repetitivas.
3. **Top 3 candidatos à automação:** impacto x esforço.
4. **Ferramenta sugerida:** n8n / Make / Zapier / Python / RPA.$$,
  'Processo: Receber e-mail de pedido, copiar dados para planilha, enviar confirmação manual ao cliente.',
  '# Mapeamento AS-IS: Gestão de Pedidos\n1. E-mail recebido (responsável: atendente, 2min)...'
),

(108, 'Fluxo de Automacao com n8n', 'Intermediario', 'yellow', 'Automacao',
  'Especificação de fluxo n8n com nós, gatilhos, condições e tratamento de erros.',
  $$# Instrução
Especifique um fluxo de automação completo no n8n para o caso descrito.

# Entregáveis
- Lista de nós necessários (Webhook, HTTP Request, IF, Set, etc.).
- Gatilho de entrada e condições de bifurcação.
- Tratamento de erro (fallback e notificação).
- Pseudocódigo do fluxo principal.
- Estimativa de execuções/mês e custo aproximado (se cloud).$$,
  'Caso: Quando um lead preenche formulário Typeform, criar contato no HubSpot e notificar no Slack.',
  '# Fluxo n8n: Lead Typeform → HubSpot + Slack\n**Nós:** Webhook (trigger), HTTP HubSpot, Slack...'
),

(109, 'Script Python de Automacao', 'Avancado', 'red', 'Automacao',
  'Script Python documentado para automatizar tarefa repetitiva com logging e tratamento de exceções.',
  $$# Instrução
Escreva um script Python limpo para automatizar a tarefa descrita.

# Requisitos
- Logging estruturado (módulo logging).
- Tratamento de exceções com mensagens claras.
- Funções pequenas e nomeadas semanticamente.
- Docstrings nas funções principais.
- Arquivo de configuração separado (.env ou config.yaml).$$,
  'Tarefa: Baixar relatório CSV do Google Sheets toda manhã e enviar por e-mail para a equipe.',
  '```python\nimport logging\nimport smtplib\nfrom pathlib import Path\n...'
),

-- ── Negocios ─────────────────────────────────────────────────────────────────
(110, 'Plano de Negocios Rapido', 'Iniciante', 'green', 'Negocios',
  'Canvas de plano de negócios de uma página com problema, solução, mercado e modelo de receita.',
  $$# Instrução
Crie um plano de negócios de uma página (Lean Canvas) para a ideia descrita.

# Blocos obrigatórios
1. Problema (top 3 dores do cliente).
2. Solução (3 funcionalidades-chave).
3. Proposta de Valor Única (1 frase).
4. Segmento de clientes e early adopters.
5. Canais de distribuição.
6. Modelo de receita e estrutura de custos.
7. Métricas-chave (3 KPIs).$$,
  'Ideia: App de aluguel de trajes sociais por assinatura para jovens profissionais.',
  '# Lean Canvas: AlugaFormal\n**Problema:** 1. Comprar terno é caro...'
),

(111, 'Analise de Viabilidade Financeira', 'Intermediario', 'yellow', 'Negocios',
  'Projeção simplificada de receitas, custos fixos/variáveis e ponto de equilíbrio.',
  $$# Instrução
Elabore uma análise de viabilidade financeira simplificada para o negócio descrito.

# Entregáveis
- Premissas de receita (preço, volume, ticket médio).
- Custos fixos e variáveis mensais.
- Ponto de equilíbrio (em unidades e em reais).
- Projeção de resultado mensal para 12 meses (tabela).
- Prazo estimado de payback.$$,
  'Negócio: Academia de natação com 3 turmas/dia, mensalidade R$ 250, capacidade máx. 80 alunos.',
  '# Análise Financeira: Academia de Natação\n**Receita máxima:** 80 × R$ 250 = R$ 20.000/mês...'
),

(112, 'Estrategia de Precificacao', 'Intermediario', 'yellow', 'Negocios',
  'Comparação de estratégias de precificação (custo+margem, valor percebido, competitiva) e recomendação.',
  $$# Instrução
Analise o produto/serviço e recomende a melhor estratégia de precificação.

# Estratégias a avaliar
1. **Cost-plus:** custo + margem desejada.
2. **Valor percebido:** willingness to pay do cliente.
3. **Competitiva:** ancoragem no mercado.
4. **Freemium / Assinatura:** se aplicável.

# Entregue
- Tabela comparativa das 3 estratégias.
- Recomendação justificada.
- Faixa de preço sugerida.$$,
  'Produto: Curso online de Excel avançado, 8h de conteúdo, com suporte via grupo no WhatsApp.',
  '# Estratégia de Precificação: Curso Excel\n| Estratégia | Preço sugerido | Prós | Contras |'
),

-- ── Design ───────────────────────────────────────────────────────────────────
(113, 'Briefing de Design Visual', 'Iniciante', 'green', 'Design',
  'Documento de briefing para projetos de design com objetivos, público, referências e restrições.',
  $$# Instrução
Crie um briefing de design visual completo para o projeto descrito.

# Seções obrigatórias
- Objetivo do projeto (o que será criado e por quê).
- Público-alvo (perfil, faixa etária, contexto de uso).
- Tom e personalidade (3 adjetivos e 3 "não somos X").
- Referências visuais (descreva estilos ou cite exemplos).
- Restrições (cores da marca, tipografia existente, formatos).
- Entregáveis esperados e prazo.$$,
  'Projeto: Redesign da embalagem de uma linha de chás orgânicos para público feminino 30-45 anos.',
  '# Briefing: Redesign Linha de Chás Orgânicos\n**Objetivo:** Elevar percepção de premium...'
),

(114, 'Sistema de Design Minimo', 'Intermediario', 'yellow', 'Design',
  'Especificação de tokens de design (cores, tipografia, espaçamento, sombras) para consistência visual.',
  $$# Instrução
Defina os tokens de um sistema de design mínimo para a marca descrita.

# Entregáveis
- **Paleta de cores:** primária, secundária, neutros, feedbacks (erro/sucesso/alerta).
- **Tipografia:** família, pesos e tamanhos para h1→h4, body, caption.
- **Escala de espaçamento:** base 4px ou 8px.
- **Bordas e raios:** padrão de border-radius.
- **Sombras:** 3 níveis (baixo, médio, alto).
- **Componentes base:** botão, input, card, badge.$$,
  'Marca: Fintech de crédito para autônomos. Valores: confiança, simplicidade, modernidade.',
  '# Design System: FinCredit\n**Primária:** #1A56DB (azul profundo)\n**Secundária:** #16A34A (verde sucesso)...'
),

(115, 'Critica de Design (Design Critique)', 'Avancado', 'red', 'Design',
  'Revisão estruturada de um design com base em heurísticas de Nielsen e princípios Gestalt.',
  $$# Instrução
Realize uma crítica de design estruturada do elemento descrito.

# Framework
1. **Heurísticas de Nielsen:** avalie visibilidade, controle, consistência, prevenção de erros, reconhecimento, flexibilidade, estética, recuperação de erros, ajuda.
2. **Gestalt:** proximidade, similaridade, continuidade, fechamento, figura-fundo.
3. **Acessibilidade:** contraste, hierarquia visual, legibilidade.
4. **Pontuação:** nota 1-5 por critério.
5. **Top 3 problemas** e sugestões de correção.$$,
  'Elemento: Tela de checkout de e-commerce com 12 campos no mesmo scroll, botão "Comprar" pouco visível.',
  '# Crítica de Design: Checkout\n**Heurística 1 - Visibilidade:** nota 2/5 — o botão de CTA some no scroll...'
),

-- ── Suporte ──────────────────────────────────────────────────────────────────
(116, 'Resposta a Reclamacao de Cliente', 'Iniciante', 'green', 'Suporte',
  'Modelo de resposta empática e resolutiva para reclamações de clientes insatisfeitos.',
  $$# Instrução
Escreva uma resposta profissional e empática para a reclamação do cliente.

# Estrutura
1. **Acolhimento:** reconhecer a frustração sem defensividade.
2. **Pedido de desculpas:** sincero e específico.
3. **Explicação breve:** o que aconteceu (sem excesso).
4. **Solução:** o que será feito e prazo.
5. **Gesto de boa vontade:** compensação se aplicável.
6. **Encerramento:** reforço do compromisso com a experiência.

# Tom: humano, direto, nunca robótico.$$,
  'Reclamação: Produto chegou amassado e o suporte demorou 5 dias para responder.',
  'Olá, [Nome], fico genuinamente chateado com o que aconteceu...'
),

(117, 'Script de FAQ Inteligente', 'Intermediario', 'yellow', 'Suporte',
  'Criação de perguntas frequentes com respostas claras, links úteis e caminho de escalonamento.',
  $$# Instrução
Crie um FAQ inteligente para o produto/serviço descrito.

# Para cada pergunta inclua
- **Pergunta** (como o cliente realmente pergunta, não termos técnicos).
- **Resposta direta** (máx. 3 parágrafos).
- **Link ou passo útil** (documento, tutorial, tela).
- **Se não resolver:** caminho de escalonamento (chat, e-mail, tel).

# Gere pelo menos 8 perguntas cobrindo: conta, pagamento, produto, cancelamento, bug.$$,
  'Produto: Plataforma SaaS de gestão de projetos para equipes remotas.',
  '**1. Como faço para adicionar um membro à minha equipe?**\nAcesse Configurações → Membros → Convidar...'
),

(118, 'Playbook de Escalonamento', 'Avancado', 'red', 'Suporte',
  'Matriz de classificação de tickets por gravidade com SLA, responsável e fluxo de escalonamento.',
  $$# Instrução
Crie um playbook de escalonamento de tickets para o contexto descrito.

# Entregáveis
- **Matriz de Severidade:** Crítico / Alto / Médio / Baixo com definição e exemplos.
- **SLA por nível:** tempo de primeira resposta e resolução.
- **Fluxo de escalonamento:** N1 → N2 → N3 com critérios de subida.
- **Comunicação ao cliente:** templates de update por severidade.
- **Post-mortem:** quando fazer e o quê documentar.$$,
  'Contexto: Startup de pagamentos com 5 analistas de N1, 2 engenheiros de suporte (N2) e equipe de produto (N3).',
  '# Playbook de Escalonamento\n## Matriz de Severidade\n| Nível | Critério | SLA Resposta | SLA Resolução |'
),

-- ── RH ───────────────────────────────────────────────────────────────────────
(119, 'Descricao de Vaga Atrativa', 'Iniciante', 'green', 'RH',
  'Modelo de descrição de vaga inclusiva, clara e que atrai os candidatos certos.',
  $$# Instrução
Escreva uma descrição de vaga profissional e atrativa para a posição descrita.

# Seções obrigatórias
1. **Sobre a empresa** (missão, cultura, 3 linhas).
2. **Sobre o cargo** (o que a pessoa fará no dia a dia).
3. **Responsabilidades** (5-7 bullets).
4. **Requisitos obrigatórios** (máx. 5 — seja realista).
5. **Diferenciais desejáveis** (máx. 3).
6. **Benefícios** (seja específico, sem "ambiente inovador" genérico).
7. **Como se candidatar.**

# Linguagem inclusiva: evite termos que excluam gênero ou idade.$$,
  'Cargo: Desenvolvedor(a) Front-end Pleno. Stack: React, TypeScript. Remoto, PJ.',
  '# Vaga: Desenvolvedor(a) Front-end Pleno\n**Sobre nós:** Somos uma fintech que simplifica...'
),

(120, 'Roteiro de Entrevista Estruturada', 'Intermediario', 'yellow', 'RH',
  'Script de entrevista comportamental com perguntas STAR e rubrica de avaliação.',
  $$# Instrução
Crie um roteiro de entrevista estruturada para a vaga descrita.

# Entregáveis
- **Abertura** (2 min): apresentação e alinhamento de agenda.
- **Perguntas técnicas** (3-4): avaliação de habilidades-chave.
- **Perguntas comportamentais STAR** (4-5): situação passada real.
- **Perguntas situacionais** (2-3): "o que você faria se...".
- **Espaço para perguntas do candidato** (5 min).
- **Rubrica de avaliação:** critérios e pontuação 1-5 por competência.$$,
  'Vaga: Gerente de Produto. Competências: visão de produto, comunicação, priorização, data-driven.',
  '# Roteiro de Entrevista: Gerente de Produto\n**Abertura:** "Obrigado por estar aqui, [Nome]..."'
),

(121, 'Plano de Onboarding de 30-60-90 Dias', 'Intermediario', 'yellow', 'RH',
  'Plano estruturado de integração com metas claras para os primeiros 3 meses do colaborador.',
  $$# Instrução
Crie um plano de onboarding de 30-60-90 dias para o colaborador descrito.

# Estrutura por fase
- **30 dias (Aprender):** conhecer time, processos, produto e stakeholders.
- **60 dias (Contribuir):** entrar em projetos reais com suporte.
- **90 dias (Independência):** entregar com autonomia e dar feedbacks.

# Para cada fase
- Objetivos SMART.
- Atividades e reuniões recomendadas.
- Check-in com gestor (agenda, tópicos).
- Critério de sucesso ao final da fase.$$,
  'Novo colaborador: Analista de Marketing Digital Pleno, empresa de EdTech, trabalho 100% remoto.',
  '# Plano de Onboarding: Analista de Marketing Digital\n## Dias 1–30: Aprender\n**Objetivo:** entender produto, público e canais...'
)

ON CONFLICT DO NOTHING;
