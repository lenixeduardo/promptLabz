-- Extends trending_skills and prompts tables to support automated sync.
-- Adds external_id for deduplication, trending_score for ranking,
-- source_url for reference and last_synced_at for staleness tracking.

-- ── trending_skills ───────────────────────────────────────────────────────

ALTER TABLE public.trending_skills
  ADD COLUMN IF NOT EXISTS external_id    TEXT,
  ADD COLUMN IF NOT EXISTS source_url     TEXT,
  ADD COLUMN IF NOT EXISTS trending_score INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE;

CREATE UNIQUE INDEX IF NOT EXISTS trending_skills_external_id_idx
  ON public.trending_skills (external_id)
  WHERE external_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS trending_skills_trending_score_idx
  ON public.trending_skills (trending_score DESC);

-- Service role needs write access for the sync Edge Function.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'trending_skills'
      AND policyname = 'Service role manages trending_skills'
  ) THEN
    CREATE POLICY "Service role manages trending_skills" ON public.trending_skills
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ── prompts ───────────────────────────────────────────────────────────────

ALTER TABLE public.prompts
  ADD COLUMN IF NOT EXISTS external_id    TEXT,
  ADD COLUMN IF NOT EXISTS source_url     TEXT,
  ADD COLUMN IF NOT EXISTS trending_score INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE;

CREATE UNIQUE INDEX IF NOT EXISTS prompts_external_id_idx
  ON public.prompts (external_id)
  WHERE external_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS prompts_trending_score_idx
  ON public.prompts (trending_score DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'prompts'
      AND policyname = 'Service role manages prompts'
  ) THEN
    CREATE POLICY "Service role manages prompts" ON public.prompts
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;
