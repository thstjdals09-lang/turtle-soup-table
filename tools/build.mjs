// private/puzzles.mjs + private/puzzles-more.mjs (진상까지 든 원본, 저장소에 올리지 않음)에서
//  - docs/puzzles.js                   공개 데이터(문제, 삽화 바탕 또는 사진 경로, 키워드 개수)
//  - supabase/functions/soup/          화면과 같은 규칙(rules.js)·출제 지시문(judge.js) 사본
//  - private/seed.json                 서버(soup_secrets)에 올릴 문제 전체 (저장소에 올리지 않음)
// 을 만든다.  실행: node tools/build.mjs   올리기: node tools/seed.mjs
// 사진: docs/img/<id>.jpg 가 있으면 그 문제는 사진을 쓴다. 단서 사진 주소는 private/art/assets.json.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUZZLES } from '../private/puzzles.mjs';
import { MORE } from '../private/puzzles-more.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const squash = s => s.replace(/\s*\n\s*/g, '');
const ALL = [...PUZZLES, ...MORE];
const assetsPath = join(root, 'private/art/assets.json');
const assets = existsSync(assetsPath) ? JSON.parse(readFileSync(assetsPath, 'utf8')) : {};

// 점검: id 중복, 단서 3개, 필수 키워드 3개 이상
const ids = new Set();
for (const p of ALL) {
  if (ids.has(p.id)) throw new Error('중복 id ' + p.id);
  ids.add(p.id);
  if (p.secret.clues.length !== 3) throw new Error(p.id + ' 단서가 3개가 아님');
  if (p.secret.facts.filter(f => f.need).length < 3) throw new Error(p.id + ' 필수 키워드 3개 미만');
}

const pub = ALL.map(({ secret, art, ...p }) => {
  const photo = existsSync(join(root, 'docs/img', p.id + '.jpg')) ? `img/${p.id}.jpg` : undefined;
  return {
    ...p,
    scene: p.scene ? squash(p.scene) : undefined,
    photo,
    facts: secret.facts.map(f => ({ id: f.id, need: f.need })),
    clues: secret.clues.length
  };
});
const pubJs = '// 자동 생성 파일 — tools/build.mjs 가 private/ 원본에서 만든다. 직접 고치지 말 것.\n'
  + 'export const PUZZLES = ' + JSON.stringify(pub, null, 1) + ';\n';
writeFileSync(join(root, 'docs/puzzles.js'), pubJs);
for (const f of ['rules.js', 'judge.js']) writeFileSync(join(root, 'supabase/functions/soup', f), readFileSync(join(root, 'docs', f), 'utf8'));

const seed = Object.fromEntries(ALL.map(p => [p.id, {
  title: p.title, story: p.story, sceneNote: p.sceneNote,
  spots: p.spots.map(({ label, text }) => ({ label, text })),
  truth: p.secret.truth, facts: p.secret.facts, canon: p.secret.canon,
  clues: p.secret.clues.map((c, i) => ({ ...c, img: assets[p.id]?.clues?.[i] || undefined })),
  layers: Object.fromEntries(Object.entries(p.secret.layers || {}).map(([k, v]) => [k, squash(v)]))
}]));
writeFileSync(join(root, 'private/seed.json'), JSON.stringify(seed));

const photos = pub.filter(p => p.photo).length;
console.log(`docs/puzzles.js ${(pubJs.length / 1024).toFixed(1)}KB · ${ALL.length}문제 (사진 ${photos}) · private/seed.json 준비`);
