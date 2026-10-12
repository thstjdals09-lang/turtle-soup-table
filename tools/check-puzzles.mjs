// 문제 설계 규칙(tools/PUZZLE_RULES.md)의 기계적인 부분을 검사한다.
// 실행: node tools/check-puzzles.mjs [id ...]   (id를 주지 않으면 전부)
// 겹침은 글자 두 개씩 묶은 조각(바이그램)으로 잰다. 숫자가 높을수록 비슷하다.
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPuzzles } from './puzzle-data.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const want = new Set(process.argv.slice(2));
const NEED = { 1: 3, 2: 4, 3: 5 };
const ANS = ['네', '아니오', '관계없음', '애매함'];
const STOP = new Set(['있었', '었다', '했다', '이었', '였다', '에서', '으로', '하고', '그는', '그녀', '있다', '것을', '것이', '사람', '하는', '했고', '지만', '에게', '이다']);

const grams = s => {
  const t = String(s || '').replace(/[^가-힣a-zA-Z0-9]/g, '');
  const g = new Set();
  for (let i = 0; i < t.length - 1; i++) { const b = t.slice(i, i + 2); if (!STOP.has(b)) g.add(b); }
  return g;
};
const tri = s => { const t = String(s || '').replace(/[^가-힣a-zA-Z0-9]/g, ''); const g = new Set(); for (let i = 0; i < t.length - 2; i++) g.add(t.slice(i, i + 3)); return g; };
const inter = (a, b) => [...a].filter(x => b.has(x)).length;
const jaccard = (a, b) => (a.size && b.size ? inter(a, b) / new Set([...a, ...b]).size : 0);
const contain = (a, b) => (a.size ? inter(a, b) / a.size : 0);   // a 가 b 안에 얼마나 들어 있나
const pct = x => Math.round(x * 100) + '%';

let bad = 0, checked = 0;
for (const p of loadPuzzles(root)) {
  if (want.size && !want.has(p.id)) continue;
  checked++;
  const s = p.secret, errs = [], warns = [];
  const need = s.facts.filter(f => f.need), bonus = s.facts.filter(f => !f.need);
  if (need.length !== NEED[p.level]) errs.push(`필수 키워드 ${need.length}개 — 별 ${p.level}개는 ${NEED[p.level]}개여야 함`);
  if (bonus.length !== 1) errs.push(`보너스 키워드 ${bonus.length}개 — 1개여야 함`);
  if (s.clues.length !== 3) errs.push(`단서 ${s.clues.length}개 — 3개여야 함`);
  if ((s.canon || []).length < 12) errs.push(`출제자 메모 ${(s.canon || []).length}개 — 12개 이상`);
  for (const [q, a] of s.canon || []) if (!ANS.some(x => String(a).startsWith(x))) errs.push(`출제자 메모 판정이 이상함: "${q}" → "${a}"`);
  if (String(s.truth || '').length < 150) errs.push('진상이 너무 짧음 (150자 이상)');
  if (p.starters?.length && !p.rewritten) warns.push('첫 질문 추천(starters)은 쓰지 않음');
  const ids = new Set();
  for (const f of s.facts) {
    if (ids.has(f.id)) errs.push(`키워드 id 중복 ${f.id}`); ids.add(f.id);
    const len = [...String(f.label || '')].length;
    if (len < 12 || len > 44) warns.push(`${f.id} 라벨 길이 ${len}자 (20~40자 권장): ${f.label}`);
    if (String(f.check || '').length < 15) errs.push(`${f.id} 채점 기준(check)이 너무 짧음`);
  }
  // 공개된 글: 이야기 · 사진 설명 · 현장 메모
  const pub = grams([p.story, p.sceneNote, ...(p.spots || []).map(x => x.label + ' ' + x.text)].join(' '));
  for (const f of s.facts) {
    const c = contain(grams(f.label), pub);
    if (c >= 0.6) errs.push(`${f.id} 이야기·사진·메모만으로 드러남 (${pct(c)}): ${f.label}`);
    else if (c >= 0.45) warns.push(`${f.id} 공개된 글과 많이 겹침 (${pct(c)}): ${f.label}`);
  }
  for (let i = 0; i < s.facts.length; i++) for (let j = i + 1; j < s.facts.length; j++) {
    const a = s.facts[i], b = s.facts[j], jv = jaccard(grams(a.label), grams(b.label));
    if (jv >= 0.3) errs.push(`${a.id}·${b.id} 키워드끼리 겹침 (${pct(jv)}): "${a.label}" / "${b.label}"`);
    else if (jv >= 0.2) warns.push(`${a.id}·${b.id} 키워드가 조금 겹침 (${pct(jv)})`);
    const same = [...tri(a.label)].filter(x => tri(b.label).has(x));
    if (same.length) warns.push(`${a.id}·${b.id} 같은 낱말을 씀: ${same.slice(0, 3).join(', ')} — 같은 대상을 두 번 묻는지 확인`);
  }
  s.clues.forEach((c, i) => {
    for (const f of need) {
      const v = contain(grams(f.label), grams(c.text));
      if (v >= 0.5) errs.push(`단서 #${i + 1}이 ${f.id}를 거의 그대로 말함 (${pct(v)})`);
    }
  });
  const tag = errs.length ? '✗' : warns.length ? '△' : '✓';
  console.log(`${tag} ${p.id} (별 ${p.level}, 필수 ${need.length})${p.rewritten ? ' [고쳐 씀]' : ''}`);
  for (const e of errs) console.log('   오류: ' + e);
  for (const w of warns) console.log('   주의: ' + w);
  if (errs.length) bad++;
}
console.log(`\n검사 ${checked}개 · 오류 있는 문제 ${bad}개`);
process.exit(bad ? 1 : 0);
