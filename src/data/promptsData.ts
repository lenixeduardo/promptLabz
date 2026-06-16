/**
 * @deprecated Content is now served from Supabase. Kept as offline fallback only.
 */

export interface PromptCard {
  title: string
  difficulty: "Iniciante" | "Intermediario" | "Avancado"
  color: "green" | "yellow" | "red"
  category: "Criatividade" | "Marketing" | "Programacao" | "Educacao" | "Produtividade" | "Gestao de Produto"
  promptText: string
  description: string
  exampleInput?: string
  exampleOutput?: string
}

export const PROMPTS: PromptCard[] = [
  // ── Creativity ───────────────────────────────────────────────────────────
  {
    title: "Prompt para Storytelling",
    difficulty: "Iniciante",
    color: "green",
    category: "Criatividade",
    description: "Criação de narrativas cativantes baseadas em premissas simples, estruturadas com início, meio e fim envolventes.",
    promptText: `# Instrução
Você é um escritor profissional de ficção literária e roteirista de storytelling. Sua tarefa é criar uma narrativa cativante baseada nos detalhes fornecidos.

# Estrutura do Roteiro
1. **Introdução (O Gancho):** Apresente o protagonista em seu cotidiano e o incidente gerador.
2. **Desenvolvimento (Conflito):** O obstáculo crescente e a jornada para superá-lo.
3. **Clímax:** O ponto de virada de maior tensão.
4. **Resolução:** O desfecho e a transformação do personagem.

# Regras de Escrita
- Mantenha o tom adequado para o público-alvo sugerido.
- Evite clichês óbvios; use detalhes sensoriais (visuais, sonoros, olfativos).
- Escreva em português brasileiro fluido.`,
    exampleInput: "Gênero: Ficção Científica. Protagonista: Uma jovem engenheira mecânica em uma colônia isolada em Marte. Conflito: Ela descobre uma mensagem misteriosa gravada no metal de um rover antigo.",
    exampleOutput: "A poeira vermelha batia contra as vidraças do Domo 4...\n(A história continua detalhando a descoberta da mensagem 'Não estamos sós na poeira' gravada sob o chassi do Rover Pathfinder-X...)"
  },
  {
    title: "Prompts para Design Grafico",
    difficulty: "Avancado",
    color: "green",
    category: "Criatividade",
    description: "Prompts detalhados para geração de arte e conceitos visuais em ferramentas como Midjourney e DALL-E.",
    promptText: `# Contexto
Você é um diretor de arte sênior. Crie um prompt descritivo detalhado para geradores de imagens por IA (Midjourney/DALL-E 3).

# Instruções de Formatação
Forneça a descrição da cena estruturada com:
- **Sujeito:** Foco principal e ação.
- **Estilo:** Foto realista, render 3D, ilustração digital, arte conceitual, etc.
- **Iluminação:** Tipo de luz (ex: golden hour, luz dramática lateral, neon cyberpunk).
- **Parâmetros técnicos:** Lente (ex: 85mm f/1.4), profundidade de campo, cores dominantes.`,
    exampleInput: "Tema: Robô de jardinagem futurista cuidando de uma planta brilhante.",
    exampleOutput: "Retrato detalhado de um robô de jardinagem de cerâmica fosca com detalhes de latão, segurando delicadamente um pequeno broto de flor luminescente que emite uma suave luz azul. Estilo: Render 3D hiper-detalhado, estética Studio Ghibli futurista. Iluminação: Golden hour suave filtrada pelas folhas. Cores dominantes: Verde musgo, azul néon suave, ouro velho."
  },
  {
    title: "Prompt de Pesquisa UX",
    difficulty: "Avancado",
    color: "red",
    category: "Criatividade",
    description: "Criação de roteiros de entrevista, personas e fluxos de experiência focados no usuário.",
    promptText: `# Papel
Você é um Pesquisador de UX (UX Researcher) experiente.

# Objetivo
Elaborar um guia de roteiro de pesquisa com usuários, contendo perguntas abertas, metas de pesquisa e critérios de recrutamento de participantes para o produto/funcionalidade especificado.`,
    exampleInput: "Produto: Um app de controle de gastos e investimentos para adolescentes de 14 a 18 anos.",
    exampleOutput: "# Guia de Pesquisa UX - Finanças na Adolescência\n## Metas de Pesquisa\n- Compreender a relação dos adolescentes com o dinheiro físico e digital.\n..."
  },
  {
    title: "Desenvolvimento de Personagens",
    difficulty: "Iniciante",
    color: "green",
    category: "Criatividade",
    description: "Geração de fichas de personagens tridimensionais com motivações, segredos e arcos de transformação.",
    promptText: `# Instrução
Crie uma ficha de personagem completa e tridimensional. Use a seguinte estrutura:
1. **Dados Básicos:** Nome, idade aproximada, ocupação.
2. **Aparência:** Detalhes peculiares e linguagem corporal.
3. **Psicologia:** Traço marcante, virtude principal, o maior segredo/fraqueza.
4. **Motivação:** O que o personagem quer versus o que ele realmente precisa aprender (arco dramático).`,
    exampleInput: "Conceito: Um detetive aposentado que agora cuida de um farol isolado.",
    exampleOutput: "Nome: Arthur Vance\nIdade: 62 anos\n...\nSegredo: Ele não se aposentou por idade, mas após perder o rastro de seu último caso por um erro de julgamento..."
  },
  {
    title: "Construcao de Mundo",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Criatividade",
    description: "Estruturação de cenários fictícios, sistemas de magia, governos e regras sociais para fantasia ou ficção científica.",
    promptText: `# Prompt de Construcao de Mundo
Você é um criador de mundos de RPG e ficção especulativa. Desenvolva os aspectos sociais, geográficos, políticos e de magia/tecnologia para o cenário descrito abaixo. Crie regras claras e história de fundo.`,
    exampleInput: "Cenário: Uma cidade suspensa por ímãs gigantescos onde o metal é a moeda e também o recurso mais escasso.",
    exampleOutput: "# Mundo de Ferrum-Avis\n## Geografia e Tecnologia\nA cidade de Ferrum-Avis paira a 3.000 metros de altitude, mantida por bobinas eletromagnéticas ancestrais..."
  },
  {
    title: "Design de Identidade de Marca",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Criatividade",
    description: "Construção de conceitos visuais e guias de design para identidades visuais de marcas inovadoras.",
    promptText: `# Prompt de Identidade de Marca
Crie um conceito de design de identidade de marca para a empresa descrita. Forneça sugestões de paleta de cores (com códigos Hex), tipografia (primária e secundária), elementos visuais de apoio e o conceito do logotipo.`,
    exampleInput: "Empresa: EcoDrive - Uma startup de aluguel de patinetes elétricos movidos a energia solar.",
    exampleOutput: "## Conceito EcoDrive\n**Paleta de Cores:** #2ECC71 (Verde Solar), #F1C40F (Amarelo Energia)..."
  },
  {
    title: "Gerador de Briefing Criativo",
    difficulty: "Iniciante",
    color: "green",
    category: "Criatividade",
    description: "Template de briefing criativo para alinhar equipes de marketing, design e redação em um projeto.",
    promptText: `# Briefing Criativo
Gere um briefing criativo estruturado contendo: Objetivos do Projeto, Público-Alvo, Principais Entregas, Mensagem-Chave, Restrições e Cronograma Estimado.`,
    exampleInput: "Projeto: Campanha de lançamento de um novo sabor de refrigerante saudável sem açúcar.",
    exampleOutput: "# Briefing Criativo: Campanha Refrigerante Saudável\n- **Objetivo:** Introduzir o sabor Hibisco com Limão como opção refrescante diária..."
  },
  {
    title: "Painel de Conceito Visual",
    difficulty: "Avancado",
    color: "red",
    category: "Criatividade",
    description: "Diretrizes e palavras-chave para criar moodboards e direções visuais artísticas consistentes.",
    promptText: `# Painel de Conceito Visual
Descreva um painel semântico e visual completo (moodboard) para o tema indicado, listando texturas, padrões, referências estéticas e referências cinematográficas ou artísticas aplicáveis.`,
    exampleInput: "Tema: Cafeteria Minimalista Nórdica com toque Industrial.",
    exampleOutput: "# Painel de Conceito Visual: Nórdico Industrial\n- **Texturas:** Concreto aparente polido, madeira de pinho clara...\n- **Iluminação:** Pendentes pretos foscos com luz quente amarelada..."
  },

  // ── Marketing ────────────────────────────────────────────────────────────
  {
    title: "Prompt de Atendimento ao Cliente",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Marketing",
    description: "Roteiros de atendimento ao cliente, respostas a reclamações e modelos de FAQ amigáveis.",
    promptText: `# Papel
Você é um especialista em Experiência do Cliente (Customer Success) sênior.

# Instrução
Escreva uma resposta empática, clara e profissional para o problema relatado pelo cliente. 
Use a técnica HEARD (Hear, Empathize, Apologize, Resolve, Diagnose).
Evite jargões técnicos e garanta que o cliente se sinta ouvido e valorizado.`,
    exampleInput: "Cliente furioso porque seu pedido de aniversário chegou com atraso de 3 dias e com a embalagem danificada.",
    exampleOutput: "Olá, [Nome do Cliente]. Em primeiro lugar, quero pedir sinceras desculpas pelo ocorrido. Sabemos o quanto o aniversário é um momento especial e ficamos muito tristes em saber..."
  },
  {
    title: "Copy para Redes Sociais",
    difficulty: "Iniciante",
    color: "green",
    category: "Marketing",
    description: "Redação de posts persuasivos e engajadores para Instagram, LinkedIn e TikTok com hashtags e CTAs.",
    promptText: `# Instrução
Escreva uma publicação para redes sociais com base no tópico fornecido.

# Diretrizes
- Adapte a linguagem para a plataforma solicitada (ex: LinkedIn = tom profissional; Instagram = dinâmico e focado em benefícios).
- Inclua um gancho (hook) forte na primeira linha.
- Termine com uma Chamada para Ação (CTA) clara.
- Adicione emojis relevantes e até 5 hashtags estratégicas.`,
    exampleInput: "Tópico: O lançamento de um e-book gratuito sobre produtividade usando inteligência artificial no trabalho. Canal: LinkedIn.",
    exampleOutput: "🚀 O fim das tarefas manuais chatas chegou?\n\nEscrevemos este guia completo para você economizar até 10 horas semanais...\n\n👉 Acesse o link no primeiro comentário!"
  },
  {
    title: "Campanha de Email",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Marketing",
    description: "Fluxos de e-mail marketing para nutrição, vendas e reengajamento de leads.",
    promptText: `# Objetivo
Você é um Copywriter especialista em E-mail Marketing. Crie uma sequência de e-mails para nutrir e converter leads frios.

# Estrutura do E-mail
- **Assunto:** Curto, curioso e focado em benefício.
- **Pré-cabeçalho:** Complemento do assunto.
- **Corpo:** Storytelling rápido ou problema comum + solução.
- **CTA:** Link único e direto.`,
    exampleInput: "Produto: Curso online de transição de carreira para a área de tecnologia (QA/Testes). Público: Pessoas insatisfeitas com empregos atuais.",
    exampleOutput: "Assunto: Cansado do mesmo domingo à noite?\nPré-cabeçalho: Há uma alternativa fora da rotina estressante...\nOlá! Se você sente aquele frio na barriga no domingo à noite..."
  },
  {
    title: "Copywriting para Anuncios",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Marketing",
    description: "Criação de anúncios focados em conversão para plataformas como Google Ads, Meta Ads e LinkedIn.",
    promptText: `# Prompt de Copywriting para Anuncios
Escreva copies de anúncio de alta conversão usando os modelos AIDA (Atenção, Interesse, Desejo, Ação) ou PAS (Problema, Agitação, Solução). Forneça variações de títulos (head) e descrições curtas.`,
    exampleInput: "Serviço: Assessoria de contabilidade online para microempreendedores individuais (MEIs).",
    exampleOutput: "### Opção 1: Modelo PAS\n**Título:** Contabilidade sem dor de cabeça\n**Texto:** Fazer sua declaração MEI consome horas do seu dia?..."
  },
  {
    title: "Copy para Landing Page",
    difficulty: "Avancado",
    color: "red",
    category: "Marketing",
    description: "Estruturação e redação persuasiva (copywriting) de seções completas para páginas de captura.",
    promptText: `# Copy para Landing Page
Redija o texto de uma Landing Page focada em conversão de leads/vendas. Divida nas seções: Hero Section (Título, Subtítulo, CTA), Seção de Problema, Seção de Solução, Prova Social, e FAQ.`,
    exampleInput: "Produto: Aplicativo de meditação rápida para executivos sem tempo.",
    exampleOutput: "# Hero Section\n**Título principal:** Reduza a ansiedade corporativa em apenas 3 minutos por dia...\n**Subtítulo:** Meditação guiada cientificamente comprovada..."
  },
  {
    title: "Calendario de Conteudo",
    difficulty: "Iniciante",
    color: "green",
    category: "Marketing",
    description: "Planejamento e ideias de postagens estruturadas para um mês de produção de conteúdo digital.",
    promptText: `# Calendário de Conteúdo
Crie uma tabela com ideias de conteúdo para 2 semanas, detalhando: Dia, Tema, Canal, Formato (ex: carrossel, reels, artigo), Gancho e Objetivo (Educar, Entreter, Vender).`,
    exampleInput: "Nicho: Educação Financeira Familiar.",
    exampleOutput: "| Dia | Tema | Canal | Formato | Gancho |\n|---|---|---|---|---|\n| Segunda | Como falar de dinheiro com os filhos | Instagram | Carrossel | 'Seus filhos sabem o valor do dinheiro?' |"
  },
  {
    title: "Guia de Voz da Marca",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Marketing",
    description: "Definição de diretrizes de tom de voz, termos recomendados e banidos para a comunicação de uma marca.",
    promptText: `# Guia de Voz da Marca
Crie um guia rápido de Tom de Voz da marca contendo: 4 traços de personalidade (ex: Audaz mas não arrogante), exemplos de escrita 'Como dizemos' vs 'Como não dizemos', e lista de termos recomendados e banidos.`,
    exampleInput: "Marca: Um banco digital voltado exclusivamente para profissionais da área de games e e-sports.",
    exampleOutput: "# Guia de Voz: Banco Gamer\n**Personalidade:** Descontraída, focada em comunidade, transparente..."
  },
  {
    title: "Briefing para Influenciadores",
    difficulty: "Iniciante",
    color: "green",
    category: "Marketing",
    description: "Instruções de campanha e diretrizes de criação de conteúdo para influenciadores parceiros.",
    promptText: `# Briefing para Influenciadoresing
Escreva um briefing de campanha para influenciadores, cobrindo: Escopo de Trabalho (Stories/Reels), Principais Mensagens a Comunicar, Diretrizes de 'O que Fazer' e 'O que Não Fazer', e Call to Action obrigatório.`,
    exampleInput: "Campanha: Lançamento de fones de ouvido bluetooth com isolamento acústico ativo.",
    exampleOutput: "# Briefing de Campanha: Fone Silenciador X\n**Diretrizes:** Mostre o fone na orelha cortando o som do metrô..."
  },

  // ── Coding ───────────────────────────────────────────────────────────────
  {
    title: "Script de Analise de Dados",
    difficulty: "Avancado",
    color: "green",
    category: "Programacao",
    description: "Criação de scripts Python (Pandas/Numpy) para limpeza, transformação e análise estatística de dados.",
    promptText: `# Papel
Você é um Cientista de Dados sênior.

# Instrução
Escreva um script limpo em Python usando as bibliotecas Pandas e Seaborn/Matplotlib para analisar e visualizar o dataset descrito. Inclua tratamento de dados ausentes, agregação estatística e geração de um gráfico relevante. Adicione comentários explicativos.`,
    exampleInput: "Dataset: Vendas de uma rede de farmácias com colunas 'data', 'id_produto', 'categoria', 'quantidade', 'preco_unitario', 'filial'. Tarefa: Descobrir o faturamento total por filial e categoria, gerando um gráfico de barras acumuladas.",
    exampleOutput: "```python\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\n# Carregar dados\ndf = pd.read_csv('vendas.csv')\n...\n```"
  },
  {
    title: "Prompt de Revisao de Codigo",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Programacao",
    description: "Análise de código focado em encontrar bugs, problemas de performance e melhorias de legibilidade.",
    promptText: `# Instrução
Você é um Engenheiro de Software Principal realizando uma revisão de código (Code Review).
Analise o trecho de código fornecido abaixo para identificar:
1. Bugs em potencial ou comportamentos inesperados.
2. Gargalos de performance ou complexidade desnecessária.
3. Desvios das boas práticas de escrita de código limpo (Clean Code).
4. Sugestão de refatoração para otimização da legibilidade.`,
    exampleInput: "```javascript\nfunction getUsers(users) {\n  let activeUsers = [];\n  for (var i = 0; i < users.length; i++) {\n    if (users[i].active == true) {\n      activeUsers.push(users[i]);\n    }\n  }\n  return activeUsers;\n}\n```",
    exampleOutput: "### Revisão de Código\n1. **Uso de var**: Recomenda-se substituir `var` por `let` ou `const` para evitar problemas de escopo de função.\n2. **Abordagem Imperativa**: Pode ser simplificado utilizando o método `.filter()` nativo...\n\n```javascript\nconst getActiveUsers = (users) => users.filter(user => user.active);\n```"
  },
  {
    title: "Padrao de Design de API",
    difficulty: "Avancado",
    color: "red",
    category: "Programacao",
    description: "Definição de arquitetura e especificação de rotas RESTful ou endpoints GraphQL seguros e escaláveis.",
    promptText: `# Especificacao de API
Desenhe um padrão de arquitetura de API RESTful para o caso abaixo. Especifique os endpoints (recurso, método, parâmetros de query, e corpo da requisição em JSON), os códigos de status de retorno (200, 201, 400, 404, 500) e mecanismos de segurança necessários (ex: OAuth2, Rate Limiting).`,
    exampleInput: "Caso: Um sistema de agendamento de consultas médicas online com pacientes e médicos.",
    exampleOutput: "### API Endpoints\n`POST /api/v1/appointments` - Cria uma nova consulta médica...\n```json\n{\n  \"doctorId\": \"uuid\",\n  \"dateTime\": \"2026-06-10T15:00:00Z\"\n}\n```"
  },
  {
    title: "Gerador de Testes Unitarios",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Programacao",
    description: "Geração de casos de testes unitários automatizados para cobrir fluxos normais e cenários de exceção.",
    promptText: `# Criacao de Testes Unitarios
Gere testes unitários abrangentes para a função fornecida utilizando a biblioteca e linguagem apropriadas. Certifique-se de testar:
- O caminho feliz (inputs corretos/esperados).
- Valores limite ou extremos (boundary values).
- Tratamento de erros e exceções (parâmetros nulos, vazios ou inválidos).`,
    exampleInput: "Função: Calcular a taxa de juros composta de um investimento. Tecnologia: Jest/TypeScript.",
    exampleOutput: "```typescript\ndescribe('calculateCompoundInterest', () => {\n  test('should calculate correct interest for normal inputs', () => {\n    ...\n  });\n});\n```"
  },
  {
    title: "Modelo de Relatorio de Bug",
    difficulty: "Iniciante",
    color: "green",
    category: "Programacao",
    description: "Instruções estruturadas para documentar bugs com reprodução passo a passo e logs recomendados.",
    promptText: `# Gerador de Relatorio de Bug
Crie um relatório de bug padronizado contendo: Descrição Concisa, Passos para Reprodução, Comportamento Esperado vs Comportamento Atual, Ambiente (SO, Navegador, Versão), Prints/Logs relevantes sugeridos.`,
    exampleInput: "Problema: O botão de checkout da loja online simplesmente recarrega a página em vez de abrir a janela de pagamento do Stripe.",
    exampleOutput: "# Bug: Checkout falha ao abrir Stripe no mobile\n## Passos para Reproduzir\n1. Acesse o carrinho com 1 item...\n2. Clique em 'Finalizar Compra'..."
  },
  {
    title: "Esquema de Banco de Dados",
    difficulty: "Avancado",
    color: "red",
    category: "Programacao",
    description: "Desenho de esquemas de banco de dados relacionais ou NoSQL otimizados para consistência e leitura rápida.",
    promptText: `# Esquema de Banco de Dados Design
Crie um esquema de banco de dados relacional (SQL) ou estruturado (NoSQL) para o cenário fornecido. Forneça o código DDL (CREATE TABLE) contendo chaves primárias, chaves estrangeiras, índices recomendados e explicações de decisões de modelagem.`,
    exampleInput: "Sistema: Plataforma de e-learning com cursos, módulos, lições e progresso dos usuários.",
    exampleOutput: "```sql\nCREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL\n);\n... \n```"
  },
  {
    title: "Construtor de Regex",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Programacao",
    description: "Criação e explicação detalhada de expressões regulares complexas para validação e busca.",
    promptText: `# Construtor de Regex
Crie uma Expressão Regular (Regex) para encontrar ou validar o padrão de texto solicitado. Forneça a expressão pura, a explicação de cada grupo/caractere especial e 3 exemplos que correspondem (matches) e 3 que falham.`,
    exampleInput: "Validar senhas fortes: Pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.",
    exampleOutput: "**Expressão:** `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$`\n**Explicação:** ... "
  },
  {
    title: "Assistente de Refatoracao",
    difficulty: "Avancado",
    color: "red",
    category: "Programacao",
    description: "Otimização de códigos legados aplicando padrões de projeto modernos e melhoria de legibilidade.",
    promptText: `# Assistente de Refatoracao
Refatore o código legado a seguir para torná-lo mais modular, testável e legível. Utilize padrões de projeto adequados (ex: Singleton, Factory, Strategy) e justifique suas alterações.`,
    exampleInput: "Código legado em Node.js com muitas condicionais aninhadas para calcular o preço de frete de acordo com a transportadora.",
    exampleOutput: "### Código Refatorado\nImplementamos o padrão *Strategy* para as transportadoras...\n```javascript\nclass ShippingStrategy { ... }\n```"
  },

  // ── Education ────────────────────────────────────────────────────────────
  {
    title: "Gerador de Plano de Estudos",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Educacao",
    description: "Criação de cronogramas de estudo semanais personalizados com metas de revisão e recursos práticos.",
    promptText: `# Instrução
Você é um Mentor de Estudos e Especialista em Aprendizagem Acelerada. Sua missão é criar um cronograma semanal de estudos otimizado para o objetivo do estudante.

# Estrutura do Cronograma
- **Metodologia recomendada:** Divisão de blocos de tempo (ex: técnica Pomodoro) e revisão espaçada.
- **Divisão Diária:** Horas estimadas, temas de foco e exercícios práticos sugeridos.
- **Dicas de Memorização:** Gatilhos mentais ou técnicas de fixação aplicadas ao tema.`,
    exampleInput: "Objetivo: Aprender o básico de SQL para análise de dados em 4 semanas, dispondo de 1 hora por dia (segunda a sexta).",
    exampleOutput: "# Plano de Estudos: SQL em 4 Semanas\n## Semana 1: Fundamentos de SELECT e filtros\n- **Segunda-feira:** Conceito de Banco de Dados Relacional e comando SELECT..."
  },
  {
    title: "Criador de Quiz",
    difficulty: "Iniciante",
    color: "green",
    category: "Educacao",
    description: "Geração de testes rápidos com perguntas de múltipla escolha e explicações detalhadas das respostas.",
    promptText: `# Criador de Quiz
Crie um quiz com 5 perguntas de múltipla escolha sobre o tópico especificado. Cada pergunta deve ter 4 alternativas (A, B, C, D) e um gabarito comentado explicando por que a alternativa correta está certa e as outras estão erradas.`,
    exampleInput: "Tópico: O ciclo da água e estados físicos da matéria.",
    exampleOutput: "1. Qual é o processo pelo qual a água passa do estado líquido para o gasoso sob a ação do sol?\nA) Condensação\nB) Evaporação...\n*Gabarito: B - A evaporação ocorre quando o calor do sol aquece a superfície da água...*"
  },
  {
    title: "Construtor de Plano de Aula",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Educacao",
    description: "Planos de aula detalhados para professores com objetivos pedagógicos, atividades e avaliações.",
    promptText: `# Construtor de Plano de Aula
Crie um plano de aula completo para professores. Inclua: Tema, Série/Nível, Duração (ex: 50min), Objetivos Pedagógicos (BNCC se aplicável), Metodologia (ex: Sala de aula invertida), Atividades passo a passo e Avaliação.`,
    exampleInput: "Tema: Introdução à Inteligência Artificial para alunos do 9º ano do Ensino Fundamental.",
    exampleOutput: "# Plano de Aula: O que é Inteligência Artificial?\n- **Duração:** 50 minutos\n- **Objetivos:** Identificar o papel da IA no dia a dia...\n- **Atividades:** 10 min de introdução..."
  },
  {
    title: "Explique Como se Eu Tivesse 5 Anos",
    difficulty: "Iniciante",
    color: "green",
    category: "Educacao",
    description: "Simplificação extrema de conceitos complexos usando analogias infantis cotidianas e vocabulário simples.",
    promptText: `# Explique Como se Eu Tivesse 5 Anos (ELI5)
Explique o conceito científico, matemático ou tecnológico fornecido como se estivesse conversando com uma criança de 5 anos de idade. Use metáforas divertidas do dia a dia (ex: brinquedos, parquinho, comida) e evite termos difíceis.`,
    exampleInput: "Conceito: Criptografia de chave pública e privada.",
    exampleOutput: "Imagine que você tem uma caixinha de brinquedos especial. Para colocar um brinquedo lá dentro, qualquer amigo seu pode usar uma portinha aberta. Mas para trancar ou abrir essa caixinha..."
  },
  {
    title: "Gerador de Flashcards",
    difficulty: "Iniciante",
    color: "green",
    category: "Educacao",
    description: "Fichas de pergunta e resposta curta (estilo Anki) ideais para memorização de termos e fórmulas.",
    promptText: `# Flashcards (Frente e Verso)
Gere 10 flashcards no estilo Anki sobre o tema fornecido. Formate como: Frente: [Pergunta/Conceito] | Verso: [Resposta objetiva/Definição].`,
    exampleInput: "Assunto: Vocabulário de Inglês Jurídico (Law).",
    exampleOutput: "Frente: O que significa 'Plaintiff' em português? | Verso: Autor da ação judicial (quem processa)."
  },
  {
    title: "Feedback de Redacao",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Educacao",
    description: "Revisão ortográfica, estrutural e argumentativa de redações com propostas de melhoria.",
    promptText: `# Revisor de Redacao
Você é um avaliador de redações (ex: modelo ENEM ou vestibular). Avalie a redação fornecida, apontando erros gramaticais, falhas de coesão/coerência, problemas estruturais e dê uma nota de 0 a 1000 com dicas de melhoria.`,
    exampleInput: "Tema da Redação: A importância da preservação ambiental nas cidades brasileiras.",
    exampleOutput: "# Avaliação da Redação\n**Competência 1 (Norma culta):** Houve desvios em concordância nominal na linha 5...\n**Sugestão de melhoria:** ..."
  },
  {
    title: "Resumo de Pesquisa",
    difficulty: "Avancado",
    color: "red",
    category: "Educacao",
    description: "Resumo de artigos acadêmicos ou relatórios longos extraindo a metodologia, descobertas e limitações.",
    promptText: `# Resumo de Pesquisa
Resuma o artigo científico fornecido. Extraia e organize nas seções: Contexto do Problema, Metodologia Utilizada, Principais Resultados/Descobertas, Limitações do Estudo e Próximos Passos recomendados.`,
    exampleInput: "Texto ou link contendo informações de um artigo sobre o impacto do sono nas notas de estudantes universitários.",
    exampleOutput: "# Resumo de Pesquisa: Sono e Rendimento Acadêmico\n- **Metodologia:** Pesquisa de corte com 500 estudantes usando diário de sono...\n- **Descoberta:** Alunos com menos de 6h de sono..."
  },
  {
    title: "Mapa Conceitual",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Educacao",
    description: "Esquematização conceitual conectando termos e ideias principais para guiar revisões mentais.",
    promptText: `# Mapa Conceitual Generator
Crie uma estrutura hierárquica e textual para um mapa conceitual. Identifique o Conceito Central, os Conceitos Secundários e os Termos de Ligação que explicam a relação entre cada nó (ex: 'Nó A' -> [termo de ligação] -> 'Nó B').`,
    exampleInput: "Tema: Sistema Circulatório Humano.",
    exampleOutput: "Conceito Central: Sistema Circulatório\n├── Conectado por [composto por] ➔ Coração\n│   └── Conectado por [bombeia] ➔ Sangue\n..."
  },

  // ── Productivity ─────────────────────────────────────────────────────────
  {
    title: "Escrita de Curriculo",
    difficulty: "Avancado",
    color: "red",
    category: "Produtividade",
    description: "Otimização de currículos focados em sistemas de recrutamento automático (ATS) e descrição de impacto.",
    promptText: `# Papel
Você é um Recrutador Sênior e Especialista em Currículos (ATS).

# Instrução
Reescreva a descrição das experiências profissionais do usuário para torná-las orientadas a resultados e de alto impacto. 
Use a fórmula X-Y-Z do Google: 'Conquistei [X], medido por [Y], fazendo [Z]'. 
Garanta a presença de palavras-chave relevantes para sistemas automáticos de triagem (ATS).`,
    exampleInput: "Cargo: Analista de Suporte de TI. Experiência informada: 'Eu resolvia chamados de usuários que tinham problemas com computadores e sistemas internos.'",
    exampleOutput: "Reescrita de Impacto:\n- **Resolvi mais de 450 chamados técnicos mensais**, mantendo o SLA de atendimento acima de 97.5% (superior à média histórica de 92%) através da implementação de um novo fluxo ágil de triagem no Jira Service Desk."
  },
  {
    title: "Escrita de Email",
    difficulty: "Iniciante",
    color: "green",
    category: "Produtividade",
    description: "Criação de e-mails corporativos formais, persuasivos ou informativos em poucos segundos.",
    promptText: `# Compositor de Email
Escreva um e-mail profissional com base nas informações fornecidas. Escolha o tom ideal (formal, semi-formal, persuasivo) e crie um assunto impactante. Seja direto e evite palavras redundantes.`,
    exampleInput: "Objetivo: Solicitar adiamento do prazo de entrega de um relatório financeiro em 2 dias para o diretor financeiro. Motivo: Atraso no envio dos dados pela equipe de vendas.",
    exampleOutput: "Assunto: Solicitação de Ajuste no Prazo - Relatório Financeiro Q2\n\nPrezado [Nome do Diretor],\n\nEscrevo para solicitar uma breve extensão de prazo de dois dias úteis..."
  },
  {
    title: "Planejador Diario",
    difficulty: "Iniciante",
    color: "green",
    category: "Produtividade",
    description: "Estruturação da rotina diária equilibrando trabalho, bem-estar e compromissos importantes.",
    promptText: `# Planejador Diario
Gere um cronograma diário realista com base na lista de tarefas informada. Divida o dia em blocos (Timeblocking), reserve espaço para refeições, descanso e exercícios. Identifique a Tarefa Mais Importante (MIT) do dia.`,
    exampleInput: "Tarefas: Responder e-mails acumulados (1h), Reunião de equipe (1h), Escrever relatório de vendas (3h), Ir à academia (1h). Horário útil: 08:00 às 18:00.",
    exampleOutput: "# Planejamento Diário\n- **MIT (Tarefa Mais Importante):** Escrever relatório de vendas (Foco total pela manhã)\n- **08:30 - 09:30:** Triagem de e-mails e respostas...\n- **09:30 - 12:30:** [Foco] Relatório de vendas..."
  },
  {
    title: "Pauta de Reuniao",
    difficulty: "Iniciante",
    color: "green",
    category: "Produtividade",
    description: "Criação de pautas de reunião focadas e cronometradas para evitar conversas improdutivas.",
    promptText: `# Pauta de Reuniao Builder
Crie uma pauta de reunião estruturada e produtiva contendo: Objetivo da Reunião, Participantes Necessários, Cronograma de Tópicos (com tempos específicos), Material de Leitura Prévia sugerido e espaço para Definição de Responsáveis.`,
    exampleInput: "Reunião: Alinhamento de lançamento de novo design do site institucional. Duração: 45 minutos.",
    exampleOutput: "# Pauta de Reunião: Alinhamento Novo Design Site\n**Objetivo:** Validar os wireframes da Home e definir datas de entrega...\n- **00-05 min:** Alinhamento de objetivos...\n- **05-25 min:** Apresentação dos wireframes..."
  },
  {
    title: "Matriz de Decisao",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Produtividade",
    description: "Matrizes de decisão para comparar alternativas com pesos atribuídos a cada critério.",
    promptText: `# Matriz de Decisao
Crie uma tabela comparativa (Matriz de Decisão) para as opções informadas. Defina critérios de peso de 1 a 5 (como custo, tempo, complexidade, benefício) e dê pontuações para ajudar na escolha racional.`,
    exampleInput: "Decisão: Escolher entre contratar uma agência de marketing terceirizada ou contratar um funcionário de marketing interno.",
    exampleOutput: "| Opção | Critério Custo (Peso 4) | Critério Velocidade (Peso 3) | Total |\n|---|---|---|---|\n| Agência | 3 (Médio) | 5 (Rápido) | ... |"
  },
  {
    title: "Priorizacao de Tarefas",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Produtividade",
    description: "Organização de tarefas usando matrizes de priorização como Eisenhower ou GUT.",
    promptText: `# Priorização de Tarefas (Matriz de Eisenhower)
Classifique a lista de tarefas a seguir nos quatro quadrantes: 1. Urgente e Importante (Fazer agora), 2. Não Urgente mas Importante (Planejar/Agendar), 3. Urgente mas Não Importante (Delegar), 4. Não Urgente e Não Importante (Eliminar).`,
    exampleInput: "- Pagar imposto que vence hoje\n- Conversar sobre as férias com colega\n- Planejar estratégia anual da empresa\n- Responder e-mail de spam",
    exampleOutput: "## Quadrante 1: Urgente e Importante\n- Pagar imposto que vence hoje (Vencimento imediato)\n..."
  },
  {
    title: "Avaliacao de Desempenho",
    difficulty: "Avancado",
    color: "red",
    category: "Produtividade",
    description: "Roteiros para autoavaliação profissional ou avaliação de desempenho de liderados.",
    promptText: `# Avaliacao de Desempenho Assistant
Escreva uma autoavaliação ou avaliação de desempenho profissional estruturada. Divida em: Principais Entregas e Conquistas do Período, Áreas de Oportunidade/Melhoria, e Plano de Desenvolvimento Individual (PDI) para o próximo ciclo.`,
    exampleInput: "Cargo: Desenvolvedor Front-end Júnior. Conquistas: Entregou 12 novas telas no prazo. Melhoria: Precisa se comunicar melhor nas reuniões de planejamento.",
    exampleOutput: "### Avaliação de Desempenho\n**Conquistas:** Destaco a excelente consistência técnica na entrega de 12 layouts...\n**Pontos de Melhoria:** Fomentar participação ativa nas reuniões de planejamento..."
  },
  {
    title: "POPs e Checklists",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Produtividade",
    description: "Procedimentos Operacionais Padrão (POPs) claros para delegar e replicar tarefas com perfeição.",
    promptText: `# SOP Builder (Procedimento Operacional Padrão)
Escreva um POP detalhado contendo: Objetivo do Processo, Pré-requisitos necessários, Passo a Passo Numerado sequencial, Ações de Mitigação se algo der errado (Troubleshooting) e Critérios de Sucesso.`,
    exampleInput: "Processo: Publicação semanal de artigos no blog da empresa (WordPress).",
    exampleOutput: "# POP: Publicação de Artigo no WordPress\n## Passo 1: Revisar otimização de imagem...\n## Passo 2: Copiar texto estruturado no editor Gutenberg..."
  },

  // ── Product Management ───────────────────────────────────────────────────
  {
    title: "Construir vs Comprar vs Firmar Parceria",
    difficulty: "Avancado",
    color: "red",
    category: "Gestao de Produto",
    description: "Framework para decidir se uma funcionalidade deve ser desenvolvida internamente ou contratada de terceiros.",
    promptText: `# Construir vs Comprar vs Firmar Parceria Analysis
Você é um Diretor de Produto avaliando a estratégia de desenvolvimento de um novo componente. Crie uma análise estruturada comparando:
1. **Build (Desenvolvimento Interno):** Custos, alocação de engenharia, time-to-market e diferenciação competitiva.
2. **Buy (Compra/SaaS comercial):** Custo de licenças, limitações de customização e velocidade de entrega.
3. **Partner (Integração/Parceria de plataforma):** Alianças estratégicas e divisão de receitas.

Forneça um veredito recomendado fundamentado na complexidade informada.`,
    exampleInput: "Funcionalidade: Sistema de chat em tempo real e chamadas de vídeo dentro de um aplicativo de telemedicina médica.",
    exampleOutput: "## Análise: Sistema de Vídeo/Chat em Telemedicina\n### 1. Build (Interno)\n- **Vantagem:** Total controle sobre privacidade e conformidade HIPAA/LGPD.\n- **Desvantagem:** Tempo estimado de 6 meses de um time de 4 desenvolvedores focados em infraestrutura WebRTC...\n### Veredito Recomendado: BUY/PARTNER (Ex: Twilio/Agora) pela urgência regulatória..."
  },
  {
    title: "Estrategia de Dados para IA",
    difficulty: "Avancado",
    color: "red",
    category: "Gestao de Produto",
    description: "Desenho de planos de governança, aquisição, rotulagem e pipelines de dados para alimentar modelos de IA.",
    promptText: `# Estrategia de Dados para IA Framework
Como Gerente de Produto de IA (AI PM), estruture uma estratégia de dados para o produto proposto, detalhando: Fontes de dados necessárias, Métodos de coleta/rotulagem (human-in-the-loop), Privacidade/Segurança de Dados e Pipeline de feedback para melhoria do modelo.`,
    exampleInput: "Produto: Um assistente inteligente para análise de contratos jurídicos e identificação de cláusulas de alto risco.",
    exampleOutput: "# Estratégia de Dados: Analisador de Contratos Jurídicos\n## 1. Aquisição de Dados de Treinamento\n- Fontes: Parcerias com escritórios de advocacia, repositórios públicos..."
  },
  {
    title: "Definicao de Funcionalidade com IA",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Definição de escopo, métricas de modelo e limites de erro para novos recursos baseados em IA.",
    promptText: `# Especificacao de Funcionalidade com IA
Defina as especificações de produto para uma nova funcionalidade de inteligência artificial, detalhando: Objetivo da Funcionalidade, Modelo sugerido, Métricas de IA (Precisão, Recall ou F1-score), Latência tolerada e tratamento de falsos positivos/negativos.`,
    exampleInput: "Funcionalidade: Recomendação inteligente de vagas de emprego compatíveis no LinkedIn baseada no currículo do usuário.",
    exampleOutput: "# Especificação de Funcionalidade: Recomendação de Vagas por IA\n- **Métrica de IA:** Precision@5 superior a 80%..."
  },
  {
    title: "Resposta a Incidentes de IA",
    difficulty: "Avancado",
    color: "red",
    category: "Gestao de Produto",
    description: "Planos de contingência e mitigação para falhas e alucinações críticas de modelos de IA.",
    promptText: `# Resposta a Incidentes de IA Plan
Escreva um guia de resposta rápida a incidentes de IA contendo: Nível de severidade da falha, Passos imediatos para contenção (ex: fallback para heurística estática), Protocolo de comunicação com o cliente afetado e Processo de análise de causa raiz.`,
    exampleInput: "Incidente: Um chatbot de suporte ao cliente gerou termos abusivos e ofereceu produtos por valor R$ 0,00 incorretamente.",
    exampleOutput: "# Plano de Resposta a Incidentes: Falha Crítica do Chatbot\n## 1. Contenção Imediata\n- Desativar a API do LLM e ativar fallback automático para menu estático de FAQ..."
  },
  {
    title: "Avaliacao de Modelo de IA",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Guia para avaliar modelos de linguagem de acordo com alucinações, latência e custo por token.",
    promptText: `# Avaliacao de Modelo de IA
Crie um framework de avaliação comparando 3 modelos de IA (ex: GPT-4o, Claude 3.5 Sonnet, Llama 3) para o caso de uso fornecido, focando em: Custo por milhão de tokens, Latência de resposta, Acurácia factual e facilidade de ajuste fino.`,
    exampleInput: "Caso de uso: Classificação em tempo real de mensagens de suporte para envio à equipe de resposta urgente.",
    exampleOutput: "## Tabela de Avaliação de Modelos\n| Modelo | Latência | Custo/1M Tokens | Acurácia (Zero-Shot) |\n|---|---|---|---|\n| Llama 3 8B (Local) | < 300ms | Baixo (Infra) | 82% |"
  },
  {
    title: "Pesquisa de Usuarios para IA",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Entrevistas com usuários com foco em testar a percepção de valor e confiança em produtos orientados por IA.",
    promptText: `# Pesquisa de Usuarios para IA Plan
Gere um plano de pesquisa focado na confiança e adoção de IA. Liste perguntas para validar: Confiança nas respostas, Percepção de utilidade prática das sugestões e Facilidade de interação via chat vs botões.`,
    exampleInput: "Produto: Sistema que gera receitas médicas automáticas com base em sintomas informados por voz pelo médico.",
    exampleOutput: "# Pesquisa de UX: Assistente de Receita Médica por Voz\n## Perguntas-chave de Confiança\n- 'Como você valida se a IA incluiu a dosagem correta?'"
  },
  {
    title: "Engenharia de Prompts",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Criação de diretrizes para padronização e versionamento de prompts no desenvolvimento de softwares.",
    promptText: `# Engenharia de Prompts Guide
Crie um guia de engenharia de prompts internos para o time de desenvolvimento, definindo: Diretrizes de formatação (Markdown), Variáveis dinâmicas (tags {{VAR}}), restrições de formatação de saída (JSON estruturado) e sistema de versionamento.`,
    exampleInput: "Tarefa: Extração estruturada de dados de notas fiscais digitalizadas.",
    exampleOutput: "# Diretrizes de Prompting: Extração de Nota Fiscal\n- Use sempre a tag `<xml>` para separar a entrada de dados..."
  },
  {
    title: "IA Responsavel",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Checklist ético para avaliação de privacidade, equidade e explicabilidade de algoritmos de aprendizado.",
    promptText: `# Checklist de IA Responsável
Crie um documento de governança ética para o desenvolvimento do modelo de IA proposto, detalhando: Explicabilidade (como o modelo justifica a decisão), Privacidade (tratamento de PII), Equidade (mitigação de vieses demográficos) e Segurança.`,
    exampleInput: "Modelo: Algoritmo de triagem automatizada de currículos de candidatos para vagas corporativas.",
    exampleOutput: "# Governança Ética: Triagem de Currículos\n- **Equidade:** Remover dados de nome, idade, gênero e localização antes da inferência..."
  },
  {
    title: "Analise de Teste A/B",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Estruturação de relatórios pós-teste A/B para documentar significância estatística e aprendizados práticos.",
    promptText: `# Relatorio Pos-Mortem de Teste A/B
Escreva uma análise detalhada de resultados de teste A/B contendo: Hipótese original, Métrica Primária, Resultados das Variantes (A vs B), Significância Estatística (P-valor) e recomendação de Rollout ou Rollback.`,
    exampleInput: "Experimento: Alteração da cor do botão de checkout de azul para verde. Resultado: Aumento de 4.2% na conversão com P-valor de 0.01.",
    exampleOutput: "# Relatório de Teste A/B: Cor do Botão de Checkout\n- **Hipótese:** Um botão verde gera mais contraste e sensação de segurança...\n- **Resultado:** Variante B (Verde) superou a Variante A (Azul) em 4.2%..."
  },
  {
    title: "Analise de Coortes",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Análise de comportamento de retenção de grupos de usuários ao longo do tempo (cohorts).",
    promptText: `# Analise de Retencao por Coortes
Analise os dados de retenção de coorte fornecidos. Identifique gargalos de produto (ex: queda acentuada na Semana 1) e recomende ações de engajamento direcionadas.`,
    exampleInput: "Dados: Coorte de Janeiro 2026. Semana 0: 100%, Semana 1: 40%, Semana 2: 35%, Semana 3: 32%.",
    exampleOutput: "# Análise de Retenção de Coorte (Janeiro 2026)\n- **Gargalo Identificado:** Perda de 60% dos usuários logo na primeira semana (Onboarding problem)..."
  },
  {
    title: "Plano de Rastreamento de Eventos",
    difficulty: "Iniciante",
    color: "green",
    category: "Gestao de Produto",
    description: "Mapeamento de eventos e propriedades para ferramentas de analytics (Mixpanel, Amplitude).",
    promptText: `# Plano de Rastreamento de Eventos
Gere um plano de tag de rastreamento de eventos em formato de tabela para a jornada descrita. Colunas: Nome do Evento (ex: 'click_checkout_button'), Ação do Usuário, Propriedades do Evento (ex: 'cart_value', 'currency').`,
    exampleInput: "Fluxo: Cadastro de novo usuário, adição de produto ao carrinho e finalização do pagamento.",
    exampleOutput: "| Evento | Ação | Propriedades |\n|---|---|---|\n| sign_up_completed | Usuário preenche e confirma cadastro | 'method' (google/email) |"
  },
  {
    title: "Analise de Funil",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Identificação de gargalos e oportunidades de otimização em fluxos de conversão lineares.",
    promptText: `# Analise de Queda no Funil
Analise as taxas de conversão entre as etapas do funil de vendas indicado, aponte a etapa com maior atrito (drop-off) e apresente 3 hipóteses de melhoria UX/Produto.`,
    exampleInput: "Funnel: Home (10.000 visitas) -> Ver Produto (4.000) -> Adicionar Carrinho (500) -> Checkout Finalizado (100).",
    exampleOutput: "# Análise de Funil\n- **Maior Drop-off:** Ver Produto para Adicionar ao Carrinho (Queda de 87.5%)\n- **Hipóteses:** Preço pouco visível, falta de frete calculado na página..."
  },
  {
    title: "Definicao de Metricas",
    difficulty: "Iniciante",
    color: "green",
    category: "Gestao de Produto",
    description: "Definição clara de North Star Metrics, indicadores chave de performance (KPIs) e métricas de saúde.",
    promptText: `# Metricas de Produto framework
Defina a North Star Metric (Métrica Estrela Guia) e as Métricas de Suporte (Entrada, Saída e Saúde) para a plataforma indicada. Descreva a justificativa estratégica de cada escolha.`,
    exampleInput: "Produto: Aplicativo de entrega de comida ultra-rápida local.",
    exampleOutput: "# Estrutura de Métricas: FastFood delivery\n- **North Star Metric:** Número de pedidos entregues com sucesso antes de 20 minutos...\n- **Justificativa:** Reflete o valor central prometido..."
  },
  {
    title: "Metricas de Produto",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Acompanhamento de engajamento do usuário usando frameworks de métricas consolidados.",
    promptText: `# Metricas de Produto Definition
Desenvolva um painel de métricas de produto utilizando o framework HEART do Google (Happiness, Engagement, Adoption, Retention, Task Success) para o produto fornecido.`,
    exampleInput: "Produto: Plataforma B2B SaaS de gestão de tarefas de projetos de engenharia.",
    exampleOutput: "### Framework HEART\n- **Happiness:** Net Promoter Score (NPS) dos gerentes de engenharia...\n- **Engagement:** Tempo ativo diário na plataforma por usuário..."
  },
  {
    title: "Consultas SQL para PMs",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Geração de queries SQL para extrair dados de comportamento e taxas de conversão.",
    promptText: `# SQL para Product Managers
Escreva uma consulta SQL limpa e explicada passo a passo para calcular a métrica de produto solicitada a partir das tabelas fornecidas.`,
    exampleInput: "Métrica: Taxa de conversão de cadastro para compra por mês. Tabelas: 'users' (id, created_at) e 'orders' (id, user_id, order_date, amount).",
    exampleOutput: "```sql\nSELECT \n  DATE_TRUNC('month', u.created_at) AS signup_month,\n  COUNT(DISTINCT u.id) AS total_signups,\n  COUNT(DISTINCT o.user_id) AS converted_users,\n...\n```"
  },
  {
    title: "Brainstorm de OKRs",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Construção de Objetivos e Resultados-Chave (OKRs) ambiciosos, mensuráveis e alinhados.",
    promptText: `# Brainstorm de OKRs
Como um Diretor de Produto sênior, crie 3 Objetivos (Objectives) estratégicos com 3 Resultados-Chave (Key Results) mensuráveis cada um para o cenário de produto proposto. Siga a metodologia OKR clássica (foco em resultados, não tarefas).`,
    exampleInput: "Objetivo de Negócio: Melhorar a retenção de usuários ativos no aplicativo de streaming de áudio.",
    exampleOutput: "# OKRs: Retenção de Streaming de Áudio\n## Objetivo 1: Tornar-se um hábito diário indispensável na rotina do ouvinte.\n- **KR 1:** Aumentar a proporção de usuários DAU/MAU de 28% para 40%..."
  },
  {
    title: "Criar PRD",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Criação de Documentos de Requisitos de Produto (PRD) completos com alinhamento técnico e de negócios.",
    promptText: `# Documento de Requisitos de Produto (PRD)
Você é um Product Manager experiente. Escreva um PRD robusto para a funcionalidade sugerida. O documento deve cobrir:
1. **Problema do Usuário & Visão Geral:** Por que estamos construindo isso e qual o valor.
2. **Métricas de Sucesso:** Como mediremos o sucesso da entrega.
3. **Casos de Uso & Requisitos Funcionais:** Detalhamento funcional em formato de tabela (Requisito, Prioridade P0/P1/P2, Descrição).
4. **Fora de Escopo:** O que decidimos não fazer nesta versão.
5. **Critérios de Aceite:** Regras finais para aprovação do time de engenharia e QA.`,
    exampleInput: "Funcionalidade: Adição de login biométrico (FaceID/Impressão digital) em um aplicativo bancário móvel.",
    exampleOutput: "# PRD: Autenticação Biométrica no App Bancário\n## 1. Problema do Usuário\nOs usuários reclamam da lentidão de digitar senhas numéricas complexas toda vez que precisam realizar consultas rápidas..."
  },
  {
    title: "Historias de Trabalho",
    difficulty: "Iniciante",
    color: "green",
    category: "Gestao de Produto",
    description: "Construção de histórias baseadas na metodologia 'Jobs-to-be-Done' (JTBD) para entender a motivação real.",
    promptText: `# Historias de Trabalho Generator
Escreva 5 Historias de Trabalho baseadas no framework Jobs-to-be-Done (JTBD) usando a estrutura: 'Quando [Situação/Contexto], eu quero [Motivação/Ação], para que eu possa [Resultado Esperado].'`,
    exampleInput: "Produto: Ferramenta de edição de fotos profissional rápida no celular.",
    exampleOutput: "1. **Quando** estou cobrindo um evento em tempo real e não tenho meu computador por perto, **eu quero** aplicar ajustes rápidos de luz nas minhas fotos brutas pelo celular, **para que eu possa** enviá-las imediatamente para o portal de notícias."
  },
  {
    title: "Preparacao de Reuniao",
    difficulty: "Iniciante",
    color: "green",
    category: "Gestao de Produto",
    description: "Preparação de dados e alinhamentos pré-reuniões com stakeholders importantes.",
    promptText: `# Preparacao de Reuniaoaration Guide
Gere um documento de preparação pré-reunião de alinhamento técnico ou executivo. Cubra: Principais fatos e dados do contexto, Posicionamento estratégico recomendado, Possíveis objeções de stakeholders e Respostas sugeridas.`,
    exampleInput: "Reunião com CFO para pedir aprovação de aumento de 15% no orçamento de infraestrutura cloud devido ao crescimento de acessos.",
    exampleOutput: "# Preparação de Reunião: Orçamento Cloud Q3\n- **Dados de Suporte:** Crescimento de 45% nos acessos ativos diários nos últimos 3 meses...\n- **Objeção Esperada:** 'Por que não otimizamos o código antes de gastar mais?'\n- **Resposta:** ..."
  },
  {
    title: "Roadmap por Resultados",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Construção de roadmaps focados em resultados de negócios (outcomes) em vez de entregas de software (outputs).",
    promptText: `# Roadmap Baseado em Resultados
Crie um roadmap de produto focado em resultados (outcomes) para as fases: Agora, Próximo, Futuro. Cada item do roadmap deve listar: Meta de Negócio a Atingir, Hipóteses de Solução associadas e Métricas Chave de Sucesso.`,
    exampleInput: "Produto: Plataforma de telemedicina focada na redução da taxa de no-show (não comparecimento de pacientes).",
    exampleOutput: "# Roadmap de Outcomes: Redução de No-Show\n## Agora (Foco Principal)\n- **Outcome:** Reduzir faltas de pacientes nas primeiras 24 horas após agendamento...\n- **Métrica:** Taxa de no-show geral cair de 18% para 12%..."
  },
  {
    title: "Analise Pre-Mortem",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Exercício de antecipação de falhas para blindar projetos antes do lançamento oficial.",
    promptText: `# Analise Pre-Mortem
Assuma que o projeto sugerido foi um fracasso catastrófico logo após o lançamento. Escreva uma análise de trás para frente explicando: Por que o projeto falhou? Quais sinais ignoramos? Quais as 5 principais causas da falha e como podemos mitigá-las hoje.`,
    exampleInput: "Projeto: Lançamento de um recurso de pagamento instantâneo por aproximação usando NFC.",
    exampleOutput: "# Análise Pre-Mortem: Falha do NFC Pay\n**Cenário de Fracasso:** O recurso foi lançado e teve menos de 1% de uso...\n- **Causa 1:** Falta de suporte na maioria dos dispositivos dos usuários de baixa renda..."
  },
  {
    title: "Priorizacao",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Priorização de backlog de produto usando frameworks como RICE ou MoSCoW.",
    promptText: `# Backlog Priorizacao (RICE Framework)
Calcule a pontuação RICE (Reach x Impact x Confidence / Effort) para a lista de ideias de funcionalidades enviada. Classifique a tabela final de acordo com a pontuação decrescente para recomendar a ordem de desenvolvimento.`,
    exampleInput: "Opção A: Integração com carteiras digitais (Apple Pay). Alcance: 80% dos usuários, Impacto: Alto (3), Confiança: 80% (0.8), Esforço: 2 meses (2).\nOpção B: Mudar esquema de cores do rodapé. Alcance: 100%, Impacto: Mínimo (0.5), Confiança: 100% (1.0), Esforço: 0.5 meses.",
    exampleOutput: "| Funcionalidade | Reach | Impact | Confidence | Effort | RICE Score |\n|---|---|---|---|---|---|\n| Apple Pay | 80% | 3 | 0.8 | 2 | **96** |"
  },
  {
    title: "Notas de Lancamento",
    difficulty: "Iniciante",
    color: "green",
    category: "Gestao de Produto",
    description: "Redação de notas de lançamento engajadoras e informativas para usuários finais e equipe de vendas.",
    promptText: `# Notas de Lancamento Generator
Escreva notas de lançamento atraentes e fáceis de ler para os usuários finais sobre as novas funcionalidades descritas. Divida em: Novidades (Novos recursos), Melhorias de Estabilidade (Correção de bugs) e Como Usar.`,
    exampleInput: "Novidades: Adicionado modo escuro automático e exportação direta de relatórios para PDF.",
    exampleOutput: "# O que há de novo no App v2.4 🌙\n- **Modo Escuro Automático:** Seus olhos agradecem! Agora o app acompanha as configurações do seu celular...\n- **PDF com 1 clique:** ..."
  },
  {
    title: "Retrospectiva da Sprint",
    difficulty: "Iniciante",
    color: "green",
    category: "Gestao de Produto",
    description: "Facilitação de dinâmicas pós-sprint para melhoria contínua do time de desenvolvimento.",
    promptText: `# Retrospectiva da Sprint Template
Crie um guia de facilitação de retrospectiva ágil usando a técnica 'Mad, Sad, Glad' (Bravo, Triste, Feliz) ou 'Start, Stop, Continue'. Proponha dinâmicas práticas para motivar o time a identificar problemas e gerar planos de ação com responsáveis definidos.`,
    exampleInput: "Contexto do time: Sprint difícil, atraso na API de terceiros, mas equipe de design ajudou muito a codificar o front-end.",
    exampleOutput: "# Retrospectiva da Sprint 12\n## 🟢 Glad (Feliz / O que deu certo)\n- Integração design-engenharia foi excelente...\n## 🔴 Sad (Triste / Desafios)\n- Dependência da API de terceiros travou entregas..."
  },
  {
    title: "Plano de Sprint",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Planejamento e estimativa de histórias de usuário em formato de metas claras de sprint.",
    promptText: `# Plano de Sprintning Assistant
Ajude a planejar a próxima sprint com base na capacidade do time (Story Points disponíveis) e na lista de histórias priorizadas. Defina uma Meta da Sprint única e divida as tarefas técnicas recomendadas.`,
    exampleInput: "Capacidade: 40 Story Points. Histórias: Migrar Banco de Dados (13 SP), Tela de Login Social (8 SP), Envio de SMS Token (5 SP), Dashboard Financeiro (21 SP).",
    exampleOutput: "# Plano da Sprint 15\n**Meta da Sprint:** Garantir a estabilidade de autenticação e segurança de dados do usuário...\n- **Histórias selecionadas:** Migrar Banco (13), Login Social (8), SMS Token (5). Total: 26 SP. (Dashboard descartado pois estouraria o limite)..."
  },
  {
    title: "Mapa de Stakeholders",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Mapeamento de poder, interesse e plano de comunicação para stakeholders de um projeto.",
    promptText: `# Mapeamento de Stakeholders (Matriz de Poder/Interesse)
Mapeie os stakeholders listados nos 4 quadrantes clássicos: 1. Monitorar (Baixo Poder, Baixo Interesse), 2. Manter Informado (Baixo Poder, Alto Interesse), 3. Manter Satisfeito (Alto Poder, Baixo Interesse), 4. Gerenciar de Perto (Alto Poder, Alto Interesse). Apresente um plano de comunicação para cada grupo.`,
    exampleInput: "Stakeholders: CEO, Engenheiro de Software Júnior, Gerente de Marketing, Diretor de Segurança de Dados, Cliente Beta.",
    exampleOutput: "# Matriz de Stakeholders\n- **Gerenciar de Perto:** CEO, Diretor de Segurança de Dados (alto poder de veto, alto interesse na segurança)...\n- **Manter Informado:** Gerente de Marketing..."
  },
  {
    title: "Atualizacao para Stakeholders",
    difficulty: "Iniciante",
    color: "green",
    category: "Gestao de Produto",
    description: "Comunicações periódicas de progresso do produto adaptadas para audiências de liderança ou executivos.",
    promptText: `# Email de Atualizacao para Stakeholders
Escreva um relatório executivo curto e direto informando o progresso do produto. Use a estrutura: 🎯 Objetivos Principais, 🚀 Conquistas e Marcos Alcançados, ⚠️ Riscos e Bloqueios Atuais, e 🔮 Próximos Passos.`,
    exampleInput: "Progresso: Lançamos o beta fechado para 100 usuários, a retenção inicial é de 45%, mas o serviço de e-mail de ativação está instável causando atrasos.",
    exampleOutput: "Assunto: Atualização de Produto Q3 - Fase Beta\n\nPrezados,\n\n🎯 **Objetivo Principal:** Validar o produto no mercado privado...\n🚀 **Conquistas:** Beta fechado liberado para 100 usuários selecionados..."
  },
  {
    title: "Resumo de Reuniao",
    difficulty: "Iniciante",
    color: "green",
    category: "Gestao de Produto",
    description: "Resumos executivos rápidos de reuniões com foco em decisões tomadas e planos de ação (Next Steps).",
    promptText: `# Resumo de Reuniao
Crie um resumo de reunião focado em resultados. Forneça: 1. Decisões Principais Tomadas, 2. Ações Pendentes com Donos e Prazos (Action Items) em formato de tabela, 3. Tópicos adiados para futuras discussões.`,
    exampleInput: "Discussão: Decidimos lançar o MVP apenas em iOS. João vai preparar a especificação até sexta. Maria vai verificar o custo de infraestrutura do Firebase até segunda.",
    exampleOutput: "# Ata de Reunião: Decisão MVP iOS\n## Principais Decisões\n- O MVP será exclusivo para a plataforma iOS devido ao perfil inicial de público-alvo...\n## Plano de Ação\n| Tarefa | Responsável | Prazo |\n|---|---|---|\n| Especificação funcional | João | Sexta-feira |"
  },
  {
    title: "Cenarios de Teste",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Identificação de cenários de teste funcionais e de borda para garantir a qualidade de software.",
    promptText: `# Gerador de Cenarios de Teste QA
Gere cenários de teste funcionais e não funcionais detalhados para a funcionalidade proposta. Inclua: Cenários de Caminho Feliz, Cenários de Fluxos Alternativos e Cenários de Erro/Falha de Sistema.`,
    exampleInput: "Funcionalidade: Pagamento de compras usando cupom de desconto de porcentagem.",
    exampleOutput: "# Cenários de Teste: Cupom de Desconto\n- **Cenário 1 (Feliz):** Aplicar cupom ativo de 10% em carrinho de R$ 100,00. Esperado: Valor total ir para R$ 90,00...\n- **Cenário 2 (Erro):** Aplicar cupom expirado..."
  },
  {
    title: "Historias de Usuario",
    difficulty: "Iniciante",
    color: "green",
    category: "Gestao de Produto",
    description: "Histórias de usuário ágeis no padrão padrão de mercado contendo critérios de aceitação específicos.",
    promptText: `# Criador de Historias de Usuario
Você é um Product Owner ágil. Escreva histórias de usuário completas e prontas para o time de engenharia detalhando:
1. **História:** 'Como [Tipo de Usuário], eu quero [Funcionalidade], para que possa [Benefício/Valor]'.
2. **Cenário e Critérios de Aceitação:** Usando a sintaxe Gherkin (Dado que..., Quando..., Então...).`,
    exampleInput: "Funcionalidade: Um botão para exportar faturas de pedidos anteriores em formato Excel para prestação de contas de contabilidade.",
    exampleOutput: "## História de Usuário: Exportação de Faturas em Excel\n**História:**\nComo um analista financeiro corporativo, eu quero exportar a lista de faturas do mês em formato Excel, para que possa conciliar os pagamentos no meu ERP interno sem digitação manual.\n\n**Critérios de Aceite:**\nDado que estou na tela de histórico de faturas...\nQuando clico em 'Exportar Excel'...\nEntão um arquivo contendo as colunas data, id e valor é baixado..."
  },
  {
    title: "Loops de Crescimento",
    difficulty: "Avancado",
    color: "red",
    category: "Gestao de Produto",
    description: "Definição de ciclos de crescimento viral ou por recomendação de produto para aquisição auto-sustentável.",
    promptText: `# Arquitetura de Loop de Crescimento
Crie uma arquitetura de loop de crescimento para o produto fornecido, categorizando-o (ex: Loop Viral de Convite, Loop de Conteúdo UGC ou Loop Financeiro). Detalhe as etapas do ciclo: Entrada de Usuário ➔ Ação de Valor ➔ Geração de Gatilho/Convite ➔ Atração de Novo Usuário.`,
    exampleInput: "Produto: Um editor de infográficos online colaborativo gratuito.",
    exampleOutput: "# Loop de Crescimento: Infográficos Colaborativos\n## Tipo de Loop: Loop Viral de Conteúdo (UGC) + Convite de Colaboração\n1. **Entrada de Usuário:** Cria um infográfico na plataforma...\n2. **Ação de Valor:** Para editar junto com o time, convida colegas por e-mail..."
  },
  {
    title: "Estrategia GTM",
    difficulty: "Avancado",
    color: "red",
    category: "Gestao de Produto",
    description: "Estratégia Go-To-Market contendo canais de aquisição, táticas de vendas e cronograma de lançamento.",
    promptText: `# Estrategia Go-To-Market (GTM)
Gere uma estratégia Go-To-Market abrangente para o produto informado. Cubra: Análise do Problema no Mercado, Posicionamento do Produto, Estratégia de Preço/Pricing, Canais de Distribuição/Aquisição principais (Inbound/Outbound/PLG) e Metas de Lançamento.`,
    exampleInput: "Produto: Software de monitoramento automático de conformidade LGPD para e-commerces de médio porte.",
    exampleOutput: "# Estratégia GTM: LGPD Guard\n## 1. Posicionamento e Proposta de Valor\n'A tranquilidade jurídica que seu e-commerce precisa para vender sem multas, instalada em 5 minutos'..."
  },
  {
    title: "Perfil de Cliente Ideal",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Definição detalhada do Perfil de Cliente Ideal (ICP) com tamanho de empresa, cargos e dores de negócio.",
    promptText: `# Perfil de Cliente Ideal (ICP) Builder
Escreva a ficha de Perfil de Cliente Ideal (ICP) e Buyer Persona para o mercado B2B ou B2C especificado. Inclua: Perfil da Empresa (tamanho, faturamento, setor), Cargos Decisores chaves, Principais Dores e Desafios de Negócio, e como o produto resolve essas dores.`,
    exampleInput: "Produto: Software de gestão automatizada de escala de trabalho para hospitais de grande porte.",
    exampleOutput: "# Perfil de Cliente Ideal (ICP): Hospitais de Grande Porte\n## Perfil Demográfico da Organização\n- **Setor:** Saúde / Hospitais privados e redes filantrópicas...\n- **Tamanho:** Acima de 500 funcionários de escala..."
  },
  {
    title: "Analise de Concorrentes",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Análise competitiva comparando pontos fortes, fracos e proposta de valor dos concorrentes diretos.",
    promptText: `# Analise de Concorrentes Framework
Crie uma matriz de análise competitiva para o produto e seus concorrentes informados. Detalhe: Funcionalidades Principais, Modelo de Negócios, Pontos Fortes, Pontos Fracos e Oportunidade de Diferenciação Estratégica.`,
    exampleInput: "Produto: Nova plataforma de ensino de idiomas focada em conversação diária curta (10min). Concorrentes principais: Duolingo, Cambly.",
    exampleOutput: "# Análise Competitiva: Talky10\n- **Duolingo:** Forte gamificação e grande alcance gratuito, mas fraco na retenção de conversação real...\n- **Cambly:** Aulas reais excelentes, porém custo elevado e sessões longas..."
  },
  {
    title: "Mapa da Jornada do Cliente",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Mapeamento das etapas do cliente, sentimentos, pontos de contato e oportunidades de atrito.",
    promptText: `# Mapa da Jornada do Cliente
Desenhe a jornada do cliente dividida nas etapas clássicas: Consciência (Awareness), Consideração, Decisão, Onboarding, Uso Diário e Recomendação. Para cada etapa, liste: Ações do Usuário, Pontos de Contato, Sentimentos/Dores e Oportunidades de Produto.`,
    exampleInput: "Produto: Seguro auto digital de contratação simplificada pelo celular.",
    exampleOutput: "# Jornada do Cliente: Seguro Auto Simples\n## 1. Consciência (Awareness)\n- **Ações:** Usuário percebe que o seguro atual está caro...\n- **Pontos de Contato:** Anúncio no Instagram...\n- **Sentimento:** Preocupação com custos..."
  },
  {
    title: "Dimensionamento de Mercado",
    difficulty: "Avancado",
    color: "red",
    category: "Gestao de Produto",
    description: "Estimativa de tamanho de mercado usando os conceitos de TAM, SAM e SOM.",
    promptText: `# Dimensionamento de Mercado (TAM, SAM, SOM)
Crie um modelo de estimativa de tamanho de mercado detalhando a lógica passo a passo (abordagem Top-Down ou Bottom-Up) para calcular:
- **TAM (Total Addressable Market):** Mercado Total Disponível.
- **SAM (Serviceable Addressable Market):** Mercado Útil Disponível.
- **SOM (Serviceable Obtainable Market):** Mercado Útil Atingível.`,
    exampleInput: "Mercado: Startup de software para gestão de pet shops em cidades do Sudeste do Brasil.",
    exampleOutput: "# Estimativa de Mercado: Pet Management Software\n## Lógica Bottom-Up\n- **Passo 1 (TAM):** Existem aproximadamente 40.000 pet shops registrados no Brasil...\n- **Passo 2 (SAM):** Focando nos 22.000 localizados na região Sudeste..."
  },
  {
    title: "Canvas de Modelo de Negocio",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Modelagem de negócios estruturada cobrando parceiros chave, custos e fontes de receita.",
    promptText: `# Canvas de Modelo de Negocio Generator
Desenvolva os 9 blocos do Canvas de Modelo de Negocio para a proposta de valor sugerida: Parceiros-Chave, Atividades-Chave, Recursos-Chave, Propostas de Valor, Relacionamento com Clientes, Canais, Segmentos de Clientes, Estrutura de Custos e Fontes de Receita.`,
    exampleInput: "Negócio: Plataforma de aluguel de ferramentas pesadas de construção civil via app (modelo Airbnb).",
    exampleOutput: "# Canvas de Modelo de Negocio: Construshare\n## 1. Proposta de Valor\n- Acesso econômico a maquinário profissional de alta qualidade sem custo de posse...\n## 2. Segmentos de Clientes\n- Pequenas empreiteiras, engenheiros civis autônomos..."
  },
  {
    title: "Visao de Produto",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Definição do norte de longo prazo e posicionamento do produto utilizando frameworks reconhecidos.",
    promptText: `# Visao de Produto Statement
Crie um manifesto e uma declaração de visão de produto usando a fórmula clássica de Moore: 'Para [cliente ideal] que tem [problema], o [nome do produto] é um [categoria do produto] que [benefício principal]. Ao contrário do [concorrente], nós [diferencial competitivo].'`,
    exampleInput: "Produto: Banco de dados em nuvem ultra-simplificado para desenvolvedores solo/no-code.",
    exampleOutput: "# Declaração de Visão de Produto: SimploDB\n**Para** desenvolvedores solo e criadores no-code **que** têm dificuldades com a complexidade e custos de infraestrutura do AWS/GCP, **o** SimploDB **é um** banco de dados em nuvem serverless **que** permite criar e conectar tabelas em menos de 10 segundos..."
  },
  {
    title: "Analise SWOT",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Análise estratégica avaliando Forças, Fraquezas, Oportunidades e Ameaças internas e externas.",
    promptText: `# Analise SWOT (Matriz FOFA)
Realize uma análise SWOT (Forças, Fraquezas, Oportunidades e Ameaças) completa para a empresa ou projeto proposto. Forneça estratégias práticas cruzando: Forças + Oportunidades (Aproveitar) e Fraquezas + Ameaças (Mitigar).`,
    exampleInput: "Empresa: Startup de entrega de medicamentos com drones em áreas de acesso difícil (florestas/interior).",
    exampleOutput: "# Análise SWOT: DronePharma\n- **Forças (Internas):** Tecnologia de drone patenteada de longa autonomia...\n- **Fraquezas (Internas):** Dependência de condições climáticas favoráveis..."
  },
  {
    title: "Canvas de Proposta de Valor",
    difficulty: "Intermediario",
    color: "yellow",
    category: "Gestao de Produto",
    description: "Alinhamento das dores e necessidades dos clientes com os diferenciais e funcionalidades do produto.",
    promptText: `# Canvas de Proposta de Valor Generator
Desenhe o Canvas de Proposta de Valor detalhando:
1. **O Perfil do Cliente:** Tarefas do Cliente (Customer Jobs), Dores (Pains) e Ganhos (Gains).
2. **O Mapa de Valor:** Produtos e Serviços, Aliviadores de Dores (Pain Relievers) e Criadores de Ganhos (Gain Creators).`,
    exampleInput: "Produto: Sistema de cartão de crédito pré-pago para mesada digital de crianças.",
    exampleOutput: "# Canvas de Proposta de Valor: MesadaKids\n## Perfil do Cliente\n- **Tarefas do Cliente:** Dar dinheiro para o filho na escola, controlar gastos semanais...\n- **Dores:** Perda de dinheiro físico pelo filho, falta de visibilidade sobre compras..."
  },
  {
    title: "Especificacao de Vibe Coding",
    difficulty: "Iniciante",
    color: "green",
    category: "Gestao de Produto",
    description: "Template de especificação leve focado em instruir ferramentas de IA a desenvolver microsserviços ou apps simples de forma rápida.",
    promptText: `# Especificacao de Vibe Coding
Escreva uma especificação de código simples e objetiva para que uma IA de desenvolvimento (Cursor, Copilot, etc.) escreva um protótipo de software de forma rápida. Liste as telas principais, o comportamento de interação do usuário, as tecnologias sugeridas e o fluxo de dados simplificado.`,
    exampleInput: "Projeto: Aplicativo web simples de cronômetro de foco Pomodoro com sons relaxantes de fundo (chuva, floresta) feito em HTML e Tailwind CSS de arquivo único.",
    exampleOutput: "# Especificação: Pomodoro Chill WebApp\n- **Tecnologia:** HTML5 e Tailwind CSS carregado via CDN.\n- **Interface:** Layout centralizado minimalista..."
  }
];
