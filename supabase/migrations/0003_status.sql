-- PC 출제자 봇이 30초마다 출석을 남기는 곳. 화면은 이걸 읽고 "출제자 자리에 있음/비움"을 보여 준다.
create table public.soup_status (
  id int primary key check (id = 1),
  bot_seen timestamptz
);
alter table public.soup_status enable row level security;
create policy "soup status readable" on public.soup_status for select to anon, authenticated using (true);
insert into public.soup_status (id, bot_seen) values (1, null);
