-- Migration: Cria tabela de inventário do usuário (power-ups e avatares comprados)
-- Date: 2026-07-04
-- Author: PromptLab
-- Description: Persiste no servidor as compras feitas na Loja (power-ups e avatares),
-- que hoje vivem só em localStorage e por isso somem ao trocar de dispositivo/navegador
-- ou são manipuláveis via DevTools. Necessário antes de qualquer venda real de gems (IAP).

-- ───────────────────────────────────────────────────────────────────────────────
-- 1. Create user_inventory table
-- ───────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_inventory (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  boost_xp INTEGER NOT NULL DEFAULT 0 CHECK (boost_xp >= 0 AND boost_xp <= 1000),
  protection INTEGER NOT NULL DEFAULT 0 CHECK (protection >= 0 AND protection <= 1000),
  focus_total INTEGER NOT NULL DEFAULT 0 CHECK (focus_total >= 0 AND focus_total <= 1000),
  owned_avatar_ids TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CHECK (cardinality(owned_avatar_ids) <= 200)
);

-- Enable Row Level Security
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

-- ───────────────────────────────────────────────────────────────────────────────
-- 2. Policies for user_inventory table (usuário só acessa a própria linha)
-- ───────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view own inventory" ON public.user_inventory;
CREATE POLICY "Users can view own inventory" ON public.user_inventory
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own inventory" ON public.user_inventory;
CREATE POLICY "Users can insert own inventory" ON public.user_inventory
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own inventory" ON public.user_inventory;
CREATE POLICY "Users can update own inventory" ON public.user_inventory
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────────────────────────────
-- 3. Updated at trigger
-- ───────────────────────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS user_inventory_set_updated_at ON public.user_inventory;
CREATE TRIGGER user_inventory_set_updated_at
  BEFORE UPDATE ON public.user_inventory
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
