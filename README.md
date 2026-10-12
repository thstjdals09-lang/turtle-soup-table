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
| `tools/host-bot.mjs` | 방장 PC 출제자 봇: 대기 질문을 `claude -p`로 판정해 올린다 |
| `docs/judge.js` | 출제자 지시문과 답 정리. 서버 함수와 봇이 함께 쓴다 |

진상은 저장소에 없다. 화면은 공개된 문제와 삽화 바탕만 갖고, 키워드·단서·진상은 열릴 때마다 서버 함수가 내려준다.

## 판정은 누가 하나

서버 함수가 아래 순서로 고른다. 코드를 바꿀 필요 없이 키만 넣고 빼면 된다.

1. `ANTHROPIC_API_KEY`(함수 비밀 값)가 있으면 Claude API (유료, `SOUP_MODEL` 기본 `claude-opus-5-5`)
2. 없으면 Gemini 무료 키 (`soup_keys` 표의 `gemini` 또는 함수 비밀 값 `GEMINI_API_KEY`). `GEMINI_MODELS` 기본 `gemini-flash-lite-latest,gemini-3.1-flash-lite` — 분당 한도에 걸리면 다음 모델로 넘어간다
3. 둘 다 없거나 Gemini가 모두 막히면 질문을 대기로 남기고, 아래 출제자 봇이 받는다

## 출제자 봇 (방장 PC)

API 키 없이 방장의 Claude 구독으로 판정한다. 게임할 때 방장 PC에서 켜 두면 친구들이 남긴 질문을 가져가 `claude -p`로 판정하고 결과를 올린다.

- `host-bot.bat` 더블클릭, 또는 `node tools/host-bot.mjs`
- 필요한 것: 로그인된 Claude Code, `private/puzzles.mjs`·`private/admin-token.txt` (저장소에 없음)
- 봇이 꺼져 있으면 화면에 "출제자 봇이 꺼져 있어요"가 뜨고, 질문은 대기로 남았다가 봇이 켜지면 차례로 답한다
- 선택: `BOT_MODEL`(예: sonnet), `BOT_PARALLEL`(동시 판정 수, 기본 2)

서버가 직접 판정하는 동안(1·2번)에는 봇이 무료 AI가 넘긴 질문이나 30초 넘게 밀린 질문만 받는다.

## 운영

```bash
node tools/build.mjs   # 문제를 고친 뒤 공개 파일·함수 사본 다시 만들기
node tools/seed.mjs    # 진상 데이터 서버에 올리기 (private/admin-token.txt 필요)
```
