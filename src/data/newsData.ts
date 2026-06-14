export type NewsCategory = "OpenAI" | "Anthropic" | "Google" | "ChatGPT"

export interface NewsArticle {
  id: string
  title: string
  description: string
  category: NewsCategory
  date: string
  imageEmoji: string
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "1",
    title: "OpenAI anuncia GPT-4o: mais rápido, multimodal e gratuito",
    description:
      "O novo modelo da OpenAI combina texto, áudio e imagem em tempo real, com redução significativa nos custos de API.",
    category: "OpenAI",
    date: "13 Jun 2026",
    imageEmoji: "🚀",
  },
  {
    id: "2",
    title: "Novo modelo Llama 3 chega com desempenho superior",
    description:
      "Meta lança o Llama 3 com 70B de parâmetros, rivalizando com GPT-4 em benchmarks de raciocínio e codificação.",
    category: "Anthropic",
    date: "11 Jun 2026",
    imageEmoji: "🦙",
  },
  {
    id: "3",
    title: "Prompt Engineering se torna profissão do futuro",
    description:
      "Pesquisa da Stanford aponta que profissionais de prompt engineering ganham 40% mais e têm demanda crescente no mercado.",
    category: "OpenAI",
    date: "09 Jun 2026",
    imageEmoji: "💼",
  },
  {
    id: "4",
    title: "Notion integra IA em todas as ferramentas",
    description:
      "O Notion AI agora está disponível em documentos, bancos de dados e calendários, com suporte a comandos em português.",
    category: "ChatGPT",
    date: "07 Jun 2026",
    imageEmoji: "📝",
  },
  {
    id: "5",
    title: "Claude 4 da Anthropic foca em segurança e interpretabilidade",
    description:
      "A Anthropic apresenta o Claude 4 com foco em alinhamento e transparência, sendo o modelo mais auditável do mercado.",
    category: "Anthropic",
    date: "05 Jun 2026",
    imageEmoji: "🔒",
  },
  {
    id: "6",
    title: "Google Gemini Ultra 2.0 chega ao Workspace",
    description:
      "O Gemini Ultra 2.0 integra-se ao Docs, Sheets e Gmail para geração de conteúdo e resumo de reuniões em tempo real.",
    category: "Google",
    date: "03 Jun 2026",
    imageEmoji: "✨",
  },
  {
    id: "7",
    title: "ChatGPT agora gera vídeos diretamente no chat",
    description:
      "Com a nova integração de geração de vídeo, o ChatGPT permite criar clipes de até 60 segundos por conversa.",
    category: "ChatGPT",
    date: "01 Jun 2026",
    imageEmoji: "🎬",
  },
  {
    id: "8",
    title: "Google lança NotebookLM com IA multimodal",
    description:
      "A versão atualizada do NotebookLM analisa PDFs, vídeos e áudios simultaneamente, gerando resumos e perguntas automáticas.",
    category: "Google",
    date: "29 Mai 2026",
    imageEmoji: "📚",
  },
  {
    id: "9",
    title: "OpenAI abre acesso ao o3-mini para desenvolvedores",
    description:
      "O modelo de raciocínio o3-mini já está disponível via API com preços acessíveis e suporte a prompts encadeados.",
    category: "OpenAI",
    date: "27 Mai 2026",
    imageEmoji: "🧠",
  },
  {
    id: "10",
    title: "ChatGPT bate 500 milhões de usuários ativos mensais",
    description:
      "A OpenAI anuncia marco histórico de 500M de usuários mensais, com crescimento liderado pela América Latina e Ásia.",
    category: "ChatGPT",
    date: "25 Mai 2026",
    imageEmoji: "📈",
  },
]
