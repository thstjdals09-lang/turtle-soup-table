-- 바다거북 수프 식탁: 방, 기록, 진상(비공개), 하루 AI 호출 수
-- 화면(anon)은 방과 기록을 읽기만 하고, 쓰기는 모두 서버 함수(service role)가 한다.

create table public.soup_rooms (
  code text primary key check (code ~ '^[a-z0-9]{4}$'),
  host text not null,
  created_at timestamptz not null default now()
);

create table public.soup_events (
  id bigint generated always as identity primary key,
  room text not null references public.soup_rooms(code) on delete cascade,
  puzzle text not null,
  scope text not null default 'coop',          -- 'coop' 이면 함께 풀기, 아니면 경쟁전 참가자 id
  player text not null,
  name text not null default '',
  kind text not null check (kind in ('q', 'guess', 'clue', 'giveup', 'end', 'chat')),
  body text not null default '',
  status text not null default 'done' check (status in ('pending', 'done', 'error')),
  answer text,
  note text,
  facts text[] not null default '{}',
  hot boolean not null default false,
  hits jsonb,
  ok boolean,
  final boolean not null default false,
  appeal text,
  prev text,
  clue_i int,
  err text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index soup_events_room_idx on public.soup_events (room, puzzle, scope, id);

create table public.soup_secrets (
  puzzle text primary key,
  data jsonb not null
);

create table public.soup_usage (
  day date primary key,
  calls int not null default 0
);

alter table public.soup_rooms enable row level security;
alter table public.soup_events enable row level security;
alter table public.soup_secrets enable row level security;
alter table public.soup_usage enable row level security;

-- 코드를 아는 사람은 누구나 방과 기록을 읽는다. 진상과 사용량 표에는 정책이 없어 화면에서 읽을 수 없다.
create policy "soup rooms readable" on public.soup_rooms for select to anon, authenticated using (true);
create policy "soup events readable" on public.soup_events for select to anon, authenticated using (true);

-- AI 호출 하루 한도. 서버 함수만 부른다.
create or replace function public.soup_bump(lim int) returns boolean
language plpgsql security definer set search_path = public as $$
declare c int;
begin
  insert into public.soup_usage (day, calls) values (current_date, 1)
  on conflict (day) do update set calls = public.soup_usage.calls + 1
  returning calls into c;
  return c <= lim;
end $$;
revoke all on function public.soup_bump(int) from public, anon, authenticated;
grant execute on function public.soup_bump(int) to service_role;

alter publication supabase_realtime add table public.soup_events;
