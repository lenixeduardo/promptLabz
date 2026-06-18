-- Extend news_articles to support automated daily ingestion.
-- Adds source_url and external_id for deduplication, and expands the
-- category constraint to cover Meta, Microsoft and General topics.

ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS source_url  TEXT,
  ADD COLUMN IF NOT EXISTS external_id TEXT,
  ADD COLUMN IF NOT EXISTS image_url   TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS news_articles_external_id_idx
  ON public.news_articles (external_id)
  WHERE external_id IS NOT NULL;

-- Drop the old 4-value constraint and replace with the extended set.
ALTER TABLE public.news_articles
  DROP CONSTRAINT IF EXISTS news_articles_category_check;

ALTER TABLE public.news_articles
  ADD CONSTRAINT news_articles_category_check
  CHECK (category IN (
    'OpenAI', 'Anthropic', 'Google', 'ChatGPT',
    'Meta', 'Microsoft', 'General'
  ));
