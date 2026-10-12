-- 서버 함수가 쓰는 외부 AI 키 (예: name='gemini'). 화면에서는 읽을 수 없다. 값은 저장소에 두지 않는다.
create table public.soup_keys (
  name text primary key,
  value text not null
);
alter table public.soup_keys enable row level security;
-- insert into public.soup_keys (name, value) values ('gemini', '<Google AI Studio 키>');
