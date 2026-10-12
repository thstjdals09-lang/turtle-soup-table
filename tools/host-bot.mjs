// 바다거북 수프 식탁 — 방장 PC의 출제자 봇.
// 서버에 쌓인 "대기" 질문을 가져와 로그인된 Claude Code(claude -p)로 판정하고 결과를 올린다.
// 판정은 방장의 Claude 구독 사용량에서 빠진다. 게임할 때만 켜 두면 된다.
//
// 실행: node tools/host-bot.mjs   (또는 host-bot.bat 더블클릭)
// 선택 환경 변수: BOT_MODEL(예: sonnet, opus), BOT_PARALLEL(동시 판정 수, 기본 2), CLAUDE_BIN(claude 실행 파일 경로)
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { derive } from '../docs/rules.js';
import { gradeSchema, gradeSystem, gradeUser, judgeSchema, judgeSystem, judgeUser, metaOf } from '../docs/judge.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SB = 'https://yunhtdmtzyuojotzhhoe.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bmh0ZG10enl1b2pvdHpoaG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NTA5NjQsImV4cCI6MjEwNzMyNjk2NH0.OI9X5AlLpCi7aYqhspbVVlPLR2eSqmS04dl52I-JPHk';
const HEAD = { apikey: KEY, Authorization: 'Bearer ' + KEY };
const MODEL = process.env.BOT_MODEL || '';
const PARALLEL = Math.max(1, Number(process.env.BOT_PARALLEL || 2));
const POLL_MS = 2500, PING_MS = 30000, TIMEOUT_MS = 180000;

const log = (...a) => console.log(new Date().toLocaleTimeString('ko-KR'), ...a);
const need = (path, hint) => { if (!existsSync(path)) { console.error(`${path} 가 없어요. ${hint}`); process.exit(1); } return path; };
const token = readFileSync(need(join(root, 'private/admin-token.txt'), '관리자 토큰 파일이 필요해요.'), 'utf8').trim();
const puzzles = JSON.parse(readFileSync(need(join(root, 'private/seed.json'), '먼저 node tools/build.mjs 를 실행하세요.'), 'utf8'));

function findClaude() {
  if (process.env.CLAUDE_BIN) return process.env.CLAUDE_BIN;
  const appdata = process.env.APPDATA;
  const win = appdata && join(appdata, 'npm/node_modules/@anthropic-ai/claude-code/bin/claude.exe');
  if (win && existsSync(win)) return win;
  return 'claude';
}
const CLAUDE = findClaude();
// claude가 프로젝트 설정이나 CLAUDE.md를 읽지 않도록 빈 폴더에서 실행한다
const work = mkdtempSync(join(tmpdir(), 'soup-bot-'));

async function rest(path) {
  const r = await fetch(`${SB}/rest/v1/${path}`, { headers: HEAD });
  if (!r.ok) throw new Error('rest ' + r.status);
  return r.json();
}
async function fn(action, body) {
  const r = await fetch(`${SB}/functions/v1/soup`, {
    method: 'POST', headers: { ...HEAD, 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, token, ...body })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(j.error || 'http ' + r.status);
  return j;
}

function runClaude(system, user, schema) {
  const sysFile = join(work, 'sys-' + createHash('sha1').update(system).digest('hex').slice(0, 12) + '.txt');
  if (!existsSync(sysFile)) writeFileSync(sysFile, system);
  const args = ['-p', '--system-prompt-file', sysFile, '--tools', '', '--strict-mcp-config', '--disable-slash-commands',
    '--no-session-persistence', '--output-format', 'json', '--json-schema', JSON.stringify(schema)];
  if (MODEL) args.push('--model', MODEL);
  return new Promise((resolve, reject) => {
    const child = spawn(CLAUDE, args, { cwd: work, windowsHide: true });
    let out = '', err = '';
    const timer = setTimeout(() => { child.kill(); reject(new Error('시간 초과')); }, TIMEOUT_MS);
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { err += d; });
    child.on('error', e => { clearTimeout(timer); reject(e); });
    child.on('close', code => {
      clearTimeout(timer);
      try {
        const j = JSON.parse(out);
        if (j.is_error || !j.structured_output) return reject(new Error(j.result || j.subtype || 'no output'));
        resolve(j.structured_output);
      } catch { reject(new Error(`claude 종료 ${code}: ${(err || out).slice(0, 200)}`)); }
    });
    child.stdin.end(user);
  });
}

const busy = new Set();
async function handle(e) {
  const mode = e.appeal === 'pending' ? 'appeal' : e.kind === 'guess' ? 'grade' : 'judge';
  const s = puzzles[e.puzzle];
  const t0 = Date.now();
  try {
    if (!s) throw new Error('모르는 문제 ' + e.puzzle);
    let out;
    if (mode === 'grade') out = await runClaude(gradeSystem(s), gradeUser(e.body), gradeSchema(s));
    else {
      const list = await rest(`soup_events?room=eq.${e.room}&puzzle=eq.${e.puzzle}&scope=eq.${encodeURIComponent(e.scope)}&order=id.asc&select=*`);
      const d = derive(metaOf(s), list.filter(x => x.id !== e.id));
      out = await runClaude(judgeSystem(s), judgeUser(d, e.body, mode === 'appeal' ? e.prev : null), judgeSchema(s));
    }
    await fn('bot_done', { id: e.id, mode, result: out });
    const shown = mode === 'grade' ? JSON.stringify(out.hits) : out.answer;
    log(`[${e.room.toUpperCase()}] ${s.title} · ${mode === 'grade' ? '진상 채점' : mode === 'appeal' ? '이의 재판정' : '질문'} "${String(e.body).slice(0, 40)}" → ${shown} (${((Date.now() - t0) / 1000).toFixed(1)}초)`);
  } catch (err) {
    log(`판정 실패 #${e.id}: ${err.message}`);
    await fn('bot_done', { id: e.id, mode, error: 'bot_failed' }).catch(() => {});
  }
}

async function tick() {
  try {
    const rows = await rest('soup_events?or=(status.eq.pending,appeal.eq.pending)&order=id.asc&limit=20&select=*');
    for (const e of rows) {
      if (busy.size >= PARALLEL) break;
      if (busy.has(e.id) || !['q', 'guess'].includes(e.kind)) continue;
      busy.add(e.id);
      handle(e).finally(() => busy.delete(e.id));
    }
  } catch (err) { log('기록을 읽지 못했어요:', err.message); }
}
async function ping(off) {
  try {
    const r = await fn('bot_ping', off ? { off: true } : {});
    if (r.judge === 'api' && !off) log('알림: 서버에 API 키가 있어서 판정은 서버가 해요. 이 봇은 켜 둬도 할 일이 없어요.');
  } catch (err) { log('서버에 출석을 알리지 못했어요:', err.message); }
}

log(`출제자 봇 시작 · claude: ${CLAUDE}${MODEL ? ' · 모델 ' + MODEL : ''} · 동시 ${PARALLEL}개`);
log('창을 닫거나 Ctrl+C를 누르면 출제자가 자리를 비운 것으로 표시돼요.');
await ping(false);
setInterval(() => ping(false), PING_MS);
setInterval(tick, POLL_MS);
tick();
let quitting = false;
const quit = async () => { if (quitting) return; quitting = true; log('출제자 봇을 끕니다.'); await ping(true); process.exit(0); };
process.on('SIGINT', quit);
process.on('SIGTERM', quit);
process.on('SIGHUP', quit);
