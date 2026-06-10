-- supabase/migrations/20260610_001_users_premium.sql
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS premium_status TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS premium_since TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'premium_status_check'
      AND conrelid = 'public.users'::regclass
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT premium_status_check
      CHECK (premium_status IN ('free', 'trial', 'active', 'cancelled'));
  END IF;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS users_stripe_customer_id_unique
  ON public.users(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_stripe_subscription_id_unique
  ON public.users(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

REVOKE UPDATE ON public.users FROM authenticated;
GRANT UPDATE (full_name, avatar_url) ON public.users TO authenticated;
