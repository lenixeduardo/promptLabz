create table public.user_streaks (
  user_id        uuid primary key references public.users(id) on delete cascade,
  current_streak int          not null default 0,
  longest_streak int          not null default 0,
  last_visit_date date,
  updated_at     timestamptz  not null default now()
);

alter table public.user_streaks enable row level security;

create policy "users can read own streak"
  on public.user_streaks for select
  using (auth.uid() = user_id);

create policy "users can insert own streak"
  on public.user_streaks for insert
  with check (auth.uid() = user_id);

create policy "users can update own streak"
  on public.user_streaks for update
  using (auth.uid() = user_id);

create trigger user_streaks_set_updated_at
  before update on public.user_streaks
  for each row execute function set_updated_at();
