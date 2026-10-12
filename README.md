# 바다거북 수프 식탁

방 코드 하나로 친구들과 한 식탁에 앉아, AI 출제자에게 네·아니오로 물으며 진상을 맞히는 바다거북 수프(상황 추리) 게임.

**플레이:** https://thstjdals09-lang.github.io/turtle-soup-table/

## 규칙

- 답은 **네 · 아니오 · 관계없음 · 애매함** 넷. 누가·왜·어떻게 같은 열린 질문은 **반려**되고 세지 않는다.
- 문수(적을수록 좋음): 질문 +1, 오답 +5, 포기·최종 실패 +25, 보너스 키워드 −3, 긴급 단서 열람 +10.
- 15·30·45문마다 단서 그림이 삽화에 찍힌다. 50문이 되거나 스스로 질문을 끝내면 최종 답안 한 번만 남는다.
- **함께 풀기**: 같은 방 사람들이 질문과 답, 의논을 함께 본다. **경쟁전**: 각자 따로 묻고 점수판만 나눈다.

## 구조

| 위치 | 내용 |
|---|---|
| `docs/` | GitHub Pages로 배포되는 화면 (`index.html`, `app.js`, `style.css`, `rules.js`, 자동 생성 `puzzles.js`) |
| `docs/rules.js` | 문수 계산 규칙. 화면과 서버 함수가 같은 파일을 쓴다 |
| `supabase/functions/soup/` | 서버 함수: 방 만들기, 질문 판정·진상 채점(Claude API), 단서 공개 |
| `supabase/migrations/` | 표 정의: `soup_rooms`, `soup_events`(실시간), `soup_secrets`(진상, 화면에서 읽을 수 없음) |
| `tools/build.mjs` | `private/puzzles.mjs`(진상이 든 원본, 저장소 밖)에서 `docs/puzzles.js`를 만든다 |
| `tools/seed.mjs` | 진상·키워드·단서를 서버 함수를 거쳐 `soup_secrets`에 올린다 |

진상은 저장소에 없다. 화면은 공개된 문제와 삽화 바탕만 갖고, 키워드·단서·진상은 열릴 때마다 서버 함수가 내려준다.

## 운영

```bash
node tools/build.mjs   # 문제를 고친 뒤 공개 파일 다시 만들기
node tools/seed.mjs    # 진상 데이터 서버에 올리기 (private/admin-token.txt 필요)
```

서버 함수 비밀 값: `ANTHROPIC_API_KEY`(필수), `SOUP_MODEL`(기본 `claude-opus-5-5`), `SOUP_DAILY_LIMIT`(하루 AI 호출 한도, 기본 2000).
