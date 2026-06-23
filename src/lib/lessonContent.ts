import type { TrackId } from "@/lib/moduleProgress";

// ── Tipos de atividade ─────────────────────────────────────────────────

export type ActivityType = "multiple-choice" | "fill-blank" | "match" | "order" | "essay";

/** Questão dissertativa — resposta livre com gabarito de referência */
export type EssayActivity = {
  id: string;
  type: "essay";
  prompt: string;
  placeholder?: string;
  referenceAnswer: string;
};

/** Multiple choice (existente) */
export type Question = {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
  hint?: string;
};

/** Completar frase — lacuna {___} com opções de palavra */
export type FillBlankActivity = {
  id: string;
  type: "fill-blank";
  sentence: string;           // frase com {___} para lacuna
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
  hint?: string;
};

/** Ligar palavra → significado */
export type MatchActivity = {
  id: string;
  type: "match";
  instruction: string;
  pairs: { word: string; definition: string }[];
  correctPairs: Record<string, string>;
  explanation: string;
};

/** Conectar itens entre duas colunas */
export type OrderActivity = {
  id: string;
  type: "order";
  instruction: string;
  leftItems: { id: string; text: string }[];
  rightItems: { id: string; text: string }[];
  correctPairs: Record<string, string>;  // leftId → rightId
  explanation: string;
};

export type LessonActivity = Question | FillBlankActivity | MatchActivity | OrderActivity | EssayActivity;

// ── Guards ─────────────────────────────────────────────────────────────
export function isFillBlank(a: LessonActivity): a is FillBlankActivity {
  return (a as FillBlankActivity).type === "fill-blank";
}
export function isMatch(a: LessonActivity): a is MatchActivity {
  return (a as MatchActivity).type === "match";
}
export function isOrder(a: LessonActivity): a is OrderActivity {
  return (a as OrderActivity).type === "order";
}
export function isEssay(a: LessonActivity): a is EssayActivity {
  return (a as EssayActivity).type === "essay";
}
// ── Atividades dos novos tipos ─────────────────────────────────────────

const apiKeyFillBlank: LessonActivity[] = [
  {
    id: "ak-fill-1",
    type: "fill-blank",
    sentence: "Uma {___} é uma credencial secreta que identifica seu aplicativo ao chamar um serviço externo.",
    options: [
      { id: "a", text: "chave de API" },
      { id: "b", text: "token JWT" },
      { id: "c", text: "hash de senha" },
    ],
    correct: "a",
    explanation: "Chave de API (API key) é o segredo que prova ao servidor quem está chamando. JWT é um formato de token, hash é unidirecional.",
  },
  {
    id: "ak-fill-2",
    type: "fill-blank",
    sentence: "Quando sua chave de API vaza, a primeira ação deve ser {___} a chave no painel do provedor.",
    options: [
      { id: "a", text: "rotacionar (revogar e gerar nova)" },
      { id: "b", text: "apenas apagar o commit" },
      { id: "c", text: "esperar para ver se alguém usa" },
    ],
    correct: "a",
    explanation: "Rotação (rotate) é obrigatória: o histórico do Git mantém o segredo mesmo após o delete. Revogue, gere outra e atualize seus segredos.",
  },
]

const llmMatch: LessonActivity[] = [
  {
    id: "llm-match-1",
    type: "match",
    instruction: "Ligue cada modelo de linguagem à sua empresa criadora:",
    pairs: [
      { word: "Claude", definition: "Anthropic" },
      { word: "GPT-4", definition: "OpenAI" },
      { word: "Gemini", definition: "Google" },
      { word: "Qwen", definition: "Alibaba" },
    ],
    correctPairs: { "Claude": "Anthropic", "GPT-4": "OpenAI", "Gemini": "Google", "Qwen": "Alibaba" },
    explanation: "Cada modelo é desenvolvido por uma organização diferente. Claude = Anthropic, GPT = OpenAI, Gemini = Google, Qwen = Alibaba.",
  },
]

const gitOrder: LessonActivity[] = [
  {
    id: "gb-order-1",
    type: "order",
    instruction: "Conecte cada comando Git à sua função correspondente:",
    leftItems: [
      { id: "a", text: "git add" },
      { id: "b", text: "git commit" },
      { id: "c", text: "git push" },
      { id: "d", text: "git clone" },
    ],
    rightItems: [
      { id: "w", text: "Prepara arquivos para o commit" },
      { id: "x", text: "Salva alterações no histórico local" },
      { id: "y", text: "Envia commits para o repositório remoto" },
      { id: "z", text: "Faz cópia local de um repositório remoto" },
    ],
    correctPairs: { a: "w", b: "x", c: "y", d: "z" },
    explanation: "Fluxo Git: clone (baixar) → add (preparar) → commit (salvar local) → push (enviar remoto).",
  },
]

const cronMatch: LessonActivity[] = [
  {
    id: "cj-match-1",
    type: "match",
    instruction: "Ligue cada expressão cron ao seu significado:",
    pairs: [
      { word: "0 9 * * 1", definition: "Toda segunda às 09:00" },
      { word: "*/15 * * * *", definition: "A cada 15 minutos" },
      { word: "0 0 * * *", definition: "Todo dia à meia-noite" },
      { word: "0 0 1 * *", definition: "Primeiro dia de cada mês" },
    ],
    correctPairs: { "0 9 * * 1": "Toda segunda às 09:00", "*/15 * * * *": "A cada 15 minutos", "0 0 * * *": "Todo dia à meia-noite", "0 0 1 * *": "Primeiro dia de cada mês" },
    explanation: "Os 5 campos do cron são: minuto, hora, dia-do-mês, mês, dia-da-semana. * = qualquer valor, */N = a cada N.",
  },
]

const healthOrder: LessonActivity[] = [
  {
    id: "hc-order-1",
    type: "order",
    instruction: "Conecte cada conceito de health check à sua descrição:",
    leftItems: [
      { id: "a", text: "Liveness" },
      { id: "b", text: "Readiness" },
      { id: "c", text: "SELECT 1" },
    ],
    rightItems: [
      { id: "x", text: "Verifica se o processo está vivo" },
      { id: "y", text: "Verifica se está pronto para receber tráfego" },
      { id: "z", text: "Consulta leve para testar o banco de dados" },
    ],
    correctPairs: { a: "x", b: "y", c: "z" },
    explanation: "Liveness reinicia o app se travar. Readiness tira do balanceador. SELECT 1 testa o banco sem gerar carga.",
  },
]

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


// ── A1 — Fundamentos de Prompts ───────────────────────────────────────────

const a1Boas_vindas: Question[] = [
  {
    id: "a1bv0",
    prompt: "O que é o PromptLabz?",
    options: [
      { id: "a", text: "Uma plataforma para treinar modelos de IA do zero." },
      { id: "b", text: "Uma trilha de aprendizado prática para você dominar a arte de escrever prompts e usar IA com eficiência." },
      { id: "c", text: "Um substituto para o ChatGPT." },
    ],
    correct: "b",
    explanation: "PromptLabz é um curso prático em formato de trilha. Você aprende prompts — desde o básico até aplicações profissionais — com atividades, exemplos reais e desafios.",
  },
  {
    id: "a1bv1",
    prompt: "Qual é a habilidade central que você vai desenvolver nesta trilha?",
    options: [
      { id: "a", text: "Programar modelos de linguagem (LLMs) em Python." },
      { id: "b", text: "Escrever prompts claros, específicos e eficazes para obter respostas de qualidade da IA." },
      { id: "c", text: "Criar apresentações de slides com IA." },
    ],
    correct: "b",
    explanation: "Engenharia de prompt (Prompt Engineering) é a habilidade de comunicar intenções com clareza para a IA. Pequenas mudanças no prompt geram grandes diferenças no resultado.",
    hint: "Pense em prompt como a instrução que você dá à IA.",
  },
  {
    id: "a1bv2",
    prompt: "Por que aprender a escrever bons prompts é valioso?",
    options: [
      { id: "a", text: "Porque a IA não funciona sem prompts perfeitos." },
      { id: "b", text: "Porque prompts bem escritos multiplicam sua produtividade — você consegue resultados melhores, mais rápido, sem precisar saber programar." },
      { id: "c", text: "Porque a maioria dos modelos de IA cobra por palavra no prompt." },
    ],
    correct: "b",
    explanation: "Um bom prompt é a diferença entre uma resposta genérica e uma resposta que resolve seu problema real. É a habilidade mais acessível e de maior retorno para usar IA no dia a dia.",
  },
];

const a1OQueEPrompt: Question[] = [
  {
    id: "a1oqp0",
    prompt: "O que é um prompt em IA?",
    options: [
      { id: "a", text: "O botão 'Enviar' no chat." },
      { id: "b", text: "A instrução, pergunta ou texto que você envia para um modelo de linguagem (LLM) para obter uma resposta." },
      { id: "c", text: "O nome do servidor onde a IA roda." },
    ],
    correct: "b",
    explanation: "Prompt é a sua entrada (input) para o modelo. Pode ser uma pergunta, um comando, um trecho de texto para continuar — qualquer coisa que você envia para a IA processar.",
    hint: "É o que você 'digita' para a IA.",
  },
  {
    id: "a1oqp1",
    prompt: "Qual destes é um exemplo de prompt ruim?",
    options: [
      { id: "a", text: "\"Resuma em 3 pontos os benefícios de beber água para adultos sedentários.\"" },
      { id: "b", text: "\"Me conta algo.\"" },
      { id: "c", text: "\"Liste 5 estratégias de marketing para um restaurante italiano delivery no bairro do Itaim Bibi.\"" },
    ],
    correct: "b",
    explanation: "\"Me conta algo\" é vago demais. Sem contexto ou objetivo, a IA vai gerar algo aleatório e inútil. Bons prompts têm objetivo claro e contexto suficiente.",
  },
  {
    id: "a1oqp2",
    prompt: "O que torna um prompt eficaz?",
    options: [
      { id: "a", text: "Usar palavras em maiúsculas para dar ênfase." },
      { id: "b", text: "Ser longo — quanto maior, melhor." },
      { id: "c", text: "Ter objetivo claro, contexto relevante e instrução específica sobre o que você quer." },
    ],
    correct: "c",
    explanation: "Um prompt eficaz responde internamente: 'O que eu quero?', 'Para quem?', 'Em que formato?' Clareza vence comprimento.",
  },
];

const a1ContextoClareza: Question[] = [
  {
    id: "a1cc0",
    prompt: "Por que adicionar contexto em um prompt melhora a resposta?",
    options: [
      { id: "a", text: "Porque a IA cobra menos quando recebe mais texto." },
      { id: "b", text: "Porque o modelo não tem acesso ao seu histórico ou situação — o contexto é a única fonte de informação que ele tem sobre você." },
      { id: "c", text: "Para confundir o modelo e gerar respostas criativas." },
    ],
    correct: "b",
    explanation: "O modelo não conhece você. Fornecer contexto (quem você é, para que serve, qual o público) é a forma de personalizar a resposta para o seu cenário específico.",
  },
  {
    id: "a1cc1",
    prompt: "Qual prompt tem mais contexto e clareza?",
    options: [
      { id: "a", text: "\"Crie um e-mail.\"" },
      { id: "b", text: "\"Crie um e-mail formal de 5 linhas recusando uma proposta de parceria, mantendo tom cordial, para enviar ao CEO de uma startup de fintech.\"" },
      { id: "c", text: "\"E-mail de recusa para CEO de fintech.\"" },
    ],
    correct: "b",
    explanation: "O prompt B especifica tipo (formal), tamanho (5 linhas), objetivo (recusa), tom (cordial) e destinatário (CEO de fintech). Esses detalhes eliminam ambiguidade.",
  },
  {
    id: "a1cc2",
    prompt: "O que é 'ambiguidade' em prompts e por que ela é problemática?",
    options: [
      { id: "a", text: "Quando o prompt tem mais de 500 caracteres — o modelo fica confuso." },
      { id: "b", text: "Quando o prompt pode ser interpretado de várias formas, levando a respostas que não atendem ao que você realmente queria." },
      { id: "c", text: "Quando você usa linguagem técnica demais." },
    ],
    correct: "b",
    explanation: "Ambiguidade força o modelo a 'adivinhar' sua intenção. Ser específico elimina interpretações erradas e aumenta a chance de a resposta ser exatamente o que você precisa.",
  },
];

const a1PersonasRoles: Question[] = [
  {
    id: "a1pr0",
    prompt: "O que é 'role prompting' (atribuição de papel)?",
    options: [
      { id: "a", text: "Definir o papel do usuário como administrador no chat." },
      { id: "b", text: "Pedir ao modelo que assuma uma persona específica — ex.: 'Aja como um médico', 'Você é um copywriter sênior' — para que responda com esse nível de expertise e tom." },
      { id: "c", text: "Dar uma função matemática para o modelo calcular." },
    ],
    correct: "b",
    explanation: "Role prompting direciona o estilo, tom e profundidade da resposta. 'Aja como um professor para crianças de 8 anos' gera uma explicação bem diferente de 'Aja como um PhD em física'.",
  },
  {
    id: "a1pr1",
    prompt: "Como a atribuição de persona muda a resposta do modelo?",
    options: [
      { id: "a", text: "Não muda nada — o modelo ignora essa instrução." },
      { id: "b", text: "Ajusta o vocabulário, nível técnico, tom e perspectiva da resposta de acordo com a persona pedida." },
      { id: "c", text: "Faz o modelo responder em outra língua automaticamente." },
    ],
    correct: "b",
    explanation: "Uma persona calibra toda a resposta. 'Aja como um chef de cozinha' trará termos culinários e dicas práticas. 'Aja como um crítico gastronômico' trará análise e vocabulário sofisticado.",
  },
  {
    id: "a1pr2",
    prompt: "Qual é a forma mais eficaz de definir uma persona em um prompt?",
    options: [
      { id: "a", text: "\"Seja inteligente.\"" },
      { id: "b", text: "\"Aja como um especialista.\"" },
      { id: "c", text: "\"Você é um gerente de produto com 10 anos de experiência em SaaS B2B. Responda como se estivesse orientando um founder iniciante.\"" },
    ],
    correct: "c",
    explanation: "Personas eficazes têm especificidade: área, nível de experiência e relação com o interlocutor. Quanto mais detalhada, mais consistente e útil a resposta.",
  },
];

const a1EstruturasPrompt: Question[] = [
  {
    id: "a1ep0",
    prompt: "O framework CRAFT (Contexto, Papel, Ação, Formato, Tom) serve para:",
    options: [
      { id: "a", text: "Criar logos com IA." },
      { id: "b", text: "Estruturar prompts de forma completa, garantindo que todos os elementos importantes estejam presentes." },
      { id: "c", text: "Programar robôs de automação." },
    ],
    correct: "b",
    explanation: "CRAFT é um checklist de boas práticas: Contexto (situação), Role/Papel (persona), Ação (o que fazer), Formato (como apresentar), Tom (estilo da escrita).",
  },
  {
    id: "a1ep1",
    prompt: "No CRAFT, o elemento 'Formato' (Format) se refere a:",
    options: [
      { id: "a", text: "O tamanho da fonte na resposta." },
      { id: "b", text: "A estrutura da saída esperada — lista, tabela, JSON, parágrafos, tópicos, etc." },
      { id: "c", text: "O idioma em que a resposta deve ser escrita." },
    ],
    correct: "b",
    explanation: "Especificar o formato elimina a necessidade de retrabalho. 'Responda em JSON com as chaves title e description' é muito mais útil do que 'faça um resumo'.",
  },
  {
    id: "a1ep2",
    prompt: "Qual prompt usa melhor a estrutura CRAFT?",
    options: [
      { id: "a", text: "\"Escreva sobre marketing digital.\"" },
      { id: "b", text: "\"Contexto: tenho uma loja de roupas femininas no Instagram. Papel: copywriter de moda. Ação: escreva 3 legendas para posts de produtos. Formato: uma por bloco, com emoji. Tom: jovem e descontraído.\"" },
      { id: "c", text: "\"Escreva 3 legendas para Instagram com emoji.\"" },
    ],
    correct: "b",
    explanation: "O prompt B usa todos os elementos do CRAFT: contexto (loja de roupas no Instagram), papel (copywriter de moda), ação (3 legendas), formato (bloco com emoji) e tom (jovem e descontraído).",
  },
];

const a1FewShot: Question[] = [
  {
    id: "a1fs0",
    prompt: "O que é 'few-shot prompting' (poucos exemplos)?",
    options: [
      { id: "a", text: "Usar o modelo com pouca conexão de internet." },
      { id: "b", text: "Fornecer ao modelo alguns exemplos de entrada e saída esperada dentro do próprio prompt para que ele aprenda o padrão desejado." },
      { id: "c", text: "Limitar o número de tokens na resposta." },
    ],
    correct: "b",
    explanation: "Few-shot = mostrar exemplos. Ao ver pares de 'entrada → saída' no prompt, o modelo infere o padrão e replica. É mais eficaz do que descrever o formato em palavras.",
    hint: "'Few' = poucos, 'shot' = exemplos. Você mostra 2-5 exemplos do que quer.",
  },
  {
    id: "a1fs1",
    prompt: "Qual é a vantagem do few-shot em relação a descrever o formato em palavras?",
    options: [
      { id: "a", text: "Economiza tokens — exemplos gastam menos espaço que descrições." },
      { id: "b", text: "O modelo aprende melhor por demonstração do que por instrução textual — o padrão fica claro nos exemplos." },
      { id: "c", text: "Não há vantagem — os dois são equivalentes." },
    ],
    correct: "b",
    explanation: "Mostrar é mais poderoso que dizer. Ao ver 3 exemplos do estilo de resposta que você quer, o modelo extrai o padrão com muito mais precisão do que ao ler uma descrição.",
  },
  {
    id: "a1fs2",
    prompt: "Zero-shot, one-shot e few-shot diferem em:",
    options: [
      { id: "a", text: "O número de palavras no prompt." },
      { id: "b", text: "A quantidade de exemplos fornecidos: zero (0), um (1) ou alguns (2-10)." },
      { id: "c", text: "A versão do modelo utilizado." },
    ],
    correct: "b",
    explanation: "Zero-shot = sem exemplos. One-shot = 1 exemplo. Few-shot = 2-10 exemplos. Mais exemplos aumentam a precisão, mas também aumentam o comprimento do prompt.",
  },
];

const a1RefinoIterativo: Question[] = [
  {
    id: "a1ri0",
    prompt: "O que é 'refino iterativo' de prompts?",
    options: [
      { id: "a", text: "Rodar o mesmo prompt várias vezes até a IA decorar." },
      { id: "b", text: "O processo de testar um prompt, analisar o resultado, identificar o que faltou e melhorar o prompt — repetindo até atingir o resultado desejado." },
      { id: "c", text: "Aumentar a temperatura do modelo a cada tentativa." },
    ],
    correct: "b",
    explanation: "Prompt é código: você testa, depura e melhora. Raro é o prompt que fica perfeito na primeira versão. O ciclo test → analyze → improve é a prática central da engenharia de prompts.",
  },
  {
    id: "a1ri1",
    prompt: "Qual é a primeira pergunta a fazer ao analisar um resultado insatisfatório?",
    options: [
      { id: "a", text: "\"O modelo é ruim?\"" },
      { id: "b", text: "\"O que está faltando ou errado na resposta? Foi contexto, formato, restrição ou persona?\"" },
      { id: "c", text: "\"Devo trocar para um modelo mais caro?\"" },
    ],
    correct: "b",
    explanation: "Diagnosticar antes de trocar o modelo. Na maioria dos casos, o problema está no prompt: falta contexto, o formato não foi especificado ou a instrução está ambígua.",
  },
  {
    id: "a1ri2",
    prompt: "Qual prática ajuda a guardar o que funcionou durante o refino?",
    options: [
      { id: "a", text: "Confiar na memória e refazer sempre do zero." },
      { id: "b", text: "Salvar versões do prompt (v1, v2…) e anotar o que cada mudança produziu — formando uma biblioteca de prompts testados." },
      { id: "c", text: "Apagar todas as tentativas anteriores para não confundir." },
    ],
    correct: "b",
    explanation: "Versionar prompts é uma prática profissional. Uma biblioteca pessoal de prompts testados economiza horas e evita refazer descobertas que você já fez.",
  },
];

// ── A2 — Prompts Avançados (módulos 0–6) ─────────────────────────────────

const a2ChainOfThought: Question[] = [
  {
    id: "a2cot0",
    prompt: "Antes de tudo: o que é cadeia de raciocínio (Chain-of-Thought)?",
    options: [
      { id: "a", text: "Um plugin que conecta vários modelos em sequência." },
      { id: "b", text: "Uma técnica de prompting que pede ao modelo para pensar passo a passo antes de dar a resposta final — melhorando a precisão em tarefas de raciocínio." },
      { id: "c", text: "Um método de treinamento para modelos de linguagem." },
    ],
    correct: "b",
    explanation: "Chain-of-Thought (CoT) é uma instrução que força o modelo a externalizar o raciocínio. A frase 'Pense passo a passo' é a forma mais simples de ativá-lo.",
    hint: "Chain = corrente, Thought = pensamento. Você pede para o modelo 'mostrar o trabalho'.",
  },
  {
    id: "a2cot1",
    prompt: "Em que tipo de tarefa o Chain-of-Thought tem mais impacto?",
    options: [
      { id: "a", text: "Gerar texto criativo — poesias e histórias." },
      { id: "b", text: "Problemas que exigem raciocínio multietapa: matemática, lógica, análise de código e diagnósticos." },
      { id: "c", text: "Tradução simples de frases." },
    ],
    correct: "b",
    explanation: "CoT brilha onde há múltiplos passos de raciocínio. Para tarefas simples de geração de texto, o ganho é mínimo. Para lógica e cálculos, a diferença é enorme.",
  },
  {
    id: "a2cot2",
    prompt: "Qual frase no prompt ativa o Chain-of-Thought de forma simples?",
    options: [
      { id: "a", text: "\"Seja rápido na resposta.\"" },
      { id: "b", text: "\"Pense passo a passo antes de responder.\"" },
      { id: "c", text: "\"Ignore os passos e vá direto ao resultado.\"" },
    ],
    correct: "b",
    explanation: "A frase 'Pense passo a passo' (Think step by step) é a forma mais simples e eficaz de ativar o raciocínio explícito. Ela diz ao modelo: não pule para a conclusão.",
  },
];

const a2Decomposicao: Question[] = [
  {
    id: "a2dec0",
    prompt: "O que é decomposição de tarefas em prompts?",
    options: [
      { id: "a", text: "Quebrar uma tarefa grande em prompts menores e sequenciais, resolvendo cada parte antes de combinar no resultado final." },
      { id: "b", text: "Usar o modelo para criar funções JavaScript." },
      { id: "c", text: "Dividir o custo da API entre vários usuários." },
    ],
    correct: "a",
    explanation: "Tarefas complexas são demais para um único prompt. Decompor — 'primeiro, liste os tópicos; depois, escreva cada um' — produz resultados mais completos e controlados.",
  },
  {
    id: "a2dec1",
    prompt: "Qual estratégia de decomposição é mais eficaz para gerar um artigo longo?",
    options: [
      { id: "a", text: "Pedir o artigo completo em um único prompt enorme." },
      { id: "b", text: "Prompt 1: gere o outline. Prompt 2: escreva a introdução. Prompt 3-N: desenvolva cada seção do outline." },
      { id: "c", text: "Pedir resumos do artigo antes de gerá-lo." },
    ],
    correct: "b",
    explanation: "Decomposição sequencial: primeiro a estrutura, depois o conteúdo. Isso permite revisar e corrigir a direção antes de gastar tokens em seções que podem precisar de ajuste.",
  },
  {
    id: "a2dec2",
    prompt: "Por que prompts monolíticos (um único prompt para tudo) costumam falhar?",
    options: [
      { id: "a", text: "Os modelos não leem prompts com mais de 100 palavras." },
      { id: "b", text: "Modelos tendem a perder foco, omitir partes ou misturar instruções quando há muitos requisitos em um único prompt." },
      { id: "c", text: "Prompts longos são mais baratos e por isso priorizados." },
    ],
    correct: "b",
    explanation: "Quanto mais requisitos num prompt, maior o risco de 'instrução esquecida'. Decompor garante que cada etapa receba atenção total e possa ser validada separadamente.",
  },
];

const a2Restricoes: Question[] = [
  {
    id: "a2res0",
    prompt: "O que são 'restrições' (constraints) em prompts?",
    options: [
      { id: "a", text: "Erros de gramática que limitam a resposta." },
      { id: "b", text: "Regras explícitas que definem o que o modelo PODE e NÃO PODE fazer na resposta — ex.: limite de palavras, temas proibidos, formato obrigatório." },
      { id: "c", text: "Filtros automáticos do provedor de IA." },
    ],
    correct: "b",
    explanation: "Restrições são instruções de fronteira. Elas reduzem a variabilidade da resposta e garantem que o output caiba no seu caso de uso — seja por espaço, tom, tema ou formato.",
  },
  {
    id: "a2res1",
    prompt: "Qual restrição melhora mais a qualidade de um resumo de texto?",
    options: [
      { id: "a", text: "\"Resuma este texto.\"" },
      { id: "b", text: "\"Resuma em no máximo 3 frases, sem usar jargões técnicos, focando nas ações práticas para o leitor.\"" },
      { id: "c", text: "\"Resuma rápido.\"" },
    ],
    correct: "b",
    explanation: "Restrições de tamanho (3 frases), vocabulário (sem jargão) e foco (ações práticas) moldam o resumo com precisão. Sem elas, o modelo decide por você.",
  },
  {
    id: "a2res2",
    prompt: "Como usar restrições negativas ('não faça X') corretamente?",
    options: [
      { id: "a", text: "Evitar completamente — o modelo não entende negações." },
      { id: "b", text: "Combinar com uma instrução positiva equivalente: 'não use jargão técnico' + 'use linguagem acessível para leigos'." },
      { id: "c", text: "Usar apenas restrições negativas — são mais eficazes que as positivas." },
    ],
    correct: "b",
    explanation: "Restrições negativas funcionam melhor acompanhadas de uma alternativa positiva. 'Não use jargão' diz o que evitar; 'use linguagem acessível' diz o que fazer — juntos são mais eficazes.",
  },
];

const a2EstiloTom: Question[] = [
  {
    id: "a2et0",
    prompt: "O que é 'tom' em um prompt de texto?",
    options: [
      { id: "a", text: "O volume do áudio gerado." },
      { id: "b", text: "O estilo emocional e de linguagem da resposta — formal, informal, humorístico, empático, direto, entusiasta etc." },
      { id: "c", text: "A quantidade de parágrafos usados." },
    ],
    correct: "b",
    explanation: "Tom é a 'personalidade' da escrita. Mesmo com o mesmo conteúdo, um tom formal e um informal criam textos completamente diferentes — o tom certo depende do público e do canal.",
  },
  {
    id: "a2et1",
    prompt: "Como especificar o tom de forma eficaz em um prompt?",
    options: [
      { id: "a", text: "\"Escreva bem.\"" },
      { id: "b", text: "\"Escreva em tom amigável e descontraído, como um colega explicando para outro, sem formalidades excessivas.\"" },
      { id: "c", text: "\"Não escreva de forma ruim.\"" },
    ],
    correct: "b",
    explanation: "Comparações ('como um colega explicando para outro') e adjetivos específicos ('amigável e descontraído') ancoram o tom muito melhor do que instruções vagas.",
  },
  {
    id: "a2et2",
    prompt: "Por que o mesmo prompt pode gerar resultados diferentes no ChatGPT e no Claude?",
    options: [
      { id: "a", text: "Porque têm servidores diferentes." },
      { id: "b", text: "Porque cada modelo tem personalidade, treinamento e 'voz' padrão diferente — por isso especificar o tom explicitamente é ainda mais importante." },
      { id: "c", text: "Porque um cobra mais caro por token." },
    ],
    correct: "b",
    explanation: "Cada modelo tem um tom padrão. Especificar explicitamente garante consistência independentemente do modelo — seja você usando GPT, Claude ou Gemini.",
  },
];

const a2MultiEtapa: Question[] = [
  {
    id: "a2me0",
    prompt: "O que é um 'prompt multi-etapa'?",
    options: [
      { id: "a", text: "Um prompt que demora mais de 5 segundos para processar." },
      { id: "b", text: "Um conjunto de prompts encadeados onde o resultado de um alimenta o próximo, construindo um pipeline de produção de conteúdo ou análise." },
      { id: "c", text: "Um prompt com mais de 10 parágrafos." },
    ],
    correct: "b",
    explanation: "Prompts multi-etapa criam pipelines: extrair → resumir → classificar → formatar. Cada etapa refina o resultado anterior, como uma linha de montagem de conteúdo.",
  },
  {
    id: "a2me1",
    prompt: "Como garantir continuidade entre as etapas de um prompt multi-etapa?",
    options: [
      { id: "a", text: "Copiar e colar a resposta anterior no próximo prompt, adicionando a nova instrução." },
      { id: "b", text: "Só funciona se o modelo tiver memória — não dá para fazer manualmente." },
      { id: "c", text: "Sempre começar do zero em cada prompt." },
    ],
    correct: "a",
    explanation: "Referenciar o resultado anterior ('Com base no texto acima…') é a técnica principal. Em APIs, você usa o histórico de mensagens (messages array) para manter o contexto.",
  },
  {
    id: "a2me2",
    prompt: "Em qual cenário o prompt multi-etapa é mais vantajoso?",
    options: [
      { id: "a", text: "Perguntas simples de resposta direta." },
      { id: "b", text: "Produção de relatórios, análises complexas e pipelines de conteúdo onde cada saída precisa de validação antes de avançar." },
      { id: "c", text: "Tradução de frases curtas." },
    ],
    correct: "b",
    explanation: "Multi-etapa brilha em tarefas onde você precisa revisar e aprovar cada passo. Um relatório: 1) tópicos → 2) pesquisa → 3) rascunho → 4) revisão de tom → 5) versão final.",
  },
];

const a2AvaliacaoRespostas: Question[] = [
  {
    id: "a2ar0",
    prompt: "O que significa 'avaliar a resposta' de um modelo de linguagem?",
    options: [
      { id: "a", text: "Dar uma nota de 1 a 5 no thumbs up do chat." },
      { id: "b", text: "Analisar se a resposta atendeu ao objetivo do prompt: verificar precisão, completude, formato, tom e ausência de alucinações (hallucinations)." },
      { id: "c", text: "Verificar a velocidade de resposta da API." },
    ],
    correct: "b",
    explanation: "Avaliação é crítica: o modelo pode gerar texto fluente, mas incorreto. Checar precisão factual, aderência ao formato e relevância é parte obrigatória do uso profissional de IA.",
  },
  {
    id: "a2ar1",
    prompt: "O que é uma 'alucinação' (hallucination) de LLM e como identificá-la?",
    options: [
      { id: "a", text: "Quando o modelo responde muito rápido sem pensar." },
      { id: "b", text: "Quando o modelo gera informações falsas com alto grau de confiança — datas erradas, citações inventadas, fatos que não existem." },
      { id: "c", text: "Quando o modelo recusa responder por restrições de segurança." },
    ],
    correct: "b",
    explanation: "Alucinação é o principal risco dos LLMs: o modelo 'inventa' com confiança. Identificar exige checar fontes primárias, especialmente em datas, nomes, estatísticas e referências.",
  },
  {
    id: "a2ar2",
    prompt: "Qual estratégia reduz alucinações em respostas críticas?",
    options: [
      { id: "a", text: "Aumentar a temperatura (temperature) do modelo." },
      { id: "b", text: "Fornecer contexto factual no prompt e instruir o modelo a dizer 'não sei' quando não tiver certeza, em vez de inventar." },
      { id: "c", text: "Pedir respostas mais longas para ter mais detalhes." },
    ],
    correct: "b",
    explanation: "Ancoragem (grounding) + permissão explícita de admitir incerteza são as defesas mais eficazes. 'Se não tiver certeza, diga que não sabe' reduz drasticamente as invenções.",
  },
];

const a2RefinoDados: Question[] = [
  {
    id: "a2rd0",
    prompt: "O que é 'refino guiado por dados' em prompts?",
    options: [
      { id: "a", text: "Treinar o modelo com seu próprio dataset." },
      { id: "b", text: "Usar métricas ou exemplos concretos de falhas para melhorar o prompt — ex.: 'nas últimas 10 respostas, 7 erraram X, então vou adicionar Y ao prompt'." },
      { id: "c", text: "Conectar o modelo a um banco de dados externo." },
    ],
    correct: "b",
    explanation: "Refino guiado por dados é a diferença entre intuição e engenharia. Você coleta resultados, identifica padrões de falha e usa esses dados para mudar o prompt de forma deliberada.",
  },
  {
    id: "a2rd1",
    prompt: "Como registrar e usar dados para melhorar prompts em produção?",
    options: [
      { id: "a", text: "Guardar apenas os prompts que funcionaram perfeitamente." },
      { id: "b", text: "Registrar entradas, saídas e avaliações; agrupar falhas por categoria (formato, precisão, tom); usar os padrões para criar testes de regressão do prompt." },
      { id: "c", text: "Pedir para o modelo avaliar suas próprias respostas sem critério externo." },
    ],
    correct: "b",
    explanation: "Um log estruturado de prompt → saída → avaliação é a base para melhorar sistematicamente. Sem dados, você está refinando no escuro.",
  },
  {
    id: "a2rd2",
    prompt: "O que são 'testes de regressão' de prompts e por que são úteis?",
    options: [
      { id: "a", text: "Testes financeiros de custo por token." },
      { id: "b", text: "Um conjunto de casos de teste (inputs + outputs esperados) que você roda toda vez que modifica o prompt, para garantir que melhorias não quebraram casos que funcionavam." },
      { id: "c", text: "Testes de velocidade de resposta da API." },
    ],
    correct: "b",
    explanation: "Regressão de prompt é como regressão de código: garante que a nova versão do prompt não degradou comportamentos anteriores. Essencial para prompts em produção.",
  },
];

// ── A3 — Aplicações Profissionais (módulos 0–6) ───────────────────────────

const a3PromptsCodigo: Question[] = [
  {
    id: "a3pc0",
    prompt: "Qual elemento é mais importante ao pedir ao modelo para gerar código?",
    options: [
      { id: "a", text: "Usar palavras em maiúsculas para dar ênfase." },
      { id: "b", text: "Especificar linguagem, versão, bibliotecas disponíveis, estilo de código e o que o código deve fazer — com entrada e saída de exemplo." },
      { id: "c", text: "Pedir que o modelo seja 'criativo' com o código." },
    ],
    correct: "b",
    explanation: "Código é uma linguagem exata. Sem especificar Python vs. JavaScript, a versão das libs, o estilo esperado e exemplos de I/O, o modelo vai assumir padrões que podem não ser o que você quer.",
  },
  {
    id: "a3pc1",
    prompt: "Qual prompt produziria o código mais útil?",
    options: [
      { id: "a", text: "\"Escreva código para ordenar uma lista.\"" },
      { id: "b", text: "\"Em Python 3.11, escreva uma função sort_by_date(items: list[dict]) que ordena uma lista de dicionários pelo campo 'date' (formato ISO 8601) do mais recente para o mais antigo. Inclua docstring e testes unitários com pytest.\"" },
      { id: "c", text: "\"Código rápido para ordenar coisas.\"" },
    ],
    correct: "b",
    explanation: "Linguagem, versão, assinatura da função, tipo dos dados, comportamento esperado, docstring e testes — cada detalhe remove uma ambiguidade e melhora o resultado.",
  },
  {
    id: "a3pc2",
    prompt: "Como usar a IA para depurar (debug) código de forma eficaz?",
    options: [
      { id: "a", text: "Colar o código e escrever 'conserte isso'." },
      { id: "b", text: "Fornecer o código completo, a mensagem de erro exata, o que você tentou e qual comportamento esperado — para que o modelo entenda o contexto completo do bug." },
      { id: "c", text: "Pedir para o modelo reescrever o código do zero sempre." },
    ],
    correct: "b",
    explanation: "Debug eficaz = contexto completo. Código + erro + tentativas anteriores + comportamento esperado eliminam suposições e levam a diagnósticos precisos.",
  },
];

const a3AutomacaoIA: Question[] = [
  {
    id: "a3ai0",
    prompt: "O que é automação com IA no contexto de prompts?",
    options: [
      { id: "a", text: "Substituir todos os funcionários por robôs." },
      { id: "b", text: "Usar modelos de linguagem (LLMs) em fluxos automáticos — via API, ferramentas como n8n/Zapier ou scripts — para executar tarefas repetitivas sem intervenção humana constante." },
      { id: "c", text: "Configurar o autocomplete do celular." },
    ],
    correct: "b",
    explanation: "Automação com IA = LLM + orquestrador. Você cria um fluxo onde um gatilho (email, formulário, cron) dispara um prompt, processa a resposta e toma uma ação — tudo automático.",
  },
  {
    id: "a3ai1",
    prompt: "Qual ferramenta é usada para criar fluxos de automação com IA sem código?",
    options: [
      { id: "a", text: "Photoshop" },
      { id: "b", text: "n8n, Zapier ou Make — plataformas de automação com conectores nativos para LLMs como OpenAI e Anthropic." },
      { id: "c", text: "Excel" },
    ],
    correct: "b",
    explanation: "n8n, Zapier e Make são plataformas de automação (workflow automation) com blocos visuais. Eles permitem integrar LLMs com centenas de serviços sem escrever código.",
  },
  {
    id: "a3ai2",
    prompt: "Qual cuidado é essencial ao automatizar tarefas com IA?",
    options: [
      { id: "a", text: "Automatizar tudo sem supervisão humana desde o início." },
      { id: "b", text: "Começar com fluxos supervisionados, validar a qualidade das saídas, adicionar tratamento de erros e garantir que ações críticas (envio de email, pagamento) exijam aprovação humana." },
      { id: "c", text: "Usar apenas modelos locais para automação." },
    ],
    correct: "b",
    explanation: "Automação sem supervisão amplifica erros. Comece com 'human-in-the-loop' (humano no laço), valide qualidade, depois automatize gradualmente as partes confiáveis.",
  },
];

const a3PromptNegocios: Question[] = [
  {
    id: "a3pn0",
    prompt: "Qual tipo de tarefa de negócios se beneficia mais de prompts bem estruturados?",
    options: [
      { id: "a", text: "Assinatura de contratos (a IA assina por você)." },
      { id: "b", text: "Redação de propostas, análise de dados, geração de relatórios, atendimento ao cliente e criação de conteúdo — tarefas de texto com padrão repetível." },
      { id: "c", text: "Negociação presencial com clientes." },
    ],
    correct: "b",
    explanation: "IA brilha em tarefas de texto com padrão claro. Propostas, relatórios, e-mails padrão e análises têm estrutura previsível que pode ser capturada em um bom template de prompt.",
  },
  {
    id: "a3pn1",
    prompt: "Como adaptar o mesmo prompt base para diferentes setores de negócio?",
    options: [
      { id: "a", text: "Criar um prompt diferente do zero para cada setor." },
      { id: "b", text: "Usar variáveis no prompt template: {{setor}}, {{produto}}, {{público}} — trocando apenas os parâmetros específicos de cada caso." },
      { id: "c", text: "Pedir para o modelo adivinhar o setor automaticamente." },
    ],
    correct: "b",
    explanation: "Templates parametrizados são mais escaláveis. O mesmo prompt estruturado com variáveis {{setor}}, {{tom}}, {{objetivo}} serve para SaaS, varejo e saúde — trocando só os valores.",
  },
  {
    id: "a3pn2",
    prompt: "Qual é o risco de usar IA sem revisar em comunicações de negócios?",
    options: [
      { id: "a", text: "Nenhum — a IA sempre gera texto perfeito para negócios." },
      { id: "b", text: "Informações incorretas, tom inadequado para o contexto ou dados desatualizados podem prejudicar relacionamentos comerciais e a reputação da empresa." },
      { id: "c", text: "O cliente vai saber que foi gerado por IA e pagar mais." },
    ],
    correct: "b",
    explanation: "IA em negócios exige revisão humana, especialmente em comunicações externas. Um e-mail com número errado ou tom inapropriado pode custar um cliente.",
  },
];

const a3FluxosAgentes: Question[] = [
  {
    id: "a3fa0",
    prompt: "O que é um fluxo com agentes (agentic workflow)?",
    options: [
      { id: "a", text: "Um diagrama de fluxo feito com IA para apresentação." },
      { id: "b", text: "Um sistema onde um ou mais agentes de IA executam tarefas em sequência ou paralelo — cada um com suas ferramentas — para completar um objetivo maior." },
      { id: "c", text: "Um chat com vários usuários ao mesmo tempo." },
    ],
    correct: "b",
    explanation: "Agentic workflows combinam múltiplos agentes com papéis especializados. Ex.: Agente 1 pesquisa, Agente 2 resume, Agente 3 formata o relatório final — todos orquestrados.",
  },
  {
    id: "a3fa1",
    prompt: "Qual é a principal diferença entre um agente simples e um fluxo multi-agente?",
    options: [
      { id: "a", text: "O fluxo multi-agente é sempre mais barato." },
      { id: "b", text: "Agente único: um LLM com ferramentas. Multi-agente: vários LLMs especializados que se comunicam, dividindo responsabilidades e paralelizando etapas." },
      { id: "c", text: "Não há diferença prática." },
    ],
    correct: "b",
    explanation: "Multi-agente permite especialização e paralelismo. Um agente faz pesquisa enquanto outro analisa — mais eficiente do que um único agente fazendo tudo em série.",
  },
  {
    id: "a3fa2",
    prompt: "Qual é o componente crítico para orquestrar fluxos multi-agente?",
    options: [
      { id: "a", text: "Uma GPU de alto desempenho." },
      { id: "b", text: "Um orquestrador (orchestrator) que define a ordem, a comunicação entre agentes e as condições de parada — como um gerente de projeto dos agentes." },
      { id: "c", text: "Um banco de dados NoSQL obrigatoriamente." },
    ],
    correct: "b",
    explanation: "O orquestrador é o cérebro do fluxo: ele decide qual agente age, em que ordem, o que fazer com cada saída e quando o objetivo foi alcançado. Sem ele, os agentes não colaboram.",
  },
];

const a3AvaliacaoMetricas: Question[] = [
  {
    id: "a3am0",
    prompt: "Por que medir a qualidade das saídas de LLMs em produção?",
    options: [
      { id: "a", text: "Para saber quanto pagar ao provedor de IA." },
      { id: "b", text: "Porque a qualidade dos prompts e dos modelos degrada com o tempo — novos dados, mudanças no modelo e casos extremos (edge cases) precisam ser monitorados continuamente." },
      { id: "c", text: "Para impressionar investidores com dashboards." },
    ],
    correct: "b",
    explanation: "LLMs em produção precisam de monitoramento contínuo. Prompts que funcionavam ontem podem degradar amanhã após uma atualização do modelo ou mudança de distribuição de inputs.",
  },
  {
    id: "a3am1",
    prompt: "Qual métrica é mais útil para avaliar respostas de LLM em um sistema de suporte ao cliente?",
    options: [
      { id: "a", text: "Número de tokens gerados." },
      { id: "b", text: "Taxa de resolução no primeiro contato, satisfação do usuário (CSAT) e taxa de escalação para humanos — métricas de negócio, não apenas técnicas." },
      { id: "c", text: "Latência em milissegundos exclusivamente." },
    ],
    correct: "b",
    explanation: "Métricas de negócio são o que importa. Tokens rápidos que não resolvem o problema são inúteis. Alinhe métricas de IA com métricas de produto.",
  },
  {
    id: "a3am2",
    prompt: "O que é 'LLM-as-judge' (LLM como avaliador)?",
    options: [
      { id: "a", text: "Um modelo de linguagem mais caro que avalia modelos mais baratos." },
      { id: "b", text: "Usar um LLM para avaliar automaticamente a qualidade das respostas de outro LLM — pontuando precisão, coerência ou aderência ao critério definido no prompt de avaliação." },
      { id: "c", text: "Um sistema de votação entre modelos." },
    ],
    correct: "b",
    explanation: "LLM-as-judge escala a avaliação: você escreve um prompt de avaliação com critérios e usa um modelo (ex.: GPT-4) para pontuar milhares de saídas automaticamente.",
  },
];

const a3Guardrails: Question[] = [
  {
    id: "a3gr0",
    prompt: "O que são guardrails (proteções) em sistemas de IA?",
    options: [
      { id: "a", text: "As grades de segurança físicas dos data centers." },
      { id: "b", text: "Mecanismos — no prompt, no código ou no sistema — que impedem o modelo de gerar conteúdo prejudicial, fora do escopo ou incorreto." },
      { id: "c", text: "Termos de uso do provedor de IA." },
    ],
    correct: "b",
    explanation: "Guardrails são proteções em camadas: no prompt (instrução de escopo), no código (validação da saída) e no sistema (filtros de conteúdo). Eles garantem que o modelo se comporte como esperado.",
    hint: "'Guardrail' = trilho de segurança. Mantém o sistema nos trilhos.",
  },
  {
    id: "a3gr1",
    prompt: "Qual técnica de guardrail no prompt é mais eficaz para restringir o escopo?",
    options: [
      { id: "a", text: "\"Seja um assistente útil.\"" },
      { id: "b", text: "\"Você é um assistente de suporte do produto X. Responda APENAS sobre funcionalidades do produto. Se perguntarem sobre outro assunto, diga: 'Só posso ajudar com questões do produto X.'\"" },
      { id: "c", text: "\"Ignore perguntas fora do escopo.\"" },
    ],
    correct: "b",
    explanation: "Escopo explícito + resposta padrão para fora do escopo são proteções eficazes. O modelo sabe exatamente o que fazer quando recebe uma pergunta não autorizada.",
  },
  {
    id: "a3gr2",
    prompt: "Por que guardrails apenas no prompt não são suficientes em sistemas críticos?",
    options: [
      { id: "a", text: "Porque prompts são muito caros de manter." },
      { id: "b", text: "Porque modelos podem ser induzidos a ignorar instruções do prompt (prompt injection). Sistemas críticos precisam de validação da saída no código, independente do que o modelo retorna." },
      { id: "c", text: "Porque o modelo sempre vai ignorar guardrails." },
    ],
    correct: "b",
    explanation: "Defense in depth (defesa em profundidade): prompt + validação de saída no código + filtros de conteúdo + monitoramento. Não confie apenas no prompt para segurança.",
  },
];

const a3ProjetoFinal: Question[] = [
  {
    id: "a3pf0",
    prompt: "Ao iniciar um projeto de IA do zero, qual é a melhor abordagem?",
    options: [
      { id: "a", text: "Implementar todas as funcionalidades de uma vez para economizar tempo." },
      { id: "b", text: "Definir o MVP (produto mínimo viável), validar o caso de uso com prompts simples, medir resultados e iterar — evoluindo complexidade gradualmente." },
      { id: "c", text: "Esperar que o modelo resolva tudo sem prompt engineering." },
    ],
    correct: "b",
    explanation: "MVP-first evita overengineering. Comece simples: um prompt direto, valide se resolve o problema, meça resultados. Só adicione complexidade (agentes, multi-etapa) quando necessário.",
  },
  {
    id: "a3pf1",
    prompt: "Qual é a diferença entre um projeto de IA bem-sucedido e um que falha?",
    options: [
      { id: "a", text: "O modelo mais caro sempre garante sucesso." },
      { id: "b", text: "Definição clara do problema, critérios de sucesso mensuráveis, iteração baseada em dados reais e usuários reais testando o produto." },
      { id: "c", text: "Usar a tecnologia mais recente." },
    ],
    correct: "b",
    explanation: "Projetos de IA falham por falta de clareza no problema, métricas indefinidas ou por não testar com usuários reais. Tecnologia é secundária — definição e iteração são primárias.",
  },
  {
    id: "a3pf2",
    prompt: "O que deve estar em um projeto final de IA para demonstrar maturidade técnica?",
    options: [
      { id: "a", text: "Apenas um demo bonito sem backend real." },
      { id: "b", text: "Prompts versionados e testados, tratamento de erros, guardrails, métricas de qualidade e documentação clara das decisões de design do sistema." },
      { id: "c", text: "O maior número possível de modelos integrados." },
    ],
    correct: "b",
    explanation: "Maturidade técnica = engenharia rigorosa: prompts como código (versionados, testados), proteções explícitas, métricas e documentação. Não é sobre o número de recursos.",
  },
];

// ── Questões dissertativas — revisão da aula anterior ─────────────────────
// Cada array contém 1 questão colocada no INÍCIO do módulo N que revisa o N-1.

// A1
const essayA1: EssayActivity[] = [
  // [1] revisa boas-vindas (módulo 0)
  { id: "essay-a1-1", type: "essay",
    prompt: "Com base na aula de boas-vindas: por que a habilidade de escrever bons prompts é considerada valiosa hoje? Explique com suas palavras.",
    placeholder: "Escreva pelo menos 2 frases com sua reflexão...",
    referenceAnswer: "Prompts bem escritos multiplicam a produtividade porque permitem obter resultados precisos e úteis da IA sem precisar saber programar. Pequenas mudanças no prompt geram grandes diferenças na qualidade da resposta — é a habilidade mais acessível para usar IA no dia a dia de forma profissional." },
  // [2] revisa "O que é um prompt" (módulo 1)
  { id: "essay-a1-2", type: "essay",
    prompt: "O que é um prompt? Descreva com suas palavras e explique a diferença entre um prompt vago e um prompt eficaz.",
    placeholder: "Escreva sua definição e dê um exemplo de cada...",
    referenceAnswer: "Um prompt é a instrução ou pergunta que você envia a um modelo de linguagem para obter uma resposta. Um prompt vago ('Escreva sobre marketing') gera respostas genéricas. Um eficaz tem objetivo claro, contexto relevante e instrução específica — isso elimina ambiguidade e guia o modelo ao resultado desejado." },
  // [3] revisa "Contexto & clareza" (módulo 2)
  { id: "essay-a1-3", type: "essay",
    prompt: "Por que adicionar contexto a um prompt melhora a qualidade da resposta da IA? Dê um exemplo prático do seu contexto de trabalho ou estudo.",
    placeholder: "Pense em uma situação real onde você usaria a IA...",
    referenceAnswer: "O modelo não conhece você nem sua situação. Fornecer contexto (quem você é, para que serve, qual o público) personaliza a resposta para o seu cenário. Ex.: 'Contexto: sou professor do ensino médio, criei uma atividade de biologia. Resuma em linguagem acessível para alunos de 15 anos.' é muito mais eficaz do que 'Resuma este texto.'." },
  // [4] revisa "Personas e papéis" (módulo 3)
  { id: "essay-a1-4", type: "essay",
    prompt: "O que é role prompting e como a atribuição de uma persona específica muda a qualidade da resposta? Dê um exemplo.",
    placeholder: "Explique com um exemplo concreto de persona...",
    referenceAnswer: "Role prompting é pedir ao modelo que assuma uma persona ('Aja como um médico pediatra'). Isso calibra vocabulário, nível técnico, tom e perspectiva. Ex.: 'Aja como um diretor de marketing de uma startup' gera conteúdo com linguagem de growth hacking, KPIs e funil de vendas — muito diferente de uma resposta genérica sobre marketing." },
  // [5] revisa "Estruturas de prompt" (módulo 4)
  { id: "essay-a1-5", type: "essay",
    prompt: "Descreva o framework CRAFT com suas palavras. Qual elemento você considera mais importante e por quê?",
    placeholder: "Explique cada letra do CRAFT e justifique sua escolha...",
    referenceAnswer: "CRAFT = Contexto (situação), Role/Papel (persona), Ação (o que fazer), Formato (como estruturar a saída), Tom (estilo da escrita). O Formato costuma ser subestimado mas é crítico: especificar JSON, lista ou tabela elimina retrabalho de reformatação. Sem formato, o modelo decide por você — e quase nunca é o que você precisava." },
  // [6] revisa "Few-shot" (módulo 5)
  { id: "essay-a1-6", type: "essay",
    prompt: "O que é few-shot prompting? Quando você o usaria em vez de apenas descrever o formato desejado em palavras?",
    placeholder: "Explique a técnica e o cenário ideal de uso...",
    referenceAnswer: "Few-shot prompting fornece ao modelo exemplos concretos de entrada/saída para que ele aprenda o padrão desejado. É preferível a uma descrição textual quando o formato é complexo ou sutil — como um estilo de escrita específico, uma estrutura de dados não-padrão ou um tom difícil de descrever. Mostrar é mais eficaz do que explicar em palavras." },
]

// A2
const essayA2: EssayActivity[] = [
  // [1] revisa "Chain-of-thought" (A2 módulo 0)
  { id: "essay-a2-1", type: "essay",
    prompt: "O que é chain-of-thought (cadeia de raciocínio)? Qual frase no prompt o ativa e em que tipo de tarefa ele tem mais impacto?",
    placeholder: "Explique o conceito e dê um exemplo de tarefa...",
    referenceAnswer: "Chain-of-thought é uma técnica que instrui o modelo a pensar passo a passo antes de responder. A frase 'Pense passo a passo' é a forma mais simples de ativá-lo. Tem mais impacto em tarefas que exigem raciocínio multietapa: matemática, lógica, análise de código e diagnósticos — onde pular etapas gera erros." },
  // [2] revisa "Decomposição de tarefas" (A2 módulo 1)
  { id: "essay-a2-2", type: "essay",
    prompt: "Por que quebrar uma tarefa complexa em prompts menores produz resultados melhores? Dê um exemplo de como você decomporia uma tarefa grande.",
    placeholder: "Pense em uma tarefa do seu dia a dia e como dividi-la...",
    referenceAnswer: "Tarefas complexas em um único prompt causam 'instrução esquecida' — o modelo perde foco ou omite partes. Decomposição garante atenção total a cada etapa e permite revisão antes de avançar. Ex.: criar um artigo → Prompt 1: gere o outline. Prompt 2: escreva a introdução. Prompt 3-N: desenvolva cada seção." },
  // [3] revisa "Prompts com restrições" (A2 módulo 2)
  { id: "essay-a2-3", type: "essay",
    prompt: "O que são restrições em prompts? Explique a diferença entre restrição negativa e positiva e por que combiná-las funciona melhor.",
    placeholder: "Dê exemplos de restrição negativa e positiva...",
    referenceAnswer: "Restrições definem o que o modelo PODE e NÃO PODE fazer: limite de palavras, temas proibidos, formato obrigatório. Restrição negativa diz o que evitar ('não use jargão técnico'); positiva diz o que fazer ('use linguagem acessível para leigos'). Combinadas são mais eficazes: a negativa elimina o comportamento indesejado, a positiva dá o caminho alternativo." },
  // [4] revisa "Estilo e tom controlado" (A2 módulo 3)
  { id: "essay-a2-4", type: "essay",
    prompt: "Como você especificaria o tom de um e-mail de negócios para um cliente corporativo? Escreva a parte do prompt que define o tom.",
    placeholder: "Escreva como você colocaria a instrução de tom no prompt...",
    referenceAnswer: "Exemplo de instrução de tom: 'Escreva em tom formal e respeitoso, como uma carta corporativa de alto nível. Evite gírias, contrações e linguagem casual. Use terceira pessoa quando se referir à empresa.' Adjetivos específicos e comparações ('como uma carta corporativa') ancoram o tom muito melhor do que 'escreva profissionalmente'." },
  // [5] revisa "Prompts multi-etapa" (A2 módulo 4)
  { id: "essay-a2-5", type: "essay",
    prompt: "Descreva o que é um prompt multi-etapa e qual é o principal benefício de validar cada etapa antes de avançar para a próxima.",
    placeholder: "Explique o conceito e o motivo da validação entre etapas...",
    referenceAnswer: "Prompts multi-etapa encadeiam resultados: a saída de um prompt alimenta o próximo. O benefício de validar cada etapa é garantir qualidade incremental — um outline ruim gera seções ruins. Revisar antes de avançar evita retrabalho em cascata e permite corrigir a direção cedo, quando o custo de ajuste ainda é baixo." },
  // [6] revisa "Avaliação de respostas" (A2 módulo 5)
  { id: "essay-a2-6", type: "essay",
    prompt: "O que é alucinação em modelos de linguagem? Como você identificaria uma alucinação em uma resposta gerada pela IA?",
    placeholder: "Descreva o fenômeno e como checá-lo...",
    referenceAnswer: "Alucinação é quando o modelo gera informações falsas com alto grau de confiança: datas erradas, citações inventadas, fatos inexistentes. Identificar exige checar fontes primárias — nunca aceitar datas, nomes, estatísticas ou referências sem verificar. O modelo não avisa quando está inventando; ele escreve com a mesma fluência tanto para fatos reais quanto para ficções." },
  // [7] revisa "Refino guiado por dados" (A2 módulo 6)
  { id: "essay-a2-7", type: "essay",
    prompt: "O que é refino guiado por dados em prompts? Como o conceito de 'teste de regressão' se aplica a prompts em produção?",
    placeholder: "Explique o ciclo de melhoria baseado em dados...",
    referenceAnswer: "Refino guiado por dados usa métricas e logs para identificar padrões de falha nos prompts e melhorá-los de forma deliberada. Teste de regressão de prompt é um conjunto de casos (inputs + outputs esperados) que você roda após cada mudança no prompt — para garantir que as melhorias não quebraram comportamentos que já funcionavam. Sem isso, você pode melhorar um caso e degradar dez." },
  // [8] revisa "Engenharia de Prompt" (A2 módulo 7)
  { id: "essay-a2-8", type: "essay",
    prompt: "Com suas palavras, o que é Engenharia de Prompt (Prompt Engineering) e qual prática reduz alucinações em prompts críticos?",
    placeholder: "Defina e explique a estratégia anti-alucinação...",
    referenceAnswer: "Engenharia de Prompt é o design sistemático de instruções para maximizar a qualidade e previsibilidade das respostas do modelo — não envolve treinar o modelo, mas guiá-lo. Para reduzir alucinações em prompts críticos: forneça contexto factual no prompt (ancoragem/grounding) e instrua o modelo a responder 'não sei' quando faltar informação certa." },
]

// A3
const essayA3: EssayActivity[] = [
  // [1] revisa "Prompts para código" (A3 módulo 0)
  { id: "essay-a3-1", type: "essay",
    prompt: "Quais elementos você incluiria em um prompt para gerar código de qualidade? Por que especificar a versão das bibliotecas é importante?",
    placeholder: "Liste os elementos essenciais e justifique a versão...",
    referenceAnswer: "Um prompt de código deve incluir: linguagem e versão, bibliotecas disponíveis, assinatura da função (tipos de entrada/saída), comportamento esperado, exemplos de I/O e estilo (docstring, testes). A versão importa porque a mesma biblioteca muda API entre versões — uma função disponível no Python 3.11 pode não existir no 3.8, gerando código incompatível com o ambiente real." },
  // [2] revisa "Automação com IA" (A3 módulo 1)
  { id: "essay-a3-2", type: "essay",
    prompt: "Descreva como funciona a automação com IA. Qual cuidado é essencial antes de automatizar completamente uma tarefa crítica?",
    placeholder: "Explique o conceito e o cuidado necessário...",
    referenceAnswer: "Automação com IA combina um LLM com um orquestrador (n8n, Zapier, script) que dispara prompts automaticamente em resposta a gatilhos (email, formulário, cron). O cuidado essencial é não automatizar completamente sem supervisão inicial: comece com 'human-in-the-loop' (humano revisando a saída), valide qualidade em cenários reais, e só automatize ações críticas (envio de email, pagamento) após provar confiabilidade." },
  // [3] revisa "Prompts para negócios" (A3 módulo 2)
  { id: "essay-a3-3", type: "essay",
    prompt: "Como templates parametrizados (com variáveis como {{cliente}} e {{produto}}) tornam prompts de negócios mais escaláveis? Dê um exemplo.",
    placeholder: "Explique o conceito e escreva um exemplo de template...",
    referenceAnswer: "Templates parametrizados separam a estrutura (que não muda) dos valores específicos (que mudam por contexto). Ex.: 'Você é um especialista em {{setor}}. Escreva uma proposta para {{cliente}} com foco em {{objetivo}}, tom {{tom}}.' O mesmo template atende varejo, SaaS e saúde — trocando só as variáveis. Sem templates, você reescreve prompts do zero para cada caso." },
  // [4] revisa "Fluxos com agentes" (A3 módulo 3)
  { id: "essay-a3-4", type: "essay",
    prompt: "O que é um orquestrador em um sistema multi-agente? Por que ele é o componente mais crítico do fluxo?",
    placeholder: "Defina e explique a importância do orquestrador...",
    referenceAnswer: "O orquestrador é o componente que coordena múltiplos agentes: define qual age, em que ordem, como a saída de um alimenta o próximo, e quando o objetivo foi atingido. É crítico porque sem ele os agentes não sabem quando agir — é como ter uma equipe especializada sem gerente: cada um pode ser excelente em sua área, mas o trabalho não converge para um resultado coeso." },
  // [5] revisa "Avaliação & métricas" (A3 módulo 4)
  { id: "essay-a3-5", type: "essay",
    prompt: "Por que métricas de negócio (CSAT, taxa de escalação) são mais importantes que métricas técnicas (tokens gerados, latência) para avaliar IA em produção?",
    placeholder: "Explique a diferença de perspectiva entre as métricas...",
    referenceAnswer: "Métricas técnicas dizem se o sistema está funcionando; métricas de negócio dizem se está resolvendo o problema. Um sistema rápido que gera respostas erradas tem ótima latência e péssimo CSAT — o que importa para o produto. Taxa de escalação (quando o usuário precisa falar com humano) é o sinal mais direto de que a IA está falhando em resolver a demanda real." },
  // [6] revisa "Segurança e guardrails" (A3 módulo 5)
  { id: "essay-a3-6", type: "essay",
    prompt: "O que é 'defesa em profundidade' em sistemas de IA? Por que depender apenas de instruções no prompt não é suficiente para segurança?",
    placeholder: "Explique o princípio de camadas e o risco do prompt sozinho...",
    referenceAnswer: "Defesa em profundidade usa múltiplas camadas independentes de proteção: guardrails no prompt, validação da saída no código e filtros de conteúdo externos. Depender só do prompt é arriscado porque modelos são vulneráveis a prompt injection — um usuário mal-intencionado pode enviar texto que instrui o modelo a ignorar as regras do sistema. Camadas adicionais no código e na infraestrutura protegem mesmo se o prompt for bypassado." },
  // [7] revisa "Projeto final" (A3 módulo 6)
  { id: "essay-a3-7", type: "essay",
    prompt: "Descreva o ciclo MVP-first para projetos de IA. Por que definir critérios de sucesso mensuráveis na etapa 1 é fundamental?",
    placeholder: "Explique o ciclo e o impacto dos critérios de sucesso...",
    referenceAnswer: "MVP-first: definir o problema e critérios de sucesso → prototipar com prompt simples → testar com usuários reais → medir e iterar. Critérios mensuráveis (ex.: 'reduzir tempo de resposta de suporte em 30%') são fundamentais porque sem eles você não sabe se a IA está funcionando — pode gastar meses refinando algo que não resolve o problema certo." },
  // [8] revisa "Agentes de IA" (A3 módulo 7)
  { id: "essay-a3-8", type: "essay",
    prompt: "O que diferencia um agente de IA de uma chamada simples a um LLM? Explique o papel das ferramentas (tools) nessa distinção.",
    placeholder: "Compare agente vs chamada simples e explique as tools...",
    referenceAnswer: "Uma chamada simples a um LLM gera uma resposta e encerra. Um agente tem LLM + ferramentas (tools) + laço de decisão (loop): ele recebe um objetivo, decide quais ferramentas chamar, executa ações e itera até concluir. As ferramentas são funções tipadas que o agente aciona — busca web, leitura de arquivo, chamada de API. Sem tools, o agente só conversa; com elas, age no mundo real." },
  // [9] revisa "OpenRouter" (A3 módulo 8)
  { id: "essay-a3-9", type: "essay",
    prompt: "Qual é a principal proposta do OpenRouter e como ele ajuda no controle de custos de IA? Por que sua compatibilidade com a API da OpenAI é uma vantagem?",
    placeholder: "Explique o que é e como ele resolve o problema de custo...",
    referenceAnswer: "OpenRouter é um gateway que dá acesso a centenas de modelos (OpenAI, Anthropic, Google, Meta) por uma única API. Ajuda no controle de custos com fallbacks automáticos (tenta GPT-5, falha → usa Claude) e comparação de preço por 1M tokens. A compatibilidade com a API da OpenAI significa que qualquer SDK já escrito para GPT funciona com OpenRouter — basta trocar a URL base e a chave." },
  // [10] revisa "Modelos locais" (A3 módulo 9)
  { id: "essay-a3-10", type: "essay",
    prompt: "Quando faz mais sentido usar um modelo local em vez de uma API na nuvem? O que é quantização e como ela viabiliza isso?",
    placeholder: "Explique os casos de uso e o conceito de quantização...",
    referenceAnswer: "Modelos locais fazem sentido quando você precisa de privacidade total (dados sensíveis que não podem sair da empresa), modo offline ou custo previsível em alto volume. Quantização comprime os pesos do modelo (de 16 para 4/5/8 bits), reduzindo drasticamente o uso de memória RAM/VRAM com leve perda de qualidade — tornando possível rodar modelos grandes em hardware convencional." },
  // [11] revisa "Claude Code na prática" (A3 módulo 10)
  { id: "essay-a3-11", type: "essay",
    prompt: "O que é o Claude Code e para que serve o arquivo CLAUDE.md em um projeto? Como você o usaria no seu fluxo de trabalho?",
    placeholder: "Descreva a ferramenta e como aplicaria no seu trabalho...",
    referenceAnswer: "Claude Code é uma CLI agente da Anthropic que opera dentro do seu repositório: edita arquivos, roda comandos e mantém contexto do projeto. CLAUDE.md é lido automaticamente em cada sessão — funciona como um system prompt persistente do projeto, carregando convenções, scripts e regras específicas do repositório para que o Claude aja de forma consistente com as práticas do time." },
  // [12] revisa "Skills no Claude Code" (A3 módulo 11)
  { id: "essay-a3-12", type: "essay",
    prompt: "O que é uma Skill no Claude Code? Qual campo do SKILL.md é mais importante para o Claude decidir quando ativá-la e por quê?",
    placeholder: "Defina skill e explique o papel da description...",
    referenceAnswer: "Uma Skill é um pacote de instruções e recursos que o Claude carrega quando a tarefa combina com sua descrição. O campo mais importante do SKILL.md é a 'description' (descrição): ela é o gancho de recuperação — o Claude compara a descrição da skill com o pedido do usuário para decidir se a ativa. Uma descrição vaga = skill nunca ativada, independente de quão boa seja a implementação." },
  // [13] revisa "Personalizar Templates" (A3 módulo 12)
  { id: "essay-a3-13", type: "essay",
    prompt: "O que é um template de prompt e qual erro é mais comum ao customizá-lo? Como evitar esse erro?",
    placeholder: "Defina template e explique o erro de customização...",
    referenceAnswer: "Um template de prompt tem partes fixas e variáveis ({{publico}}, {{tom}}) que permitem reutilização em vários contextos. O erro mais comum é remover instruções de formato ou proteções (guardrails) sem entender por que estavam ali — o que degrada o resultado. Para evitar: leia o template inteiro, entenda o propósito de cada bloco antes de alterar, e teste após cada mudança." },
  // [14] revisa "API Key" (A3 módulo 13)
  { id: "essay-a3-14", type: "essay",
    prompt: "Onde uma chave de API NUNCA deve ser armazenada? O que você faria se sua chave de API vazasse em um repositório público?",
    placeholder: "Liste onde não guardar e descreva a resposta ao vazamento...",
    referenceAnswer: "Uma API key jamais deve estar no código front-end (browser) ou commitada em repositório público — qualquer pessoa pode ver e usar. Se vazar: 1) Rotacione imediatamente no painel do provedor (revogue a chave antiga e gere uma nova). 2) Atualize todos os ambientes e segredos que usavam a chave antiga. 3) Verifique os logs do provedor por uso não autorizado. Apagar o commit não basta — o histórico do Git preserva o segredo." },
  // [15] revisa "Migrations" (A3 módulo 14)
  { id: "essay-a3-15", type: "essay",
    prompt: "O que é uma migration de banco de dados e por que ela é preferível a alterar o banco diretamente pelo painel?",
    placeholder: "Defina migration e explique as vantagens sobre o painel...",
    referenceAnswer: "Uma migration é um arquivo versionado com instruções SQL que evolui o esquema do banco de forma reproduzível. É preferível ao painel porque: 1) fica no controle de versão (Git), 2) pode ser revisada em PR antes de ser aplicada, 3) garante que qualquer ambiente (dev, staging, prod) chegue ao mesmo estado ao rodar a migration. Mudanças pelo painel não ficam registradas e não são replicáveis." },
  // [16] revisa "Health Check" (A3 módulo 15)
  { id: "essay-a3-16", type: "essay",
    prompt: "Qual é a diferença entre liveness e readiness em health checks? Como você verificaria a saúde do banco de dados de forma eficiente?",
    placeholder: "Explique cada tipo e descreva a verificação de banco...",
    referenceAnswer: "Liveness verifica se o processo está vivo — se falhar, o orquestrador reinicia o container. Readiness verifica se o serviço está pronto para receber tráfego (banco, cache e dependências OK) — se falhar, o balanceador para de enviar requisições sem matar o processo. Para verificar o banco: execute SELECT 1 com um timeout curto — prova que o pool de conexões funciona e o banco responde queries sem gerar carga desnecessária." },
  // [17] revisa "Cron Jobs" (A3 módulo 16)
  { id: "essay-a3-17", type: "essay",
    prompt: "O que é um cron job e o que significa a expressão '0 9 * * 1'? Quais práticas evitam problemas em produção?",
    placeholder: "Defina cron job, interprete a expressão e liste as práticas...",
    referenceAnswer: "Cron job é uma tarefa agendada que roda automaticamente em horários definidos por uma expressão de 5 campos (min hora dia-mês mês dia-semana). '0 9 * * 1' = toda segunda-feira às 09:00. Práticas essenciais: tornar a tarefa idempotente (rodar duas vezes não estraga dados), registrar logs com horário e usar locks (mutex) para evitar execuções sobrepostas quando o job demora mais do que seu intervalo." },
  // [18] revisa "Node.js" (A3 módulo 17)
  { id: "essay-a3-18", type: "essay",
    prompt: "O que é o Node.js e o que significa dizer que ele é um 'runtime'? Para quais tipos de tarefa ele é mais indicado?",
    placeholder: "Defina Node.js e explique runtime com exemplos de uso...",
    referenceAnswer: "Node.js é um ambiente de execução (runtime) que permite rodar JavaScript fora do navegador — no servidor, no terminal e em ferramentas de CLI. Runtime significa o motor que interpreta, compila e executa o código, fornecendo APIs nativas (fs, http, path). É mais indicado para: servidores web e APIs REST, ferramentas de linha de comando, scripts de build (Vite, Webpack) e automações de I/O assíncrono." },
  // [19] revisa "Git Bash" (A3 módulo 18)
  { id: "essay-a3-19", type: "essay",
    prompt: "Explique a diferença entre 'git add', 'git commit' e 'git push'. Em que situação você usaria 'git clone'?",
    placeholder: "Descreva cada comando e o caso de uso do clone...",
    referenceAnswer: "git add prepara arquivos para o commit (staging area). git commit salva as alterações no histórico local com uma mensagem descritiva. git push envia os commits locais para o repositório remoto (GitHub). git clone faz uma cópia completa de um repositório remoto para a máquina local — usado quando você quer trabalhar em um projeto existente pela primeira vez." },
  // [20] revisa "npm" (A3 módulo 19)
  { id: "essay-a3-20", type: "essay",
    prompt: "O que é o npm e o que faz o comando 'npm install'? Qual a diferença entre 'dependencies' e 'devDependencies' no package.json?",
    placeholder: "Defina npm, descreva npm install e explique as dependências...",
    referenceAnswer: "npm (Node Package Manager) é o gerenciador de pacotes do Node.js — instala, atualiza e remove bibliotecas. 'npm install' lê o package.json, resolve versões compatíveis e baixa tudo para node_modules. 'dependencies' são pacotes necessários em produção (ex.: React, Express). 'devDependencies' são usados apenas no desenvolvimento (ex.: Vitest, ESLint) e não são incluídos no build de produção." },
]

// ── Atividades extras (fill-blank / match / order) para os módulos novos ──

// A1
const a1OQueEPromptExtra: LessonActivity[] = [
  {
    id: "a1oqp-fb",
    type: "fill-blank",
    sentence: "Um {___} é a instrução que você envia para um modelo de linguagem (LLM) para obter uma resposta.",
    options: [
      { id: "a", text: "prompt" },
      { id: "b", text: "cookie" },
      { id: "c", text: "endpoint" },
    ],
    correct: "a",
    explanation: "Prompt é o termo técnico para a entrada que você fornece à IA — seja uma pergunta, um comando ou um texto para continuar.",
  },
]

const a1ContextoClareza_extra: LessonActivity[] = [
  {
    id: "a1cc-match",
    type: "match",
    instruction: "Ligue cada elemento de um prompt ao que ele define:",
    pairs: [
      { word: "Contexto", definition: "Quem você é e por que está perguntando" },
      { word: "Objetivo", definition: "O que você quer que a IA faça" },
      { word: "Público-alvo", definition: "Para quem a resposta é destinada" },
      { word: "Formato", definition: "Como a saída deve ser estruturada" },
    ],
    correctPairs: { "Contexto": "Quem você é e por que está perguntando", "Objetivo": "O que você quer que a IA faça", "Público-alvo": "Para quem a resposta é destinada", "Formato": "Como a saída deve ser estruturada" },
    explanation: "Um prompt completo tem contexto (situação), objetivo (ação), público (receptor) e formato (estrutura). Cada elemento elimina uma possível ambiguidade.",
  },
]

const a1PersonasExtra: LessonActivity[] = [
  {
    id: "a1pr-fb",
    type: "fill-blank",
    sentence: "Pedir 'Aja como um {___} especializado em X' é a técnica de role prompting que calibra o nível técnico e o tom da resposta.",
    options: [
      { id: "a", text: "especialista sênior" },
      { id: "b", text: "arquivo de texto" },
      { id: "c", text: "banco de dados" },
    ],
    correct: "a",
    explanation: "Role prompting atribui uma persona ao modelo. 'Especialista sênior' calibra profundidade e vocabulário; definir a área de atuação torna a persona ainda mais precisa.",
  },
]

const a1EstruturasExtra: LessonActivity[] = [
  {
    id: "a1ep-fb",
    type: "fill-blank",
    sentence: "No framework CRAFT, a letra 'F' representa {___} — o campo que define como a saída deve ser estruturada (lista, JSON, tabela etc.).",
    options: [
      { id: "a", text: "Formato (Format)" },
      { id: "b", text: "Foco" },
      { id: "c", text: "Fluxo" },
    ],
    correct: "a",
    explanation: "Formato (Format) é o 'F' do CRAFT. Especificar o formato elimina a necessidade de reformatar a resposta manualmente — JSON, lista numerada, tabela, parágrafos.",
  },
]

const a1FewShotExtra: LessonActivity[] = [
  {
    id: "a1fs-order",
    type: "order",
    instruction: "Conecte cada técnica de prompting ao número de exemplos que ela usa:",
    leftItems: [
      { id: "a", text: "Zero-shot" },
      { id: "b", text: "One-shot" },
      { id: "c", text: "Few-shot" },
    ],
    rightItems: [
      { id: "x", text: "Nenhum exemplo fornecido" },
      { id: "y", text: "Um único exemplo de input/output" },
      { id: "z", text: "Dois ou mais exemplos" },
    ],
    correctPairs: { a: "x", b: "y", c: "z" },
    explanation: "Zero = 0 exemplos. One = 1. Few = 2+. Mais exemplos ensinam o padrão melhor, mas aumentam o tamanho do prompt.",
  },
]

const a1RefinoExtra: LessonActivity[] = [
  {
    id: "a1ri-match",
    type: "match",
    instruction: "Ligue cada etapa do ciclo de refino ao que ela representa:",
    pairs: [
      { word: "Testar", definition: "Rodar o prompt e coletar o resultado" },
      { word: "Analisar", definition: "Identificar onde a resposta falhou" },
      { word: "Melhorar", definition: "Editar o prompt com base na análise" },
      { word: "Versionar", definition: "Salvar a nova versão como v2, v3…" },
    ],
    correctPairs: { "Testar": "Rodar o prompt e coletar o resultado", "Analisar": "Identificar onde a resposta falhou", "Melhorar": "Editar o prompt com base na análise", "Versionar": "Salvar a nova versão como v2, v3…" },
    explanation: "Refino iterativo é um ciclo: testar → analisar → melhorar → versionar. Sem versionar, você perde o histórico do que funcionou.",
  },
]

// A2
const a2CotExtra: LessonActivity[] = [
  {
    id: "a2cot-fb",
    type: "fill-blank",
    sentence: "A frase '{___}' é a instrução mais simples para ativar o raciocínio explícito (chain-of-thought) em um prompt.",
    options: [
      { id: "a", text: "Pense passo a passo" },
      { id: "b", text: "Seja criativo" },
      { id: "c", text: "Responda rapidamente" },
    ],
    correct: "a",
    explanation: "'Pense passo a passo' (Think step by step) instrui o modelo a externalizar o raciocínio antes da resposta final, reduzindo erros em tarefas de lógica.",
  },
]

const a2DecomposicaoExtra: LessonActivity[] = [
  {
    id: "a2dec-order",
    type: "order",
    instruction: "Conecte cada etapa de decomposição ao seu papel no pipeline de criação de um artigo:",
    leftItems: [
      { id: "a", text: "Etapa 1 — Estrutura" },
      { id: "b", text: "Etapa 2 — Rascunho" },
      { id: "c", text: "Etapa 3 — Revisão" },
      { id: "d", text: "Etapa 4 — Publicação" },
    ],
    rightItems: [
      { id: "w", text: "Gerar outline com tópicos e subtópicos" },
      { id: "x", text: "Desenvolver o conteúdo de cada seção" },
      { id: "y", text: "Corrigir tom, erros e coerência" },
      { id: "z", text: "Formatar e distribuir no canal certo" },
    ],
    correctPairs: { a: "w", b: "x", c: "y", d: "z" },
    explanation: "Outline → conteúdo → revisão → publicação é o pipeline clássico. Cada etapa pode ser um prompt separado, com revisão humana entre elas.",
  },
]

const a2RestricaoExtra: LessonActivity[] = [
  {
    id: "a2res-fb",
    type: "fill-blank",
    sentence: "Uma restrição negativa ('não faça X') funciona melhor combinada com uma instrução {___} equivalente ('faça Y em vez disso').",
    options: [
      { id: "a", text: "positiva" },
      { id: "b", text: "inversa" },
      { id: "c", text: "longa" },
    ],
    correct: "a",
    explanation: "Restrições negativas dizem o que evitar; instruções positivas dizem o que fazer. Juntas, eliminam ambiguidade e dão ao modelo um caminho claro.",
  },
]

const a2EstiloTomExtra: LessonActivity[] = [
  {
    id: "a2et-match",
    type: "match",
    instruction: "Ligue cada tom ao contexto mais adequado:",
    pairs: [
      { word: "Formal", definition: "Relatório executivo ou comunicação corporativa" },
      { word: "Conversacional", definition: "Tutorial ou blog para iniciantes" },
      { word: "Técnico", definition: "Documentação de API ou white paper" },
      { word: "Empático", definition: "Mensagem de suporte ao cliente em crise" },
    ],
    correctPairs: { "Formal": "Relatório executivo ou comunicação corporativa", "Conversacional": "Tutorial ou blog para iniciantes", "Técnico": "Documentação de API ou white paper", "Empático": "Mensagem de suporte ao cliente em crise" },
    explanation: "Tom errado no contexto certo quebra a comunicação. Um e-mail de suporte com tom técnico frio pode frustrar um cliente — mesmo com a resposta correta.",
  },
]

const a2MultiEtapaExtra: LessonActivity[] = [
  {
    id: "a2me-order",
    type: "order",
    instruction: "Ordene as etapas de um pipeline multi-etapa para gerar um relatório de mercado:",
    leftItems: [
      { id: "a", text: "Passo 1" },
      { id: "b", text: "Passo 2" },
      { id: "c", text: "Passo 3" },
      { id: "d", text: "Passo 4" },
    ],
    rightItems: [
      { id: "w", text: "Definir escopo e perguntas-chave" },
      { id: "x", text: "Coletar e resumir dados por seção" },
      { id: "y", text: "Gerar análise e conclusões" },
      { id: "z", text: "Formatar e revisar o documento final" },
    ],
    correctPairs: { a: "w", b: "x", c: "y", d: "z" },
    explanation: "Escopo → coleta → análise → formato é o pipeline típico. Validar cada etapa antes de avançar garante que o resultado final tenha qualidade.",
  },
]

const a2AvaliacaoExtra: LessonActivity[] = [
  {
    id: "a2ar-fb",
    type: "fill-blank",
    sentence: "Quando um modelo de linguagem gera informações falsas com alto grau de confiança, chamamos esse fenômeno de {___}.",
    options: [
      { id: "a", text: "alucinação (hallucination)" },
      { id: "b", text: "sobrecarga (overload)" },
      { id: "c", text: "truncagem (truncation)" },
    ],
    correct: "a",
    explanation: "Alucinação (hallucination) é o principal risco dos LLMs: o modelo inventa fatos com confiança. Identificar exige verificar fontes primárias, especialmente datas, nomes e estatísticas.",
  },
]

const a2RefinoDadosExtra: LessonActivity[] = [
  {
    id: "a2rd-match",
    type: "match",
    instruction: "Ligue cada conceito de melhoria de prompt ao seu significado:",
    pairs: [
      { word: "Teste A/B", definition: "Comparar duas versões do prompt com métricas objetivas" },
      { word: "Regressão", definition: "Garantir que melhorias não quebraram casos anteriores" },
      { word: "Log de erros", definition: "Registro de inputs que geraram respostas incorretas" },
      { word: "Golden set", definition: "Conjunto de casos com respostas ideais para benchmark" },
    ],
    correctPairs: { "Teste A/B": "Comparar duas versões do prompt com métricas objetivas", "Regressão": "Garantir que melhorias não quebraram casos anteriores", "Log de erros": "Registro de inputs que geraram respostas incorretas", "Golden set": "Conjunto de casos com respostas ideais para benchmark" },
    explanation: "Engenharia de prompt profissional usa as mesmas práticas de engenharia de software: testes, regressão e benchmarks para melhorar com dados.",
  },
]

// A3
const a3CodigoExtra: LessonActivity[] = [
  {
    id: "a3pc-fb",
    type: "fill-blank",
    sentence: "Ao pedir código, especificar a linguagem, a {___} das bibliotecas usadas e exemplos de entrada/saída elimina a maioria das ambiguidades.",
    options: [
      { id: "a", text: "versão" },
      { id: "b", text: "cor" },
      { id: "c", text: "localização geográfica" },
    ],
    correct: "a",
    explanation: "Linguagem + versão + bibliotecas + I/O de exemplo é o combo mínimo para código reutilizável. Sem versão, o modelo pode gerar código incompatível com seu ambiente.",
  },
]

const a3AutomacaoExtra: LessonActivity[] = [
  {
    id: "a3ai-match",
    type: "match",
    instruction: "Ligue cada ferramenta de automação ao seu perfil de uso:",
    pairs: [
      { word: "n8n", definition: "Fluxos visuais, código aberto, auto-hospedável" },
      { word: "Zapier", definition: "Automações simples entre SaaS sem código" },
      { word: "Make", definition: "Automações visuais de complexidade média" },
      { word: "Python + API", definition: "Controle total com código customizado" },
    ],
    correctPairs: { "n8n": "Fluxos visuais, código aberto, auto-hospedável", "Zapier": "Automações simples entre SaaS sem código", "Make": "Automações visuais de complexidade média", "Python + API": "Controle total com código customizado" },
    explanation: "Escolha a ferramenta pelo nível de controle necessário: Zapier para o simples, n8n para mais poder, Python quando precisar de lógica avançada ou privacidade total.",
  },
]

const a3NegociosExtra: LessonActivity[] = [
  {
    id: "a3pn-order",
    type: "order",
    instruction: "Ordene o processo de usar IA para gerar uma proposta comercial:",
    leftItems: [
      { id: "a", text: "Passo 1" },
      { id: "b", text: "Passo 2" },
      { id: "c", text: "Passo 3" },
      { id: "d", text: "Passo 4" },
    ],
    rightItems: [
      { id: "w", text: "Definir o template e variáveis da proposta" },
      { id: "x", text: "Preencher contexto (cliente, produto, objetivo)" },
      { id: "y", text: "Gerar rascunho com IA" },
      { id: "z", text: "Revisar e personalizar antes de enviar" },
    ],
    correctPairs: { a: "w", b: "x", c: "y", d: "z" },
    explanation: "Template → contexto → geração → revisão humana. A revisão final é obrigatória: a IA pode acertar o tom mas errar um dado específico do cliente.",
  },
]

const a3FluxosExtra: LessonActivity[] = [
  {
    id: "a3fa-fb",
    type: "fill-blank",
    sentence: "O componente que coordena múltiplos agentes, define a ordem de execução e as condições de parada é chamado de {___}.",
    options: [
      { id: "a", text: "orquestrador (orchestrator)" },
      { id: "b", text: "compilador" },
      { id: "c", text: "proxy reverso" },
    ],
    correct: "a",
    explanation: "Orquestrador é o 'gerente' do fluxo multi-agente. Sem ele, os agentes não sabem quando agir, em que ordem, ou quando o objetivo foi atingido.",
  },
]

const a3MetricasExtra: LessonActivity[] = [
  {
    id: "a3am-match",
    type: "match",
    instruction: "Ligue cada métrica ao que ela mede em sistemas de IA em produção:",
    pairs: [
      { word: "Taxa de alucinação", definition: "Frequência com que o modelo inventa informações" },
      { word: "CSAT", definition: "Satisfação do usuário com a resposta recebida" },
      { word: "Latência P95", definition: "Tempo de resposta no percentil 95 (pior caso frequente)" },
      { word: "Taxa de escalação", definition: "Casos enviados para atendimento humano" },
    ],
    correctPairs: { "Taxa de alucinação": "Frequência com que o modelo inventa informações", "CSAT": "Satisfação do usuário com a resposta recebida", "Latência P95": "Tempo de resposta no percentil 95 (pior caso frequente)", "Taxa de escalação": "Casos enviados para atendimento humano" },
    explanation: "Métricas de IA têm duas camadas: técnicas (latência, tokens) e de negócio (CSAT, escalação). As de negócio dizem se a IA está realmente resolvendo o problema.",
  },
]

const a3GuardrailsExtra: LessonActivity[] = [
  {
    id: "a3gr-fb",
    type: "fill-blank",
    sentence: "A estratégia de usar múltiplas camadas de proteção — prompt + validação no código + filtros — é chamada de {___} em profundidade.",
    options: [
      { id: "a", text: "defesa" },
      { id: "b", text: "ataque" },
      { id: "c", text: "automação" },
    ],
    correct: "a",
    explanation: "Defesa em profundidade (defense in depth) é o princípio de não depender de uma única proteção. Camadas independentes garantem que a falha de uma não comprometa o sistema.",
  },
]

const a3ProjetoFinalExtra: LessonActivity[] = [
  {
    id: "a3pf-order",
    type: "order",
    instruction: "Ordene as etapas do ciclo de desenvolvimento de um produto com IA:",
    leftItems: [
      { id: "a", text: "Etapa 1" },
      { id: "b", text: "Etapa 2" },
      { id: "c", text: "Etapa 3" },
      { id: "d", text: "Etapa 4" },
    ],
    rightItems: [
      { id: "w", text: "Definir o problema e critérios de sucesso" },
      { id: "x", text: "Prototipar com prompt simples (MVP)" },
      { id: "y", text: "Testar com usuários reais e coletar feedback" },
      { id: "z", text: "Medir métricas e iterar na próxima versão" },
    ],
    correctPairs: { a: "w", b: "x", c: "y", d: "z" },
    explanation: "Definir → prototipar → testar → medir é o ciclo de produto aplicado à IA. Sem métricas claras na etapa 1, você não saberá se a IA está realmente resolvendo o problema.",
  },
]

// Conteúdo por trilha → módulo (índice). Falta → DEFAULT_QUESTIONS.
// Agora suporta LessonActivity[] (múltiplos tipos) em vez de apenas Question[]
export const LESSONS: Record<TrackId, LessonActivity[][]> = {
  a1: [
    a1Boas_vindas,                                                           // 0
    [essayA1[0], ...a1OQueEPrompt, ...a1OQueEPromptExtra],                  // 1 ← essay revisa módulo 0
    [essayA1[1], ...a1ContextoClareza, ...a1ContextoClareza_extra],         // 2 ← essay revisa módulo 1
    [essayA1[2], ...a1PersonasRoles, ...a1PersonasExtra],                   // 3 ← essay revisa módulo 2
    [essayA1[3], ...a1EstruturasPrompt, ...a1EstruturasExtra],              // 4 ← essay revisa módulo 3
    [essayA1[4], ...a1FewShot, ...a1FewShotExtra],                          // 5 ← essay revisa módulo 4
    [essayA1[5], ...a1RefinoIterativo, ...a1RefinoExtra],                   // 6 ← essay revisa módulo 5
  ],
  a2: [
    [...a2ChainOfThought, ...a2CotExtra],                                   // 0
    [essayA2[0], ...a2Decomposicao, ...a2DecomposicaoExtra],                // 1 ← essay revisa módulo 0
    [essayA2[1], ...a2Restricoes, ...a2RestricaoExtra],                     // 2 ← essay revisa módulo 1
    [essayA2[2], ...a2EstiloTom, ...a2EstiloTomExtra],                      // 3 ← essay revisa módulo 2
    [essayA2[3], ...a2MultiEtapa, ...a2MultiEtapaExtra],                    // 4 ← essay revisa módulo 3
    [essayA2[4], ...a2AvaliacaoRespostas, ...a2AvaliacaoExtra],             // 5 ← essay revisa módulo 4
    [essayA2[5], ...a2RefinoDados, ...a2RefinoDadosExtra],                  // 6 ← essay revisa módulo 5
    [essayA2[6], ...engenhariaDePrompt],                                    // 7 ← essay revisa módulo 6
    [essayA2[7], ...conhecaLLMs],                                           // 8 ← essay revisa módulo 7
  ],
  a3: [
    [...a3PromptsCodigo, ...a3CodigoExtra],                                 // 0
    [essayA3[0], ...a3AutomacaoIA, ...a3AutomacaoExtra],                    // 1 ← essay revisa módulo 0
    [essayA3[1], ...a3PromptNegocios, ...a3NegociosExtra],                  // 2 ← essay revisa módulo 1
    [essayA3[2], ...a3FluxosAgentes, ...a3FluxosExtra],                     // 3 ← essay revisa módulo 2
    [essayA3[3], ...a3AvaliacaoMetricas, ...a3MetricasExtra],               // 4 ← essay revisa módulo 3
    [essayA3[4], ...a3Guardrails, ...a3GuardrailsExtra],                    // 5 ← essay revisa módulo 4
    [essayA3[5], ...a3ProjetoFinal, ...a3ProjetoFinalExtra],                // 6 ← essay revisa módulo 5
    [essayA3[6], ...aplicandoAgents],                          // 7 ← essay revisa módulo 6
    [essayA3[7], ...usandoOpenRouter],                         // 8 ← essay revisa módulo 7
    [essayA3[8], ...modelosLocais],                            // 9 ← essay revisa módulo 8
    [essayA3[9], ...claudeCodePratica],                        // 10 ← essay revisa módulo 9
    [essayA3[10], ...skillsClaudeCode],                        // 11 ← essay revisa módulo 10
    [essayA3[11], ...personalizarTemplates],                   // 12 ← essay revisa módulo 11
    [essayA3[12], ...apiKeyBasico, ...apiKeyFillBlank],        // 13 ← essay revisa módulo 12
    [essayA3[13], ...migrationsBasico],                        // 14 ← essay revisa módulo 13
    [essayA3[14], ...healthCheckBasico, ...healthOrder],       // 15 ← essay revisa módulo 14
    [essayA3[15], ...cronJobsBasico, ...cronMatch],            // 16 ← essay revisa módulo 15
    [essayA3[16], ...nodeBasico],                              // 17 ← essay revisa módulo 16
    [essayA3[17], ...gitBashBasico, ...gitOrder],              // 18 ← essay revisa módulo 17
    [essayA3[18], ...npmBasico],                               // 19 ← essay revisa módulo 18
    [essayA3[19], ...skillsLLMBasico, ...llmMatch],            // 20 ← essay revisa módulo 19
  ],
};

export function getActivities(track: TrackId, moduleIndex: number): LessonActivity[] {
  const set = LESSONS[track]?.[moduleIndex];
  return set && set.length > 0 ? set : DEFAULT_QUESTIONS;
}

/** @deprecated Use getActivities instead */
export function getQuestions(track: TrackId, moduleIndex: number): LessonActivity[] {
  return getActivities(track, moduleIndex);
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

