// private/seed.json(문제 전체)을 서버 함수의 seed 동작으로 soup_secrets에 올린다.
// 관리자 토큰은 private/admin-token.txt 에 있고, 그 SHA-256 해시가 soup_admin 표에 들어 있어야 한다.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL = 'https://yunhtdmtzyuojotzhhoe.supabase.co/functions/v1/soup';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bmh0ZG10enl1b2pvdHpoaG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NTA5NjQsImV4cCI6MjEwNzMyNjk2NH0.OI9X5AlLpCi7aYqhspbVVlPLR2eSqmS04dl52I-JPHk';

const token = readFileSync(join(root, 'private/admin-token.txt'), 'utf8').trim();
const puzzles = JSON.parse(readFileSync(join(root, 'private/seed.json'), 'utf8'));
const res = await fetch(URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: 'Bearer ' + KEY },
  body: JSON.stringify({ action: 'seed', token, puzzles })
});
console.log(res.status, await res.text());
