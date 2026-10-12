-- 사건이 끝난 뒤의 반응: 질문 추천(like, body = 대상 기록 id)과 체감 난이도(rate, body = easy|ok|hard)
alter table soup_events drop constraint if exists soup_events_kind_check;
alter table soup_events add constraint soup_events_kind_check
  check (kind in ('q', 'guess', 'clue', 'giveup', 'end', 'chat', 'like', 'rate'));
