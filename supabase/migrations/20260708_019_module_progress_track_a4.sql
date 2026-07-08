-- Migration: Permite a trilha A4 (Técnica SAFE) em user_module_progress
-- Date: 2026-07-08
-- Author: PromptLab
-- Description: A trilha A4 (src/lib/moduleProgress.ts, src/lib/lessonContent.ts) foi
-- adicionada como uma quarta trilha real de aprendizado. A tabela criada em
-- 20260707_018_user_module_progress.sql restringe track a ('a1','a2','a3') via CHECK —
-- essa migration amplia a constraint para aceitar 'a4' sem perder os dados existentes.

ALTER TABLE public.user_module_progress
  DROP CONSTRAINT IF EXISTS user_module_progress_track_check;

ALTER TABLE public.user_module_progress
  ADD CONSTRAINT user_module_progress_track_check CHECK (track IN ('a1', 'a2', 'a3', 'a4'));
