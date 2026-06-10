-- Community tables: news, daily_tips, templates with RLS for premium users

-- News (populated by rss-fetcher cron)
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_url TEXT NOT NULL UNIQUE,
  source_name TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premium users can read news"
  ON public.news FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE premium_status IN ('trial', 'active')
    )
  );

-- Daily tips (manually inserted)
CREATE TABLE IF NOT EXISTS public.daily_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_text TEXT NOT NULL,
  category TEXT,
  scheduled_date DATE UNIQUE NOT NULL
);

ALTER TABLE public.daily_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premium users can read daily_tips"
  ON public.daily_tips FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE premium_status IN ('trial', 'active')
    )
  );

-- Templates (manually inserted)
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premium users can read templates"
  ON public.templates FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE premium_status IN ('trial', 'active')
    )
  );

-- Seed one daily tip so the UI has data immediately
INSERT INTO public.daily_tips (tip_text, category, scheduled_date)
VALUES (
  'Use "pense passo a passo" no final de prompts complexos. Isso ativa o raciocínio encadeado (Chain of Thought) e reduz erros em tarefas analíticas.',
  'Prompt',
  CURRENT_DATE
) ON CONFLICT (scheduled_date) DO NOTHING;
