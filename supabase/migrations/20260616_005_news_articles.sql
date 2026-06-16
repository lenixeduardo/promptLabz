-- News articles table for the in-app news feed.
-- Articles are publicly readable (no auth required); managed via Supabase Studio or future RSS integration.

CREATE TABLE IF NOT EXISTS public.news_articles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 300),
  description  TEXT NOT NULL CHECK (char_length(description) BETWEEN 1 AND 800),
  category     TEXT NOT NULL CHECK (category IN ('OpenAI', 'Anthropic', 'Google', 'ChatGPT')),
  image_emoji  TEXT NOT NULL DEFAULT '📰',
  visible      BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "News articles are publicly readable" ON public.news_articles;
CREATE POLICY "News articles are publicly readable" ON public.news_articles
  FOR SELECT USING (visible = true);

CREATE INDEX IF NOT EXISTS news_articles_published_at_idx ON public.news_articles (published_at DESC);
CREATE INDEX IF NOT EXISTS news_articles_category_idx ON public.news_articles (category);

-- Seed with current curated articles
INSERT INTO public.news_articles (title, description, category, image_emoji, published_at) VALUES
  (
    'OpenAI anuncia GPT-4o: mais rápido, multimodal e gratuito',
    'O novo modelo da OpenAI combina texto, áudio e imagem em tempo real, com redução significativa nos custos de API.',
    'OpenAI', '🚀', '2026-06-13T12:00:00Z'
  ),
  (
    'Novo modelo Llama 3 chega com desempenho superior',
    'Meta lança o Llama 3 com 70B de parâmetros, rivalizando com GPT-4 em benchmarks de raciocínio e codificação.',
    'Anthropic', '🦙', '2026-06-11T12:00:00Z'
  ),
  (
    'Prompt Engineering se torna profissão do futuro',
    'Pesquisa da Stanford aponta que profissionais de prompt engineering ganham 40% mais e têm demanda crescente no mercado.',
    'OpenAI', '💼', '2026-06-09T12:00:00Z'
  ),
  (
    'Notion integra IA em todas as ferramentas',
    'O Notion AI agora está disponível em documentos, bancos de dados e calendários, com suporte a comandos em português.',
    'ChatGPT', '📝', '2026-06-07T12:00:00Z'
  ),
  (
    'Claude 4 da Anthropic foca em segurança e interpretabilidade',
    'A Anthropic apresenta o Claude 4 com foco em alinhamento e transparência, sendo o modelo mais auditável do mercado.',
    'Anthropic', '🔒', '2026-06-05T12:00:00Z'
  ),
  (
    'Google Gemini Ultra 2.0 chega ao Workspace',
    'O Gemini Ultra 2.0 integra-se ao Docs, Sheets e Gmail para geração de conteúdo e resumo de reuniões em tempo real.',
    'Google', '✨', '2026-06-03T12:00:00Z'
  ),
  (
    'ChatGPT agora gera vídeos diretamente no chat',
    'Com a nova integração de geração de vídeo, o ChatGPT permite criar clipes de até 60 segundos por conversa.',
    'ChatGPT', '🎬', '2026-06-01T12:00:00Z'
  ),
  (
    'Google lança NotebookLM com IA multimodal',
    'A versão atualizada do NotebookLM analisa PDFs, vídeos e áudios simultaneamente, gerando resumos e perguntas automáticas.',
    'Google', '📚', '2026-05-29T12:00:00Z'
  ),
  (
    'OpenAI abre acesso ao o3-mini para desenvolvedores',
    'O modelo de raciocínio o3-mini já está disponível via API com preços acessíveis e suporte a prompts encadeados.',
    'OpenAI', '🧠', '2026-05-27T12:00:00Z'
  ),
  (
    'ChatGPT bate 500 milhões de usuários ativos mensais',
    'A OpenAI anuncia marco histórico de 500M de usuários mensais, com crescimento liderado pela América Latina e Ásia.',
    'ChatGPT', '📈', '2026-05-25T12:00:00Z'
  )
ON CONFLICT DO NOTHING;
