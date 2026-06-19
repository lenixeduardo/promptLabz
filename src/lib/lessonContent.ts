import type { TrackId } from "@/lib/moduleProgress";

export type Question = {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
  hint?: string;
};

// Conteúdo padrão (fallback para módulos sem conteúdo dedicado)
export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "q1",
    prompt: "Qual desses prompts daria o melhor resultado?",
    options: [
      { id: "a", text: "Escreva um texto sobre marketing." },
      { id: "b", text: "Atue como copywriter sênior e escreva um anúncio de Instagram para um curso de IA voltado a designers que querem aprender prompts em 30 dias. Use tom inspirador, máximo 80 palavras." },
      { id: "c", text: "Texto bom para Instagram, urgente." },
    ],
    correct: "b",
    explanation: "Um bom prompt traz persona, contexto, público-alvo e restrições. A opção B faz tudo isso.",
  },
  {
    id: "q2",
    prompt: "Qual técnica ajuda a fixar o formato de saída desejado?",
    options: [
      { id: "a", text: "Cadeia de raciocínio (Chain-of-thought)" },
      { id: "b", text: "Aprendizado com poucos exemplos (Few-shot prompting)" },
      { id: "c", text: "Sem exemplos (Zero-shot)" },
      { id: "d", text: "Ajuste de temperatura (Temperature tuning)" },
    ],
    correct: "b",
    explanation: "Poucos exemplos (Few-shot prompting) fornece pares de entrada e saída, ensinando ao modelo o formato esperado.",
  },
  {
    id: "q3",
    prompt: "Pedir 'aja como um especialista em X' é um exemplo de…",
    options: [
      { id: "a", text: "Poucos exemplos (Few-shot)" },
      { id: "b", text: "Atribuição de papel (Persona / Role prompting)" },
      { id: "c", text: "Cadeia de raciocínio (Chain-of-thought)" },
      { id: "d", text: "Refino iterativo" },
    ],
    correct: "b",
    explanation: "Atribuir um papel (Role) ou persona orienta o tom e a profundidade da resposta do modelo.",
  },
];

// --- Conteúdo dos novos módulos ---

const engenhariaDePrompt: Question[] = [
  {
    id: "ep1",
    prompt: "O que melhor descreve 'Engenharia de Prompt' (Prompt Engineering)?",
    options: [
      { id: "a", text: "Programar a IA em Python para gerar respostas." },
      { id: "b", text: "Projetar instruções para maximizar a qualidade e previsibilidade das respostas do modelo." },
      { id: "c", text: "Treinar um novo modelo do zero." },
    ],
    correct: "b",
    explanation: "Engenharia de prompt (Prompt Engineering) é o design sistemático de instruções — não envolve treinar o modelo, e sim guiá-lo.",
  },
  {
    id: "ep2",
    prompt: "No framework CRAFT (Contexto, Papel, Ação, Formato, Tom — Context, Role, Action, Format, Tone), o 'F' serve para…",
    options: [
      { id: "a", text: "Definir o formato (Format) da resposta — JSON, lista, tabela, parágrafo." },
      { id: "b", text: "Filtrar palavrões." },
      { id: "c", text: "Fixar o nome do modelo usado." },
    ],
    correct: "a",
    explanation: "Formato (Format) especifica como a saída deve ser estruturada — chave para integrar IA em fluxos de trabalho (workflows).",
  },
  {
    id: "ep3",
    prompt: "Qual prática reduz alucinações (hallucinations) em prompts críticos?",
    options: [
      { id: "a", text: "Pedir respostas mais longas." },
      { id: "b", text: "Aumentar a temperatura (temperature) para 1.5." },
      { id: "c", text: "Dar contexto factual no prompt e instruir o modelo a responder 'não sei' quando faltar informação." },
    ],
    correct: "c",
    explanation: "Ancoragem em fatos (Grounding) + permissão explícita de admitir incerteza reduz fortemente a alucinação (hallucination).",
  },
];

const conhecaLLMs: Question[] = [
  {
    id: "llm0",
    prompt: "Antes de tudo: o que é um modelo de linguagem grande (LLM)?",
    options: [
      { id: "a", text: "Um banco de dados que guarda perguntas e respostas prontas." },
      { id: "b", text: "Modelo de Linguagem Grande (Large Language Model) — uma IA treinada em grandes volumes de texto para prever a próxima palavra e gerar respostas em linguagem natural." },
      { id: "c", text: "Um navegador de internet com IA embutida." },
    ],
    correct: "b",
    explanation: "LLM = Modelo de Linguagem Grande (Large Language Model). São modelos como GPT, Claude, Gemini e Qwen, treinados em bilhões de palavras para entender e gerar texto.",
    hint: "L = Large (grande), L = Language (linguagem), M = Model (modelo).",
  },
  {
    id: "llm1",
    prompt: "Qual família de modelo de linguagem (LLM) é desenvolvida pela Anthropic?",
    options: [
      { id: "a", text: "Gemini" },
      { id: "b", text: "Claude" },
      { id: "c", text: "Qwen" },
      { id: "d", text: "MiniMax" },
    ],
    correct: "b",
    explanation: "Claude é a família da Anthropic. Gemini = Google, Qwen = Alibaba, MiniMax = MiniMax (China).",
  },
  {
    id: "llm2",
    prompt: "Qual modelo é especializado em geração de código pela OpenAI?",
    options: [
      { id: "a", text: "GLM" },
      { id: "b", text: "Codex" },
      { id: "c", text: "Gemini Nano" },
    ],
    correct: "b",
    explanation: "Codex é a linha da OpenAI focada em programação, base de produtos como GitHub Copilot e Codex CLI (interface de linha de comando).",
  },
  {
    id: "llm3",
    prompt: "Por que escolher Qwen ou GLM em vez de Claude/GPT em alguns casos?",
    options: [
      { id: "a", text: "São sempre mais inteligentes." },
      { id: "b", text: "São de pesos abertos (open-weights) — você pode rodar localmente, ajustar e usar sem enviar dados a uma API externa." },
      { id: "c", text: "Não têm limite de contexto." },
    ],
    correct: "b",
    explanation: "Qwen (Alibaba) e GLM (Zhipu) liberam os pesos do modelo (open-weights), permitindo execução local, ajuste fino (fine-tuning) e privacidade de dados.",
  },
];

const aplicandoAgents: Question[] = [
  {
    id: "ag0",
    prompt: "Antes de tudo: o que é um agente (Agent) de IA?",
    options: [
      { id: "a", text: "Um humano que vende IA." },
      { id: "b", text: "Um sistema em que um modelo de linguagem (LLM) recebe um objetivo, decide quais ferramentas (tools) usar e executa ações em um laço (loop) até concluir a tarefa." },
      { id: "c", text: "Um servidor onde a IA fica hospedada." },
    ],
    correct: "b",
    explanation: "Agente (Agent) = LLM + ferramentas (tools) + memória + laço de decisão (loop). Ele age, não só responde.",
    hint: "Pense em alguém autônomo executando tarefas para você.",
  },
  {
    id: "ag1",
    prompt: "O que diferencia um agente (Agent) de uma chamada simples a um modelo de linguagem (LLM)?",
    options: [
      { id: "a", text: "O agente roda em GPU, o LLM não." },
      { id: "b", text: "O agente decide quais ferramentas (tools) usar e executa passos em um laço (loop) até atingir um objetivo." },
      { id: "c", text: "Agente é só um nome mais bonito para chatbot." },
    ],
    correct: "b",
    explanation: "Um agente combina LLM + ferramentas (tools) + laço de decisão (loop), escolhendo dinamicamente quais ações tomar.",
  },
  {
    id: "ag2",
    prompt: "Qual componente é essencial para um agente executar ações no mundo real?",
    options: [
      { id: "a", text: "Ferramentas (tools) com esquema (schema) de entrada bem definido." },
      { id: "b", text: "Uma fonte musical." },
      { id: "c", text: "Um banco vetorial obrigatoriamente." },
    ],
    correct: "a",
    explanation: "Ferramentas (tools) são funções tipadas que o agente chama. Sem elas, ele só conversa — não age.",
  },
  {
    id: "ag3",
    prompt: "Por que limitar o número de iterações de um agente?",
    options: [
      { id: "a", text: "Para evitar laços infinitos (loops), custos descontrolados e respostas degradadas." },
      { id: "b", text: "Para deixar o código mais bonito." },
      { id: "c", text: "Não precisa limitar — agentes sempre param sozinhos." },
    ],
    correct: "a",
    explanation: "Condição de parada (stopWhen) e limite máximo de passos (max steps) são proteções (guardrails) críticas: agentes podem entrar em laço (loop) e queimar tokens rapidamente.",
  },
];

const usandoOpenRouter: Question[] = [
  {
    id: "or0",
    prompt: "Antes de tudo: o que é o OpenRouter?",
    options: [
      { id: "a", text: "Um roteador de internet com IA." },
      { id: "b", text: "Um portal de acesso (gateway) que dá acesso a centenas de modelos de linguagem (LLMs) — OpenAI, Anthropic, Google, Meta… — por uma única API compatível com a da OpenAI." },
      { id: "c", text: "Uma versão gratuita do GPT." },
    ],
    correct: "b",
    explanation: "OpenRouter é uma camada única na frente de muitos provedores. Você troca de modelo mudando um parâmetro.",
    hint: "'Open' (aberto) + 'Router' (roteador) = roteador aberto entre vários modelos.",
  },
  {
    id: "or1",
    prompt: "Qual é a principal proposta do OpenRouter?",
    options: [
      { id: "a", text: "Hospedar seu próprio modelo gratuitamente." },
      { id: "b", text: "Acessar centenas de modelos (OpenAI, Anthropic, Google, Meta, etc.) por uma única API compatível." },
      { id: "c", text: "Substituir o Claude e o GPT por um modelo único." },
    ],
    correct: "b",
    explanation: "OpenRouter é um portal de acesso (gateway): uma API, muitos provedores. Você troca de modelo mudando só um parâmetro.",
  },
  {
    id: "or2",
    prompt: "Como o OpenRouter ajuda no controle de custos?",
    options: [
      { id: "a", text: "Você define alternativas automáticas (fallbacks) — ex.: tenta GPT-5; se cair, usa Claude — e compara preços por 1M tokens." },
      { id: "b", text: "Negociando com a sua operadora de internet." },
      { id: "c", text: "Cobra sempre o mesmo preço por requisição." },
    ],
    correct: "a",
    explanation: "Alternativas automáticas (fallbacks), roteamento por preço e painéis (dashboards) de uso permitem otimizar custo sem mudar o código de cada provedor.",
  },
  {
    id: "or3",
    prompt: "Qual padrão de API o OpenRouter expõe?",
    options: [
      { id: "a", text: "GraphQL exclusivo." },
      { id: "b", text: "Compatível com a API da OpenAI (/v1/chat/completions)." },
      { id: "c", text: "Apenas gRPC." },
    ],
    correct: "b",
    explanation: "Por ser compatível com a API da OpenAI (OpenAI-compatible), basta trocar a URL base (baseURL) e a chave de API (API key) — qualquer SDK da OpenAI funciona.",
  },
];

const modelosLocais: Question[] = [
  {
    id: "ml0",
    prompt: "Antes de tudo: o que é um modelo local (Local Model)?",
    options: [
      { id: "a", text: "Um modelo que só funciona no seu país." },
      { id: "b", text: "Um modelo de linguagem (LLM) cujos pesos rodam direto na sua máquina (ou servidor próprio), sem depender de uma API externa." },
      { id: "c", text: "Uma versão paga do ChatGPT." },
    ],
    correct: "b",
    explanation: "Modelo local (Local Model) = você baixa os pesos e roda a inferência localmente (ex.: Ollama, LM Studio). Sem nuvem, sem enviar dados a terceiros.",
    hint: "'Local' = na sua máquina, não na nuvem.",
  },
  {
    id: "ml1",
    prompt: "Qual ferramenta popular roda modelos de linguagem (LLMs) localmente via interface de linha de comando (CLI)?",
    options: [
      { id: "a", text: "Ollama" },
      { id: "b", text: "Photoshop" },
      { id: "c", text: "Notion" },
    ],
    correct: "a",
    explanation: "Ollama (e LM Studio) baixa modelos quantizados (quantized) e expõe uma API local compatível com a da OpenAI.",
  },
  {
    id: "ml2",
    prompt: "Quando faz mais sentido usar modelo local em vez de API na nuvem?",
    options: [
      { id: "a", text: "Quando você precisa de privacidade total, modo desconectado (offline) ou custo previsível em alto volume." },
      { id: "b", text: "Sempre — local é melhor em tudo." },
      { id: "c", text: "Nunca — modelos locais não servem para nada." },
    ],
    correct: "a",
    explanation: "Privacidade, modo desconectado (offline) e custo fixo são os ganhos. A contrapartida é qualidade menor e exigência de hardware.",
  },
  {
    id: "ml3",
    prompt: "O que significa 'quantização' (quantization) de um modelo — ex.: Q4_K_M?",
    options: [
      { id: "a", text: "Reduzir a precisão dos pesos para caber em menos memória RAM/VRAM, com leve perda de qualidade." },
      { id: "b", text: "Treinar o modelo em computação quântica (quantum computing)." },
      { id: "c", text: "Limitar o número de tokens (unidades de texto) de saída." },
    ],
    correct: "a",
    explanation: "Quantização (quantization) comprime os pesos (de 16 bits para 4/5/8 bits), permitindo rodar modelos grandes em hardware modesto.",
  },
];

const claudeCodePratica: Question[] = [
  {
    id: "cc1",
    prompt: "O que é o Claude Code?",
    options: [
      { id: "a", text: "Um modelo de Claude exclusivo para programar — sem interface." },
      { id: "b", text: "Uma interface de linha de comando (CLI) agente da Anthropic que edita arquivos, roda comandos e mantém contexto do seu projeto." },
      { id: "c", text: "Uma extensão do VS Code para colorir código." },
    ],
    correct: "b",
    explanation: "Claude Code é uma ferramenta de linha de comando (CLI) que opera como agente (Agent) dentro do seu repositório.",
  },
  {
    id: "cc2",
    prompt: "Para que serve o arquivo CLAUDE.md na raiz de um projeto?",
    options: [
      { id: "a", text: "Documentar a licença do projeto." },
      { id: "b", text: "Dar contexto persistente ao Claude Code: convenções, scripts, regras do repositório." },
      { id: "c", text: "Configurar o Git." },
    ],
    correct: "b",
    explanation: "CLAUDE.md é lido automaticamente em cada sessão — é como um prompt de sistema (system prompt) do seu projeto.",
  },
  {
    id: "cc3",
    prompt: "Qual prática melhora resultados com Claude Code em tarefas grandes?",
    options: [
      { id: "a", text: "Pedir tudo em um único prompt enorme." },
      { id: "b", text: "Quebrar em etapas, revisar as alterações propostas (diffs) e usar /clear entre tarefas independentes." },
      { id: "c", text: "Desabilitar todas as ferramentas (tools)." },
    ],
    correct: "b",
    explanation: "Sessões enxutas, etapas pequenas e revisão das alterações propostas (diff) dão muito mais qualidade do que prompts monolíticos.",
  },
];

const skillsClaudeCode: Question[] = [
  {
    id: "sk1",
    prompt: "O que é uma habilidade (Skill) no Claude Code?",
    options: [
      { id: "a", text: "Um plugin pago da Anthropic." },
      { id: "b", text: "Um pacote de instruções + arquivos auxiliares que o Claude carrega quando a tarefa combina com sua descrição (description)." },
      { id: "c", text: "Um atalho de teclado." },
    ],
    correct: "b",
    explanation: "Habilidades (Skills) são conhecimento procedural reutilizável — uma pasta com SKILL.md + recursos opcionais.",
  },
  {
    id: "sk2",
    prompt: "Qual campo do SKILL.md é mais importante para o Claude decidir quando ativá-la?",
    options: [
      { id: "a", text: "version (versão)" },
      { id: "b", text: "description (descrição) — é usada na correspondência de relevância contra o pedido do usuário." },
      { id: "c", text: "author (autor)" },
    ],
    correct: "b",
    explanation: "A descrição (description) é o gancho de recuperação (retrieval). Uma descrição vaga = habilidade (skill) nunca ativada.",
  },
  {
    id: "sk3",
    prompt: "Onde uma habilidade (Skill) ativa do projeto fica armazenada?",
    options: [
      { id: "a", text: "Em .workspace/skills/<nome>/ (após ser aplicada a partir do rascunho)." },
      { id: "b", text: "Em node_modules." },
      { id: "c", text: "No bucket do Lovable Cloud." },
    ],
    correct: "a",
    explanation: "Rascunhos (drafts) vivem em .agents/skills/ e, depois de aplicados, viram habilidades (skills) ativas em .workspace/skills/.",
  },
];


const personalizarTemplates: Question[] = [
  {
    id: "tp0",
    prompt: "Antes de tudo: o que é um modelo de prompt (Template)?",
    options: [
      { id: "a", text: "Um tema visual do site." },
      { id: "b", text: "Um modelo de prompt (Template), com partes fixas e variáveis (ex.: {{publico}}, {{tom}}), que pode ser reutilizado em vários casos." },
      { id: "c", text: "Uma resposta pronta da IA, sem precisar de prompt." },
    ],
    correct: "b",
    explanation: "Modelo (Template) = prompt parametrizado. Você troca as variáveis e reutiliza a mesma estrutura em vários contextos.",
    hint: "Pense em um molde com lacunas para preencher.",
  },
  {
    id: "tp1",
    prompt: "Qual é a primeira coisa a fazer ao adotar um modelo (template) pronto?",
    options: [
      { id: "a", text: "Renomear todas as variáveis aleatoriamente." },
      { id: "b", text: "Ler o template inteiro, mapear variáveis de entrada e identificar o que é fixo vs. configurável." },
      { id: "c", text: "Apagar os comentários." },
    ],
    correct: "b",
    explanation: "Entender variáveis e blocos configuráveis evita quebrar o modelo (template) ao customizar.",
  },
  {
    id: "tp2",
    prompt: "Como manter a manutenibilidade ao customizar um modelo (template)?",
    options: [
      { id: "a", text: "Bifurcar (fork), parametrizar as partes que mudam por projeto e versionar suas variações." },
      { id: "b", text: "Reescrever cada vez do zero." },
      { id: "c", text: "Fixar tudo no código (hardcode)." },
    ],
    correct: "a",
    explanation: "Bifurcação (fork) + parametrização + versionamento dá reuso real. Fixar no código (hardcode) mata a vantagem do modelo (template).",
  },
  {
    id: "tp3",
    prompt: "Ao adaptar um modelo (template) de prompt, qual erro é mais comum?",
    options: [
      { id: "a", text: "Remover instruções de formato ou proteções (guardrails) sem entender por que estavam ali." },
      { id: "b", text: "Manter as variáveis originais." },
      { id: "c", text: "Testar antes de publicar." },
    ],
    correct: "a",
    explanation: "Restrições e formatos no modelo (template) foram colocados por algum motivo — remover às cegas degrada o resultado.",
  },
];


const apiKeyBasico: Question[] = [
  {
    id: "ak0",
    prompt: "Antes de tudo: o que é uma chave de API (API key)?",
    options: [
      { id: "a", text: "Uma senha pública que qualquer pessoa pode ver." },
      { id: "b", text: "Uma credencial secreta (string) que identifica e autoriza seu aplicativo a chamar uma API — funciona como uma combinação de login + senha do app." },
      { id: "c", text: "O endereço (URL) da API." },
    ],
    correct: "b",
    explanation: "Chave de API (API key) é um segredo que prova ao serviço quem está chamando. Se vazar, qualquer um pode usar a sua conta e gerar custo.",
    hint: "Pense em uma senha que o seu app usa para se identificar no serviço.",
  },
  {
    id: "ak1",
    prompt: "Onde uma chave de API (API key) NUNCA deve ficar?",
    options: [
      { id: "a", text: "Em variáveis de ambiente (.env) do servidor." },
      { id: "b", text: "Em um gerenciador de segredos (Secrets Manager / Vault)." },
      { id: "c", text: "No código do front-end (browser) ou commitada no Git público." },
    ],
    correct: "c",
    explanation: "Qualquer coisa que vai para o navegador é pública. Chaves secretas ficam no servidor, em variáveis de ambiente ou em um cofre de segredos.",
  },
  {
    id: "ak2",
    prompt: "Sua chave de API vazou em um repositório público. Qual a primeira ação?",
    options: [
      { id: "a", text: "Rotacionar (revogar e gerar uma nova) imediatamente no painel do provedor." },
      { id: "b", text: "Apenas apagar o commit — o histórico do Git resolve." },
      { id: "c", text: "Esperar para ver se alguém usa." },
    ],
    correct: "a",
    explanation: "Rotação (rotate) é obrigatória: o histórico do Git mantém o segredo mesmo após o delete. Revogue, gere outra e atualize seus segredos.",
  },
];

const migrationsBasico: Question[] = [
  {
    id: "mg0",
    prompt: "Antes de tudo: o que é uma migration (migração de banco)?",
    options: [
      { id: "a", text: "Mudar o servidor de banco de uma máquina para outra." },
      { id: "b", text: "Um arquivo versionado com instruções SQL que evolui o esquema do banco (criar tabela, adicionar coluna, alterar tipo) de forma reproduzível." },
      { id: "c", text: "Fazer backup do banco." },
    ],
    correct: "b",
    explanation: "Migration = código versionado que descreve uma mudança no banco. Roda em ordem, é registrada, e qualquer ambiente (dev, prod) chega ao mesmo estado.",
    hint: "Pense em commits do Git, mas aplicados ao schema do banco.",
  },
  {
    id: "mg1",
    prompt: "Por que usar migrations em vez de alterar o banco direto pelo painel?",
    options: [
      { id: "a", text: "Migrations dão histórico, revisão por pares (PR) e reprodutibilidade entre ambientes (dev, staging, prod)." },
      { id: "b", text: "São mais bonitas visualmente." },
      { id: "c", text: "Não precisam de SQL." },
    ],
    correct: "a",
    explanation: "Mudanças pelo painel ('cliques no dashboard') não ficam versionadas — outro dev não consegue reproduzir. Migrations resolvem isso.",
  },
  {
    id: "mg2",
    prompt: "Qual é uma boa prática para alimentar (seed) dados iniciais no banco?",
    options: [
      { id: "a", text: "Inserir manualmente em produção e torcer para não esquecer." },
      { id: "b", text: "Criar uma migration de seed com INSERTs idempotentes (ex.: ON CONFLICT DO NOTHING) para popular categorias, papéis e dados de demonstração." },
      { id: "c", text: "Salvar um JSON no front e fingir que é banco." },
    ],
    correct: "b",
    explanation: "Migrations de seed idempotentes garantem que dados de catálogo/demo existam em todo ambiente, sem duplicar quando rodadas de novo.",
  },
];

const healthCheckBasico: Question[] = [
  {
    id: "hc0",
    prompt: "Antes de tudo: o que é um health check?",
    options: [
      { id: "a", text: "Um exame médico do desenvolvedor." },
      { id: "b", text: "Um endpoint (ex.: GET /health) que responde rapidamente dizendo se o serviço — e suas dependências (banco, fila, cache) — estão saudáveis." },
      { id: "c", text: "Um relatório financeiro do projeto." },
    ],
    correct: "b",
    explanation: "Health check = sinal de vida do serviço. Usado por balanceadores, monitoramento (uptime) e orquestradores para decidir se o app está apto a receber tráfego.",
    hint: "Pense em um 'tá vivo?' que retorna 200 OK quando tudo está bem.",
  },
  {
    id: "hc1",
    prompt: "Qual a diferença entre liveness e readiness?",
    options: [
      { id: "a", text: "São a mesma coisa." },
      { id: "b", text: "Liveness = o processo está vivo? Readiness = está pronto para receber tráfego (dependências OK)?" },
      { id: "c", text: "Liveness mede CPU; readiness mede memória." },
    ],
    correct: "b",
    explanation: "Liveness reinicia o app se travar. Readiness tira do balanceador quando o banco/cache cai, sem matar o processo.",
  },
  {
    id: "hc2",
    prompt: "O que um health check de banco deve verificar — sem custar caro?",
    options: [
      { id: "a", text: "Rodar SELECT * em todas as tabelas." },
      { id: "b", text: "Executar uma consulta leve (ex.: SELECT 1) com timeout curto e checar latência da conexão." },
      { id: "c", text: "Apenas checar se a porta TCP está aberta." },
    ],
    correct: "b",
    explanation: "SELECT 1 com timeout prova que o pool de conexões funciona e o banco responde — sem gerar carga. Só TCP aberto não garante que o banco responde queries.",
  },
];

const cronJobsBasico: Question[] = [
  {
    id: "cj0",
    prompt: "Antes de tudo: o que é um cron job?",
    options: [
      { id: "a", text: "Um cargo de emprego em TI." },
      { id: "b", text: "Uma tarefa agendada que roda automaticamente em horários definidos por uma expressão cron (ex.: '0 * * * *' = de hora em hora)." },
      { id: "c", text: "Um tipo de banco de dados." },
    ],
    correct: "b",
    explanation: "Cron job = automação por agendamento. Você descreve a frequência com 5 campos (min hora dia mês dia-semana) e o sistema dispara sua tarefa.",
    hint: "Pense em um despertador que executa código em vez de tocar.",
  },
  {
    id: "cj1",
    prompt: "O que a expressão '0 9 * * 1' significa?",
    options: [
      { id: "a", text: "A cada 9 minutos." },
      { id: "b", text: "Toda segunda-feira às 09:00." },
      { id: "c", text: "Dia 9 de cada mês à meia-noite." },
    ],
    correct: "b",
    explanation: "Os campos são: minuto(0) hora(9) dia-do-mês(*) mês(*) dia-da-semana(1=segunda). Logo: segunda 09:00.",
  },
  {
    id: "cj2",
    prompt: "Qual prática evita problemas com cron jobs em produção?",
    options: [
      { id: "a", text: "Tornar a tarefa idempotente, registrar logs com horário e usar lock para impedir execuções sobrepostas." },
      { id: "b", text: "Rodar a cada segundo sem monitoramento." },
      { id: "c", text: "Confiar que nunca vai falhar." },
    ],
    correct: "a",
    explanation: "Idempotência (rodar duas vezes não estraga dados), logs e locks (mutex) são essenciais — jobs podem atrasar, sobrepor ou repetir.",
  },
];

const nodeBasico: Question[] = [
  {
    id: "nb0",
    prompt: "Antes de tudo: o que é o Node.js?",
    options: [
      { id: "a", text: "Um framework para construir sites bonitos." },
      { id: "b", text: "Um ambiente de execução que permite rodar JavaScript fora do navegador — no servidor, no terminal e em ferramentas de linha de comando." },
      { id: "c", text: "Um banco de dados NoSQL." },
    ],
    correct: "b",
    explanation: "Node.js é um runtime (ambiente de execução) baseado no motor V8 do Chrome. Ele executa JavaScript no servidor, possibilitando APIs, automações e scripts de CLI.",
    hint: "Pense no Node.js como o 'motor' que faz JavaScript funcionar fora do navegador.",
  },
  {
    id: "nb1",
    prompt: "Para que o Node.js é mais usado no mundo real?",
    options: [
      { id: "a", text: "Editar imagens e vídeos." },
      { id: "b", text: "Criar servidores web, APIs REST, ferramentas de linha de comando (CLI) e automações de build." },
      { id: "c", text: "Desenhar interfaces gráficas (GUI) apenas." },
    ],
    correct: "b",
    explanation: "Node.js brilha em I/O assíncrono: servidores HTTP, APIs, WebSockets, scripts de build (Vite, Webpack) e CLIs (linha de comando).",
  },
  {
    id: "nb2",
    prompt: "O que significa 'runtime' no contexto do Node.js?",
    options: [
      { id: "a", text: "Um tipo de banco de dados rápido." },
      { id: "b", text: "O ambiente que executa o código — interpreta, compila e roda o JavaScript, fornecendo APIs como fs, http e path." },
      { id: "c", text: "Um plugin do VS Code." },
    ],
    correct: "b",
    explanation: "Runtime = motor de execução. O Node.js fornece o V8 (compilação) + libuv (event loop) + APIs nativas (fs, net, http) para JavaScript funcionar no servidor.",
  },
];

const gitBashBasico: Question[] = [
  {
    id: "gb0",
    prompt: "Antes de tudo: o que é o Git Bash?",
    options: [
      { id: "a", text: "Um jogo de terminal para aprender comandos." },
      { id: "b", text: "Um terminal para Windows que traz comandos do Linux/Unix (ls, pwd, grep) junto com o Git — permite versionar código e navegar no sistema como em um terminal Unix." },
      { id: "c", text: "Um editor de texto avançado." },
    ],
    correct: "b",
    explanation: "Git Bash é o terminal que acompanha o Git for Windows. Ele emula um ambiente Unix no Windows, dando acesso a comandos do Linux e a todos os comandos do Git.",
    hint: "'Bash' é o shell padrão do Linux — o Git Bash traz esse poder para o Windows.",
  },
  {
    id: "gb1",
    prompt: "Qual comando do Git Bash cria uma cópia local de um repositório remoto?",
    options: [
      { id: "a", text: "git copy" },
      { id: "b", text: "git clone <url>" },
      { id: "c", text: "git download" },
    ],
    correct: "b",
    explanation: "git clone baixa o repositório inteiro, incluindo histórico de commits e branches, criando uma cópia funcional na sua máquina.",
  },
  {
    id: "gb2",
    prompt: "Qual a diferença entre 'git add', 'git commit' e 'git push'?",
    options: [
      { id: "a", text: "Não há diferença — fazem a mesma coisa." },
      { id: "b", text: "git add prepara arquivos para commit; git commit salva a alteração no histórico local; git push envia para o repositório remoto." },
      { id: "c", text: "git add cria um branch; git commit faz merge; git push deleta arquivos." },
    ],
    correct: "b",
    explanation: "Fluxo Git: add (stage) → commit (salvar no histórico local) → push (sincronizar com remoto). É como embalar, fotografar e enviar.",
  },
];

const npmBasico: Question[] = [
  {
    id: "npm0",
    prompt: "Antes de tudo: o que é npm?",
    options: [
      { id: "a", text: "Um serviço de streaming de música." },
      { id: "b", text: "Node Package Manager — o gerenciador de pacotes do Node.js que instala, atualiza e remove bibliotecas e ferramentas." },
      { id: "c", text: "Um protocolo de internet novo." },
    ],
    correct: "b",
    explanation: "npm (Node Package Manager) é o gerenciador oficial de pacotes do Node.js. Ele lê o package.json, baixa dependências para node_modules e executa scripts.",
    hint: "npm install = 'instalar tudo que o projeto precisa'.",
  },
  {
    id: "npm1",
    prompt: "Qual comando instala todas as dependências listadas no package.json?",
    options: [
      { id: "a", text: "npm start" },
      { id: "b", text: "npm install" },
      { id: "c", text: "npm build" },
    ],
    correct: "b",
    explanation: "npm install (ou npm i) lê o package.json, resolve versões compatíveis e baixa tudo para a pasta node_modules. É o primeiro comando ao clonar um projeto.",
  },
  {
    id: "npm2",
    prompt: "O que faz o comando 'npm run dev' em um projeto típico?",
    options: [
      { id: "a", text: "Instala pacotes de desenvolvimento." },
      { id: "b", text: "Executa o script chamado 'dev' no package.json — geralmente inicia um servidor local de desenvolvimento com hot-reload." },
      { id: "c", text: "Compila o projeto para produção." },
    ],
    correct: "b",
    explanation: "npm run <script> executa qualquer script definido no package.json. 'dev' geralmente sobe um servidor local (ex.: Vite em localhost:5173) com recarregamento automático.",
  },
];

const skillsLLMBasico: Question[] = [
  {
    id: "skllm0",
    prompt: "Antes de tudo: o que são skills (habilidades) em LLMs?",
    options: [
      { id: "a", text: "Pacotes de software que se instalam via npm no modelo." },
      { id: "b", text: "Conjuntos de instruções, exemplos e diretrizes que ensinam o modelo de IA a executar uma tarefa específica com qualidade e consistência." },
      { id: "c", text: "Atalhos de teclado dentro do chat." },
    ],
    correct: "b",
    explanation: "Skills em LLMs são 'super prompts' — instruções estruturadas, exemplos few-shot e regras que transformam o modelo em um especialista em uma tarefa específica. Não são código instalável; são conhecimento textual.",
    hint: "Pense em skills como um 'manual de instruções' que você dá à IA para ela se comportar de forma especializada.",
  },
  {
    id: "skllm1",
    prompt: "Qual é a diferença entre uma 'skill' e um 'prompt' comum?",
    options: [
      { id: "a", text: "Não há diferença — são a mesma coisa." },
      { id: "b", text: "Uma skill é um prompt sistemático e reutilizável, com estrutura, exemplos e proteções (guardrails), enquanto um prompt comum é uma pergunta isolada." },
      { id: "c", text: "Skills só funcionam no ChatGPT pago." },
    ],
    correct: "b",
    explanation: "Prompt = pergunta pontual. Skill = sistema completo: persona, regras, exemplos de entrada/saída, formato e proteções (guardrails). Skills são projetadas para serem reutilizáveis e consistentes.",
  },
  {
    id: "skllm2",
    prompt: "Como você 'instala' ou usa uma skill em uma LLM?",
    options: [
      { id: "a", text: "Executa 'npm install skill-name' no terminal." },
      { id: "b", text: "Copia o conteúdo da skill (instruções + exemplos) para o contexto do chat, system prompt ou arquivo de configuração da ferramenta que usa a LLM." },
      { id: "c", text: "Faz download de um arquivo .exe." },
    ],
    correct: "b",
    explanation: "Skills não são instaladas como software. Você as 'carrega' no contexto: cola no system prompt, importa como arquivo no Claude Code (.claude/skills/), ou carrega em ferramentas como Cursor, n8n e Lovable que suportam instruções personalizadas.",
  },
];


// Conteúdo por trilha → módulo (índice). Falta → DEFAULT_QUESTIONS.
export const LESSONS: Record<TrackId, Question[][]> = {
  a1: [],
  a2: [
    [], [], [], [], [], [], [], // 0..6 (módulos antigos → fallback)
    engenhariaDePrompt,           // 7
    conhecaLLMs,                  // 8
  ],
  a3: [
    [], [], [], [], [], [], [], // 0..6 (módulos antigos → fallback)
    aplicandoAgents,              // 7
    usandoOpenRouter,             // 8
    modelosLocais,                // 9
    claudeCodePratica,            // 10
    skillsClaudeCode,             // 11
    personalizarTemplates,        // 12
    apiKeyBasico,                 // 13
    migrationsBasico,             // 14
    healthCheckBasico,            // 15
    cronJobsBasico,               // 16
    nodeBasico,                   // 17
    gitBashBasico,                // 18
    npmBasico,                    // 19
    skillsLLMBasico,              // 20
  ],
};

export function getQuestions(track: TrackId, moduleIndex: number): Question[] {
  const set = LESSONS[track]?.[moduleIndex];
  return set && set.length > 0 ? set : DEFAULT_QUESTIONS;
}

// Total de módulos por trilha (sincronizado com TRACKS em learn.tsx)
export const TRACK_TOTALS: Record<TrackId, number> = {
  a1: 7,
  a2: 9,
  a3: 21,
};

// --- Tarefa prática (envio de print) ---
// Módulos em que a aula exige uma comprovação visual (screenshot) além do quiz.
export type ProofTask = {
  title: string;
  description: string;
  examples: string[];
};

export const PROOF_TASKS: Partial<Record<TrackId, Record<number, ProofTask>>> = {
  a3: {
    7: {
      title: "Mostre um agente (Agent) em ação",
      description:
        "Envie um print de um agente (Agent) executando uma tarefa real (Claude Code, Cursor, ChatGPT Agents, Lovable, n8n etc.) — algo que mostre o agente decidindo passos ou chamando uma ferramenta (tool).",
      examples: [
        "Terminal do Claude Code rodando um plano",
        "Registro (log) do n8n com nós (nodes) de IA",
        "Tela do Cursor em modo Agente (Agent)",
      ],
    },
    8: {
      title: "Sua chamada via OpenRouter",
      description:
        "Envie um print do OpenRouter — Área de testes (Playground), Atividade (Activity), página de Modelos (Models) — ou do código fazendo uma requisição para openrouter.ai/api.",
      examples: [
        "Área de testes (Playground) respondendo",
        "Painel (dashboard) de uso",
        "Trecho de código com URL base (baseURL) openrouter.ai",
      ],
    },
    9: {
      title: "Seu modelo local (Local Model) rodando",
      description:
        "Envie um print de um modelo de linguagem (LLM) respondendo localmente — Ollama, LM Studio, llama.cpp, Jan, GPT4All ou similar.",
      examples: [
        "Saída de `ollama run llama3`",
        "LM Studio com chat respondendo",
        "Terminal mostrando o modelo carregado",
      ],
    },
    10: {
      title: "Claude Code em execução",
      description:
        "Envie um print do Claude Code rodando no seu terminal — pode ser iniciando uma sessão, executando /init, propondo alterações (diff) ou completando uma tarefa.",
      examples: [
        "Tela de boas-vindas do Claude Code",
        "Alterações propostas (diff) antes de aceitar",
        "Conclusão de uma tarefa",
      ],
    },
    11: {
      title: "Uma habilidade (Skill) instalada no Claude Code",
      description:
        "Envie um print mostrando uma habilidade (Skill) instalada/ativada — pode ser a saída do comando que ativa a skill, a estrutura de pastas .claude/skills ou .workspace/skills, ou o Claude usando a skill em uma resposta.",
      examples: [
        "Listagem de .claude/skills/",
        "Mensagem 'Used the X skill' (Habilidade X usada)",
        "SKILL.md aberto no editor",
      ],
    },
    12: {
      title: "Modelo (Template) personalizado por você",
      description:
        "Envie um print do modelo (Template) antes/depois da sua personalização — variáveis trocadas, blocos adaptados ao seu caso — ou da IA respondendo com o template customizado.",
      examples: [
        "Diferenças (diff) do template antes/depois",
        "Prompt final no ChatGPT/Claude",
        "Variáveis preenchidas para o seu cenário",
      ],
    },
  },
};

export function getProofTask(track: TrackId, moduleIndex: number): ProofTask | null {
  return PROOF_TASKS[track]?.[moduleIndex] ?? null;
}

