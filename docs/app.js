// 바다거북 수프 식탁 — 화면
// 방과 기록은 Supabase(soup_rooms, soup_events)에서 읽고 실시간으로 받는다.
// 쓰기와 AI 판정은 모두 서버 함수 /functions/v1/soup 를 거친다.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { PUZZLES } from './puzzles.js';
import { CAP, CLUE_AT, WRONG, FAIL, BONUS, BUY, STALE_MS, derive, grade } from './rules.js';

const SUPABASE_URL = 'https://yunhtdmtzyuojotzhhoe.supabase.co';
// 공개용 anon 키. 데이터베이스 정책상 방과 기록을 읽는 것만 할 수 있다.
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bmh0ZG10enl1b2pvdHpoaG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NTA5NjQsImV4cCI6MjEwNzMyNjk2NH0.OI9X5AlLpCi7aYqhspbVVlPLR2eSqmS04dl52I-JPHk';
const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

/* ---------- 작은 도구 ---------- */
const $ = (s, r = document) => r.querySelector(s);
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'svg') el.innerHTML = v; // 이 페이지와 서버 함수가 만든 삽화 문자열만 넣는다
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) {
    if (c == null || c === false) continue;
    el.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
}
// replaceChildren은 null을 "null" 글자로 넣으므로 빈 값을 걸러서 넣는다
const put = (el, ...kids) => el.replaceChildren(...kids.flat().filter(k => k != null && k !== false && k !== ''));
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const num = i => 'No. ' + String(i + 1).padStart(2, '0');
const P = Object.fromEntries(PUZZLES.map(p => [p.id, p]));
const tms = v => (typeof v === 'number' ? v : Date.parse(v || 0) || 0);
function ago(t) {
  const s = Math.max(0, (Date.now() - tms(t)) / 1000);
  if (s < 45) return '방금';
  if (s < 3600) return Math.round(s / 60) + '분 전';
  if (s < 86400) return Math.round(s / 3600) + '시간 전';
  return Math.round(s / 86400) + '일 전';
}

/* ---------- 나 ---------- */
let me = lsGet('soup.player', '');
if (!/^[A-Za-z0-9-]{8,64}$/.test(me || '')) { me = crypto.randomUUID(); lsSet('soup.player', me); }
let myName = String(lsGet('soup.name', '') || '').slice(0, 20);

/* ---------- 답 ---------- */
const ANS_CLASS = { '네': 's-yes', '아니오': 's-no', '관계없음': 's-na', '애매함': 's-amb', '반려': 's-rej' };
const NOTES = {
  split: '참과 거짓이 섞였어요. 절 단위로 나눠 물어 보세요',
  partial: '일부만 맞아요',
  interp: '해석에 따라 갈려요',
  unset: '진상에 정해져 있진 않지만 풀이와 닿아 있어요',
  premise: '질문의 전제가 틀렸어요',
  focus: '그쪽은 진상과 거리가 멀어요',
  open: '누가·왜·어떻게 대신 네·아니오로 답할 수 있게 물어 주세요. 문수에 넣지 않았어요',
  notq: '질문이 아니라서 돌려보냈어요. 문수에 넣지 않았어요'
};
const ERR = {
  network: '서버에 닿지 않았어요. 인터넷 연결을 확인해 주세요.',
  no_room: '그런 방이 없어요. 코드를 다시 확인해 주세요.',
  bad_code: '방 코드는 영문과 숫자 4자리예요.',
  no_key: '출제자 AI 키가 아직 설정되지 않았어요. 게임 관리자가 Supabase에 키를 넣어야 해요.',
  daily_limit: '오늘 쓸 수 있는 AI 판정을 다 썼어요. 내일 다시 열려요.',
  rate_limited: '질문이 몰렸어요. 잠시 뒤 다시 묻기를 눌러 주세요.',
  over: '이 사건은 이미 끝났어요.',
  capped: '질문이 마감됐어요. 최종 답안만 낼 수 있어요.',
  guessing: '제출한 진상을 채점하는 중이에요. 잠시 기다려 주세요.',
  too_many: '답을 기다리는 질문이 세 개예요. 답이 오면 다시 물어 주세요.',
  not_host: '함께 풀기 기록은 방을 만든 사람만 지울 수 있어요.',
  bot_failed: '출제자 봇이 판정하지 못했어요. 다시 묻기를 눌러 주세요.',
  gemini_busy: '무료 AI가 잠깐 붐벼요. 조금 뒤 다시 묻기를 누르거나, 방장 출제자 봇이 켜져 있으면 봇이 대신 답해요.',
  no_clue: '더 열 단서가 없어요.',
  server: '출제자가 답을 정하지 못했어요. 다시 묻기를 눌러 주세요.'
};
const errText = c => ERR[c] || ERR.server;
const stamp = (a, big) => h('span', { class: 'stamp ' + (ANS_CLASS[a] || 's-amb') + (big ? ' big' : '') }, a);

/* ---------- 서버 ---------- */
async function api(action, body = {}) {
  let r;
  try {
    r = await fetch(SUPABASE_URL + '/functions/v1/soup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY },
      body: JSON.stringify({ action, player: me, name: myName, ...body })
    });
  } catch { throw { code: 'network' }; }
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw { code: j.error || 'server' };
  return j;
}

/* ---------- 상태 ---------- */
const S = {
  view: 'home', caseId: null, filter: 'all',
  talkOpen: false, talkSeen: {}, talkJump: false, guessDraft: '', briefOpen: false,
  resultOpen: false, resultSeen: new Set(),   // 정답이 나오면 결과 페이지를 한 번 자동으로 띄운다
  play: lsGet('soup.play', 'coop') === 'versus' ? 'versus' : 'coop',
  room: null, host: null, channel: null, conn: 'off', judge: null, botSeen: 0,
  events: new Map(), loaded: false, peers: [], typing: null, lastTrack: '',
  spot: null, seen: {}, err: '', lobbyErr: '', busy: false,
  pins: new Set(lsGet('soup.pins', []) || []), reveal: new Map(),
  arc: { f: 'all', q: '', sort: 'no', ...(lsGet('soup.arc', {}) || {}) },
  watch: null,  // 경쟁전에서 내 기록이 끝난 뒤 지켜보는 다른 수사관
  mtab: null, logSeen: {}   // 좁은 화면의 사건/기록 탭, 탭별로 읽은 기록 수
};
const narrow = () => matchMedia('(max-width:900px)').matches;
const playing = () => S.play;
const scopeOf = kind => (kind === 'versus' ? (S.watch || me) : 'coop');
const watching = () => S.play === 'versus' && !!S.watch && S.watch !== me;
let idx = null;
function index() {
  if (idx) return idx;
  idx = { logs: new Map(), names: new Map(), likes: new Map(), rates: new Map() };
  for (const e of [...S.events.values()].sort((a, b) => a.id - b.id)) {
    if (e.name) idx.names.set(e.player, e.name);
    // 끝난 뒤의 반응(추천 · 체감 난이도)은 수사 기록과 따로 모은다
    if (e.kind === 'like') { if (!idx.likes.has(e.body)) idx.likes.set(e.body, new Set()); idx.likes.get(e.body).add(e.player); continue; }
    if (e.kind === 'rate') { if (!idx.rates.has(e.puzzle)) idx.rates.set(e.puzzle, new Map()); idx.rates.get(e.puzzle).set(e.player, e.body); continue; }
    const k = e.puzzle + '|' + e.scope;
    if (!idx.logs.has(k)) idx.logs.set(k, []);
    idx.logs.get(k).push(e);
  }
  return idx;
}
const logsOf = (pid, kind = playing()) => index().logs.get(pid + '|' + scopeOf(kind)) || [];
const dOf = (pid, kind = playing()) => derive(P[pid], logsOf(pid, kind));

/* ---------- 사람 ---------- */
function who(id) {
  if (!id || id === me) return { name: myName || '나', av: avatar(me, myName || '나'), me: true };
  const peer = S.peers.find(p => p.id === id);
  const name = peer?.name || index().names.get(id) || '손님';
  return { name, av: avatar(id, name) };
}
function avatar(seed, name) {
  const hue = [...String(seed || 'x')].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);
  const ch = [...String(name || '?')][0] || '?';
  const esc = ch.replace(/[<>&"']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="16" fill="hsl(${hue},24%,30%)"/><text x="16" y="21.5" font-size="15" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#E3E9EE">${esc}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
function viewersHere(pid) {
  return S.peers.filter(p => (!pid || p.c === pid));
}

/* ---------- 방 ---------- */
function ensureName() {
  if (!myName) { myName = '손님' + (10 + Math.floor(Math.random() * 90)); lsSet('soup.name', myName); }
}
async function createRoom() {
  ensureName();
  S.lobbyErr = ''; S.busy = true; render();
  try { const r = await api('create'); await enterRoom(r.code); }
  catch (e) { S.lobbyErr = errText(e.code); }
  S.busy = false; render();
}
async function joinRoom(code, quiet) {
  const c = String(code || '').trim().toLowerCase();
  if (!/^[a-z0-9]{4}$/.test(c)) { if (!quiet) { S.lobbyErr = ERR.bad_code; render(); } return false; }
  ensureName();
  S.lobbyErr = ''; S.busy = true; render();
  try { await enterRoom(c); S.busy = false; render(); return true; }
  catch (e) { S.busy = false; if (!quiet) S.lobbyErr = errText(e.code); else lsSet('soup.room', null); render(); return false; }
}
async function enterRoom(code) {
  const r = await api('join', { code });
  leaveRoom(true);
  S.room = r.code; S.host = r.host; S.judge = r.judge || 'api'; S.events = new Map(); idx = null; S.loaded = false; S.reveal.clear(); S.seen = {};
  pollBot();
  lsSet('soup.room', S.room);
  const ch = sb.channel('soup:' + S.room, { config: { presence: { key: me } } });
  ch.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'soup_events', filter: 'room=eq.' + S.room }, p => upsert(p.new))
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'soup_events', filter: 'room=eq.' + S.room }, p => upsert(p.new))
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'soup_events' }, p => { if (S.events.delete(p.old?.id)) { idx = null; scheduleRender(); } })
    .on('presence', { event: 'sync' }, () => { S.peers = flatPresence(ch.presenceState()); scheduleRender(); })
    .subscribe(status => {
      S.conn = status;
      // 연결이 (다시) 붙으면 그 사이 놓친 기록을 한 번 더 읽는다
      if (status === 'SUBSCRIBED') { S.lastTrack = ''; track(); if (S.loaded) loadAll(); }
      scheduleRender();
    });
  S.channel = ch;
  setHash();
  loadAll();
}
// 판정을 방장 PC 봇이 하는 경우, 봇이 30초마다 남기는 출석 시각을 읽는다
async function pollBot() {
  if (S.judge !== 'bot') return;
  const { data } = await sb.from('soup_status').select('bot_seen').eq('id', 1).maybeSingle();
  const seen = data?.bot_seen ? tms(data.bot_seen) : 0;
  if (seen !== S.botSeen) { S.botSeen = seen; scheduleRender(); }
}
const botOnline = () => S.judge !== 'bot' || Date.now() - S.botSeen < 75000;
function botBanner() {
  if (S.judge !== 'bot') return null;
  return botOnline()
    ? h('p', { class: 'conn' }, '출제자 봇이 자리에 있어요.')
    : h('div', { class: 'banner' }, h('span', null, '출제자 봇이 꺼져 있어요. 질문은 남겨 둘 수 있고, 방장 PC에서 출제자 봇을 켜면 쌓인 질문부터 차례로 답해요.'));
}
function leaveRoom(silent) {
  if (S.channel) { try { sb.removeChannel(S.channel); } catch {} }
  S.channel = null; S.room = null; S.host = null; S.events = new Map(); idx = null; S.peers = []; S.conn = 'off';
  if (!silent) { lsSet('soup.room', null); S.view = 'home'; S.caseId = null; setHash(); render(); }
}
async function loadAll() {
  const code = S.room; const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from('soup_events').select('*').eq('room', code).order('id').range(from, from + 999);
    if (error || code !== S.room) return;
    rows.push(...data);
    if (data.length < 1000) break;
  }
  for (const e of rows) upsert(e, true);
  S.loaded = true; idx = null; scheduleRender();
}
function upsert(e, quiet) {
  if (!e || e.room !== S.room) return;
  const old = S.events.get(e.id);
  if (old && tms(old.updated_at) > tms(e.updated_at)) return;
  S.events.set(e.id, e); idx = null;
  if (!quiet) scheduleRender();
}
function flatPresence(st) {
  const out = [];
  for (const [key, metas] of Object.entries(st || {})) {
    const m = metas[metas.length - 1] || {};
    out.push({ id: key, name: String(m.name || '').slice(0, 20), c: m.c || null, m: m.m || 'coop', ty: m.ty || null, isMe: key === me });
  }
  return out;
}
function track() {
  if (!S.channel || S.conn !== 'SUBSCRIBED') return;
  const st = { name: myName, c: S.view === 'table' ? S.caseId : null, m: playing(), ty: S.typing };
  const sig = JSON.stringify(st);
  if (sig === S.lastTrack) return;
  S.lastTrack = sig;
  S.channel.track(st).catch(() => { S.lastTrack = ''; });
}
function setTyping(on) {
  clearTimeout(setTyping.t);
  const v = on && playing() === 'coop' ? S.caseId : null;
  if (S.typing !== v) { S.typing = v; track(); }
  if (on) setTyping.t = setTimeout(() => setTyping(false), 4000);
}
function setHash() {
  const hsh = S.room ? '#' + S.room + (S.view === 'table' && S.caseId ? '/' + S.caseId : '') : '';
  try { history.replaceState(null, '', location.pathname + location.search + hsh); } catch {}
}
const inviteLink = () => location.origin + location.pathname + '#' + S.room;

/* ---------- 공개된 것(진상·단서·키워드)은 서버에서 받는다 ---------- */
function revealOf(pid, kind, d) {
  const scope = scopeOf(kind);
  const key = pid + '|' + scope;
  const sig = [...d.open].sort().join(',') + '|' + (d.over || '');
  const c = S.reveal.get(key) || {};
  const empty = { facts: {}, clues: [], truth: null };
  if (!S.room || !d.open.size) return c.data || empty;
  if (c.sig !== sig && c.want !== sig && !(c.failAt && Date.now() - c.failAt < 5000)) {
    S.reveal.set(key, { ...c, want: sig });
    const room = S.room;
    api('reveal', { code: room, puzzle: pid, scope })
      .then(data => { if (room === S.room) { S.reveal.set(key, { sig, data }); scheduleRender(); } })
      .catch(() => { const cur = S.reveal.get(key) || {}; S.reveal.set(key, { ...cur, want: null, failAt: Date.now() }); });
  }
  return c.data || empty;
}

/* ---------- 삽화 ---------- */
function artHTML(pid, rv, fresh) {
  const p = P[pid];
  if (p.photo) return `<img class="photo" src="${p.photo}" alt="${p.title} 사건 사진" loading="lazy" decoding="async">`;
  if (p.scene) return sceneSVG(pid, rv, fresh);
  return `<div class="noart"><span>증거 사진 준비 중</span></div>`;
}
function sceneSVG(pid, rv, fresh) {
  const p = P[pid];
  let layers = '';
  for (const c of rv?.clues || []) if (c.layer) layers += `<g class="${fresh?.has('c' + (c.i + 1)) ? 'layer-in' : ''}">${c.layer}</g>`;
  return `<svg class="scene" viewBox="0 0 400 300" role="img" aria-label="${p.title} 삽화"><rect class="bg" width="400" height="300"/>${p.scene}${layers}</svg>`;
}
function plateEl(pid, rv, fresh, big) {
  const spots = P[pid].spots || [];
  const seen = S.seen[pid + ':spots'] || (S.seen[pid + ':spots'] = new Set(spots.map(x => x.id)));
  const plate = h('div', { class: 'plate', svg: artHTML(pid, rv, fresh) });
  spots.forEach((sp, i) => sp.x != null && plate.append(h('button', {
    class: 'spot' + (seen.has(sp.id) ? '' : ' new'), type: 'button', style: `left:${sp.x}%;top:${sp.y}%`,
    'aria-pressed': String(S.spot === sp.id), 'aria-label': sp.label + ' 살펴보기',
    onclick: () => { S.spot = S.spot === sp.id ? null : sp.id; if (big) openZoom(); else render(); }
  }, String(i + 1))));
  if (!big) plate.append(h('button', { class: 'zoom', type: 'button', onclick: openZoom }, '확대'));
  const cur = spots.find(x => x.id === S.spot);
  const loose = spots.filter(sp => sp.x == null);
  const memo = loose.length ? h('div', { class: 'memo' }, loose.map(sp => h('button', { type: 'button', 'aria-pressed': String(S.spot === sp.id), onclick: () => { S.spot = S.spot === sp.id ? null : sp.id; if (big) openZoom(); else render(); } }, sp.label))) : null;
  const hint = loose.length ? '현장 메모를 눌러 사진 속 사물을 살펴보세요. 15·30·45문마다 단서 사진이 한 장씩 열려요.' : '번호를 눌러 그림 속 사물을 살펴보세요. 15·30·45문마다 단서 그림이 한 장씩 더 찍혀요.';
  const cap = [memo, cur ? h('p', null, h('b', { text: cur.label }), ' — ', cur.text) : h('p', { class: 'dim' }, hint)];
  return { plate, cap };
}

/* ---------- 수프 온도 · 수사 경과 · 보고서 ---------- */
// 수프 온도: 키워드를 찾을수록, 핵심에 다가가는 질문이 이어질수록 데워지고, 엉뚱한 질문이 이어지면 식는다
function heatOf(d) {
  if (d.over === 'solved') return 100;
  const qs = d.L.filter(x => x.kind === 'q' && x.status === 'done' && x.answer !== '반려');
  let t = 12 + (d.need ? 60 * d.needFound / d.need : 0) + 4 * d.bonus, recent = 0;
  for (const x of qs.slice(-6)) {
    if (x.hot) recent += 7;
    else if ((x.facts || []).length) recent += 4;
    else if (x.answer === '관계없음' || x.note === 'focus' || x.note === 'premise') recent -= 3;
  }
  t += Math.max(-12, Math.min(24, recent));
  return Math.round(Math.max(4, Math.min(97, t)));
}
const heatName = t => (t >= 100 ? '다 끓었어요' : t >= 88 ? '펄펄 끓음' : t >= 68 ? '보글보글' : t >= 45 ? '따끈' : t >= 25 ? '미지근' : '식은 수프');
const HEAT_HELP = '키워드를 찾을수록, 핵심에 다가가는 질문을 할수록 수프가 데워져요. 엉뚱한 질문이 이어지면 식어요.';

// 수사 경과: 질문 하나하나를 칸으로 (결과 복사·보고서에 쓰고, 진상은 담지 않는다)
const TRAIL = { '네': ['yes', '🟦'], '아니오': ['no', '🟥'], '관계없음': ['na', '⬛'], '애매함': ['amb', '🟨'] };
function trailOf(d) {
  const out = [];
  for (const x of d.L) {
    if (x.kind === 'q' && x.status === 'done' && x.answer !== '반려') {
      const key = (x.facts || []).some(f => d.revealed.get(f)?.ev === x.id);
      const [c, g] = TRAIL[x.answer] || TRAIL['애매함'];
      out.push({ c: key ? 'key' : c, g: key ? '⭐' : g, t: `Q${d.qNo.get(x.id)} · ${x.answer}${key ? ' · 키워드 발견' : ''}` });
    } else if (x.kind === 'clue') out.push({ c: 'clue', g: '🔎', t: `단서 #${(+x.clue_i || 0) + 1} 긴급 열람` });
    else if (x.kind === 'guess' && x.status === 'done') out.push(x.ok ? { c: 'ok', g: '✅', t: '진상 제출 · 정답' } : { c: 'miss', g: '❌', t: '진상 제출 · 오답' });
    else if (x.kind === 'giveup') out.push({ c: 'miss', g: '🏳️', t: '포기' });
  }
  return out;
}
// 사건이 끝나기 전까지 열리지 않았던 단서 번호
function unseenOf(pid, d) {
  if (!d.overEv) return [];
  return derive(P[pid], d.L.filter(e => e.id < d.overEv.id)).clues.filter(c => !c.open).map(c => c.i);
}
function crewOf(d) {
  const crew = new Map();
  const bump = (k, f) => { if (!k) return; const c = crew.get(k) || { q: 0, f: 0 }; f(c); crew.set(k, c); };
  for (const x of d.L) if (x.kind === 'q' && x.status === 'done' && x.answer !== '반려') bump(x.player, c => c.q++);
  for (const r of d.revealed.values()) bump(r.by, c => c.f++);
  const list = [...crew.entries()].map(([id, c]) => ({ id, ...c })).sort((a, b) => b.f - a.f || a.q - b.q);
  const mvp = list.length > 1 && list[0].f > list[1].f ? list[0].id : null;
  return { list, mvp };
}
function spanOf(d) {
  const first = d.L.find(x => x.kind !== 'chat');
  if (!first || !d.overEv) return '';
  const m = Math.max(1, Math.round((tms(d.overEv.created_at) - tms(first.created_at)) / 60000));
  return m < 60 ? `${m}분` : `${Math.floor(m / 60)}시간 ${m % 60}분`;
}
const siteUrl = () => location.origin + location.pathname;
function shareText(pid, d) {
  const p = P[pid];
  const people = crewOf(d).list.length;
  const mode = playing() === 'versus' ? '따로 풀기' : people > 1 ? `함께 풀기 ${people}명` : '혼자 풀기';
  const res = d.over === 'solved' ? `✅ 사건 종결 · ${grade(d)} · ${d.total}문` : `🧊 미제 처리 · ${d.total}문`;
  const g = trailOf(d).map(t => t.g); const rows = [];
  for (let i = 0; i < g.length; i += 10) rows.push(g.slice(i, i + 10).join(''));
  return [`🍲 바다거북 수프 식탁 ${num(PUZZLES.indexOf(p))} 「${p.title}」`, `${res} · ${mode}${spanOf(d) ? ' · ' + spanOf(d) : ''}`, ...rows, siteUrl()].join('\n');
}

// 수사 보고서 이미지 (1080×1350, 스포일러 없음): 사건 사진 · 결과 도장 · 문수 · 수사 경과 · 수사관
const loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
function wrapText(g, text, maxW) {
  const out = []; let line = '';
  for (const ch of [...String(text)]) {
    if (line && g.measureText(line + ch).width > maxW) { out.push(line); line = ch.trim() ? ch : ''; } else line += ch;
  }
  if (line) out.push(line);
  return out;
}
const TRAIL_COLOR = { yes: '#8DB9D9', no: '#C9524B', na: '#2A333D', amb: '#E0B44C', key: '#F2D27A', clue: null, ok: '#5FA36B', miss: '#5A2724' };
async function saveReport(pid, d, btn) {
  const p = P[pid];
  const solved = d.over === 'solved';
  const label = btn.textContent;
  btn.disabled = true; btn.textContent = '보고서 만드는 중…';
  try {
    await Promise.all(['72px "Song Myung"', '28px "Special Elite"', '700 24px "IBM Plex Sans KR"', '24px "IBM Plex Sans KR"', '28px "Nanum Gothic Coding"']
      .map(f => document.fonts.load(f).catch(() => null)));
    const W = 1080, H = 1350, X = 72, c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    const type = px => `${px}px "Special Elite","Nanum Gothic Coding",monospace`;
    const ui = (px, w = 400) => `${w} ${px}px "IBM Plex Sans KR","Malgun Gothic",sans-serif`;
    const disp = px => `${px}px "Song Myung","Nanum Myeongjo",serif`;
    g.fillStyle = '#080B0F'; g.fillRect(0, 0, W, H);
    if (p.photo) {
      const img = await loadImg(p.photo); const ph = 720;
      const s = Math.max(W / img.width, ph / img.height);
      g.save(); g.beginPath(); g.rect(0, 0, W, ph); g.clip();
      g.drawImage(img, (W - img.width * s) / 2, (ph - img.height * s) / 2, img.width * s, img.height * s);
      g.restore();
      const gr = g.createLinearGradient(0, 280, 0, ph);
      gr.addColorStop(0, 'rgba(8,11,15,0)'); gr.addColorStop(1, 'rgba(8,11,15,1)');
      g.fillStyle = gr; g.fillRect(0, 280, W, ph - 280);
    }
    // 머리 표식
    g.fillStyle = 'rgba(8,11,15,.78)'; g.fillRect(X - 14, 48, 470, 48);
    g.fillStyle = '#C9524B'; g.font = type(26); g.fillText('CONFIDENTIAL · 수사 보고서', X, 81);
    // 사건 번호 · 제목
    g.fillStyle = '#C9524B'; g.font = type(30); g.fillText(`CASE FILE ${num(PUZZLES.indexOf(p))}`, X, 590);
    g.fillStyle = '#EEF2F5'; g.font = disp(76);
    const tl = wrapText(g, p.title, W - X * 2 - 240).slice(0, 2);
    tl.forEach((t, i) => g.fillText(t, X, 680 + i * 84));
    let y = 680 + (tl.length - 1) * 84;
    // 결과 도장
    g.save(); g.translate(W - 190, 600); g.rotate(-0.12);
    g.strokeStyle = solved ? '#7FC79A' : '#C9524B'; g.lineWidth = 5; g.strokeRect(-130, -50, 260, 100);
    g.fillStyle = g.strokeStyle; g.font = disp(50); g.textAlign = 'center'; g.fillText(solved ? '사건 종결' : '미제 처리', 0, 18);
    g.restore(); g.textAlign = 'left';
    // 숫자들
    y += 90;
    const stats = [['최종 문수', `${d.total}문`], ['등급', grade(d)], ['질문', `${d.q}개`], ['수사 시간', spanOf(d) || '-']];
    const colW = (W - X * 2) / 4;
    stats.forEach(([k, v], i) => {
      g.fillStyle = '#7F8B96'; g.font = ui(22); g.fillText(k, X + i * colW, y);
      g.fillStyle = '#EEF2F5'; g.font = i === 1 ? disp(42) : type(44); g.fillText(v, X + i * colW, y + 54);
    });
    y += 100;
    g.fillStyle = '#1E2A35'; g.fillRect(X, y, W - X * 2, 2);
    // 수사 경과
    y += 52;
    g.fillStyle = '#8DB9D9'; g.font = type(24); g.fillText('INVESTIGATION LOG · 수사 경과', X, y);
    y += 26;
    const trail = trailOf(d); const cell = 34, gap = 8, per = Math.floor((W - X * 2 + gap) / (cell + gap));
    trail.slice(0, per * 4).forEach((t, i) => {
      const cx = X + (i % per) * (cell + gap), cy = y + Math.floor(i / per) * (cell + gap);
      const col = TRAIL_COLOR[t.c];
      if (col) { g.fillStyle = col; g.fillRect(cx, cy, cell, cell); }
      else { g.strokeStyle = '#8DB9D9'; g.lineWidth = 3; g.strokeRect(cx + 1.5, cy + 1.5, cell - 3, cell - 3); }
      if (t.c === 'key') { g.fillStyle = '#3A2C08'; g.font = ui(24, 700); g.textAlign = 'center'; g.fillText('★', cx + cell / 2, cy + 26); g.textAlign = 'left'; }
    });
    y += Math.ceil(Math.min(trail.length, per * 4) / per) * (cell + gap) + 20;
    g.font = ui(20);
    let lx = X;
    for (const [c, t] of [['yes', '네'], ['no', '아니오'], ['na', '관계없음'], ['amb', '애매함'], ['key', '키워드 발견'], ['clue', '긴급 열람']]) {
      if (TRAIL_COLOR[c]) { g.fillStyle = TRAIL_COLOR[c]; g.fillRect(lx, y - 10, 16, 16); }
      else { g.strokeStyle = '#8DB9D9'; g.lineWidth = 2; g.strokeRect(lx + 1, y - 9, 14, 14); }
      g.fillStyle = '#7F8B96'; g.fillText(t, lx + 24, y + 5);
      lx += 24 + g.measureText(t).width + 26;
    }
    // 수사관
    const { list, mvp } = crewOf(d);
    if (list.length) {
      y += 64;
      g.fillStyle = '#8DB9D9'; g.font = type(24); g.fillText('DETECTIVES · 담당 수사관', X, y);
      g.fillStyle = '#D5DCE2'; g.font = ui(26);
      const names = list.slice(0, 6).map(c => `${who(c.id).name}${c.id === mvp ? ' (MVP)' : ''} · 질문 ${c.q} · 키워드 ${c.f}`);
      names.slice(0, 3).forEach((t, i) => g.fillText(t, X, y + 44 + i * 38));
    }
    // 바닥
    g.fillStyle = '#1E2A35'; g.fillRect(X, H - 92, W - X * 2, 2);
    g.fillStyle = '#EEF2F5'; g.font = disp(34); g.fillText('바다거북 수프 식탁', X, H - 40);
    g.fillStyle = '#7F8B96'; g.font = type(20); g.textAlign = 'right'; g.fillText('NO SPOILERS · ' + siteUrl().replace(/^https?:\/\//, ''), W - X, H - 44); g.textAlign = 'left';
    const blob = await new Promise(ok => c.toBlob(ok, 'image/png'));
    const file = new File([blob], `soup-report-${p.id}.png`, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] }) && matchMedia('(pointer:coarse)').matches) {
      await navigator.share({ files: [file], text: shareText(pid, d) }).catch(() => null);
    } else {
      const a = h('a', { href: URL.createObjectURL(blob), download: file.name });
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }
    btn.textContent = '보고서를 저장했어요';
  } catch {
    btn.textContent = '보고서를 만들지 못했어요';
  } finally {
    btn.disabled = false;
    setTimeout(() => { if (btn.isConnected) btn.textContent = label; }, 2500);
  }
}

/* ---------- 행동 ---------- */
const canAct = () => !!S.room && !S.busy && !watching();
async function act(action, body, clearDraft) {
  if (!canAct()) return null;
  S.err = ''; S.busy = true; syncComposer();
  try {
    const r = await api(action, { code: S.room, puzzle: S.caseId, scope: playing(), ...body });
    if (clearDraft) $('#draft').value = '';
    return r;
  } catch (e) { S.err = errText(e.code); return null; }
  finally { S.busy = false; render(); }
}
// 질문 · 의논 · 진상 제출은 입력하는 곳이 모두 따로다
function submitDraft() {
  const text = $('#draft').value.trim();
  if (!text || !S.caseId) return;
  setTyping(false);
  const d = dOf(S.caseId);
  if (d.over || d.capped) return;
  return act('ask', { text }, true);
}
async function submitTalk() {
  const input = $('#talkInput'); const text = input.value.trim();
  if (!text || !S.caseId || playing() !== 'coop' || S.busy) return;
  setTyping(false);
  S.talkJump = true;
  if (await act('chat', { text })) input.value = '';
  input.focus();
}
// 진상 제출: 넓은 칸이 있는 창을 따로 띄운다. 닫아도 적던 글은 남겨 둔다.
function guessSheet() {
  const d = dOf(S.caseId);
  if (!S.caseId || d.over || d.guessing || watching()) return;
  const final = d.capped;
  let ta;
  const keep = () => { S.guessDraft = ta.value; };
  sheetShell(final ? '최종 답안' : '진상 제출', close => h('div', { class: 'sheet guess-sheet', role: 'dialog', 'aria-modal': 'true' },
    h('p', { class: 'v-round' }, final ? 'FINAL ANSWER · 최종 답안' : 'SUBMIT THE TRUTH · 진상 제출'),
    h('h3', null, final ? '마지막 추리를 적어 주세요' : '무슨 일이 있었는지 적어 주세요'),
    h('p', null, `처음부터 끝까지 이어지게 설명해 주세요. 키워드 ${d.need}개를 인과관계까지 담아야 해결돼요. `
      + (final ? `질문이 끝나서 이번이 마지막 기회예요. 틀리면 +${FAIL}문으로 사건이 끝나요.` : `틀리면 +${WRONG}문이고, 맞힌 키워드는 ${playing() === 'versus' ? '나에게' : '방 전체에'} 열려요.`)),
    ta = h('textarea', { class: 'field', rows: 7, maxlength: 1200, placeholder: '예) 그 사람은 사실 …였다. 그래서 …했고, 그 때문에 …', oninput: keep }),
    h('div', { class: 'row' },
      h('button', { class: 'btn', type: 'button', onclick: () => { keep(); close(); } }, '닫기'),
      h('button', { class: 'btn primary', type: 'button', onclick: async () => {
        const text = ta.value.trim(); if (!text) { ta.focus(); return; }
        close(); S.guessDraft = '';
        if (!(await act('guess', { text }))) S.guessDraft = text;
      } }, final ? `최종 제출 · 틀리면 +${FAIL}문` : `제출 · 틀리면 +${WRONG}문`))), keep);
  ta.value = S.guessDraft || ''; ta.focus();
}
const retry = x => act('retry', { id: x.id });
function appeal(x) {
  sheet('판정에 이의를 제기할까요?', `"${x.answer}" 판정을 더 신중하게 진상을 다시 읽고 판정해요. 문수는 늘지 않아요. 질문마다 한 번만 할 수 있어요.`, '이의 제기', () => act('appeal', { id: x.id }));
}
function buyClue() {
  const d = dOf(S.caseId); const c = d.nextClue;
  if (!c || d.over) return;
  sheet(`단서 #${c.i + 1}을 지금 열까요?`, `원래 ${c.at}문에 열리는 단서예요. 긴급 열람하면 문수가 ${d.n}문에서 ${d.n + BUY}문이 돼요.${playing() === 'coop' ? ' 방 전체에 열려요.' : ''} 등급에는 큰 손해예요.`, `+${BUY}문 내고 열기`, () => act('clue', {}));
}
function endQuestions() {
  sheet('질문을 끝낼까요?', `더는 질문할 수 없고, 최종 답안 한 번만 남아요. 맞히면 지금 문수로 해결, 틀리면 +${FAIL}문으로 사건이 끝나요.${playing() === 'coop' ? ' 방 전체의 질문이 끝나요.' : ''}`, '질문 끝내기', () => act('end', {}));
}
function giveUp() {
  sheet('포기하고 진상을 볼까요?', `+${FAIL}문이 붙고 사건이 끝나요. ${playing() === 'coop' ? '방 전체에 진상이 보여요. ' : ''}되돌릴 수 없어요.`, '포기하기', () => act('giveup', {}));
}
function clearCase() {
  const msg = playing() === 'versus' ? '이 사건의 내 따로 풀기 기록을 지우고 처음부터 시작해요.' : '이 사건의 함께 풀기 기록을 모두 지워요. 같은 방 사람들의 질문도 사라져요.';
  sheet('식탁을 치울까요?', msg, '모두 지우기', async () => {
    const r = await act('clear', {});
    if (r) { S.reveal.delete(S.caseId + '|' + scopeOf(playing())); loadFresh(); }
  });
}
function loadFresh() { S.events = new Map(); idx = null; loadAll(); }
function togglePin(id) {
  if (S.pins.has(id)) S.pins.delete(id); else S.pins.add(id);
  lsSet('soup.pins', [...S.pins].slice(-600));
  render();
}
function setPlay(m) {
  S.play = m === 'versus' ? 'versus' : 'coop'; lsSet('soup.play', S.play); S.filter = 'all'; S.err = ''; S.watch = null;
  track(); render();
}

/* ---------- 시트 ---------- */
function sheetShell(label, inner, onClose) {
  const root = $('#sheetRoot');
  const close = () => { root.replaceChildren(); onClose?.(); };
  const bg = h('div', { class: 'sheet-bg', onclick: e => { if (e.target === bg) close(); }, onkeydown: e => { if (e.key === 'Escape') close(); } }, inner(close));
  bg.firstChild?.setAttribute('aria-label', label);
  root.replaceChildren(bg);
  return { bg, close };
}
function sheet(title, body, okLabel, onOk) {
  let ok;
  sheetShell(title, close => h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true' },
    h('h3', { text: title }), h('p', { text: body }),
    h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', onclick: close }, '그만두기'),
      ok = h('button', { class: 'btn primary', type: 'button', onclick: () => { close(); onOk(); } }, okLabel))));
  ok.focus();
}
function nameSheet() {
  let input;
  const save = close => {
    const v = input.value.trim().slice(0, 20);
    if (!v) return;
    myName = v; lsSet('soup.name', v); S.lastTrack = ''; track(); close(); render();
  };
  sheetShell('이름 바꾸기', close => h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true' },
    h('h3', { text: '이름 바꾸기' }), h('p', null, '같은 방 사람들에게 보이는 이름이에요. 새로 남기는 기록부터 이 이름이 붙어요.'),
    input = h('input', { class: 'field', id: 'nameEdit', type: 'text', maxlength: '20', value: myName, onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); save(close); } } }),
    h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', onclick: close }, '닫기'), h('button', { class: 'btn primary', type: 'button', onclick: () => save(close) }, '저장'))));
  input.focus(); input.select();
}
function roomSheet() {
  if (!S.room) return;
  let copyBtn;
  sheetShell('방 정보', close => h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true' },
    h('h3', { text: '방 ' + S.room.toUpperCase() }),
    h('p', null, '친구에게 코드나 초대 링크를 보내면 로그인 없이 같은 방에 앉아요.'),
    h('input', { class: 'field', id: 'inviteLink', type: 'text', readonly: true, value: inviteLink(), onfocus: e => e.target.select() }),
    h('div', { class: 'row' },
      h('button', { class: 'btn ghost warn', type: 'button', onclick: () => { close(); leaveRoom(false); } }, '방 나가기'),
      h('button', { class: 'btn', type: 'button', onclick: close }, '닫기'),
      copyBtn = h('button', { class: 'btn primary', type: 'button', onclick: () => copy(inviteLink(), copyBtn) }, '초대 링크 복사'))));
  copyBtn.focus();
}
async function copy(text, btn) {
  try { await navigator.clipboard.writeText(text); if (btn) btn.textContent = '복사했어요'; }
  catch { const el = $('#inviteLink'); if (el) { el.focus(); el.select(); } if (btn) btn.textContent = '선택해 두었어요. 복사해 주세요'; }
}
function openClue(c, text) {
  let closeBtn;
  sheetShell('단서 사진', close => h('div', { class: 'zoom-sheet', role: 'dialog', 'aria-modal': 'true' },
    h('div', { class: 'plate clue-plate' }, h('img', { class: 'photo', src: c.img, alt: text || '단서 사진' })),
    h('div', { class: 'bar2' }, h('span', null, h('b', null, '단서 #' + (c.i + 1)), ' — ', text || ''), closeBtn = h('button', { type: 'button', onclick: close }, '닫기'))));
  closeBtn.focus();
}
function openZoom() {
  const pid = S.caseId; if (!pid) return;
  const d = dOf(pid); const rv = revealOf(pid, playing(), d);
  const { plate, cap } = plateEl(pid, rv, null, true);
  let closeBtn;
  sheetShell('사진 크게 보기', close => h('div', { class: 'zoom-sheet', role: 'dialog', 'aria-modal': 'true' }, plate,
    h('div', { class: 'bar2' }, h('span', null, cap), closeBtn = h('button', { type: 'button', onclick: close }, '닫기'))), () => render());
  closeBtn.focus();
}

/* ---------- 그리기 ---------- */
let rq = 0;
function scheduleRender() { if (!rq) rq = requestAnimationFrame(() => { rq = 0; render(); }); }
function render() {
  if (S.view === 'table' && !S.room) S.view = 'home';
  $('#home').hidden = S.view !== 'home';
  $('#table').hidden = S.view !== 'table';
  document.body.classList.toggle('in-table', S.view === 'table');
  renderTop();
  if (S.view === 'home') renderHome(); else renderTable();
  renderTalk();
  renderResult();
}
function renderTop() {
  const chip = $('#roomChip');
  chip.hidden = !S.room;
  if (S.room) { chip.textContent = '방 ' + S.room.toUpperCase() + (S.conn === 'SUBSCRIBED' ? '' : ' · 연결 중'); chip.dataset.net = S.conn === 'SUBSCRIBED' ? 'shared' : 'offline'; }
  $('#nameChip').textContent = (myName || '이름 정하기') + ' ✎';
  const v = S.peers;
  put($('#faces'), v.slice(0, 5).map(x => h('img', { src: who(x.id).av, alt: who(x.id).name, title: who(x.id).name })),
    v.length > 5 ? h('span', { class: 'more' }, '+' + (v.length - 5)) : null);
}
function bowls(level) { return h('span', { class: 'bowls', title: '난이도 ' + level + '/3' }, [1, 2, 3].map(n => h('i', { class: n <= level ? 'on' : '' }))); }
function renderLobby() {
  const box = $('#lobby');
  if (!S.room) {
    if (box.dataset.mode === 'out' && box.contains(document.activeElement)) { $('#lobbyErr').textContent = S.lobbyErr; return; }
    box.dataset.mode = 'out';
    const nameIn = h('input', { class: 'field', id: 'lobbyName', type: 'text', maxlength: '20', placeholder: '내 이름 (예: 수프탐정)', value: myName, oninput: e => { myName = e.target.value.trim().slice(0, 20); lsSet('soup.name', myName); renderTop(); } });
    const codeIn = h('input', { class: 'field code', id: 'lobbyCode', type: 'text', maxlength: '4', placeholder: 'ABCD', autocomplete: 'off', onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); joinRoom(codeIn.value); } } });
    put(box,
      h('h3', null, '식탁에 앉기'),
      h('div', { class: 'stack' }, h('label', { class: 'lbl', for: 'lobbyName' }, '이름'), nameIn),
      h('button', { class: 'btn primary', type: 'button', disabled: S.busy, onclick: createRoom }, S.busy ? '여는 중…' : '새 방 만들기'),
      h('div', { class: 'or' }, '또는 친구가 알려 준 코드로'),
      h('div', { class: 'row' }, codeIn, h('button', { class: 'btn', type: 'button', disabled: S.busy, onclick: () => joinRoom(codeIn.value) }, '들어가기')),
      h('p', { class: 'err', id: 'lobbyErr' }, S.lobbyErr));
    return;
  }
  box.dataset.mode = 'in';
  let copyBtn;
  const others = S.peers.filter(p => !p.isMe);
  put(box,
    h('span', { class: 'lbl' }, '지금 앉은 방'),
    h('div', { class: 'code-big' }, S.room.toUpperCase()),
    h('p', { class: 'count' }, '이 코드나 초대 링크를 친구에게 보내면 로그인 없이 같은 방에 들어와요.'),
    h('div', { class: 'row' },
      copyBtn = h('button', { class: 'btn primary', type: 'button', onclick: () => copy(inviteLink(), copyBtn) }, '초대 링크 복사'),
      h('button', { class: 'btn ghost', type: 'button', onclick: () => leaveRoom(false) }, '방 나가기')),
    h('div', { class: 'people' }, h('span', null, h('img', { src: who(me).av, alt: '' }), (myName || '나') + ' (나)'),
      others.map(p => h('span', null, h('img', { src: who(p.id).av, alt: '' }), who(p.id).name + (p.c ? ' · ' + (P[p.c]?.title || '') : '')))),
    botBanner(),
    h('p', { class: 'conn' + (S.conn === 'SUBSCRIBED' ? '' : ' bad') }, S.conn === 'SUBSCRIBED' ? (others.length ? `${others.length}명과 함께 있어요` : '아직 나 혼자예요. 친구를 불러 보세요.') : '실시간 연결 중이에요…'));
}
function renderHome() {
  const legend = $('#legend');
  if (!legend.childElementCount) {
    legend.append(...[['네', '참'], ['아니오', '거짓'], ['관계없음', '풀이와 상관없음'], ['애매함', '참·거짓이 섞임'], ['반려', '열린 질문 · 안 셈']]
      .map(([a, t]) => h('span', { class: 'legend-item' }, stamp(a), t)));
  }
  renderLobby();
  renderArchiveTools();
  const q = S.arc.q.trim().toLowerCase();
  let list = PUZZLES.map((p, i) => ({ p, i, st: caseState(p) }))
    .filter(x => S.arc.f === 'all' || x.st === S.arc.f)
    .filter(x => !q || (x.p.title + ' ' + x.p.story + ' ' + (x.p.tags || []).join(' ')).toLowerCase().includes(q));
  if (S.arc.sort === 'easy') list.sort((a, b) => a.p.level - b.p.level || a.i - b.i);
  if (S.arc.sort === 'hard') list.sort((a, b) => b.p.level - a.p.level || a.i - b.i);
  $('#arcCount').textContent = `${list.length}건`;
  put($('#cases'), list.length ? list.map(({ p, i }) => {
    const d = S.room ? dOf(p.id, 'coop') : null;
    const vd = S.room ? dOf(p.id, 'versus') : null;
    const ranks = S.room ? rankFor(p.id) : [];
    const here = S.room ? viewersHere(p.id) : [];
    let status;
    if (!d) status = h('span', { class: 'pill' }, '방에 들어가면 열려요');
    else if (d.over === 'solved') status = h('span', { class: 'pill done' }, `함께 해결 · ${d.total}문`);
    else if (d.over) status = h('span', { class: 'pill' }, '함께 · 진상 공개됨');
    else if (d.L.some(e => e.kind !== 'chat')) status = h('span', { class: 'pill live' }, `함께 ${d.n}문 · 키워드 ${d.needFound}/${d.need}`);
    else status = h('span', { class: 'pill' }, '아직 아무도 안 앉음');
    const best = ranks.find(r => r.st === 'solved');
    return h('button', { class: 'case-card', type: 'button', onclick: () => openCase(p.id) },
      h('div', { class: 'thumb', svg: artHTML(p.id, d?.over ? S.reveal.get(p.id + '|coop')?.data : null) }, h('span', { class: 'no' }, num(i)), d?.over ? h('span', { class: 'closed' + (d.over === 'solved' ? '' : ' fail') }, d.over === 'solved' ? '사건 종결' : '미제 처리') : null),
      h('div', { class: 'body' },
        h('h3', { text: p.title }),
        h('div', { class: 'tagline' }, (p.tags || []).map(g => h('span', { class: 'genre' }, g))),
        h('p', { class: 'teaser', text: p.story }),
        ranks.length || (vd && vd.L.length) ? h('p', { class: 'vs' }, `따로 풀기 ${ranks.length}명${best ? ` · 최저 ${best.n}문` : ''}${vd && vd.L.length ? ` · 내 기록 ${vd.over === 'solved' ? vd.total + '문 해결' : vd.n + '문'}` : ''}`) : null,
        h('div', { class: 'foot' }, bowls(p.level),
          here.length ? h('span', { class: 'faces' }, here.slice(0, 3).map(x => h('img', { src: who(x.id).av, alt: who(x.id).name }))) : null,
          status)));
  }) : h('p', { class: 'empty' }, '조건에 맞는 사건이 없어요.'));
  $('#homeNote').textContent = S.room
    ? '사건을 고르면 함께 풀기와 따로 풀기 중에 고를 수 있어요.'
    : '위에서 방을 만들거나 코드로 들어가면 사건을 고를 수 있어요.';
}
function caseState(p) {
  if (!S.room) return 'new';
  const d = dOf(p.id, 'coop');
  return d.over ? 'closed' : d.L.some(e => e.kind !== 'chat') ? 'open' : 'new';
}
function renderArchiveTools() {
  const n = st => PUZZLES.filter(p => caseState(p) === st).length;
  const chips = [['all', '전체', PUZZLES.length], ['new', '미착수', n('new')], ['open', '수사 중', n('open')], ['closed', '종결', n('closed')]];
  put($('#arcChips'), chips.map(([k, t, c]) => h('button', { class: 'chip', type: 'button', 'aria-pressed': String(S.arc.f === k), onclick: () => { S.arc.f = k; saveArc(); render(); } }, `${t} ${c}`)));
}
function saveArc() { lsSet('soup.arc', S.arc); }
function rankFor(pid) {
  const by = new Map();
  for (const [k, list] of index().logs) {
    const [p, scope] = k.split('|');
    if (p === pid && scope !== 'coop') by.set(scope, list);
  }
  const ord = st => (st === 'solved' ? 0 : st === 'play' ? 1 : 2);
  // 동점이면 키워드를 더 찾은 사람, 그다음 먼저 끝낸 사람
  return [...by.entries()].map(([uid, list]) => { const d = derive(P[pid], list); return { uid, n: d.total, st: d.over || 'play', k: d.needFound, d, at: tms(d.overEv?.created_at) || Infinity }; })
    .sort((a, b) => ord(a.st) - ord(b.st) || a.n - b.n || b.k - a.k || a.at - b.at);
}

let lastKey = null, lastLen = 0;
function renderTable() {
  const pid = S.caseId; const p = P[pid];
  if (!p) { S.view = 'home'; return render(); }
  const kind = playing();
  const d = dOf(pid, kind);
  const rv = revealOf(pid, kind, d);
  const bonusN = p.facts.filter(f => !f.need).length;
  $('#tNo').textContent = num(PUZZLES.indexOf(p));
  $('#tTitle').textContent = p.title;
  for (const b of $('#playSeg').querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.play === kind));

  // 좁은 화면: 문제·심문 / 사진·단서 탭 (문제와 키워드가 메인이라 처음엔 문제·심문)
  const tab = S.mtab || 'log';
  const seenK = pid + '|' + scopeOf(kind);
  if (S.logSeen[seenK] == null || tab === 'log') S.logSeen[seenK] = d.L.length;
  const unread = tab === 'case' ? d.L.length - S.logSeen[seenK] : 0;
  const grid = $('#tableGrid');
  grid.dataset.mtab = tab;
  grid.classList.toggle('over', !!d.over);
  for (const b of $('#mtabs').querySelectorAll('button')) b.setAttribute('aria-selected', String(b.dataset.mtab === tab));
  $('#mtabBadge').textContent = unread > 0 ? `+${unread}` : '';
  const look = watching();
  const myOver = kind === 'versus' && !!derive(p, index().logs.get(pid + '|' + me) || []).over;
  const seenKey = pid + ':' + kind;
  const seenOpen = S.seen[seenKey] || (S.seen[seenKey] = new Set(d.open));
  const fresh = new Set([...d.open].filter(x => !seenOpen.has(x)));

  // 문수 미터 · 수프 온도 (두 줄로 짧게)
  const heat = heatOf(d);
  const pct = v => Math.min(100, (v / CAP) * 100);
  const nx = d.over ? (d.over === 'solved' ? `해결 · ${grade(d)}` : '사건 종료') : d.capped ? '질문 마감 · 최종 답안 1회' : d.nextClue ? `다음 단서까지 ${d.nextClue.at - d.n}문` : `마감까지 ${CAP - d.n}문`;
  const sub = [`질문 ${d.q}`, d.rej ? `반려 ${d.rej}` : null, d.wrong ? `오답 ${d.wrong} (+${d.wrong * WRONG})` : null, d.bought ? `긴급 열람 +${d.bought}` : null, d.bonus ? `보너스 −${BONUS * d.bonus}` : null].filter(Boolean).join(' · ');
  put($('#meter'),
    h('div', { class: 'm-row' },
      h('span', { class: 'm-n' }, h('b', { text: d.total }), h('span', { class: 'of' }, `/${CAP}문`)),
      h('div', { class: 'bar', role: 'img', 'aria-label': `${d.n}문 / ${CAP}문. 단서는 ${CLUE_AT.join('·')}문에 열려요` },
        h('i', { style: `width:${pct(d.n)}%` }), CLUE_AT.map(t => h('s', { style: `left:${pct(t)}%`, title: `${t}문 단서` })), h('s', { class: 'end', style: 'left:calc(100% - 2px)' })),
      h('span', { class: 'nx' }, nx)),
    h('div', { class: 'm-row m-row2' },
      h('span', { class: 'm-sub' }, sub),
      h('div', { class: 'heat' + (heat >= 88 ? ' boil' : heat >= 68 ? ' hot' : ''), title: HEAT_HELP },
        h('span', { class: 'h-lbl' }, '수프 온도'),
        h('span', { class: 'tb', role: 'img', 'aria-label': `수프 온도 ${heat}도, ${heatName(heat)}` }, h('i', { style: `clip-path:inset(0 ${100 - heat}% 0 0)` })),
        h('b', null, `${heat}°`), h('span', { class: 'h-name' }, heatName(heat)))));

  // 문제와 키워드 (메인) · 진상 제출은 여기서만
  const here = viewersHere(pid).filter(x => !x.isMe);
  const slots = p.facts.map(f => {
    const r = d.revealed.get(f.id), open = !!r || !!d.over;
    const label = open ? (rv.facts?.[f.id] || '…') : f.need ? '아직 밝혀지지 않은 키워드' : `보너스 · 찾으면 −${BONUS}문`;
    return h('div', { class: 'slot' + (f.need ? '' : ' bonus') + (open ? ' open' : '') + (fresh.has(f.id) ? ' fresh' : ''),
      title: label + (r ? ` · ${kind === 'versus' ? '' : who(r.by).name + '의 '}${r.via === 'guess' ? '진상 제출' : '질문'}로 밝혀짐` : '') },
      h('span', { class: 'sn' }, f.need ? (open ? '★' : '?') : '+'), h('span', { class: 'st', text: label }));
  });
  const canGuess = !d.over && !look;
  put($('#soupArea'), h('article', { class: 'soup-card' + (S.briefOpen ? ' open' : '') },
    h('div', { class: 'lbl' }, h('span', null, h('i', { class: 'en' }, 'CASE BRIEF'), kind === 'versus' ? '따로 풀기' : '함께 풀기'),
      h('span', { class: 'lbl-r' }, (p.tags || []).map(g => h('span', { class: 'genre' }, g)), bowls(p.level))),
    h('p', { class: 'story', text: p.story, title: '눌러서 펼치기/접기', onclick: () => { S.briefOpen = !S.briefOpen; render(); } }),
    h('div', { class: 'slots-head' },
      h('span', null, h('i', { class: 'en' }, 'KEY FACTS'), `키워드 ${d.needFound}/${d.need}`, bonusN ? h('span', { class: 'b' }, ` · 보너스 ${d.bonus}/${bonusN}`) : null),
      canGuess ? h('button', { class: 'btn primary guess-btn', type: 'button', disabled: S.busy || d.guessing, onclick: guessSheet }, d.guessing ? '채점 중…' : d.capped ? '최종 답안 제출' : '진상 제출') : null),
    h('div', { class: 'slots' }, slots),
    here.length ? h('div', { class: 'here' }, h('span', { class: 'faces' }, here.slice(0, 6).map(x => h('img', { src: who(x.id).av, alt: '' }))),
      `${here.slice(0, 3).map(x => who(x.id).name).join(', ')}${here.length > 3 ? ` 외 ${here.length - 3}명` : ''}이 보고 있어요`) : null));

  // 단서판
  const { plate, cap } = plateEl(pid, rv, fresh, false);
  if (heat >= 45) plate.append(h('div', { class: 'steam', 'aria-hidden': 'true', style: `--so:${heat >= 88 ? 0.9 : heat >= 68 ? 0.6 : 0.32}` }, h('i'), h('i'), h('i')));
  const clueOf = i => (rv.clues || []).find(c => c.i === i);
  const clueCards = d.clues.map(c => {
    if (c.open) {
      const got = clueOf(c.i);
      const where = got?.img ? '단서 사진' : '단서 메모';
      return h('div', { class: 'card clue' + (fresh.has(c.id) ? ' fresh' : '') }, h('span', { class: 'n' }, '#' + (c.i + 1)),
        h('div', { class: 'clue-body' },
          got?.img ? h('button', { class: 'clue-img', type: 'button', 'aria-label': '단서 사진 크게 보기', onclick: () => openClue(got, got.text) }, h('img', { src: got.img, alt: '', loading: 'lazy' })) : null,
          h('p', null, got?.text || h('span', { class: 'dots' }, '단서를 펼치는 중'))),
        h('small', null, c.bought ? `긴급 열람 (+${BUY}문) · ${where}` : `${c.at}문 단서 · ${where}`));
    }
    const isNext = d.nextClue === c;
    return h('div', { class: 'card locked' }, h('span', { class: 'n' }, '#' + (c.i + 1)), h('p', null, `${c.at}문에 열려요`),
      isNext && !d.over && !look ? h('div', { class: 'act' }, h('button', { class: 'btn small', type: 'button', disabled: S.busy, onclick: buyClue }, `긴급 열람 · +${BUY}문`)) : null);
  });
  if (rv.clues?.length || Object.keys(rv.facts || {}).length) fresh.forEach(x => seenOpen.add(x));
  const ranks = kind === 'versus' ? rankFor(pid) : [];
  put($('#board'),
    h('figure', { class: 'print' }, plate, h('figcaption', null, cap)),
    h('section', { class: 'panel' }, h('h3', null, h('span', null, h('i', { class: 'en' }, 'EVIDENCE'), '단서'), h('span', null, `${d.clues.filter(c => c.open).length}/${d.clues.length}`)), h('div', { class: 'stack' }, clueCards)),
    kind === 'versus' ? h('section', { class: 'panel' }, h('h3', null, h('span', null, h('i', { class: 'en' }, 'RIVALS'), '따로 풀기 점수판'), h('span', null, '적을수록 위')),
      ranks.length ? h('div', { class: 'board-rank' }, ranks.map((r, i) => h('div', { class: 'rank-row' + (r.uid === me ? ' me' : '') + (myOver ? ' can-watch' : '') + (S.watch === r.uid ? ' watched' : '') },
        h('span', { class: 'r' }, i + 1), h('img', { src: who(r.uid).av, alt: '' }), h('span', { class: 'nm', text: r.uid === me ? `${who(r.uid).name} (나)` : who(r.uid).name }),
        h('span', { class: 'sc' }, r.st === 'solved' ? `${r.n}문 해결` : r.st === 'play' ? `${r.n}문 · 키워드 ${r.k}` : `${r.n}문 · 실패`),
        myOver ? (r.uid === me
          ? (look ? h('button', { class: 'flag', type: 'button', onclick: () => { S.watch = null; render(); } }, '내 기록') : h('span'))
          : h('button', { class: 'flag' + (S.watch === r.uid ? ' on' : ''), type: 'button', 'aria-pressed': String(S.watch === r.uid), onclick: () => { S.watch = S.watch === r.uid ? null : r.uid; S.mtab = 'log'; render(); $('#deskScroll').scrollTop = 0; } }, S.watch === r.uid ? '관전 중' : '지켜보기')) : null)))
        : h('p', { class: 'count' }, '아직 이 사건에 도전한 사람이 없어요. 첫 질문을 하면 점수판에 올라가요.')) : null,
    look ? null : h('div', { class: 'row' },
      !d.over && !d.capped ? h('button', { class: 'btn', type: 'button', disabled: S.busy, onclick: endQuestions }, '질문 끝내기 · 최종 추리') : null,
      !d.over ? h('button', { class: 'btn ghost warn', type: 'button', disabled: S.busy, onclick: giveUp }, `포기하고 진상 보기 · +${FAIL}문`) : null,
      d.L.length && (kind === 'versus' || S.host === me) ? h('button', { class: 'btn ghost', type: 'button', onclick: clearCase }, '식탁 치우기') : null));

  put($('#botBanner'), d.over ? null : botBanner());

  // 진상 (사건 종결 화면)
  const watchBar = look ? h('div', { class: 'watch-bar' },
    h('span', null, h('i', { class: 'en' }, 'SPECTATING'), `${who(S.watch).name} 수사관의 기록을 관전 중이에요`),
    h('button', { class: 'btn small', type: 'button', onclick: () => { S.watch = null; render(); } }, '내 기록으로')) : null;
  const rk = pid + '|' + scopeOf(kind);
  if (d.over && S.loaded && !look && !S.resultSeen.has(rk)) { S.resultSeen.add(rk); S.resultOpen = true; }
  const overBar = d.over ? h('div', { class: 'over-bar' + (d.over === 'solved' ? '' : ' cold') },
    h('span', null, h('i', { class: 'en' }, d.over === 'solved' ? 'CASE CLOSED' : 'COLD CASE'),
      d.over === 'solved' ? `사건 종결 · ${grade(d)} · ${d.total}문` : `미제 처리 · ${d.total}문`),
    h('button', { class: 'btn primary small', type: 'button', onclick: () => { S.resultOpen = true; render(); } }, '결과 · 해설 보기')) : null;
  // 끝난 사건은 문제 카드 자리에 결과 띠를 고정해 둔다
  if (overBar) put($('#soupArea'), overBar);
  put($('#verdictArea'), watchBar);

  // 기록 (의논은 따로 의논 창에서)
  const F = S.filter === 'chat' ? 'all' : S.filter;
  const L = d.L.filter(x => x.kind !== 'chat');
  const pinned = L.filter(x => S.pins.has(x.id)).length;
  const filters = [['all', '전체'], ['네', '네'], ['아니오', '아니오'], ['key', '키워드·중요'], ['note', `수사 노트 ${pinned}`], ...(kind === 'coop' ? [['mine', '내 질문']] : [])];
  put($('#filters'), filters.map(([k, t]) => h('button', { class: 'chip', type: 'button', 'aria-pressed': String(F === k), onclick: () => { S.filter = k; render(); } }, t)));
  const show = L.filter(x => {
    if (F === 'all') return true;
    if (F === 'note') return S.pins.has(x.id);
    if (F === 'mine') return x.player === me;
    if (F === 'key') return x.kind !== 'q' || (x.facts && x.facts.length) || x.hot || d.marks.has(x.id);
    return x.kind === 'q' && x.answer === F;
  });
  $('#logCount').textContent = S.loaded ? `기록 ${show.length}개` : '기록을 불러오는 중…';
  const box = $('#deskScroll');
  const nearBottom = box.scrollTop + box.clientHeight >= box.scrollHeight - 120;
  const items = [];
  for (const x of show) {
    items.push(entry(pid, x, d, kind, rv));
    for (const i of d.marks.get(x.id) || []) items.push(h('li', { class: 'entry e-sys e-clue' }, h('span'), h('p', { class: 'qt', text: `${CLUE_AT[i]}문 도달 · 단서 #${i + 1}이 열렸어요` })));
  }
  put($('#log'), items);
  if (S.loaded && !L.length) {
    put($('#logEmpty'), h('div', { class: 'empty' },
      h('p', null, '아직 아무도 묻지 않았어요. 처음엔 이야기의 빈칸을 넓게 훑는 질문이 좋아요.'),
      h('div', { class: 'starter' }, (p.starters || []).map(q => h('button', { type: 'button', onclick: () => { $('#draft').value = q; $('#draft').focus(); } }, q)))));
  } else put($('#logEmpty'));

  syncComposer(d);
  renderTyping();
  // 새 기록이 오면 기록 칸 안에서만 아래로 (화면 전체는 움직이지 않는다)
  const key = pid + kind + (S.watch || '');
  if (lastKey !== key) { lastKey = key; lastLen = L.length; if (!d.over) requestAnimationFrame(() => { box.scrollTop = box.scrollHeight; }); }
  else if (L.length > lastLen) { lastLen = L.length; if (nearBottom) requestAnimationFrame(() => box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' })); }
}
/* ---------- 사건 종결 화면 ---------- */
// 등급 → 수사관 칭호
const TITLES = { '한 숟갈': ['S', '명탐정'], '한 그릇': ['A', '베테랑 수사관'], '두 그릇': ['B', '수사관'], '냄비째': ['C', '신참 형사'], '솥째': ['D', '견습 형사'] };
function titleOf(d) {
  if (!d.over) return ['…', '수사 중'];
  if (d.over !== 'solved') return ['F', '미제 담당'];
  return TITLES[grade(d)] || ['D', '견습 형사'];
}
const gClass = g => 'g-' + ({ '…': 'live' }[g] || g.toLowerCase());
function costLine(d) {
  return [`질문 ${d.q}회 (+${d.q})`, d.bought ? `긴급 단서 (+${d.bought})` : null, d.wrong ? `오답 ${d.wrong}회 (+${d.wrong * WRONG})` : null,
    d.over === 'failed' ? `최종 실패 (+${FAIL})` : d.over === 'gaveup' ? `포기 (+${FAIL})` : null,
    d.bonus ? `보너스 ${d.bonus}개 (−${BONUS * d.bonus})` : null].filter(Boolean).join(' · ');
}
// 추천 · 체감 난이도 (끝난 뒤의 반응이라 관전 중에도 할 수 있다)
async function react(action, body) {
  if (!S.room || !S.caseId) return;
  try { await api(action, { code: S.room, puzzle: S.caseId, ...body }); }
  catch (e) { S.err = errText(e.code); render(); }
}
function likeBtn(x) {
  const set = index().likes.get(String(x.id)); const n = set?.size || 0; const on = !!set?.has(me);
  return h('button', { class: 'like' + (on ? ' on' : ''), type: 'button', 'aria-pressed': String(on), title: '명예의 질문으로 추천', onclick: () => react('like', { id: x.id }) }, '👍', n ? h('b', null, n) : null);
}
const countedQs = list => list.filter(x => x.kind === 'q' && x.status === 'done' && x.answer !== '반려');
function allVersusQs(pid) {
  const out = [];
  for (const [k, list] of index().logs) { const [p, scope] = k.split('|'); if (p === pid && scope !== 'coop') out.push(...countedQs(list)); }
  return out.sort((a, b) => tms(a.created_at) - tms(b.created_at));
}
// 결정적인 질문: 정답 전에 마지막 필수 키워드를 연 질문, 없으면 정답 바로 앞 질문
function decisiveOf(pid, d) {
  if (d.over !== 'solved' || !d.overEv) return null;
  const qs = countedQs(d.L).filter(x => x.id < d.overEv.id);
  if (!qs.length) return null;
  const need = new Set(P[pid].facts.filter(f => f.need).map(f => f.id));
  const key = [...qs].reverse().find(x => (x.facts || []).some(f => need.has(f) && d.revealed.get(f)?.ev === x.id));
  const last = qs[qs.length - 1];
  const x = key || last;
  const note = x === last ? (key ? '이 질문으로 키워드가 열렸고, 바로 다음에 정답이 나왔다.' : '이 답 바로 다음에 정답이 나왔다.') : '이 질문이 마지막 핵심 키워드를 열었다.';
  return { x, no: d.qNo.get(x.id), note };
}
function hlCard(cls, label, no, x, note) {
  return h('div', { class: 'hl ' + cls },
    h('div', { class: 'hl-top' }, h('span', null, label), no ? h('span', null, `${no}번째 질문`) : null),
    h('p', { class: 'hl-q', text: `“${x.body}”` }),
    h('div', { class: 'hl-who' }, h('span', null, h('b', { text: x.name || who(x.player).name }), ' 이(가) 물었다'), stamp(x.answer)),
    note ? h('p', { class: 'hl-note' }, note) : null,
    h('div', { class: 'hl-act' }, likeBtn(x)));
}
function verdictEl(pid, d, rv, kind, look) {
  const p = P[pid], no = PUZZLES.indexOf(p);
  const solved = d.over === 'solved', versus = kind === 'versus';
  const bonusN = p.facts.filter(f => !f.need).length;
  const unseen = unseenOf(pid, d);
  const trail = trailOf(d);
  const hits = d.overEv?.kind === 'guess' ? d.overEv.hits || {} : {};
  const clueAt = i => (rv.clues || []).find(c => c.i === i);
  const badge = dd => { const [g, t] = titleOf(dd); return h('span', { class: 'badge ' + gClass(g) }, `${g} · ${t}`); };

  const head = h('header', { class: 'v-head' },
    h('p', { class: 'v-eye' }, solved ? 'CASE CLOSED' : 'COLD CASE'),
    h('h3', null, solved ? '사건 종결' : '미제 사건'),
    h('p', { class: 'v-sub' }, versus ? '가장 적은 문수로 진실에 도달한 수사관이 이긴다.'
      : solved ? `${who(d.overEv?.player).name}이 진상을 맞혔어요${spanOf(d) ? ' · 수사 ' + spanOf(d) : ''}`
      : d.over === 'failed' ? '최종 답안이 빗나갔어요. 진상은 어둠 속에 남았습니다.' : '수사를 접었어요. 진상은 어둠 속에 남았습니다.'),
    h('span', { class: 'v-frozen' }, '기록 동결됨'));

  // 순위: 경쟁전은 수사관별, 함께 풀기는 팀 하나와 기여도
  let board;
  if (versus) {
    board = h('div', { class: 'ranking' }, rankFor(pid).map((r, i) => h('div', { class: 'rk' + (r.uid === (S.watch || me) ? ' me' : '') + (r.st === 'play' ? ' live' : '') },
      h('span', { class: 'rk-no' }, r.st === 'play' ? '수사 중' : `${i + 1}위`),
      h('div', { class: 'rk-main' },
        h('div', { class: 'rk-name' }, h('b', { text: who(r.uid).name }), r.uid === me ? h('span', { class: 'dim' }, '(나)') : null, r.d.over ? badge(r.d) : null),
        h('p', { class: 'rk-line' }, r.st === 'solved' ? `✓ 해결 · ${grade(r.d)}` : r.st === 'play' ? `키워드 ${r.k}/${r.d.need}` : '✗ 미해결'),
        h('p', { class: 'rk-cost' }, costLine(r.d))),
      h('div', { class: 'rk-score' }, h('b', null, r.n), h('span', null, '문')))));
  } else {
    const { list, mvp } = crewOf(d);
    board = h('div', { class: 'ranking' },
      h('div', { class: 'rk me' },
        h('span', { class: 'rk-no' }, '팀'),
        h('div', { class: 'rk-main' },
          h('div', { class: 'rk-name' }, h('b', null, '함께 풀기'), h('span', { class: 'dim' }, `${list.length}명`), badge(d)),
          h('p', { class: 'rk-line' }, solved ? `✓ 해결 · ${grade(d)}` : '✗ 미해결'),
          h('p', { class: 'rk-cost' }, costLine(d))),
        h('div', { class: 'rk-score' }, h('b', null, d.total), h('span', null, '문'))),
      list.length ? h('div', { class: 'crew' }, list.map(c => h('span', { class: 'crew-chip' + (c.id === mvp ? ' mvp' : '') },
        h('img', { src: who(c.id).av, alt: '' }), `${who(c.id).name} · 질문 ${c.q} · 키워드 ${c.f}`, c.id === mvp ? h('b', null, 'MVP') : null))) : null);
  }

  const next = [...PUZZLES.slice(no + 1), ...PUZZLES.slice(0, no)].find(q => !dOf(q.id, kind).over);
  const actions = look ? null : h('div', { class: 'v-actions' },
    h('p', { class: 'count' }, versus ? '동점이면 키워드를 더 찾은 순, 그다음 먼저 끝낸 순' : '결과 공유는 진상을 담지 않아요'),
    h('div', { class: 'row' },
      h('button', { class: 'btn', type: 'button', onclick: e => saveReport(pid, d, e.currentTarget) }, '공유 카드'),
      h('button', { class: 'btn', type: 'button', onclick: e => copy(shareText(pid, d), e.currentTarget) }, '결과 공유'),
      next ? h('button', { class: 'btn primary', type: 'button', onclick: () => openCase(next.id) }, '다음 사건 →') : null));

  const GRADES = [['S', '한 숟갈', '15문 이하', '명탐정'], ['A', '한 그릇', '16~25문', '베테랑 수사관'], ['B', '두 그릇', '26~35문', '수사관'], ['C', '냄비째', '36~50문', '신참 형사'], ['D', '솥째', '51문 이상', '견습 형사'], ['F', '식은 수프', '포기 · 최종 실패', '미제 담당']];
  const myG = grade(d);
  const whose = versus ? (look ? `${who(S.watch).name}의 등급` : '내 등급') : '팀 등급';
  const ladder = h('section', { class: 'v-sec' },
    h('p', { class: 'v-lbl' }, h('span', null, '등급 해설'), h('span', null, `${whose} · ${myG}`)),
    h('div', { class: 'ladder' }, GRADES.map(([g, n, r, t]) => h('div', { class: 'rung ' + gClass(g) + (n === myG ? ' on' : '') },
      h('b', null, g), h('span', { class: 'rn' }, n), h('span', { class: 'rr' }, r), h('span', { class: 'rt' }, t)))),
    h('p', { class: 'crit-note' }, `최종 문수 = 질문 수 + 긴급 단서 ${BUY} + 오답 ${WRONG} + 포기·최종 실패 ${FAIL} − 보너스 키워드 ${BONUS}. 적을수록 높은 등급이에요. ${solved ? `이번 기록은 ${d.total}문이라 「${myG}」이에요.` : ''}`));
  const vault = h('details', { class: 'vault', open: S.vault ? true : null, ontoggle: e => { S.vault = e.currentTarget.open; } },
    h('summary', null, h('span', { class: 'v-lbl' }, '단서 보관함'), h('b', null, `${d.clues.length}개`),
      unseen.length ? h('span', { class: 'tag found' }, `미공개 ${unseen.length}개 해금`) : null, h('span', { class: 'v-open' }, '펼쳐 보기')),
    h('div', { class: 'unseen-grid' }, d.clues.map(c => {
      const got = clueAt(c.i), fresh = unseen.includes(c.i);
      return h('button', { class: 'bracket' + (fresh ? ' new' : ''), type: 'button', disabled: !got?.img, 'aria-label': `단서 #${c.i + 1} 크게 보기`, onclick: () => got?.img && openClue(got, got.text) },
        h('span', { class: 'b-no' }, `#${c.i + 1}${fresh ? ' · 해금' : ''}`),
        got?.img ? h('img', { src: got.img, alt: '', loading: 'lazy' }) : null,
        h('p', null, got?.text || h('span', { class: 'dots' }, '단서를 펼치는 중')));
    })));

  const chip = (f, on) => h('span', { class: (f.need ? '' : 'bonus') + (on ? ' hit' : '') }, on ? '✓ ' : '', rv.facts[f.id]);
  const truth = h('section', { class: 'v-sec' },
    h('p', { class: 'v-lbl' }, '전체 진상 공개'),
    h('div', { class: 'truth-card' },
      p.photo ? h('img', { class: 'truth-photo', src: p.photo, alt: `${p.title} 사건 사진`, loading: 'lazy' }) : null,
      h('div', { class: 'truth-in' },
        h('p', { class: 'v-round' }, `CASE FILE ${num(no)} · ${p.title}`),
        h('h4', { text: p.story }),
        h('p', { class: 'v-lbl' }, `정답 기준 ${d.need}`),
        h('div', { class: 'crit-chips' }, p.facts.filter(f => f.need && rv.facts?.[f.id]).map(f => chip(f, hits[f.id] === 'hit'))),
        bonusN ? h('p', { class: 'v-lbl bonus' }, `보너스 ${bonusN}`) : null,
        bonusN ? h('div', { class: 'crit-chips' }, p.facts.filter(f => !f.need && rv.facts?.[f.id]).map(f => chip(f, d.revealed.has(f.id)))) : null,
        h('p', { class: 'crit-note' }, `채점은 파란 항목만 봐요. 노란 보너스는 찾으면 하나당 −${BONUS}문이고, 못 찾아도 불이익은 없어요.${Object.keys(hits).length ? ' ✓는 정답 제출에서 인정된 항목이에요.' : ''}`),
        h('div', { class: 'truth-box' }, h('p', { class: 'truth' }, rv.truth || h('span', { class: 'dots' }, '진상을 펼치는 중'))),
        vault)));

  const dec = decisiveOf(pid, d);
  const pool = versus ? allVersusQs(pid) : countedQs(d.L);
  let honor = null, best = 0;
  for (const x of pool) { const n = index().likes.get(String(x.id))?.size || 0; if (n > best) { best = n; honor = x; } }
  const hl = h('section', { class: 'v-sec' },
    h('p', { class: 'v-lbl' }, '하이라이트'),
    h('div', { class: 'hl-grid' },
      dec ? hlCard('key', '결정적인 질문', dec.no, dec.x, dec.note)
        : h('div', { class: 'hl key empty' }, h('div', { class: 'hl-top' }, h('span', null, '결정적인 질문')), h('p', { class: 'hl-note' }, '정답에 닿지 못해 결정적인 질문이 없어요.')),
      honor ? hlCard('honor', `명예의 질문 · 추천 ${best}`, versus ? null : d.qNo.get(honor.id), honor, null)
        : h('div', { class: 'hl honor empty' }, h('div', { class: 'hl-top' }, h('span', null, '명예의 질문')), h('p', { class: 'hl-note' }, `${versus ? '아래 전원 심문 기록' : '심문 기록'}에서 👍로 가장 날카롭거나 웃긴 질문을 뽑아 주세요.`))));

  const trailSec = trail.length ? h('section', { class: 'v-sec' },
    h('p', { class: 'v-lbl' }, h('span', null, '수사 경과'), h('span', null, `${trail.length}수`)),
    h('div', { class: 'trail' }, trail.map(t => h('i', { class: 't-' + t.c, title: t.t }))),
    h('p', { class: 'legend' }, [['yes', '네'], ['no', '아니오'], ['na', '관계없음'], ['amb', '애매함'], ['key', '키워드 발견'], ['clue', '긴급 열람']].map(([c, t]) => h('span', null, h('i', { class: 't-' + c }), t)))) : null;

  const allQs = versus ? allVersusQs(pid) : [];
  const table = allQs.length ? h('section', { class: 'v-sec' },
    h('p', { class: 'v-lbl' }, '전원 심문 기록 · 누가 무엇을 물었나'),
    h('div', { class: 'qtable' }, allQs.map((x, i) => h('div', { class: 'qrow' },
      h('span', { class: 'qn' }, `#${i + 1}`), h('span', { class: 'nm', text: x.name || who(x.player).name }), h('span', { class: 'q', text: x.body }), stamp(x.answer), likeBtn(x))))) : null;

  const rates = index().rates.get(pid) || new Map(), mine = rates.get(me);
  const cnt = v => [...rates.values()].filter(x => x === v).length;
  const rate = h('section', { class: 'v-sec v-rate' },
    h('p', { class: 'v-lbl' }, '이 사건, 어땠나요? · 체감 난이도'),
    h('div', { class: 'row' }, [['easy', '쉬움'], ['ok', '적당'], ['hard', '어려움']].map(([v, t]) =>
      h('button', { class: 'chip', type: 'button', 'aria-pressed': String(mine === v), onclick: () => react('rate', { value: v }) }, t, cnt(v) ? h('b', null, ` ${cnt(v)}`) : null))));

  return h('section', { class: 'verdict ' + (solved ? 'v-solved' : 'v-cold') }, head, board, actions, ladder, truth, hl, trailSec, table, rate,
    versus && !look ? h('p', { class: 'v-watch' }, '관전 모드 · 내 기록은 동결됐어요. 점수판의 지켜보기로 다른 수사관의 수사를 볼 수 있어요.') : null);
}

function entry(pid, x, d, kind, rv) {
  const w = who(x.player);
  const mine = kind === 'coop' && x.player === me;
  const stale = x.status === 'pending' && Date.now() - tms(x.updated_at) > STALE_MS;
  const cls = 'entry' + (mine ? ' mine' : '');
  const name = x.player === me ? (myName || '나') : (x.name || w.name);
  const av = h('img', { class: 'av', src: avatar(x.player, name), alt: '' });
  const look = watching();
  const head = extra => h('div', { class: 'who' }, h('b', { text: kind === 'versus' ? (look ? who(S.watch).name : '나') : name }), extra, h('span', null, ago(x.created_at)));
  const waitBot = stale && S.judge === 'bot';
  const busyAI = x.status === 'pending' && !!x.err;   // 무료 AI가 한도에 걸려 대기로 남은 것
  const retryBtn = (x.status === 'error' || busyAI || (stale && !waitBot)) && !d.over && !look ? h('button', { class: 'btn small', type: 'button', disabled: S.busy, onclick: () => retry(x) }, '다시 묻기') : null;
  const errTag = (x.status === 'error' || busyAI) && x.err ? h('span', { class: 'tag' }, errText(x.err)) : null;
  const label = f => rv.facts?.[f] || '…';
  if (x.kind === 'q') {
    const done = x.status === 'done';
    const side = done ? stamp(x.answer) : busyAI ? h('span', { class: 'stamp pend' }, '잠시 대기') : x.status === 'error' || (stale && !waitBot) ? h('span', { class: 'stamp pend' }, '답 없음') : h('span', { class: 'stamp pend' }, h('span', { class: 'dots' }, waitBot ? '출제자 기다리는 중' : '생각 중'));
    const meta = [];
    if (done && x.note && NOTES[x.note]) meta.push(h('span', { class: 'tag' }, NOTES[x.note]));
    if (done) for (const f of x.facts || []) { const ff = P[pid].facts.find(z => z.id === f); if (ff && d.revealed.get(f)?.ev === x.id) meta.push(h('span', { class: 'tag found' }, (ff.need ? '★ 키워드 발견: ' : '+ 보너스 키워드: ') + label(f))); }
    if (done && x.hot) meta.push(h('span', { class: 'tag hot', title: HEAT_HELP }, '수프가 데워졌어요'));
    if (x.appeal === 'pending') meta.push(h('span', { class: 'tag' }, h('span', { class: 'dots' }, '이의 제기 · 다시 판정 중')));
    else if (x.appeal === 'done') meta.push(h('span', { class: 'tag' }, x.prev && x.prev !== x.answer ? `이의 받아들여짐 · ${x.prev} → ${x.answer}` : '이의 검토 · 판정 유지'));
    else if (x.appeal === 'error') meta.push(h('span', { class: 'tag' }, '이의 검토 실패'));
    else if (done && x.answer !== '반려' && !d.over && !look) meta.push(h('button', { class: 'flag', type: 'button', title: '판정이 이상하면 다시 판정을 요청해요', onclick: () => appeal(x) }, '🚩 이의'));
    if (done && x.answer !== '반려') meta.push(h('button', { class: 'flag' + (S.pins.has(x.id) ? ' on' : ''), type: 'button', 'aria-pressed': String(S.pins.has(x.id)), onclick: () => togglePin(x.id) }, S.pins.has(x.id) ? '노트에 담김' : '노트에 담기'));
    if (done && x.answer !== '반려' && d.over) meta.push(likeBtn(x));
    if (errTag) meta.push(errTag);
    if (retryBtn) meta.push(retryBtn);
    const n = d.qNo.get(x.id);
    return h('li', { class: cls }, av, head(n ? h('span', { class: 'qn' }, `Q${n}`) : null), h('div', { class: 'side' }, side), h('p', { class: 'qt', text: x.body }), meta.length ? h('div', { class: 'meta' }, meta) : null);
  }
  if (x.kind === 'clue') return h('li', { class: cls + ' e-sys e-clue' }, av, head(), h('p', { class: 'qt', text: `단서 #${(+x.clue_i || 0) + 1}을 긴급 열람했어요 · +${BUY}문` }));
  if (x.kind === 'giveup') return h('li', { class: cls + ' e-sys' }, av, head(), h('p', { class: 'qt', text: `포기하고 진상을 열었어요 · +${FAIL}문` }));
  if (x.kind === 'end') return h('li', { class: cls + ' e-sys' }, av, head(), h('p', { class: 'qt', text: '질문을 끝냈어요 · 이제 최종 답안 한 번만 남았어요' }));
  if (x.kind === 'chat') return h('li', { class: cls + ' e-chat' }, av, head(h('span', { class: 'qn' }, '의논')), h('p', { class: 'qt', text: x.body }));
  if (x.kind === 'guess') {
    const facts = P[pid].facts; const meta = [];
    let side;
    if (x.status === 'done') {
      const hit = facts.filter(f => f.need && x.hits?.[f.id] === 'hit').length;
      const part = facts.filter(f => f.need && x.hits?.[f.id] === 'partial').length;
      side = stamp(x.ok ? '네' : '아니오');
      meta.push(h('span', { class: 'tag' + (x.ok ? ' found' : '') }, x.ok ? '정답이에요!' : `키워드 ${d.need}개 중 ${hit}개 맞힘${part ? ` · ${part}개는 방향만 맞음` : ''} · ${x.final ? `+${FAIL}문` : `+${WRONG}문`}`));
      for (const f of facts) if (x.hits?.[f.id] === 'hit' && d.revealed.get(f.id)?.ev === x.id) meta.push(h('span', { class: 'tag found' }, (f.need ? '★ 키워드 발견: ' : '+ 보너스 키워드: ') + label(f.id)));
    } else side = x.status === 'error' || (stale && !waitBot) ? h('span', { class: 'stamp pend' }, '채점 실패') : h('span', { class: 'stamp pend' }, h('span', { class: 'dots' }, waitBot ? '출제자 기다리는 중' : '채점 중'));
    if (errTag) meta.push(errTag);
    if (retryBtn) meta.push(retryBtn);
    return h('li', { class: cls + ' e-guess' + (x.ok ? ' ok' : '') }, av, head(h('span', null, x.final ? '최종 답안' : '진상 제출')), h('div', { class: 'side' }, side), h('p', { class: 'qt', text: x.body }), meta.length ? h('div', { class: 'meta' }, meta) : null);
  }
  return h('li', { hidden: true });
}
// 아래 입력줄은 질문 전용 (의논은 의논 창, 진상은 문제 카드의 진상 제출)
function syncComposer(d) {
  if (!S.caseId) return;
  d = d || dOf(S.caseId);
  const ta = $('#draft'); const btn = $('#sendBtn');
  let help = '', block = false;
  if (watching()) { help = '관전 중에는 질문할 수 없어요.'; block = true; }
  else if (d.capped && !d.over) { help = `질문이 마감됐어요. 문제 카드의 최종 답안 제출만 남았어요 · 틀리면 +${FAIL}문`; block = true; }
  else if (d.guessing) { help = '제출한 진상을 채점하는 중이에요…'; block = true; }
  ta.disabled = block; btn.disabled = block || S.busy;
  ta.placeholder = d.capped ? '질문이 마감됐어요' : '네 · 아니오로 답할 수 있게 물어 보세요 (누가·왜·어떻게는 반려)';
  btn.textContent = S.busy ? '…' : '묻기';
  $('#composer').hidden = watching() || !!d.over;
  $('#compHelp').textContent = help;
  $('#compErr').textContent = S.err || '';
}
function renderTyping() {
  const t = playing() === 'coop' ? S.peers.filter(p => !p.isMe && p.ty && p.ty === S.caseId && p.m !== 'versus') : [];
  $('#typing').textContent = t.length ? `${t.map(p => who(p.id).name).slice(0, 2).join(', ')}이 적는 중…` : '';
}
// 의논 창 (함께 풀기만): 오른쪽 아래 버튼으로 열고 닫는다. 입력칸은 다시 그리지 않아 쓰던 글이 남는다.
function renderTalk() {
  const pid = S.caseId;
  const show = S.view === 'table' && !!pid && !!S.room && playing() === 'coop';
  $('#talk').hidden = !show;
  if (!show) return;
  const chats = logsOf(pid, 'coop').filter(x => x.kind === 'chat');
  if (S.talkSeen[pid] == null || S.talkOpen) S.talkSeen[pid] = chats.length;
  const unread = S.talkOpen ? 0 : chats.length - S.talkSeen[pid];
  $('#talkPanel').hidden = !S.talkOpen;
  $('#talkFab').setAttribute('aria-expanded', String(S.talkOpen));
  $('#talkFab').classList.toggle('on', S.talkOpen);
  $('#talkBadge').textContent = unread > 0 ? String(unread) : '';
  if (!S.talkOpen) return;
  const list = $('#talkList');
  const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 40;
  put(list, chats.length ? chats.map(x => {
    const name = x.player === me ? (myName || '나') : (x.name || who(x.player).name);
    return h('li', { class: 'talk-item' + (x.player === me ? ' mine' : '') }, h('img', { src: avatar(x.player, name), alt: '' }),
      h('div', null, h('p', { class: 'tw' }, h('b', { text: name }), h('span', null, ago(x.created_at))), h('p', { class: 'tt', text: x.body })));
  }) : h('li', { class: 'talk-empty' }, '가설을 맞춰 보고 다음 질문을 골라 보세요. 여기 적은 말은 출제자에게 가지 않아요.'));
  if (atBottom || S.talkJump) { list.scrollTop = list.scrollHeight; S.talkJump = false; }
}
function toggleTalk(open = !S.talkOpen) {
  S.talkOpen = open; S.talkJump = open;
  renderTalk();
  if (open) $('#talkInput').focus();
}

/* ---------- 결과 페이지 (등수 · 등급 해설 · 진상 해설) ---------- */
function renderResult() {
  const box = $('#result');
  const pid = S.caseId;
  const kind = playing();
  const d = pid && S.view === 'table' && S.resultOpen ? dOf(pid, kind) : null;
  if (!d?.over) {
    if (S.resultOpen && d && !d.over) S.resultOpen = false;
    if (!box.hidden) { box.hidden = true; box.replaceChildren(); }
    return;
  }
  const rv = revealOf(pid, kind, d);
  const keep = box.querySelector('.result-scroll')?.scrollTop || 0;
  put(box,
    h('div', { class: 'result-top' },
      h('button', { class: 'back', type: 'button', onclick: closeResult }, '←', h('span', null, ' 심문 기록 보기')),
      h('span', { class: 'rt' }, h('i', { class: 'en' }, 'CASE REPORT'), P[pid].title),
      h('button', { class: 'talk-x', type: 'button', 'aria-label': '결과 닫기', onclick: closeResult }, '✕')),
    h('div', { class: 'result-scroll' }, h('div', { class: 'result-in' }, verdictEl(pid, d, rv, kind, watching()))));
  box.hidden = false;
  box.querySelector('.result-scroll').scrollTop = keep;
}
function closeResult() { S.resultOpen = false; render(); }

/* ---------- 새 버전 알림 ---------- */
const VERSION_FILES = ['app.js', 'style.css', 'puzzles.js', 'index.html'];
let versionSig = null;
async function versionNow() {
  const parts = await Promise.all(VERSION_FILES.map(async f => {
    const r = await fetch(f, { method: 'HEAD', cache: 'no-store' });
    return r.headers.get('etag') || r.headers.get('last-modified') || '';
  }));
  return parts.join('|');
}
async function checkUpdate() {
  try {
    const sig = await versionNow();
    if (!sig.split('|').some(Boolean)) return;
    if (versionSig == null) versionSig = sig;
    else if (sig !== versionSig) showUpdateToast();
  } catch {}
}
function showUpdateToast() {
  const t = $('#toast');
  if (!t.hidden) return;
  put(t, h('span', null, h('b', null, '새 버전이 나왔어요.'), ' 새로고침하면 바뀐 화면으로 이어서 할 수 있어요.'),
    h('button', { class: 'btn primary small', type: 'button', onclick: () => location.reload() }, '새로고침'),
    h('button', { class: 'toast-x', type: 'button', 'aria-label': '알림 닫기', onclick: () => { t.hidden = true; } }, '✕'));
  t.hidden = false;
}
function watchUpdates() {
  checkUpdate();
  setInterval(checkUpdate, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkUpdate(); });
}

/* ---------- 이동 ---------- */
function openCase(pid) {
  if (!S.room) {
    S.lobbyErr = '먼저 방을 만들거나 코드로 들어가 주세요.';
    render(); window.scrollTo({ top: 0, behavior: 'smooth' }); $('#lobbyCode')?.focus();
    return;
  }
  modeSheet(pid);
}
// 사건을 고르면 먼저 진행 방식을 묻는다 (주소로 바로 들어올 때는 묻지 않음)
function modeSheet(pid) {
  const p = P[pid];
  const cd = dOf(pid, 'coop'), vd = derive(p, index().logs.get(pid + '|' + me) || []);
  const rivals = rankFor(pid).length;
  const stat = (d, fresh) => d.over ? (d.over === 'solved' ? `해결 · ${d.total}문` : '끝남 · 진상 공개됨') : d.L.some(e => e.kind !== 'chat') ? `진행 중 · ${d.n}문 · 키워드 ${d.needFound}/${d.need}` : fresh;
  const pick = (m, close) => { close(); S.play = m; lsSet('soup.play', m); enterCase(pid); };
  let first;
  sheetShell('진행 방식 고르기', close => h('div', { class: 'sheet mode-sheet', role: 'dialog', 'aria-modal': 'true' },
    h('p', { class: 'v-round' }, `CASE FILE ${num(PUZZLES.indexOf(p))}`),
    h('h3', { text: p.title }),
    h('p', null, '어떻게 풀까요?'),
    h('div', { class: 'mode-pick' },
      first = h('button', { class: 'mode-opt' + (S.play === 'coop' ? ' last' : ''), type: 'button', onclick: () => pick('coop', close) },
        h('b', null, '함께 풀기'), h('span', null, '방 사람들과 질문과 답을 같이 보고, 의논하며 한 팀으로 풀어요.'), h('small', null, stat(cd, '아직 아무도 안 앉음'))),
      h('button', { class: 'mode-opt' + (S.play === 'versus' ? ' last' : ''), type: 'button', onclick: () => pick('versus', close) },
        h('b', null, '따로 풀기'), h('span', null, '각자 따로 묻고, 가장 적은 문수로 진실에 닿은 사람이 이겨요. 남의 질문은 끝날 때까지 안 보여요.'),
        h('small', null, `${stat(vd, '내 기록 없음')}${rivals ? ` · 도전 ${rivals}명` : ''}`))),
    h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', onclick: close }, '닫기'))));
  first.focus();
}
function enterCase(pid) {
  S.view = 'table'; S.caseId = pid; S.spot = null; S.err = ''; S.filter = 'all'; S.watch = null; S.mtab = null; S.briefOpen = false; S.talkOpen = false; S.resultOpen = false;
  setHash(); track(); render(); window.scrollTo({ top: 0 });
}
function goHome() {
  S.view = 'home'; S.caseId = null; S.err = ''; S.watch = null;
  setHash(); track(); render(); window.scrollTo({ top: 0 });
}

/* ---------- 시작 ---------- */
function start() {
  $('#brand').addEventListener('click', goHome);
  $('#backBtn').addEventListener('click', goHome);
  $('#nameChip').addEventListener('click', nameSheet);
  $('#mtabs').addEventListener('click', e => {
    const b = e.target.closest('[data-mtab]'); if (!b || b.dataset.mtab === S.mtab) return;
    S.mtab = b.dataset.mtab; render();
    if (S.mtab === 'log') requestAnimationFrame(() => { const box = $('#deskScroll'); box.scrollTop = box.scrollHeight; });
  });
  const qIn = $('#arcSearch'), sortIn = $('#arcSort');
  qIn.value = S.arc.q; sortIn.value = S.arc.sort;
  qIn.addEventListener('input', () => { S.arc.q = qIn.value; saveArc(); renderHome(); });
  sortIn.addEventListener('change', () => { S.arc.sort = sortIn.value; saveArc(); renderHome(); });
  $('#roomChip').addEventListener('click', roomSheet);
  for (const b of $('#playSeg').querySelectorAll('button')) b.addEventListener('click', () => setPlay(b.dataset.play));
  $('#composer').addEventListener('submit', e => { e.preventDefault(); submitDraft(); });
  const ta = $('#draft');
  ta.addEventListener('input', () => { if (ta.value.trim()) setTyping(true); });
  $('#talkFab').addEventListener('click', () => toggleTalk());
  $('#talkClose').addEventListener('click', () => toggleTalk(false));
  $('#talkForm').addEventListener('submit', e => { e.preventDefault(); submitTalk(); });
  const tk = $('#talkInput');
  tk.addEventListener('input', () => { if (tk.value.trim()) setTyping(true); });
  tk.addEventListener('keydown', e => { if (e.key === 'Escape') toggleTalk(false); });
  watchUpdates();
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && S.resultOpen && !$('#sheetRoot').childElementCount) closeResult(); });
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submitDraft(); } });
  setInterval(() => { if (S.view === 'table' && !$('#sheetRoot').childElementCount) render(); }, 30000);
  setInterval(() => { if (S.room) pollBot(); }, 20000);
  render();

  const [hRoom, hCase] = (location.hash || '').slice(1).toLowerCase().split('/');
  const target = /^[a-z0-9]{4}$/.test(hRoom || '') ? hRoom : lsGet('soup.room', null);
  if (target) joinRoom(target, true).then(ok => { if (ok && hCase && P[hCase]) enterCase(hCase); });
}
start();
