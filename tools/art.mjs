// 생성된 사진을 게임에 넣는다.
// private/art/jobs.json 의 jobs 중 url 이 있는 것만 처리한다 (key 형식: "<문제id>:base" 또는 "<문제id>:c1"~"c3").
//  - base → docs/img/<id>.jpg (공개, 깃허브 Pages가 내려준다)
//  - c1~c3 → 무작위 이름으로 Supabase 저장소(soup-art)에 올리고, 주소를 private/art/assets.json 에 적는다
//            (단서 사진은 열리기 전까지 주소를 알 수 없어야 하므로 저장소에 두지 않는다)
// 실행: node tools/art.mjs   (그다음 node tools/build.mjs && node tools/seed.mjs)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SB = 'https://yunhtdmtzyuojotzhhoe.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bmh0ZG10enl1b2pvdHpoaG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NTA5NjQsImV4cCI6MjEwNzMyNjk2NH0.OI9X5AlLpCi7aYqhspbVVlPLR2eSqmS04dl52I-JPHk';
const token = readFileSync(join(root, 'private/admin-token.txt'), 'utf8').trim();
const jobsPath = join(root, 'private/art/jobs.json');
const assetsPath = join(root, 'private/art/assets.json');
const jobs = JSON.parse(readFileSync(jobsPath, 'utf8'));
const assets = existsSync(assetsPath) ? JSON.parse(readFileSync(assetsPath, 'utf8')) : {};
mkdirSync(join(root, 'docs/img'), { recursive: true });

async function fetchImage(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('download ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}
const toJpg = (buf, width) => sharp(buf).resize({ width, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();

async function upload(name, buf) {
  const r = await fetch(SB + '/functions/v1/soup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: 'Bearer ' + KEY },
    body: JSON.stringify({ action: 'upload', token, name, b64: buf.toString('base64') })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.url) throw new Error('upload ' + (j.error || r.status));
  return j.url;
}

let done = 0;
for (const job of jobs.jobs) {
  if (!job.url || job.placed) continue;
  const [id, part] = String(job.key).split(':');
  if (!id || !part) continue;
  try {
    const raw = await fetchImage(job.url);
    if (part === 'base') {
      const jpg = await toJpg(raw, 1280);
      writeFileSync(join(root, 'docs/img', id + '.jpg'), jpg);
      console.log('사건 사진', id, (jpg.length / 1024).toFixed(0) + 'KB');
    } else {
      const i = Number(part.replace('c', '')) - 1;
      if (!(i >= 0 && i < 3)) throw new Error('bad key ' + job.key);
      const jpg = await toJpg(raw, 1024);
      const url = await upload(randomBytes(16).toString('hex') + '.jpg', jpg);
      ((assets[id] ||= { clues: [] }).clues)[i] = url;
      console.log('단서 사진', id, part, (jpg.length / 1024).toFixed(0) + 'KB');
    }
    job.placed = true;
    done++;
  } catch (e) {
    console.log('실패', job.key, e.message);
  }
}
writeFileSync(jobsPath, JSON.stringify(jobs, null, 2));
writeFileSync(assetsPath, JSON.stringify(assets, null, 2));
console.log(`처리 ${done}건. 이어서: node tools/build.mjs && node tools/seed.mjs`);
