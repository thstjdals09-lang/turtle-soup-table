-- 단서 사진 저장소. 공개 버킷이지만 목록 조회 정책이 없어, 무작위 파일 이름을 아는 사람만 내려받을 수 있다.
-- 서버 함수의 upload 동작(관리자 토큰 필요)이 올리고, reveal 동작이 단서가 열릴 때 주소를 알려 준다.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('soup-art', 'soup-art', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
