-- Security fix: 20260621_012_users_xp_gems.sql introduced two problems:
--
-- 1) Email leak: the "Authenticated users can view all profiles" SELECT policy
--    was added to unblock the leaderboard, but RLS SELECT policies are OR-ed
--    together, so it silently widened access to *every* column on
--    public.users (including `email`) for any logged-in user.
--
-- 2) Client-writable XP/gems: `GRANT UPDATE (xp, gems) ON public.users TO
--    authenticated` let any authenticated client set their own xp/gems to any
--    value up to the CHECK constraint ceiling (10,000,000 / 1,000,000) via a
--    direct `.update()` call, e.g. from the browser console.
--
-- This migration removes both, and replaces them with:
--   - a narrow `public.leaderboard_entries` view (id, full_name, avatar_url,
--     xp only — no email) for the leaderboard to read from.
--   - a SECURITY DEFINER `public.sync_user_xp()` function that only touches
--     the caller's own row and enforces sane per-call deltas, used instead of
--     letting the client UPDATE xp/gems directly.

-- ── 1) Revoke the over-broad SELECT policy, restore "own profile only" ─────

DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.users;
-- "Users can view own profile" (auth.uid() = id) from the initial schema
-- migration is still in place and is now the only SELECT policy on the table.

-- ── 2) Leaderboard view: only the columns the leaderboard needs ───────────
-- Created (and therefore owned) by the migration role, which bypasses RLS on
-- public.users. Callers only get SELECT on the view itself, never on the
-- underlying table, so `email` (and any other future sensitive column) is
-- never reachable through it.

DROP VIEW IF EXISTS public.leaderboard_entries;
CREATE VIEW public.leaderboard_entries
WITH (security_invoker = false)
AS
  SELECT id, full_name, avatar_url, xp
  FROM public.users;

REVOKE ALL ON public.leaderboard_entries FROM PUBLIC;
GRANT SELECT ON public.leaderboard_entries TO authenticated;

-- ── 3) Revoke direct client writes to xp/gems ──────────────────────────────

REVOKE UPDATE (xp, gems) ON public.users FROM authenticated;

-- ── 4) sync_user_xp(): the only way an authenticated client can move its
--    own xp/gems forward. Runs as SECURITY DEFINER so it can update the row
--    despite the client having no direct UPDATE grant on xp/gems, but it:
--      - always targets auth.uid() (never an arbitrary user id)
--      - never allows xp to go down (xp is a progress metric, not spendable)
--      - caps how much xp/gems can increase in a single call, so a compromised
--        or malicious client can't just set xp/gems to the max CHECK-constraint
--        value in one shot
--      - lets gems decrease freely (spending gems in the store happens
--        elsewhere and is out of scope for this migration)
--      - rejects (raises) instead of silently clamping out-of-range values,
--        so bogus client state doesn't get quietly rewritten into "whatever
--        was allowed" and mistaken for a successful sync
--
--    Cap rationale: the single biggest XP award in the app is a lesson
--    completion at 200 XP (see the trail data driving src/pages/LearningLab.tsx);
--    daily missions + chest bonus top out at ~200 XP/day combined. Because
--    sync only happens when the Ranking page mounts (offline-first: progress
--    accrues in localStorage between visits), a single sync can legitimately
--    fold in several sessions' worth of progress. 2000 XP covers roughly a
--    week of very active play in one go while still making it impossible to
--    jump straight to a top ranking or the 10,000,000 column ceiling in a
--    single call. Gems are earned in much smaller amounts (daily chest 100,
--    special quests 50), so 2000 per call is already a generous multiple of
--    any realistic accumulation window.

CREATE OR REPLACE FUNCTION public.sync_user_xp(new_xp integer, new_gems integer DEFAULT NULL)
RETURNS void AS $$
DECLARE
  uid uuid := auth.uid();
  cur_xp integer;
  cur_gems integer;
  max_xp_delta CONSTANT integer := 2000;
  max_gems_delta CONSTANT integer := 2000;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'sync_user_xp: not authenticated';
  END IF;

  IF new_xp IS NULL OR new_xp < 0 THEN
    RAISE EXCEPTION 'sync_user_xp: invalid xp value';
  END IF;

  IF new_gems IS NOT NULL AND new_gems < 0 THEN
    RAISE EXCEPTION 'sync_user_xp: invalid gems value';
  END IF;

  SELECT xp, gems INTO cur_xp, cur_gems
  FROM public.users
  WHERE id = uid
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'sync_user_xp: user profile not found';
  END IF;

  IF new_xp < cur_xp THEN
    RAISE EXCEPTION 'sync_user_xp: xp cannot decrease (current=%, requested=%)', cur_xp, new_xp;
  END IF;

  IF new_xp - cur_xp > max_xp_delta THEN
    RAISE EXCEPTION 'sync_user_xp: xp increase too large (current=%, requested=%, max delta=%)',
      cur_xp, new_xp, max_xp_delta;
  END IF;

  IF new_gems IS NOT NULL AND new_gems > cur_gems AND new_gems - cur_gems > max_gems_delta THEN
    RAISE EXCEPTION 'sync_user_xp: gems increase too large (current=%, requested=%, max delta=%)',
      cur_gems, new_gems, max_gems_delta;
  END IF;

  UPDATE public.users
  SET xp = new_xp,
      gems = COALESCE(new_gems, gems)
  WHERE id = uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.sync_user_xp(integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_user_xp(integer, integer) TO authenticated;
