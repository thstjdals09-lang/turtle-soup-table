// 바다거북 수프 식탁 — 화면(docs/app.js)과 서버 함수(supabase/functions/soup)가 함께 쓰는 규칙.
// 서버 함수에는 빌드 때 이 파일이 그대로 복사된다.

export const CAP = 50;              // 질문 마감 문수
export const CLUE_AT = [15, 30, 45]; // 단서가 열리는 문수
export const WRONG = 5;             // 오답
export const FAIL = 25;             // 포기 · 최종 실패
export const BONUS = 3;             // 보너스 키워드
export const BUY = 10;              // 긴급 단서 열람
export const STALE_MS = 150000;     // 이만큼 답이 없으면 다시 묻기 허용

export const ANSWERS = ['네', '아니오', '관계없음', '애매함', '반려'];
export const NOTE_CODES = ['none', 'split', 'partial', 'interp', 'unset', 'premise', 'focus', 'open', 'notq'];

// 한 사건(같은 방 · 같은 문제 · 같은 범위)의 기록으로 지금 상태를 계산한다.
// meta: { facts: [{id, need}], clues: 단서 개수 }
// list: soup_events 행 (id, kind, status, answer, facts, hits, ok, final, clue_i, player, created_at)
export function derive(meta, list) {
  const facts = meta.facts || [];
  const clueN = meta.clues || 0;
  const L = [...(list || [])].sort((a, b) => a.id - b.id);
  const ids = new Set(facts.map(f => f.id));
  const revealed = new Map();
  const marks = new Map();       // 기록 id → 그 뒤에 열린 단서 번호들
  const boughtIdx = new Set();   // 긴급 열람한 단서 번호
  const qNo = new Map();
  let over = null, overEv = null, n = 0, q = 0, rej = 0, wrong = 0, bought = 0, ended = false;
  const cross = (before, after, id) => CLUE_AT.forEach((t, i) => {
    if (i < clueN && before < t && after >= t && !boughtIdx.has(i)) {
      if (!marks.has(id)) marks.set(id, []);
      marks.get(id).push(i);
    }
  });
  for (const e of L) {
    if (over) continue;
    const before = n;
    if (e.kind === 'q') {
      if (e.status !== 'done') continue;
      if (e.answer === '반려') { rej++; continue; }
      q++; n++; qNo.set(e.id, q);
      for (const f of e.facts || []) if (ids.has(f) && !revealed.has(f)) revealed.set(f, { by: e.player, at: e.created_at, via: 'q', ev: e.id });
    } else if (e.kind === 'clue') {
      const i = Math.trunc(Number(e.clue_i));
      if (i >= 0 && i < clueN && !boughtIdx.has(i) && n < CLUE_AT[i]) { boughtIdx.add(i); n += BUY; bought += BUY; }
    } else if (e.kind === 'end') {
      ended = true;
    } else if (e.kind === 'guess' && e.status === 'done') {
      // 틀린 제출은 몇 개 맞혔는지만 알려 주고 키워드는 열지 않는다 (가설을 여러 번 던져 키워드를 캐내지 못하게)
      if (e.ok) for (const [f, v] of Object.entries(e.hits || {})) if (v === 'hit' && ids.has(f) && !revealed.has(f)) revealed.set(f, { by: e.player, at: e.created_at, via: 'guess', ev: e.id });
      if (e.ok) { over = 'solved'; overEv = e; }
      else if (e.final) { over = 'failed'; overEv = e; n += FAIL; }
      else { wrong++; n += WRONG; }
    } else if (e.kind === 'giveup') {
      over = 'gaveup'; overEv = e; n += FAIL;
    }
    if (!over) cross(before, n, e.id);
  }
  const bonus = facts.filter(f => !f.need && revealed.has(f.id)).length;
  const need = facts.filter(f => f.need).length;
  const needFound = facts.filter(f => f.need && revealed.has(f.id)).length;
  const clues = Array.from({ length: clueN }, (_, i) => ({
    i, id: 'c' + (i + 1), at: CLUE_AT[i], bought: boughtIdx.has(i),
    open: !!over || n >= CLUE_AT[i] || boughtIdx.has(i)
  }));
  const open = new Set([...revealed.keys(), ...clues.filter(c => c.open).map(c => c.id)]);
  if (over) facts.forEach(f => open.add(f.id));
  return {
    L, revealed, marks, qNo, over, overEv, n, total: Math.max(0, n - BONUS * bonus), q, rej, wrong, bought, bonus,
    need, needFound, clues, open, nextClue: clues.find(c => !c.open), ended,
    capped: !over && (n >= CAP || ended),
    guessing: L.some(e => e.kind === 'guess' && e.status === 'pending')
  };
}

export function grade(d) {
  if (d.over !== 'solved') return '식은 수프';
  const t = d.total;
  return t <= 15 ? '한 숟갈' : t <= 25 ? '한 그릇' : t <= 35 ? '두 그릇' : t <= 50 ? '냄비째' : '솥째';
}
