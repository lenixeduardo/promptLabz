-- Migration 003: User Achievements table for persistent cloud storage.
-- Replaces localStorage-only storage for achievement data.

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  unlocked_achievements TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  total_lessons_completed INT DEFAULT 0 NOT NULL CHECK (total_lessons_completed >= 0),
  perfect_count INT DEFAULT 0 NOT NULL CHECK (perfect_count >= 0),
  last_visit_date DATE,
  consecutive_days INT DEFAULT 0 NOT NULL CHECK (consecutive_days >= 0),
  visited_categories TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  completed_category_ids TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id),
  CHECK (cardinality(unlocked_achievements) <= 50)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies: users can only see/edit their own achievements
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON public.user_achievements FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger
DROP TRIGGER IF EXISTS user_achievements_set_updated_at ON public.user_achievements;
CREATE TRIGGER user_achievements_set_updated_at
  BEFORE UPDATE ON public.user_achievements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Auto-create achievements row on user signup ──────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '/assets/avatar-cat.png')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_achievements (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;
