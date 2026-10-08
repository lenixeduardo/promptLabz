-- Persist lab analyses per authenticated user.
create table if not exists public.lab_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  score numeric not null check (score >= 0 and score <= 100),
  label text not null,
  stars numeric not null check (stars >= 0 and stars <= 5),
  original_prompt text not null,
  analysis text not null,
  feedback jsonb not null default '[]'::jsonb check (jsonb_typeof(feedback) = 'array'),
  ai_compatibility jsonb not null default '[]'::jsonb check (jsonb_typeof(ai_compatibility) = 'array'),
  created_at timestamptz not null default now()
);
create index if not exists lab_results_user_created_idx on public.lab_results(user_id, created_at desc);
alter table public.lab_results enable row level security;
revoke all on public.lab_results from anon;
grant select, insert, delete on public.lab_results to authenticated;
create policy "lab_results_select_own" on public.lab_results for select to authenticated
  using (user_id = (select auth.uid()));
create policy "lab_results_insert_own" on public.lab_results for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "lab_results_delete_own" on public.lab_results for delete to authenticated
  using (user_id = (select auth.uid()));
