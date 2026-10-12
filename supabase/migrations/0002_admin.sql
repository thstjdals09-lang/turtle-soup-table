-- 관리자 토큰 해시 (tools/seed.mjs 가 문제 데이터를 올릴 때 확인). 화면에서는 읽을 수 없다.
create table public.soup_admin (
  id int primary key check (id = 1),
  token_hash text not null
);
alter table public.soup_admin enable row level security;
-- insert into public.soup_admin (id, token_hash) values (1, '<sha256(private/admin-token.txt)>');
