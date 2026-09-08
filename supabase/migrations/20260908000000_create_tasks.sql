create table if not exists public.tasks (
  id text primary key,
  title text not null check (char_length(trim(title)) > 0),
  type text not null default '업무',
  description text,
  status text not null default 'backlog' check (status in ('backlog', 'planned', 'in_progress', 'qa', 'done')),
  assignee_id text,
  priority text not null default 'normal' check (priority in ('urgent', 'high', 'normal', 'low')),
  due_date text,
  checklist_completed integer check (checklist_completed is null or checklist_completed >= 0),
  checklist_total integer check (checklist_total is null or checklist_total >= 0),
  is_blocked boolean not null default false,
  blocked_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_created_at_idx on public.tasks (created_at);

alter table public.tasks enable row level security;

drop policy if exists "Public board can read tasks" on public.tasks;
drop policy if exists "Public board can create tasks" on public.tasks;
drop policy if exists "Public board can update tasks" on public.tasks;
drop policy if exists "Public board can delete tasks" on public.tasks;

create policy "Public board can read tasks"
  on public.tasks for select to anon, authenticated
  using (true);

create policy "Public board can create tasks"
  on public.tasks for insert to anon, authenticated
  with check (true);

create policy "Public board can update tasks"
  on public.tasks for update to anon, authenticated
  using (true)
  with check (true);

create policy "Public board can delete tasks"
  on public.tasks for delete to anon, authenticated
  using (true);

grant select, insert, update, delete on public.tasks to anon, authenticated;
