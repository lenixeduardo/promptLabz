-- supabase/migrations/20260704_014_subscriptions_stripe.sql
--
-- The `subscriptions` table (20260619_009_subscriptions.sql) was modeled for
-- Paddle, but this project's payment provider is Stripe. Nothing in src/ or
-- supabase/functions/ ever referenced this table's paddle_* columns or the
-- has_active_subscription() function, so no data migration is needed — this
-- table has never been used in production.
--
-- The actual source of truth for premium access is public.users
-- (premium_status / stripe_customer_id / stripe_subscription_id /
-- trial_ends_at, see 20260610_001_users_premium.sql), which
-- PremiumProvider.tsx already reads. This migration turns `subscriptions`
-- into a Stripe-shaped audit/history table: the stripe-webhook Edge
-- Function inserts one row per processed event, while users.premium_status
-- remains the fast, authoritative flag the app queries.

ALTER TABLE public.subscriptions
  RENAME COLUMN paddle_subscription_id TO stripe_subscription_id;

ALTER TABLE public.subscriptions
  RENAME COLUMN paddle_customer_id TO stripe_customer_id;

ALTER TABLE public.subscriptions
  DROP COLUMN IF EXISTS environment;

DROP INDEX IF EXISTS idx_subscriptions_paddle_id;
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id
  ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id
  ON public.subscriptions(stripe_customer_id);

DROP FUNCTION IF EXISTS public.has_active_subscription(uuid, text);

CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = user_uuid
    AND (
      (status IN ('active', 'trialing') AND (current_period_end IS NULL OR current_period_end > now()))
      OR (status = 'canceled' AND current_period_end > now())
    )
  );
$$;
