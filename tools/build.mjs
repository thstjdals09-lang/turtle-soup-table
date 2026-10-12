// private/puzzles.mjs(진상까지 든 원본, 저장소에 올리지 않음)에서
//  - docs/puzzles.js                  공개 데이터(문제, 삽화 바탕, 키워드 개수)
//  - supabase/functions/soup/rules.js  화면과 같은 규칙 사본
//  - private/seed.json                서버(soup_secrets)에 올릴 문제 전체 (저장소에 올리지 않음)
// 을 만든다.  실행: node tools/build.mjs   올리기: node tools/seed.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUZZLES } from '../private/puzzles.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const squash = s => s.replace(/\s*\n\s*/g, '');

const pub = PUZZLES.map(({ secret, ...p }) => ({
  ...p,
  scene: squash(p.scene),
  facts: secret.facts.map(f => ({ id: f.id, need: f.need })),
  clues: secret.clues.length
}));
const pubJs = '// 자동 생성 파일 — tools/build.mjs 가 private/puzzles.mjs 에서 만든다. 직접 고치지 말 것.\n'
  + 'export const PUZZLES = ' + JSON.stringify(pub, null, 1) + ';\n';
writeFileSync(join(root, 'docs/puzzles.js'), pubJs);
writeFileSync(join(root, 'supabase/functions/soup/rules.js'), readFileSync(join(root, 'docs/rules.js'), 'utf8'));

const seed = Object.fromEntries(PUZZLES.map(p => [p.id, {
  title: p.title, story: p.story, sceneNote: p.sceneNote,
  spots: p.spots.map(({ label, text }) => ({ label, text })),
  truth: p.secret.truth, facts: p.secret.facts, canon: p.secret.canon, clues: p.secret.clues,
  layers: Object.fromEntries(Object.entries(p.secret.layers).map(([k, v]) => [k, squash(v)]))
}]));
writeFileSync(join(root, 'private/seed.json'), JSON.stringify(seed));

console.log(`docs/puzzles.js ${(pubJs.length / 1024).toFixed(1)}KB · ${PUZZLES.length}문제 · private/seed.json 준비`);
