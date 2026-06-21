-- Add XP and gems columns to the users table for experience-based ranking.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gems INTEGER NOT NULL DEFAULT 0;

-- Efficient index for leaderboard ordering.
CREATE INDEX IF NOT EXISTS idx_users_xp ON public.users(xp DESC);

-- Allow authenticated users to update their own XP/gems (synced from localStorage).
GRANT UPDATE (xp, gems) ON public.users TO authenticated;

-- Allow any authenticated user to read all public profiles (required for leaderboard).
-- RLS policies on SELECT are OR-ed, so this broadens the existing own-profile policy.
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.users;
CREATE POLICY "Authenticated users can view all profiles" ON public.users
  FOR SELECT USING (auth.uid() IS NOT NULL);
