-- Migration: Skills, Prompts, and Achievements Database Schema
-- Date: 2026-06-16
-- Author: PromptLab
-- Description: Create all table schemas for trending skills, skill trails, prompts, lab categories, and achievement definitions with RLS policies and seed data

-- ───────────────────────────────────────────────────────────────────────────────
-- 1. TRENDING SKILLS TABLE
-- ───────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS trending_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  sort_order INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  author VARCHAR(255) NOT NULL,
  installs VARCHAR(10) NOT NULL,
  installs_count INTEGER NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  icon VARCHAR(100) NOT NULL,
  UNIQUE(sort_order)
);

CREATE INDEX idx_trending_skills_category ON trending_skills(category);
CREATE INDEX idx_trending_skills_sort_order ON trending_skills(sort_order);

ALTER TABLE trending_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY trending_skills_select ON trending_skills FOR SELECT USING (true);

-- ───────────────────────────────────────────────────────────────────────────────
-- 2. SKILL TRAIL CATEGORIES TABLE
-- ───────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS skill_trail_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  category_id VARCHAR(50) NOT NULL UNIQUE,
  label VARCHAR(255) NOT NULL,
  icon VARCHAR(100) NOT NULL,
  sort_order INTEGER NOT NULL,
  UNIQUE(sort_order)
);

CREATE INDEX idx_skill_trail_categories_category_id ON skill_trail_categories(category_id);

ALTER TABLE skill_trail_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY skill_trail_categories_select ON skill_trail_categories FOR SELECT USING (true);

-- ───────────────────────────────────────────────────────────────────────────────
-- 3. SKILL TRAIL ITEMS TABLE
-- ───────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS skill_trail_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  category_id VARCHAR(50) NOT NULL REFERENCES skill_trail_categories(category_id) ON DELETE CASCADE,
  item_id VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100) NOT NULL,
  level INTEGER NOT NULL,
  xp INTEGER NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  sort_order INTEGER NOT NULL,
  UNIQUE(category_id, item_id),
  UNIQUE(category_id, sort_order)
);

CREATE INDEX idx_skill_trail_items_category_id ON skill_trail_items(category_id);
CREATE INDEX idx_skill_trail_items_item_id ON skill_trail_items(item_id);

ALTER TABLE skill_trail_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY skill_trail_items_select ON skill_trail_items FOR SELECT USING (true);

-- ───────────────────────────────────────────────────────────────────────────────
-- 4. PROMPTS TABLE
-- ───────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  sort_order INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  color VARCHAR(20) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  example_input TEXT,
  example_output TEXT,
  UNIQUE(sort_order)
);

CREATE INDEX idx_prompts_category ON prompts(category);
CREATE INDEX idx_prompts_difficulty ON prompts(difficulty);
CREATE INDEX idx_prompts_sort_order ON prompts(sort_order);

ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY prompts_select ON prompts FOR SELECT USING (true);

-- ───────────────────────────────────────────────────────────────────────────────
-- 5. LAB CATEGORIES TABLE
-- ───────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS lab_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  category_id VARCHAR(50) NOT NULL UNIQUE,
  label VARCHAR(255) NOT NULL,
  icon VARCHAR(100) NOT NULL,
  prompt_count INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL,
  UNIQUE(sort_order)
);

CREATE INDEX idx_lab_categories_category_id ON lab_categories(category_id);

ALTER TABLE lab_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY lab_categories_select ON lab_categories FOR SELECT USING (true);

-- ───────────────────────────────────────────────────────────────────────────────
-- 6. LAB CONFIG TABLE (PROMPT OF THE DAY)
-- ───────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS lab_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  config_key VARCHAR(100) NOT NULL UNIQUE,
  config_value JSONB NOT NULL
);

CREATE INDEX idx_lab_config_key ON lab_config(config_key);

ALTER TABLE lab_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY lab_config_select ON lab_config FOR SELECT USING (true);

-- ───────────────────────────────────────────────────────────────────────────────
-- 7. ACHIEVEMENT DEFINITIONS TABLE
-- ───────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS achievement_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  achievement_id VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  sort_order INTEGER NOT NULL,
  UNIQUE(sort_order)
);

CREATE INDEX idx_achievement_definitions_id ON achievement_definitions(achievement_id);
CREATE INDEX idx_achievement_definitions_category ON achievement_definitions(category);

ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY achievement_definitions_select ON achievement_definitions FOR SELECT USING (true);

-- ───────────────────────────────────────────────────────────────────────────────
-- 8. SEED DATA: TRENDING SKILLS (43 items)
-- ───────────────────────────────────────────────────────────────────────────────

INSERT INTO trending_skills (sort_order, name, description, category, author, installs, installs_count, tags, icon) VALUES
(1, 'Test-Driven Development (TDD)', 'Implementa o ciclo red-green-refactor para desenvolvimento orientado a testes. Escreva o teste primeiro, depois o código mínimo para passar, e refatore com segurança.', 'Desenvolvimento', 'mattpocock', '145K', 145000, ARRAY['testing', 'tdd', 'quality'], 'CheckSquare'),
(2, 'Diagnose (Debugging)', 'Loop disciplinado de diagnóstico: reproduzir → minimizar → hipotetizar → instrumentar → corrigir → testar regressão. Caça a bugs sistemática.', 'Desenvolvimento', 'mattpocock', '132K', 132000, ARRAY['debugging', 'diagnosis', 'bug-hunting'], 'Bug'),
(3, 'Improve Codebase Architecture', 'Identifica oportunidades de refatoração guiadas pela linguagem de domínio e padrões de projeto. Remove acoplamento e melhora coesão.', 'Desenvolvimento', 'mattpocock', '98K', 98000, ARRAY['architecture', 'refactoring', 'clean-code'], 'Building2'),
(4, 'Vercel React Best Practices', 'Padrões e boas práticas para React no ecossistema Vercel: Server Components, Data Fetching, Streaming, Edge Runtime, Core Web Vitals.', 'Desenvolvimento', 'vercel-labs', '312K', 312000, ARRAY['react', 'vercel', 'frontend', 'best-practices'], 'Globe'),
(5, 'Next.js Best Practices', 'Boas práticas para Next.js App Router, caching, Server Components, metadados, middleware e otimização de imagens.', 'Desenvolvimento', 'vercel-labs', '298K', 298000, ARRAY['nextjs', 'react', 'ssr', 'app-router'], 'FileJson'),
(6, 'Supabase + PostgreSQL Best Practices', 'Design de esquemas, Row-Level Security, real-time subscriptions, Edge Functions e estratégias de migração para Supabase.', 'Desenvolvimento', 'supabase', '187K', 187000, ARRAY['database', 'postgres', 'supabase', 'backend'], 'Database'),
(7, 'Web App Testing', 'Testes com Vitest, React Testing Library e Playwright. Cobertura de testes unitários, de componente e E2E com acessibilidade.', 'Desenvolvimento', 'anthropics', '156K', 156000, ARRAY['testing', 'playwright', 'vitest', 'e2e'], 'ShieldCheck'),
(8, 'Skill Creator', 'Cria novas skills para agentes de IA com estrutura padronizada, frontmatter validação e diretrizes de publicação.', 'Desenvolvimento', 'anthropics', '89K', 89000, ARRAY['skill-creation', 'agents', 'tooling'], 'Wand2'),
(9, 'High-End Visual Design', 'Define fontes, espaçamentos, sombras e animações exatas que fazem um site parecer caro e premium. Bloqueia padrões genéricos de IA.', 'Design & UI', 'leonxlnx', '234K', 234000, ARRAY['design', 'visual', 'premium', 'ui'], 'Palette'),
(10, 'Design Taste — Frontend', 'Skill anti-slop para landing pages, portfólios e redesigns. Interfaces que não parecem template. Audit-first, strict pre-flight check.', 'Design & UI', 'leonxlnx', '198K', 198000, ARRAY['frontend', 'design-system', 'taste'], 'Paintbrush'),
(11, 'Image to Code', 'Gera imagens de design seção por seção, analisa composição e implementa o site correspondente com alta fidelidade visual.', 'Design & UI', 'leonxlnx', '167K', 167000, ARRAY['design-to-code', 'frontend', 'implementation'], 'Monitor'),
(12, 'Brand Kit', 'Criação de brand-guidelines boards, sistemas de logo, identity decks e apresentações visuais para marcas premium.', 'Design & UI', 'leonxlnx', '145K', 145000, ARRAY['branding', 'identity', 'logo', 'guidelines'], 'Trophy'),
(13, 'Frontend Design', 'Diretrizes de design e implementação para aplicações web modernas: componentes, responsividade, acessibilidade e sistemas de design.', 'Design & UI', 'anthropics', '178K', 178000, ARRAY['design', 'frontend', 'ui-ux', 'accessibility'], 'Layout'),
(14, 'Industrial Brutalist UI', 'Interfaces mecânicas cruas que fundem tipografia suíça com estética de terminal militar. Ideal para dashboards e sites editoriais.', 'Design & UI', 'leonxlnx', '88K', 88000, ARRAY['brutalist', 'design', 'dashboard', 'editorial'], 'Server'),
(15, 'AI Image Generation', 'Geração de imagens de alta qualidade com modelos de difusão: Flux, DALL-E 3, Stable Diffusion. Controle de estilo, composição e variações.', 'IA & Media', 'agentspace-so', '456K', 456000, ARRAY['ai', 'image', 'generation', 'diffusion'], 'Image'),
(16, 'AI Video Generation', 'Geração e edição de vídeos com IA: texto-para-vídeo com Kling 3.0, edição, inpaint, extensão de clipes e lip-sync.', 'IA & Media', 'agentspace-so', '312K', 312000, ARRAY['ai', 'video', 'generation', 'kling'], 'Video'),
(17, 'AI Music Generation', 'Criação musical com IA via ElevenLabs: composição por texto, controle de estilo e gênero, produção de música royalty-free.', 'IA & Media', 'agentspace-so', '234K', 234000, ARRAY['ai', 'music', 'audio', 'elevenlabs'], 'Music'),
(18, 'Image Editing', 'Edição avançada de imagens com IA: inpainting, outpainting, relighting, ControlNet pose, remoção de fundo e transformação.', 'IA & Media', 'agentspace-so', '198K', 198000, ARRAY['ai', 'image-editing', 'inpainting', 'controlnet'], 'Scissors'),
(19, 'AI Avatar Video', 'Criação de vídeos com avatar de IA: geração realista a partir de fotos, text-to-speech natural, lip-sync e suporte multilíngue.', 'IA & Media', 'agentspace-so', '167K', 167000, ARRAY['ai', 'avatar', 'video', 'synthetic-media'], 'UserCircle'),
(20, 'Azure Kubernetes (AKS)', 'Gerenciamento completo do Azure Kubernetes Service: provisionamento, node pools, estratégias de deploy, monitoring e RBAC.', 'Cloud & Infra', 'microsoft', '278K', 278000, ARRAY['azure', 'kubernetes', 'aks', 'containers'], 'Box'),
(21, 'Azure Security', 'Boas práticas de segurança no Azure: Entra ID, RBAC, Key Vault, Defender for Cloud, network security groups e compliance.', 'Cloud & Infra', 'microsoft', '245K', 245000, ARRAY['azure', 'security', 'entra-id', 'compliance'], 'Shield'),
(22, 'Azure Cost Optimisation', 'Análise de custos, budgeting, reserved instances, rightsizing e otimização de gastos em nuvem Azure.', 'Cloud & Infra', 'microsoft', '212K', 212000, ARRAY['azure', 'cost', 'optimization', 'finops'], 'Coins'),
(23, 'Azure Cloud Migration', 'Estratégias de migração on-premises para Azure: assessment, planejamento (rehost/refactor/rebuild), Azure Migrate e cutover.', 'Cloud & Infra', 'microsoft', '189K', 189000, ARRAY['azure', 'migration', 'cloud', 'infrastructure'], 'ArrowRight'),
(24, 'OpenClaw — Secure Linux Cloud', 'Servidor Linux hardening: firewall, SSH key-only, fail2ban, monitoring com Prometheus, backups automatizados e auditoria de segurança.', 'Cloud & Infra', 'microsoft', '98K', 98000, ARRAY['linux', 'security', 'server', 'hardening'], 'Terminal'),
(25, 'Copywriting', 'Redação profissional de marketing: landing pages, e-mails, anúncios, sales pages. Adaptação de tom de voz e variações para A/B test.', 'Marketing', 'coreyhaines31', '198K', 198000, ARRAY['copywriting', 'marketing', 'conversion', 'sales'], 'PenLine'),
(26, 'SEO Audit', 'Auditoria completa de SEO: technical SEO, on-page, off-page, content gaps, structured data e recomendações acionáveis priorizadas.', 'Marketing', 'coreyhaines31', '176K', 176000, ARRAY['seo', 'audit', 'technical-seo', 'content'], 'Search'),
(27, 'Programmatic SEO', 'Criação de páginas SEO em escala usando templates, feeds de dados e automação. URL structure, canonical tags e conteúdo unique.', 'Marketing', 'coreyhaines31', '156K', 156000, ARRAY['seo', 'programmatic', 'scale', 'automation'], 'Layers'),
(28, 'Marketing Psychology', 'Aplicação de behavioral science e vieses cognitivos no marketing: prova social, escassez, ancoragem, framing e princípios de persuasão.', 'Marketing', 'coreyhaines31', '145K', 145000, ARRAY['psychology', 'marketing', 'persuasion', 'behavioral-science'], 'Brain'),
(29, 'Conversion Rate Optimisation (CRO)', 'Otimização de taxas de conversão: análise de funil, A/B testing, layout de landing pages, formulários e UX data-driven.', 'Marketing', 'coreyhaines31', '134K', 134000, ARRAY['cro', 'conversion', 'optimization', 'ab-testing'], 'TrendingUp'),
(30, 'AI SEO', 'Otimização de conteúdo para mecanismos de busca com IA: AI Overviews, LLM citations, structured data para consumo por IA, entity SEO.', 'Marketing', 'coreyhaines31', '112K', 112000, ARRAY['ai-seo', 'llm', 'search', 'content'], 'Sparkles'),
(31, 'Product Marketing', 'Estratégia de product marketing: posicionamento, mensagem, launch plan, sales enablement, persona e estratégias PLG.', 'Marketing', 'coreyhaines31', '98K', 98000, ARRAY['product-marketing', 'gtm', 'positioning', 'launch'], 'Rocket'),
(32, 'Brainstorming', 'Sessões estruturadas de brainstorming: pensamento divergente para geração de ideias, convergente para seleção, matriz de prioridade.', 'Produtividade', 'obra', '234K', 234000, ARRAY['brainstorming', 'ideation', 'creativity', 'planning'], 'Lightbulb'),
(33, 'Writing Plans', 'Criação de planos de execução estruturados a partir de objetivos: breakdown em passos acionáveis, dependências, milestones e riscos.', 'Produtividade', 'obra', '212K', 212000, ARRAY['planning', 'execution', 'project-management', 'strategy'], 'ClipboardList'),
(34, 'Executing Plans', 'Execução de planos passo a passo com verification gates, progress tracking, handling de blockers e status reporting.', 'Produtividade', 'obra', '189K', 189000, ARRAY['execution', 'tracking', 'verification', 'delivery'], 'ListChecks'),
(35, 'Remembering Conversations', 'Memória episódica para agentes de IA: armazenamento de contexto, decisões e progresso entre sessões com recall inteligente.', 'Produtividade', 'obra', '167K', 167000, ARRAY['memory', 'context', 'sessions', 'ai-agents'], 'History'),
(36, 'Teach', 'Ensino multi-sessão: avalia o nível do usuário, cria trilha de aprendizado, trackeia progresso e adapta o ritmo com repetição espaçada.', 'Produtividade', 'mattpocock', '123K', 123000, ARRAY['teaching', 'learning', 'education', 'tutoring'], 'GraduationCap'),
(37, 'Lark Doc', 'Gestão de documentos no Lark/Feishu: criação, edição, colaboração, templates, import/export Markdown/Word/PDF e automação.', 'Produtividade', 'larksuite', '198K', 198000, ARRAY['lark', 'documents', 'collaboration', 'productivity'], 'FileText'),
(38, 'Lark OKR', 'Gestão de OKRs no Lark/Feishu: criação de objetivos, tracking de key results, check-ins semanais, alinhamento cross-team.', 'Produtividade', 'larksuite', '156K', 156000, ARRAY['lark', 'okr', 'goals', 'alignment'], 'Target'),
(39, 'Dispatching Parallel Agents', 'Orquestração de múltiplos agentes de IA em paralelo: divisão de trabalho, dispatch com instruções claras, merge de resultados e retry.', 'Agentes & Workflows', 'obra', '256K', 256000, ARRAY['agents', 'parallel', 'orchestration', 'workflow'], 'GitBranch'),
(40, 'Subagent-Driven Development', 'Divide tarefas de desenvolvimento entre subagentes especializados: arquitetura, implementação, revisão, testes e documentação.', 'Agentes & Workflows', 'obra', '198K', 198000, ARRAY['agents', 'development', 'subagents', 'automation'], 'Workflow'),
(41, 'Verification Before Completion', 'Gates de qualidade antes de marcar tarefa como completa: checklist de requisitos, execução de testes, revisão de edge cases.', 'Agentes & Workflows', 'obra', '178K', 178000, ARRAY['quality', 'verification', 'checklist', 'completion'], 'CheckCircle2'),
(42, 'MCP Builder', 'Construção de servidores MCP (Model Context Protocol): definição de tools, schemas, recursos, autenticação, deploy e integração.', 'Agentes & Workflows', 'anthropics', '156K', 156000, ARRAY['mcp', 'tools', 'api', 'agents'], 'Plug'),
(43, 'Browsing', 'Automação de navegação web para agentes de IA: interação com páginas, preenchimento de formulários, extração de dados e screenshots.', 'Agentes & Workflows', 'obra', '145K', 145000, ARRAY['browsing', 'automation', 'web', 'scraping'], 'Globe')
ON CONFLICT DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────────────
-- 9. SEED DATA: SKILL TRAIL CATEGORIES (4 categories)
-- ───────────────────────────────────────────────────────────────────────────────

INSERT INTO skill_trail_categories (sort_order, category_id, label, icon) VALUES
(1, 'criatividade', 'Criatividade', 'Lightbulb'),
(2, 'prompt-engineering', 'Engenharia de Prompts', 'Sparkles'),
(3, 'marketing', 'Marketing', 'Megaphone'),
(4, 'analise-dados', 'Análise de Dados', 'BarChart3')
ON CONFLICT DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────────────
-- 10. SEED DATA: SKILL TRAIL ITEMS (20 items)
-- ───────────────────────────────────────────────────────────────────────────────

INSERT INTO skill_trail_items (sort_order, category_id, item_id, name, description, icon, level, xp, difficulty) VALUES
(1, 'criatividade', 'geracao-ideias', 'Geração de Ideias', 'Gere muitas ideias relevantes para qualquer tema.', 'Lightbulb', 1, 100, 'Iniciante'),
(2, 'criatividade', 'variacoes-criativas', 'Variações Criativas', 'Transforme uma ideia em diferentes abordagens únicas.', 'Lightbulb', 2, 150, 'Iniciante'),
(3, 'criatividade', 'analogias-metaforas', 'Analogias e Metáforas', 'Use analogias para explicar conceitos com clareza.', 'Star', 2, 150, 'Iniciante'),
(4, 'criatividade', 'narrativas-historias', 'Narrativas e Histórias', 'Crie histórias envolventes e contextos ricos.', 'BookOpen', 3, 200, 'Intermediario'),
(5, 'criatividade', 'brainstorm-avancado', 'Brainstorm Avançado', 'Combine técnicas para gerar ideias disruptivas.', 'Zap', 3, 200, 'Intermediario'),
(6, 'criatividade', 'perspectivas', 'Perspectivas Inovadoras', 'Olhe para o problema por ângulos inesperados.', 'Eye', 4, 250, 'Avancado'),
(7, 'prompt-engineering', 'estrutura-basica', 'Estrutura Básica', 'Monte prompts claros com contexto, tarefa e formato.', 'ListChecks', 1, 100, 'Iniciante'),
(8, 'prompt-engineering', 'contexto-papel', 'Contexto e Papel', 'Defina personas e contextos para respostas mais precisas.', 'User', 2, 150, 'Iniciante'),
(9, 'prompt-engineering', 'cadeia-pensamento', 'Cadeia de Pensamento', 'Induza o modelo a raciocinar passo a passo.', 'Brain', 3, 200, 'Intermediario'),
(10, 'prompt-engineering', 'few-shot', 'Few-Shot Learning', 'Use exemplos no prompt para calibrar o comportamento.', 'BookOpen', 3, 200, 'Intermediario'),
(11, 'prompt-engineering', 'prompt-chaining', 'Prompt Chaining', 'Encadeie prompts para resolver tarefas complexas.', 'Workflow', 4, 250, 'Avancado'),
(12, 'prompt-engineering', 'auto-refinamento', 'Auto-Refinamento', 'Faça o modelo revisar e melhorar suas próprias saídas.', 'RefreshCw', 4, 300, 'Avancado'),
(13, 'marketing', 'copy-basico', 'Copywriting Básico', 'Escreva textos persuasivos para produtos e serviços.', 'PenLine', 1, 100, 'Iniciante'),
(14, 'marketing', 'headlines', 'Headlines de Impacto', 'Crie títulos que capturam atenção imediatamente.', 'Target', 2, 150, 'Iniciante'),
(15, 'marketing', 'email-marketing', 'Email Marketing', 'Estruture campanhas de email com alta taxa de abertura.', 'MessageSquare', 3, 200, 'Intermediario'),
(16, 'marketing', 'funil-conteudo', 'Funil de Conteúdo', 'Produza conteúdo para cada etapa da jornada do cliente.', 'TrendingUp', 4, 250, 'Avancado'),
(17, 'analise-dados', 'descricao-dados', 'Descrição de Dados', 'Resuma conjuntos de dados em linguagem natural.', 'BarChart3', 1, 100, 'Iniciante'),
(18, 'analise-dados', 'visualizacao', 'Visualizações', 'Escolha e descreva gráficos adequados para cada dado.', 'LineChart', 2, 150, 'Iniciante'),
(19, 'analise-dados', 'insights', 'Extração de Insights', 'Identifique padrões e anomalias em relatórios.', 'Eye', 3, 200, 'Intermediario'),
(20, 'analise-dados', 'sql-prompts', 'SQL com IA', 'Gere e explique queries SQL complexas via prompts.', 'Database', 4, 250, 'Avancado')
ON CONFLICT DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────────────
-- 11. SEED DATA: PROMPTS (80 items)
-- ───────────────────────────────────────────────────────────────────────────────

INSERT INTO prompts (sort_order, title, difficulty, color, category, description, prompt_text, example_input, example_output) VALUES
(1, 'Prompt para Storytelling', 'Iniciante', 'green', 'Criatividade', 'Criação de narrativas cativantes baseadas em premissas simples, estruturadas com início, meio e fim envolventes.', $$# Instrução
Você é um escritor profissional de ficção literária. Sua tarefa é criar uma narrativa cativante baseada nos detalhes fornecidos.

# Estrutura do Roteiro
1. **Introdução (O Gancho):** Apresente o protagonista em seu cotidiano e o incidente gerador.
2. **Desenvolvimento (Conflito):** O obstáculo crescente e a jornada para superá-lo.$$, 'Gênero: Ficção Científica. Protagonista: Uma jovem engenharia mecânica em Marte.', 'A poeira vermelha batia contra as vidraças...'),
(2, 'Prompts para Design Grafico', 'Avancado', 'green', 'Criatividade', 'Prompts detalhados para geração de arte em ferramentas como Midjourney e DALL-E.', $$# Contexto
Você é um diretor de arte sênior. Crie um prompt descritivo detalhado para geradores de imagens por IA.

# Instruções de Formatação
Forneça a descrição da cena estruturada com:
- **Sujeito:** Foco principal e ação.
- **Estilo:** Foto realista, render 3D, ilustração digital, arte conceitual, etc.$$, 'Tema: Robô de jardinagem futurista', 'Retrato detalhado de um robô de jardinagem...'),
(3, 'Prompt de Pesquisa UX', 'Avancado', 'red', 'Criatividade', 'Criação de roteiros de entrevista, personas e fluxos de experiência focados no usuário.', $$# Papel
Você é um Pesquisador de UX (UX Researcher) experiente.

# Objetivo
Elaborar um guia de roteiro de pesquisa com usuários, contendo perguntas abertas e metas de pesquisa.$$, 'Produto: Um app de controle de gastos para adolescentes', '# Guia de Pesquisa UX'),
(4, 'Desenvolvimento de Personagens', 'Iniciante', 'green', 'Criatividade', 'Geração de fichas de personagens tridimensionais com motivações e arcos de transformação.', $$# Instrução
Crie uma ficha de personagem completa e tridimensional com:
1. **Dados Básicos:** Nome, idade aproximada, ocupação.
2. **Aparência:** Detalhes peculiares e linguagem corporal.$$, 'Conceito: Um detetive aposentado que cuida de um farol isolado.', 'Nome: Arthur Vance'),
(5, 'Construcao de Mundo', 'Intermediario', 'yellow', 'Criatividade', 'Estruturação de cenários fictícios, sistemas de magia, governos e regras sociais para fantasia ou ficção científica.', $$# Prompt de Construcao de Mundo
Você é um criador de mundos de RPG. Desenvolva os aspectos sociais, geográficos, políticos e de magia/tecnologia.$$, 'Cenário: Uma cidade suspensa por ímãs gigantescos', '# Mundo de Ferrum-Avis'),
(6, 'Design de Identidade de Marca', 'Intermediario', 'yellow', 'Criatividade', 'Construção de conceitos visuais e guias de design para identidades visuais de marcas inovadoras.', $$# Prompt de Identidade de Marca
Crie um conceito de design de identidade de marca contendo paleta de cores, tipografia e elementos visuais.$$, 'Empresa: EcoDrive - startup de patinetes elétricos', '## Conceito EcoDrive'),
(7, 'Gerador de Briefing Criativo', 'Iniciante', 'green', 'Criatividade', 'Template de briefing criativo para alinhar equipes de marketing, design e redação em um projeto.', $$# Briefing Criativo
Gere um briefing criativo estruturado contendo: Objetivos do Projeto, Público-Alvo, Principais Entregas e Mensagem-Chave.$$, 'Projeto: Campanha de lançamento de refrigerante saudável', '# Briefing Criativo'),
(8, 'Painel de Conceito Visual', 'Avancado', 'red', 'Criatividade', 'Diretrizes e palavras-chave para criar moodboards e direções visuais artísticas consistentes.', $$# Painel de Conceito Visual
Descreva um painel semântico e visual completo (moodboard) listando texturas, padrões e referências estéticas.$$, 'Tema: Cafeteria Minimalista Nórdica com toque Industrial', '# Painel de Conceito Visual'),
(9, 'Prompt de Atendimento ao Cliente', 'Intermediario', 'yellow', 'Marketing', 'Roteiros de atendimento ao cliente, respostas a reclamações e modelos de FAQ amigáveis.', $$# Papel
Você é um especialista em Experiência do Cliente (Customer Success) sênior.

# Instrução
Escreva uma resposta empática, clara e profissional para o problema relatado pelo cliente.$$, 'Cliente furioso porque pedido de aniversário chegou com atraso', 'Olá, [Nome do Cliente]...'),
(10, 'Copy para Redes Sociais', 'Iniciante', 'green', 'Marketing', 'Redação de posts persuasivos e engajadores para Instagram, LinkedIn e TikTok com hashtags e CTAs.', $$# Instrução
Escreva uma publicação para redes sociais adaptando a linguagem para a plataforma solicitada.

# Diretrizes
- Inclua um gancho (hook) forte na primeira linha
- Termine com uma Chamada para Ação (CTA) clara
- Adicione emojis relevantes e até 5 hashtags estratégicas$$, 'Tópico: Lançamento de e-book gratuito sobre produtividade. Canal: LinkedIn.', '🚀 O fim das tarefas manuais chegou?'),
(11, 'Campanha de Email', 'Intermediario', 'yellow', 'Marketing', 'Fluxos de e-mail marketing para nutrição, vendas e reengajamento de leads.', $$# Objetivo
Você é um Copywriter especialista em E-mail Marketing. Crie uma sequência de e-mails para nutrir e converter leads frios.$$, 'Produto: Curso de transição de carreira para QA/Testes', 'Assunto: Cansado do mesmo domingo à noite?'),
(12, 'Copywriting para Anuncios', 'Intermediario', 'yellow', 'Marketing', 'Criação de anúncios focados em conversão para Google Ads, Meta Ads e LinkedIn.', $$# Prompt de Copywriting para Anuncios
Escreva copies de anúncio de alta conversão usando AIDA ou PAS.$$, 'Serviço: Assessoria de contabilidade online para MEIs', '### Opção 1: Modelo PAS'),
(13, 'Copy para Landing Page', 'Avancado', 'red', 'Marketing', 'Estruturação e redação persuasiva de seções completas para páginas de captura.', $$# Copy para Landing Page
Redija o texto de uma Landing Page focada em conversão de leads/vendas.$$, 'Produto: Aplicativo de meditação rápida para executivos', '# Hero Section'),
(14, 'Calendario de Conteudo', 'Iniciante', 'green', 'Marketing', 'Planejamento e ideias de postagens estruturadas para um mês de produção de conteúdo digital.', $$# Calendário de Conteúdo
Crie uma tabela com ideias de conteúdo para 2 semanas detalhando Dia, Tema, Canal, Formato e Gancho.$$, 'Nicho: Educação Financeira Familiar', '| Dia | Tema | Canal |'),
(15, 'Guia de Voz da Marca', 'Intermediario', 'yellow', 'Marketing', 'Definição de diretrizes de tom de voz, termos recomendados e banidos para a comunicação de uma marca.', $$# Guia de Voz da Marca
Crie um guia rápido de Tom de Voz contendo traços de personalidade e exemplos.$$, 'Marca: Um banco digital para profissionais de games', '# Guia de Voz: Banco Gamer'),
(16, 'Briefing para Influenciadores', 'Iniciante', 'green', 'Marketing', 'Instruções de campanha e diretrizes de criação de conteúdo para influenciadores parceiros.', $$# Briefing para Influenciadores
Escreva um briefing de campanha para influenciadores cobrindo Escopo de Trabalho e Principais Mensagens.$$, 'Campanha: Lançamento de fones de ouvido bluetooth', '# Briefing de Campanha'),
(17, 'Script de Analise de Dados', 'Avancado', 'green', 'Programacao', 'Criação de scripts Python (Pandas/Numpy) para limpeza, transformação e análise estatística de dados.', $$# Papel
Você é um Cientista de Dados sênior.

# Instrução
Escreva um script limpo em Python usando Pandas e Seaborn/Matplotlib.$$, 'Dataset: Vendas de uma rede de farmácias', '```python'),
(18, 'Prompt de Revisao de Codigo', 'Intermediario', 'yellow', 'Programacao', 'Análise de código focado em encontrar bugs, problemas de performance e melhorias de legibilidade.', $$# Instrução
Você é um Engenheiro de Software Principal realizando uma revisão de código (Code Review).$$, 'Código em JavaScript', '### Revisão de Código'),
(19, 'Padrao de Design de API', 'Avancado', 'red', 'Programacao', 'Definição de arquitetura e especificação de rotas RESTful ou endpoints GraphQL seguros e escaláveis.', $$# Especificacao de API
Desenhe um padrão de arquitetura de API RESTful para o caso abaixo.$$, 'Caso: Sistema de agendamento de consultas médicas', '### API Endpoints'),
(20, 'Gerador de Testes Unitarios', 'Intermediario', 'yellow', 'Programacao', 'Geração de casos de testes unitários automatizados para cobrir fluxos normais e cenários de exceção.', $$# Criacao de Testes Unitarios
Gere testes unitários abrangentes testando: caminho feliz, valores limite e tratamento de erros.$$, 'Função: Calcular taxa de juros composta. Tecnologia: Jest/TypeScript.', '```typescript'),
(21, 'Modelo de Relatorio de Bug', 'Iniciante', 'green', 'Programacao', 'Instruções estruturadas para documentar bugs com reprodução passo a passo e logs recomendados.', $$# Gerador de Relatorio de Bug
Crie um relatório de bug padronizado contendo Descrição, Passos para Reprodução e Comportamento Esperado.$$, 'Problema: Botão de checkout recarrega a página em vez de abrir Stripe', '# Bug: Checkout falha'),
(22, 'Esquema de Banco de Dados', 'Avancado', 'red', 'Programacao', 'Desenho de esquemas de banco de dados relacionais ou NoSQL otimizados para consistência e leitura rápida.', $$# Esquema de Banco de Dados Design
Crie um esquema de banco de dados relacional (SQL) com chaves primárias, chaves estrangeiras e índices.$$, 'Sistema: Plataforma de e-learning com cursos e progresso', '```sql'),
(23, 'Construtor de Regex', 'Intermediario', 'yellow', 'Programacao', 'Criação e explicação detalhada de expressões regulares complexas para validação e busca.', $$# Construtor de Regex
Crie uma Expressão Regular (Regex) para encontrar ou validar o padrão de texto solicitado.$$, 'Validar senhas fortes: 8 caracteres, maiúscula, minúscula, número e caractere especial', '**Expressão:**'),
(24, 'Assistente de Refatoracao', 'Avancado', 'red', 'Programacao', 'Otimização de códigos legados aplicando padrões de projeto modernos e melhoria de legibilidade.', $$# Assistente de Refatoracao
Refatore o código legado utilizando padrões de projeto adequados.$$, 'Código legado em Node.js com muitas condicionais para calcular frete', '### Código Refatorado'),
(25, 'Gerador de Plano de Estudos', 'Intermediario', 'yellow', 'Educacao', 'Criação de cronogramas de estudo semanais personalizados com metas de revisão e recursos práticos.', $$# Instrução
Você é um Mentor de Estudos e Especialista em Aprendizagem Acelerada.

# Estrutura do Cronograma
- **Metodologia:** Divisão de blocos de tempo e revisão espaçada$$, 'Objetivo: Aprender SQL em 4 semanas, 1 hora por dia de segunda a sexta', '# Plano de Estudos: SQL em 4 Semanas'),
(26, 'Criador de Quiz', 'Iniciante', 'green', 'Educacao', 'Geração de testes rápidos com perguntas de múltipla escolha e explicações detalhadas das respostas.', $$# Criador de Quiz
Crie um quiz com 5 perguntas de múltipla escolha sobre o tópico especificado.$$, 'Tópico: O ciclo da água e estados físicos da matéria', '1. Qual é o processo...'),
(27, 'Construtor de Plano de Aula', 'Intermediario', 'yellow', 'Educacao', 'Planos de aula detalhados para professores com objetivos pedagógicos, atividades e avaliações.', $$# Construtor de Plano de Aula
Crie um plano de aula completo para professores com Tema, Duração, Objetivos Pedagógicos e Atividades.$$, 'Tema: Introdução à Inteligência Artificial para alunos do 9º ano', '# Plano de Aula'),
(28, 'Explique Como se Eu Tivesse 5 Anos', 'Iniciante', 'green', 'Educacao', 'Simplificação extrema de conceitos complexos usando analogias infantis cotidianas e vocabulário simples.', $$# Explique Como se Eu Tivesse 5 Anos (ELI5)
Explique o conceito fornecido como se estivesse conversando com uma criança de 5 anos.$$, 'Conceito: Criptografia de chave pública e privada', 'Imagine que você tem uma caixinha...'),
(29, 'Gerador de Flashcards', 'Iniciante', 'green', 'Educacao', 'Fichas de pergunta e resposta curta (estilo Anki) ideais para memorização de termos e fórmulas.', $$# Flashcards (Frente e Verso)
Gere 10 flashcards no estilo Anki sobre o tema fornecido.$$, 'Assunto: Vocabulário de Inglês Jurídico (Law)', 'Frente: O que significa...'),
(30, 'Feedback de Redacao', 'Intermediario', 'yellow', 'Educacao', 'Revisão ortográfica, estrutural e argumentativa de redações com propostas de melhoria.', $$# Revisor de Redacao
Você é um avaliador de redações. Avalie a redação fornecida, apontando erros e dando uma nota.$$, 'Tema da Redação: A importância da preservação ambiental nas cidades brasileiras', '# Avaliação da Redação'),
(31, 'Resumo de Pesquisa', 'Avancado', 'red', 'Educacao', 'Resumo de artigos acadêmicos ou relatórios longos extraindo a metodologia, descobertas e limitações.', $$# Resumo de Pesquisa
Resuma o artigo científico fornecido extraindo Metodologia, Resultados/Descobertas e Limitações.$$, 'Artigo sobre o impacto do sono nas notas de estudantes universitários', '# Resumo de Pesquisa'),
(32, 'Mapa Conceitual', 'Intermediario', 'yellow', 'Educacao', 'Esquematização conceitual conectando termos e ideias principais para guiar revisões mentais.', $$# Mapa Conceitual Generator
Crie uma estrutura hierárquica para um mapa conceitual identificando o Conceito Central.$$, 'Tema: Sistema Circulatório Humano', 'Conceito Central: Sistema Circulatório'),
(33, 'Escrita de Curriculo', 'Avancado', 'red', 'Produtividade', 'Otimização de currículos focados em sistemas de recrutamento automático (ATS) e descrição de impacto.', $$# Papel
Você é um Recrutador Sênior e Especialista em Currículos (ATS).

# Instrução
Reescreva as experiências profissionais usando a fórmula X-Y-Z do Google.$$, 'Cargo: Analista de Suporte de TI. Experiência: Resolvia chamados de usuários.', 'Reescrita de Impacto:'),
(34, 'Escrita de Email', 'Iniciante', 'green', 'Produtividade', 'Criação de e-mails corporativos formais, persuasivos ou informativos em poucos segundos.', $$# Compositor de Email
Escreva um e-mail profissional com base nas informações fornecidas.$$, 'Objetivo: Solicitar adiamento do prazo de entrega de relatório financeiro', 'Assunto: Solicitação de Ajuste no Prazo'),
(35, 'Planejador Diario', 'Iniciante', 'green', 'Produtividade', 'Estruturação da rotina diária equilibrando trabalho, bem-estar e compromissos importantes.', $$# Planejador Diario
Gere um cronograma diário realista com base na lista de tarefas informada.$$, 'Tarefas: Responder e-mails (1h), Reunião (1h), Relatório (3h), Academia (1h). Horário: 08:00-18:00', '# Planejamento Diário'),
(36, 'Pauta de Reuniao', 'Iniciante', 'green', 'Produtividade', 'Criação de pautas de reunião focadas e cronometradas para evitar conversas improdutivas.', $$# Pauta de Reuniao Builder
Crie uma pauta de reunião estruturada e produtiva contendo Objetivo, Cronograma de Tópicos e Material.$$, 'Reunião: Alinhamento de lançamento de novo design do site. Duração: 45 minutos', '# Pauta de Reunião'),
(37, 'Matriz de Decisao', 'Intermediario', 'yellow', 'Produtividade', 'Matrizes de decisão para comparar alternativas com pesos atribuídos a cada critério.', $$# Matriz de Decisao
Crie uma tabela comparativa (Matriz de Decisão) para as opções informadas.$$, 'Decisão: Contratar agência terceirizada ou funcionário interno de marketing', '| Opção | Critério |'),
(38, 'Priorizacao de Tarefas', 'Intermediario', 'yellow', 'Produtividade', 'Organização de tarefas usando matrizes de priorização como Eisenhower ou GUT.', $$# Priorização de Tarefas (Matriz de Eisenhower)
Classifique a lista de tarefas nos quatro quadrantes.$$, '- Pagar imposto que vence hoje\n- Conversar sobre férias com colega', '## Quadrante 1: Urgente e Importante'),
(39, 'Avaliacao de Desempenho', 'Avancado', 'red', 'Produtividade', 'Roteiros para autoavaliação profissional ou avaliação de desempenho de liderados.', $$# Avaliacao de Desempenho Assistant
Escreva uma autoavaliação ou avaliação de desempenho estruturada.$$, 'Cargo: Desenvolvedor Front-end Júnior. Conquistas: 12 telas no prazo.', '### Avaliação de Desempenho'),
(40, 'POPs e Checklists', 'Intermediario', 'yellow', 'Produtividade', 'Procedimentos Operacionais Padrão (POPs) claros para delegar e replicar tarefas com perfeição.', $$# SOP Builder (Procedimento Operacional Padrão)
Escreva um POP detalhado contendo Objetivo, Pré-requisitos, Passo a Passo e Troubleshooting.$$, 'Processo: Publicação semanal de artigos no blog (WordPress)', '# POP: Publicação de Artigo'),
(41, 'Construir vs Comprar vs Firmar Parceria', 'Avancado', 'red', 'Gestao de Produto', 'Framework para decidir se uma funcionalidade deve ser desenvolvida internamente ou contratada.', $$# Construir vs Comprar vs Firmar Parceria Analysis
Você é um Diretor de Produto avaliando a estratégia de desenvolvimento.$$, 'Funcionalidade: Sistema de chat e vídeo em telemedicina', '## Análise: Sistema de Vídeo/Chat'),
(42, 'Estrategia de Dados para IA', 'Avancado', 'red', 'Gestao de Produto', 'Desenho de planos de governança, aquisição, rotulagem e pipelines de dados para alimentar modelos de IA.', $$# Estrategia de Dados para IA Framework
Como Gerente de Produto de IA, estruture uma estratégia de dados.$$, 'Produto: Assistente inteligente para análise de contratos jurídicos', '# Estratégia de Dados'),
(43, 'Definicao de Funcionalidade com IA', 'Intermediario', 'yellow', 'Gestao de Produto', 'Definição de escopo, métricas de modelo e limites de erro para novos recursos baseados em IA.', $$# Especificacao de Funcionalidade com IA
Defina as especificações de produto para uma nova funcionalidade de inteligência artificial.$$, 'Funcionalidade: Recomendação de vagas compatíveis no LinkedIn', '# Especificação de Funcionalidade'),
(44, 'Resposta a Incidentes de IA', 'Avancado', 'red', 'Gestao de Produto', 'Planos de contingência e mitigação para falhas e alucinações críticas de modelos de IA.', $$# Resposta a Incidentes de IA Plan
Escreva um guia de resposta rápida a incidentes de IA.$$, 'Incidente: Chatbot gerou termos abusivos e ofereceu produtos por R$ 0,00', '# Plano de Resposta a Incidentes'),
(45, 'Avaliacao de Modelo de IA', 'Intermediario', 'yellow', 'Gestao de Produto', 'Guia para avaliar modelos de linguagem de acordo com alucinações, latência e custo por token.', $$# Avaliacao de Modelo de IA
Crie um framework de avaliação comparando 3 modelos de IA.$$, 'Caso de uso: Classificação em tempo real de mensagens de suporte', '## Tabela de Avaliação'),
(46, 'Pesquisa de Usuarios para IA', 'Intermediario', 'yellow', 'Gestao de Produto', 'Entrevistas com usuários com foco em testar a percepção de valor e confiança em produtos orientados por IA.', $$# Pesquisa de Usuarios para IA Plan
Gere um plano de pesquisa focado na confiança e adoção de IA.$$, 'Produto: Sistema que gera receitas médicas automaticamente', '# Pesquisa de UX'),
(47, 'Engenharia de Prompts', 'Intermediario', 'yellow', 'Gestao de Produto', 'Criação de diretrizes para padronização e versionamento de prompts no desenvolvimento de softwares.', $$# Engenharia de Prompts Guide
Crie um guia de engenharia de prompts internos para o time.$$, 'Tarefa: Extração estruturada de dados de notas fiscais', '# Diretrizes de Prompting'),
(48, 'IA Responsavel', 'Intermediario', 'yellow', 'Gestao de Produto', 'Checklist ético para avaliação de privacidade, equidade e explicabilidade de algoritmos de aprendizado.', $$# Checklist de IA Responsável
Crie um documento de governança ética para o desenvolvimento do modelo.$$, 'Modelo: Algoritmo de triagem de currículos de candidatos', '# Governança Ética'),
(49, 'Analise de Teste A/B', 'Intermediario', 'yellow', 'Gestao de Produto', 'Estruturação de relatórios pós-teste A/B para documentar significância estatística e aprendizados práticos.', $$# Relatorio Pos-Mortem de Teste A/B
Escreva uma análise detalhada de resultados de teste A/B.$$, 'Experimento: Cor do botão de checkout. Resultado: Aumento de 4.2% com P-valor 0.01', '# Relatório de Teste A/B'),
(50, 'Analise de Coortes', 'Intermediario', 'yellow', 'Gestao de Produto', 'Análise de comportamento de retenção de grupos de usuários ao longo do tempo (cohorts).', $$# Analise de Retencao por Coortes
Analise os dados de retenção de coorte fornecidos.$$, 'Dados: Coorte de Janeiro 2026. Semana 0: 100%, Semana 1: 40%', '# Análise de Retenção'),
(51, 'Plano de Rastreamento de Eventos', 'Iniciante', 'green', 'Gestao de Produto', 'Mapeamento de eventos e propriedades para ferramentas de analytics (Mixpanel, Amplitude).', $$# Plano de Rastreamento de Eventos
Gere um plano de tag de rastreamento de eventos em formato de tabela.$$, 'Fluxo: Cadastro de novo usuário, adição de produto ao carrinho, finalização', '| Evento | Ação |'),
(52, 'Analise de Funil', 'Intermediario', 'yellow', 'Gestao de Produto', 'Identificação de gargalos e oportunidades de otimização em fluxos de conversão lineares.', $$# Analise de Queda no Funil
Analise as taxas de conversão entre as etapas do funil.$$, 'Funnel: Home (10.000) -> Ver Produto (4.000) -> Carrinho (500) -> Checkout (100)', '# Análise de Funil'),
(53, 'Definicao de Metricas', 'Iniciante', 'green', 'Gestao de Produto', 'Definição clara de North Star Metrics, indicadores chave de performance (KPIs) e métricas de saúde.', $$# Metricas de Produto framework
Defina a North Star Metric e as Métricas de Suporte.$$, 'Produto: Aplicativo de entrega de comida ultra-rápida', '# Estrutura de Métricas'),
(54, 'Metricas de Produto', 'Intermediario', 'yellow', 'Gestao de Produto', 'Acompanhamento de engajamento do usuário usando frameworks de métricas consolidados.', $$# Metricas de Produto Definition
Desenvolva um painel de métricas usando o framework HEART do Google.$$, 'Produto: Plataforma SaaS de gestão de tarefas de projetos', '### Framework HEART'),
(55, 'Consultas SQL para PMs', 'Intermediario', 'yellow', 'Gestao de Produto', 'Geração de queries SQL para extrair dados de comportamento e taxas de conversão.', $$# SQL para Product Managers
Escreva uma consulta SQL limpa e explicada passo a passo.$$, 'Métrica: Taxa de conversão de cadastro para compra por mês', '```sql'),
(56, 'Brainstorm de OKRs', 'Intermediario', 'yellow', 'Gestao de Produto', 'Construção de Objetivos e Resultados-Chave (OKRs) ambiciosos, mensuráveis e alinhados.', $$# Brainstorm de OKRs
Como um Diretor de Produto sênior, crie 3 Objetivos com 3 Resultados-Chave.$$, 'Objetivo de Negócio: Melhorar retenção de usuários no app de streaming', '# OKRs: Retenção'),
(57, 'Criar PRD', 'Intermediario', 'yellow', 'Gestao de Produto', 'Criação de Documentos de Requisitos de Produto (PRD) completos com alinhamento técnico e de negócios.', $$# Documento de Requisitos de Produto (PRD)
Você é um Product Manager experiente. Escreva um PRD robusto.$$, 'Funcionalidade: Login biométrico em app bancário móvel', '# PRD: Autenticação Biométrica'),
(58, 'Historias de Trabalho', 'Iniciante', 'green', 'Gestao de Produto', 'Construção de histórias baseadas na metodologia Jobs-to-be-Done (JTBD).', $$# Historias de Trabalho Generator
Escreva 5 Historias de Trabalho baseadas no framework JTBD.$$, 'Produto: Ferramenta de edição de fotos profissional rápida no celular', '1. **Quando** estou cobrindo um evento...'),
(59, 'Preparacao de Reuniao', 'Iniciante', 'green', 'Gestao de Produto', 'Preparação de dados e alinhamentos pré-reuniões com stakeholders importantes.', $$# Preparacao de Reuniao Guide
Gere um documento de preparação pré-reunião.$$, 'Reunião com CFO para aumento de 15% no orçamento de infraestrutura cloud', '# Preparação de Reunião'),
(60, 'Roadmap por Resultados', 'Intermediario', 'yellow', 'Gestao de Produto', 'Construção de roadmaps focados em resultados de negócios (outcomes) em vez de entregas de software.', $$# Roadmap Baseado em Resultados
Crie um roadmap de produto focado em resultados (outcomes).$$, 'Produto: Plataforma de telemedicina focada em reduzir no-show', '# Roadmap de Outcomes'),
(61, 'Analise Pre-Mortem', 'Intermediario', 'yellow', 'Gestao de Produto', 'Exercício de antecipação de falhas para blindar projetos antes do lançamento oficial.', $$# Analise Pre-Mortem
Assuma que o projeto foi um fracasso catastrófico.$$, 'Projeto: Lançamento de pagamento instantâneo por aproximação usando NFC', '# Análise Pre-Mortem'),
(62, 'Priorizacao', 'Intermediario', 'yellow', 'Gestao de Produto', 'Priorização de backlog de produto usando frameworks como RICE ou MoSCoW.', $$# Backlog Priorizacao (RICE Framework)
Calcule a pontuação RICE para a lista de ideias.$$, 'Opção A: Apple Pay. Alcance: 80%, Impacto: Alto, Confiança: 80%, Esforço: 2', '| Funcionalidade | Reach |'),
(63, 'Notas de Lancamento', 'Iniciante', 'green', 'Gestao de Produto', 'Redação de notas de lançamento engajadoras e informativas para usuários finais e equipe de vendas.', $$# Notas de Lancamento Generator
Escreva notas de lançamento atraentes e fáceis de ler.$$, 'Novidades: Modo escuro automático e exportação de relatórios para PDF', '# O que há de novo no App v2.4'),
(64, 'Retrospectiva da Sprint', 'Iniciante', 'green', 'Gestao de Produto', 'Facilitação de dinâmicas pós-sprint para melhoria contínua do time de desenvolvimento.', $$# Retrospectiva da Sprint Template
Crie um guia de facilitação usando a técnica Mad, Sad, Glad.$$, 'Contexto do time: Sprint difícil, atraso na API de terceiros', '# Retrospectiva da Sprint'),
(65, 'Plano de Sprint', 'Intermediario', 'yellow', 'Gestao de Produto', 'Planejamento e estimativa de histórias de usuário em formato de metas claras de sprint.', $$# Plano de Sprintning Assistant
Ajude a planejar a próxima sprint com base na capacidade.$$, 'Capacidade: 40 SP. Histórias: Migrar BD (13 SP), Login Social (8 SP), SMS Token (5 SP)', '# Plano da Sprint'),
(66, 'Mapa de Stakeholders', 'Intermediario', 'yellow', 'Gestao de Produto', 'Mapeamento de poder, interesse e plano de comunicação para stakeholders de um projeto.', $$# Mapeamento de Stakeholders (Matriz de Poder/Interesse)
Mapeie os stakeholders nos 4 quadrantes clássicos.$$, 'Stakeholders: CEO, Engenheiro Júnior, Gerente Marketing, Diretor Segurança', '# Matriz de Stakeholders'),
(67, 'Atualizacao para Stakeholders', 'Iniciante', 'green', 'Gestao de Produto', 'Comunicações periódicas de progresso do produto adaptadas para audiências de liderança ou executivos.', $$# Email de Atualizacao para Stakeholders
Escreva um relatório executivo curto e direto.$$, 'Progresso: Beta fechado para 100 usuários, retenção de 45%', 'Assunto: Atualização de Produto Q3'),
(68, 'Resumo de Reuniao', 'Iniciante', 'green', 'Gestao de Produto', 'Resumos executivos rápidos de reuniões com foco em decisões tomadas e planos de ação.', $$# Resumo de Reuniao
Crie um resumo de reunião focado em resultados.$$, 'Discussão: Decidimos lançar MVP apenas em iOS. João faz spec até sexta.', '# Ata de Reunião'),
(69, 'Cenarios de Teste', 'Intermediario', 'yellow', 'Gestao de Produto', 'Identificação de cenários de teste funcionais e de borda para garantir a qualidade de software.', $$# Gerador de Cenarios de Teste QA
Gere cenários de teste funcionais e não funcionais.$$, 'Funcionalidade: Pagamento com cupom de desconto de porcentagem', '# Cenários de Teste'),
(70, 'Historias de Usuario', 'Iniciante', 'green', 'Gestao de Produto', 'Histórias de usuário ágeis no padrão padrão de mercado contendo critérios de aceitação específicos.', $$# Criador de Historias de Usuario
Você é um Product Owner ágil. Escreva histórias de usuário completas.$$, 'Funcionalidade: Botão para exportar faturas em Excel', '## História de Usuário'),
(71, 'Loops de Crescimento', 'Avancado', 'red', 'Gestao de Produto', 'Definição de ciclos de crescimento viral ou por recomendação de produto para aquisição auto-sustentável.', $$# Arquitetura de Loop de Crescimento
Crie uma arquitetura de loop de crescimento.$$, 'Produto: Editor de infográficos online colaborativo gratuito', '# Loop de Crescimento'),
(72, 'Estrategia GTM', 'Avancado', 'red', 'Gestao de Produto', 'Estratégia Go-To-Market contendo canais de aquisição, táticas de vendas e cronograma de lançamento.', $$# Estrategia Go-To-Market (GTM)
Gere uma estratégia Go-To-Market abrangente.$$, 'Produto: Software de monitoramento de conformidade LGPD para e-commerces', '# Estratégia GTM'),
(73, 'Perfil de Cliente Ideal', 'Intermediario', 'yellow', 'Gestao de Produto', 'Definição detalhada do Perfil de Cliente Ideal (ICP) com tamanho de empresa, cargos e dores.', $$# Perfil de Cliente Ideal (ICP) Builder
Escreva a ficha de Perfil de Cliente Ideal.$$, 'Produto: Software de gestão de escala de trabalho para hospitais', '# Perfil de Cliente Ideal'),
(74, 'Analise de Concorrentes', 'Intermediario', 'yellow', 'Gestao de Produto', 'Análise competitiva comparando pontos fortes, fracos e proposta de valor dos concorrentes diretos.', $$# Analise de Concorrentes Framework
Crie uma matriz de análise competitiva.$$, 'Produto: Plataforma de ensino de idiomas (conversação 10min). Concorrentes: Duolingo, Cambly', '# Análise Competitiva'),
(75, 'Mapa da Jornada do Cliente', 'Intermediario', 'yellow', 'Gestao de Produto', 'Mapeamento das etapas do cliente, sentimentos, pontos de contato e oportunidades de atrito.', $$# Mapa da Jornada do Cliente
Desenhe a jornada do cliente dividida nas etapas clássicas.$$, 'Produto: Seguro auto digital de contratação simplificada', '# Jornada do Cliente'),
(76, 'Dimensionamento de Mercado', 'Avancado', 'red', 'Gestao de Produto', 'Estimativa de tamanho de mercado usando os conceitos de TAM, SAM e SOM.', $$# Dimensionamento de Mercado (TAM, SAM, SOM)
Crie um modelo de estimativa de tamanho de mercado.$$, 'Mercado: Startup de software para gestão de pet shops no Sudeste', '# Estimativa de Mercado'),
(77, 'Canvas de Modelo de Negocio', 'Intermediario', 'yellow', 'Gestao de Produto', 'Modelagem de negócios estruturada cobrando parceiros chave, custos e fontes de receita.', $$# Canvas de Modelo de Negocio Generator
Desenvolva os 9 blocos do Canvas de Modelo de Negocio.$$, 'Negócio: Plataforma de aluguel de ferramentas de construção civil', '# Canvas de Modelo de Negocio'),
(78, 'Visao de Produto', 'Intermediario', 'yellow', 'Gestao de Produto', 'Definição do norte de longo prazo e posicionamento do produto utilizando frameworks reconhecidos.', $$# Visao de Produto Statement
Crie um manifesto e uma declaração de visão de produto.$$, 'Produto: Banco de dados em nuvem ultra-simplificado para desenvolvedores solo', '# Declaração de Visão'),
(79, 'Analise SWOT', 'Intermediario', 'yellow', 'Gestao de Produto', 'Análise estratégica avaliando Forças, Fraquezas, Oportunidades e Ameaças internas e externas.', $$# Analise SWOT (Matriz FOFA)
Realize uma análise SWOT completa.$$, 'Empresa: Startup de entrega de medicamentos com drones em áreas remotas', '# Análise SWOT'),
(80, 'Canvas de Proposta de Valor', 'Intermediario', 'yellow', 'Gestao de Produto', 'Alinhamento das dores e necessidades dos clientes com os diferenciais e funcionalidades do produto.', $$# Canvas de Proposta de Valor Generator
Desenhe o Canvas de Proposta de Valor.$$, 'Produto: Cartão de crédito pré-pago para mesada digital de crianças', '# Canvas de Proposta de Valor')
ON CONFLICT DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────────────
-- 12. SEED DATA: LAB CATEGORIES (12 categories)
-- ───────────────────────────────────────────────────────────────────────────────

INSERT INTO lab_categories (sort_order, category_id, label, icon, prompt_count) VALUES
(1, 'Criatividade', 'Criatividade', 'Lightbulb', 12),
(2, 'Marketing', 'Marketing', 'Megaphone', 15),
(3, 'Programacao', 'Coding', 'Code2', 18),
(4, 'Educacao', 'Educação', 'Apple', 14),
(5, 'Produtividade', 'Produtividade', 'ClipboardList', 16),
(6, 'Analise', 'Análise de Dados', 'BarChart3', 12),
(7, 'Comunicacao', 'Comunicação', 'MessageSquare', 15),
(8, 'Automacao', 'Automação', 'Settings', 11),
(9, 'Negocios', 'Negócios', 'Briefcase', 13),
(10, 'Design', 'Design', 'Palette', 17),
(11, 'Suporte', 'Suporte ao Cliente', 'Headphones', 10),
(12, 'RH', 'Recursos Humanos', 'Users', 9)
ON CONFLICT DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────────────
-- 13. SEED DATA: LAB CONFIG (Prompt of the Day)
-- ───────────────────────────────────────────────────────────────────────────────

INSERT INTO lab_config (config_key, config_value) VALUES
('PROMPT_OF_THE_DAY', '{"title": "Análise SWOT Inteligente", "description": "Gere uma análise SWOT completa para seu negócio com insights acionáveis.", "categoryId": "Negocios"}')
ON CONFLICT DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────────────
-- 14. SEED DATA: ACHIEVEMENT DEFINITIONS (12 items)
-- ───────────────────────────────────────────────────────────────────────────────

INSERT INTO achievement_definitions (sort_order, achievement_id, title, description, icon, category) VALUES
(1, 'first-lesson', 'Primeira Lição', 'Complete sua primeira lição', 'BookOpen', 'progress'),
(2, 'ten-lessons', 'Dedicação', 'Complete 10 lições', 'BookOpen', 'progress'),
(3, 'fifty-lessons', 'Mestre dos Estudos', 'Complete 50 lições', 'GraduationCap', 'progress'),
(4, 'first-category', 'Explorador', 'Complete sua primeira categoria de aprendizado', 'Trophy', 'progress'),
(5, 'first-perfect', 'Perfeição Inicial', 'Acerte 100% em uma lição', 'Target', 'performance'),
(6, 'three-perfect', 'Três Vezes Perfeito', 'Acerte 100% em 3 lições', 'Award', 'performance'),
(7, 'ten-perfect', 'Dez de Dez', 'Acerte 100% em 10 lições', 'Award', 'performance'),
(8, 'streak-3', 'Consistente', 'Use o app por 3 dias consecutivos', 'Zap', 'streak'),
(9, 'streak-7', 'Determinado', 'Use o app por 7 dias consecutivos', 'Sparkles', 'streak'),
(10, 'streak-30', 'Viciado em Aprender', 'Use o app por 30 dias consecutivos', 'Award', 'streak'),
(11, 'five-favorites', 'Colecionador', 'Favorita 5 skills', 'Heart', 'exploration'),
(12, 'social', 'Social', 'Visite todas as categorias de aprendizado', 'Globe', 'exploration')
ON CONFLICT DO NOTHING;
