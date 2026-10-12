// 바다거북 수프 식탁 — 화면(docs/app.js)과 서버 함수(supabase/functions/soup)가 함께 쓰는 규칙.
// 서버 함수에는 빌드 때 이 파일이 그대로 복사된다.

export const CAP = 50;              // 질문 마감 문수
export const CLUE_AT = [15, 30, 45]; // 단서가 열리는 문수
export const SHORT = { cap: 35, clueAt: [10, 20, 30] };  // 짧은 사건
export const WRONG = 5;             // 오답
export const FAIL = 25;             // 포기 · 최종 실패
export const RELIEF = 15;           // 미해결 벌점 감면 한도: 낸 답안에서 인정된 만큼 (맞힘 1 · 방향만 0.5)
export const BONUS = 3;             // 보너스 키워드
export const BUY = 10;              // 긴급 단서 열람
export const STALE_MS = 150000;     // 이만큼 답이 없으면 다시 묻기 허용

export const ANSWERS = ['네', '아니오', '관계없음', '애매함', '반려'];
export const NOTE_CODES = ['none', 'split', 'partial', 'interp', 'unset', 'premise', 'focus', 'open', 'notq'];

// 사건 형식: 보통(50문 · 단서 15/30/45) / 짧게(35문 · 단서 10/20/30)
export const formatOf = meta => (meta?.short ? SHORT : { cap: CAP, clueAt: CLUE_AT });

// 등급 기준 [한 숟갈, 한 그릇, 두 그릇, 냄비째] 이하 문수. 사건마다 다르다.
// 풀이 기록으로 맞춘 값(cuts)이 있으면 그것을, 없으면 필수 키워드 수와 사건 길이로 정한다.
export const GRADE_NAMES = ['한 숟갈', '한 그릇', '두 그릇', '냄비째', '솥째'];
const CUTS = { 2: [8, 15, 24, 40], 3: [12, 20, 30, 45], 4: [15, 25, 35, 50], 5: [18, 28, 38, 50], 6: [20, 30, 40, 50] };
const CUTS_SHORT = { 2: [6, 11, 18, 30], 3: [8, 14, 22, 35], 4: [10, 17, 25, 35], 5: [12, 19, 27, 35], 6: [13, 20, 28, 35] };
export function cutsOf(meta) {
  if (Array.isArray(meta?.cuts) && meta.cuts.length === 4) return meta.cuts;
  const n = Math.max(2, Math.min(6, (meta?.facts || []).filter(f => f.need).length || 4));
  return (meta?.short ? CUTS_SHORT : CUTS)[n];
}
// 해결한 판들의 최종 문수로 기준을 맞춘다: 상위 20 · 45 · 70 · 90%
export const CALIB_MIN = 10;
export function calibrate(totals) {
  const t = (totals || []).map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  if (t.length < CALIB_MIN) return null;
  const at = p => t[Math.min(t.length - 1, Math.floor(p * t.length))];
  const out = [];
  let prev = 1;
  for (const p of [0.2, 0.45, 0.7, 0.9]) { const v = Math.max(prev + 2, Math.min(60, at(p))); out.push(v); prev = v; }
  return out;
}

// 비슷한 질문: 띄어쓰기 · 문장부호 · 끝맺음(~나요, ~습니까)을 떼고 거의 같은 말이면 같은 질문으로 본다.
// 부정어(안 · 않 · 못 · 없 · 아니)나 숫자가 다르면 다른 질문이다.
const normQ = s => String(s || '').replace(/[^가-힣a-zA-Z0-9]/g, '')
  .replace(/(입니까|습니까|인가요|인가|나요|까요|가요|어요|아요|에요|예요|지요|죠|니|냐|요)$/, '');
const negs = s => (s.match(/안|않|못|없|아니/g) || []).join('');
const nums = s => (s.match(/\d+/g) || []).join(',');
export function similarQ(a, b) {
  const x = normQ(a), y = normQ(b);
  if (x.length < 2 || y.length < 2) return false;
  if (x === y) return true;
  if (negs(x) !== negs(y) || nums(x) !== nums(y)) return false;
  const big = s => { const g = new Set(); for (let i = 0; i < s.length - 1; i++) g.add(s.slice(i, i + 2)); return g; };
  const A = big(x), B = big(y);
  let inter = 0;
  for (const g of A) if (B.has(g)) inter++;
  return inter / (A.size + B.size - inter) >= 0.8;
}
// 이미 판정이 난 질문 중 비슷한 것 (반려 · 판정 전 제외)
export const similarOf = (L, text) => [...L].reverse().find(e => e.kind === 'q' && e.status === 'done' && e.answer !== '반려' && similarQ(e.body, text)) || null;

// 함께 풀기 규칙(방장이 정함): 의논 기록에 note "rules"(내용은 JSON), 차례 넘기기는 note "skip" 으로 남는다
const readRules = body => {
  try {
    const r = JSON.parse(body);
    return { turns: !!r.turns, approve: !!r.approve, order: (Array.isArray(r.order) ? r.order : []).map(String).slice(0, 12) };
  } catch { return null; }
};

// 한 사건(같은 방 · 같은 문제 · 같은 범위)의 기록으로 지금 상태를 계산한다.
// meta: { facts: [{id, need}], clues: 단서 개수, short?, cuts? }
// list: soup_events 행 (id, kind, status, answer, note, facts, hits, ok, final, clue_i, player, created_at)
export function derive(meta, list) {
  const facts = meta.facts || [];
  const clueN = meta.clues || 0;
  const { cap, clueAt } = formatOf(meta);
  const L = [...(list || [])].sort((a, b) => a.id - b.id);
  const ids = new Set(facts.map(f => f.id));
  const revealed = new Map();
  const marks = new Map();       // 기록 id → 그 뒤에 열린 단서 번호들
  const boughtIdx = new Set();   // 긴급 열람한 단서 번호
  const giftIdx = new Set();     // 따로 풀기에서 누가 먼저 풀어 선물로 열린 단서 번호
  const qNo = new Map();
  let over = null, overEv = null, n = 0, q = 0, rej = 0, wrong = 0, bought = 0, ended = false, best = 0, relief = 0;
  let rules = { turns: false, approve: false, order: [] }, ptr = 0;
  const needs = facts.filter(f => f.need);
  const credit = hits => needs.length ? needs.reduce((a, f) => a + (hits?.[f.id] === 'hit' ? 1 : hits?.[f.id] === 'partial' ? 0.5 : 0), 0) / needs.length : 0;
  const fail = () => { relief = Math.round(RELIEF * best); n += FAIL - relief; };
  const early = i => boughtIdx.has(i) || giftIdx.has(i);
  const cross = (before, after, id) => clueAt.forEach((t, i) => {
    if (i < clueN && before < t && after >= t && !early(i)) {
      if (!marks.has(id)) marks.set(id, []);
      marks.get(id).push(i);
    }
  });
  for (const e of L) {
    if (over) continue;
    if (e.kind === 'chat') {
      if (e.note === 'rules') { rules = readRules(e.body) || rules; ptr = 0; }
      else if (e.note === 'skip') ptr++;
      continue;
    }
    // 차례제: 질문(반려 빼고)과 진상 제출 · 제안이 한 차례씩 쓴다
    if (rules.turns && ((e.kind === 'q' && e.answer !== '반려') || e.kind === 'guess')) ptr++;
    const before = n;
    if (e.kind === 'q') {
      if (e.status !== 'done') continue;
      if (e.answer === '반려') { rej++; continue; }
      q++; n++; qNo.set(e.id, q);
      for (const f of e.facts || []) if (ids.has(f) && !revealed.has(f)) revealed.set(f, { by: e.player, at: e.created_at, via: 'q', ev: e.id });
    } else if (e.kind === 'clue') {
      const i = Math.trunc(Number(e.clue_i));
      const ok = i >= 0 && i < clueN && !early(i) && n < clueAt[i];
      if (ok && e.note === 'gift') giftIdx.add(i);
      else if (ok) { boughtIdx.add(i); n += BUY; bought += BUY; }
    } else if (e.kind === 'end') {
      ended = true;
    } else if (e.kind === 'guess' && e.status === 'done') {
      // 틀린 제출은 몇 개 맞혔는지만 알려 주고 키워드는 열지 않는다 (가설을 여러 번 던져 키워드를 캐내지 못하게)
      if (e.ok) for (const [f, v] of Object.entries(e.hits || {})) if (v === 'hit' && ids.has(f) && !revealed.has(f)) revealed.set(f, { by: e.player, at: e.created_at, via: 'guess', ev: e.id });
      if (!e.ok) best = Math.max(best, credit(e.hits));
      if (e.ok) { over = 'solved'; overEv = e; }
      else if (e.final) { over = 'failed'; overEv = e; fail(); }
      else { wrong++; n += WRONG; }
    } else if (e.kind === 'giveup') {
      over = 'gaveup'; overEv = e; fail();
    }
    if (!over) cross(before, n, e.id);
  }
  const bonus = facts.filter(f => !f.need && revealed.has(f.id)).length;
  const need = needs.length;
  const needFound = facts.filter(f => f.need && revealed.has(f.id)).length;
  const clues = Array.from({ length: clueN }, (_, i) => ({
    i, id: 'c' + (i + 1), at: clueAt[i], bought: boughtIdx.has(i), gift: giftIdx.has(i),
    open: !!over || n >= clueAt[i] || early(i)
  }));
  const open = new Set([...revealed.keys(), ...clues.filter(c => c.open).map(c => c.id)]);
  if (over) facts.forEach(f => open.add(f.id));
  const turn = !over && rules.turns && rules.order.length ? rules.order[ptr % rules.order.length] : null;
  return {
    L, revealed, marks, qNo, over, overEv, n, relief, credit: Math.round(RELIEF * best), total: Math.max(0, n - BONUS * bonus), q, rej, wrong, bought, bonus,
    need, needFound, clues, open, nextClue: clues.find(c => !c.open), ended,
    cap, clueAt, short: !!meta.short, cuts: cutsOf(meta),
    capped: !over && (n >= cap || ended),
    rules, turn,
    // 방장 승인을 기다리는 정답 제안 / 채점 중인 진상 제출
    proposal: over ? null : L.find(e => e.kind === 'guess' && e.status === 'pending' && e.note === 'proposal') || null,
    guessing: L.some(e => e.kind === 'guess' && e.status === 'pending' && e.note !== 'proposal')
  };
}

export function grade(d) {
  if (d.over !== 'solved') return '식은 수프';
  const c = d.cuts || CUTS[4];
  const i = c.findIndex(x => d.total <= x);
  return GRADE_NAMES[i < 0 ? 4 : i];
}
