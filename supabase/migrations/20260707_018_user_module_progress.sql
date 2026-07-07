-- Migration: Cria tabela de progresso da Trilha (módulos A1/A2/A3)
-- Date: 2026-07-07
-- Author: PromptLab
-- Description: O progresso da Trilha (src/lib/moduleProgress.ts) hoje vive só em
-- localStorage, sem nenhuma cópia no servidor. Qualquer perda de dado local (evento
-- SIGNED_OUT que limpa as chaves escopadas por usuário, troca de navegador/dispositivo,
-- limpeza de cache) apaga esse progresso de forma permanente, mesmo com o usuário
-- autenticado e com o resto da conta (xp, conquistas, streak) intacto no servidor.

-- ───────────────────────────────────────────────────────────────────────────────
-- 1. Create user_module_progress table
-- ───────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_module_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track TEXT NOT NULL CHECK (track IN ('a1', 'a2', 'a3')),
  completed_count INTEGER NOT NULL DEFAULT 0 CHECK (completed_count >= 0 AND completed_count <= 200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, track)
);

ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

-- ───────────────────────────────────────────────────────────────────────────────
-- 2. Policies (usuário só acessa a própria linha)
-- ───────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view own module progress" ON public.user_module_progress;
CREATE POLICY "Users can view own module progress" ON public.user_module_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own module progress" ON public.user_module_progress;
CREATE POLICY "Users can insert own module progress" ON public.user_module_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own module progress" ON public.user_module_progress;
CREATE POLICY "Users can update own module progress" ON public.user_module_progress
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────────────────────────────
-- 3. Updated at trigger
-- ───────────────────────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS user_module_progress_set_updated_at ON public.user_module_progress;
CREATE TRIGGER user_module_progress_set_updated_at
  BEFORE UPDATE ON public.user_module_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
