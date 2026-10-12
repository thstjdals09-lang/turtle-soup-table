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
  view: 'home', caseId: null, filter: 'all', compose: 'ask',
  play: lsGet('soup.play', 'coop') === 'versus' ? 'versus' : 'coop',
  room: null, host: null, channel: null, conn: 'off', judge: null, botSeen: 0,
  events: new Map(), loaded: false, peers: [], typing: null, lastTrack: '',
  spot: null, seen: {}, err: '', lobbyErr: '', busy: false,
  pins: new Set(lsGet('soup.pins', []) || []), reveal: new Map()
};
const playing = () => S.play;
const scopeOf = kind => (kind === 'versus' ? me : 'coop');
let idx = null;
function index() {
  if (idx) return idx;
  idx = { logs: new Map(), names: new Map() };
  for (const e of S.events.values()) {
    const k = e.puzzle + '|' + e.scope;
    if (!idx.logs.has(k)) idx.logs.set(k, []);
    idx.logs.get(k).push(e);
    if (e.name) idx.names.set(e.player, e.name);
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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="16" fill="hsl(${hue},48%,58%)"/><text x="16" y="21.5" font-size="15" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#fff">${esc}</text></svg>`;
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
    api('reveal', { code: room, puzzle: pid, scope: kind === 'versus' ? me : 'coop' })
      .then(data => { if (room === S.room) { S.reveal.set(key, { sig, data }); scheduleRender(); } })
      .catch(() => { const cur = S.reveal.get(key) || {}; S.reveal.set(key, { ...cur, want: null, failAt: Date.now() }); });
  }
  return c.data || empty;
}

/* ---------- 삽화 ---------- */
function sceneSVG(pid, rv, fresh) {
  const p = P[pid];
  let layers = '';
  for (const c of rv?.clues || []) if (c.layer) layers += `<g class="${fresh?.has('c' + (c.i + 1)) ? 'layer-in' : ''}">${c.layer}</g>`;
  return `<svg class="scene" viewBox="0 0 400 300" role="img" aria-label="${p.title} 삽화"><rect class="bg" width="400" height="300"/>${p.scene}${layers}</svg>`;
}
function plateEl(pid, rv, fresh, big) {
  const spots = P[pid].spots || [];
  const seen = S.seen[pid + ':spots'] || (S.seen[pid + ':spots'] = new Set(spots.map(x => x.id)));
  const plate = h('div', { class: 'plate', svg: sceneSVG(pid, rv, fresh) });
  spots.forEach((sp, i) => plate.append(h('button', {
    class: 'spot' + (seen.has(sp.id) ? '' : ' new'), type: 'button', style: `left:${sp.x}%;top:${sp.y}%`,
    'aria-pressed': String(S.spot === sp.id), 'aria-label': sp.label + ' 살펴보기',
    onclick: () => { S.spot = S.spot === sp.id ? null : sp.id; if (big) openZoom(); else render(); }
  }, String(i + 1))));
  if (!big) plate.append(h('button', { class: 'zoom', type: 'button', onclick: openZoom }, '확대'));
  const cur = spots.find(x => x.id === S.spot);
  const cap = cur ? [h('b', { text: cur.label }), ' — ', cur.text] : [h('span', { class: 'dim' }, '번호를 눌러 그림 속 사물을 살펴보세요. 15·30·45문마다 단서 그림이 한 장씩 더 찍혀요.')];
  return { plate, cap };
}

/* ---------- 행동 ---------- */
const canAct = () => !!S.room && !S.busy;
async function act(action, body, clearDraft) {
  if (!canAct()) return null;
  S.err = ''; S.busy = true; syncComposer();
  try {
    const r = await api(action, { code: S.room, puzzle: S.caseId, scope: playing(), ...body });
    if (clearDraft) { $('#draft').value = ''; autosize(); }
    return r;
  } catch (e) { S.err = errText(e.code); return null; }
  finally { S.busy = false; render(); }
}
function submitDraft() {
  const text = $('#draft').value.trim();
  if (!text || !S.caseId) return;
  setTyping(false);
  const d = dOf(S.caseId);
  if (S.compose === 'chat' && playing() === 'coop') return act('chat', { text }, true);
  if (d.over) return;
  if (S.compose === 'guess' || d.capped) return confirmGuess(text, d);
  return act('ask', { text }, true);
}
function confirmGuess(text, d) {
  const final = d.capped;
  const kw = `키워드 ${d.need}개를 인과관계까지 담아야 해결돼요.`;
  sheet(final ? '최종 답안을 낼까요?' : '진상을 제출할까요?',
    final ? `${kw} 질문이 끝나서 이번이 마지막 기회예요. 틀리면 +${FAIL}문으로 사건이 끝나요.` : `${kw} 틀리면 +${WRONG}문이고, 맞힌 키워드는 ${playing() === 'versus' ? '나에게' : '방 전체에'} 열려요.`,
    final ? '최종 제출' : '제출하기', () => act('guess', { text }, true));
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
  const msg = playing() === 'versus' ? '이 사건의 내 경쟁전 기록을 지우고 처음부터 시작해요.' : '이 사건의 함께 풀기 기록을 모두 지워요. 같은 방 사람들의 질문도 사라져요.';
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
  S.play = m === 'versus' ? 'versus' : 'coop'; lsSet('soup.play', S.play); S.filter = 'all'; S.err = '';
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
function openZoom() {
  const pid = S.caseId; if (!pid) return;
  const d = dOf(pid); const rv = revealOf(pid, playing(), d);
  const { plate, cap } = plateEl(pid, rv, null, true);
  let closeBtn;
  sheetShell('삽화 크게 보기', close => h('div', { class: 'zoom-sheet', role: 'dialog', 'aria-modal': 'true' }, plate,
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
  renderTop();
  if (S.view === 'home') renderHome(); else renderTable();
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
  put($('#cases'), PUZZLES.map((p, i) => {
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
      h('div', { class: 'thumb', svg: sceneSVG(p.id, d?.over ? S.reveal.get(p.id + '|coop')?.data : null) }, h('span', { class: 'no' }, num(i))),
      h('div', { class: 'body' },
        h('h3', { text: p.title }),
        h('div', { class: 'tagline' }, (p.tags || []).map(g => h('span', { class: 'genre' }, g))),
        h('p', { class: 'teaser', text: p.story }),
        ranks.length || (vd && vd.L.length) ? h('p', { class: 'vs' }, `경쟁전 ${ranks.length}명${best ? ` · 최저 ${best.n}문` : ''}${vd && vd.L.length ? ` · 내 기록 ${vd.over === 'solved' ? vd.total + '문 해결' : vd.n + '문'}` : ''}`) : null,
        h('div', { class: 'foot' }, bowls(p.level),
          here.length ? h('span', { class: 'faces' }, here.slice(0, 3).map(x => h('img', { src: who(x.id).av, alt: who(x.id).name }))) : null,
          status)));
  }));
  $('#homeNote').textContent = S.room
    ? '함께 풀기는 질문과 답을 방 전체가 같이 보고, 경쟁전은 각자 따로 묻고 점수판만 나눠요.'
    : '위에서 방을 만들거나 코드로 들어가면 사건을 고를 수 있어요.';
}
function rankFor(pid) {
  const by = new Map();
  for (const [k, list] of index().logs) {
    const [p, scope] = k.split('|');
    if (p === pid && scope !== 'coop') by.set(scope, list);
  }
  const ord = st => (st === 'solved' ? 0 : st === 'play' ? 1 : 2);
  return [...by.entries()].map(([uid, list]) => { const d = derive(P[pid], list); return { uid, n: d.total, st: d.over || 'play', k: d.needFound }; })
    .sort((a, b) => ord(a.st) - ord(b.st) || a.n - b.n);
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

  // 문수 미터
  const pct = v => Math.min(100, (v / CAP) * 100);
  const nx = d.over ? (d.over === 'solved' ? `해결 · ${grade(d)}` : '사건 종료') : d.capped ? '질문 마감 · 최종 답안 1회' : d.nextClue ? `다음 단서까지 ${d.nextClue.at - d.n}문` : `마감까지 ${CAP - d.n}문`;
  put($('#meter'),
    h('div', { class: 'm-top' }, h('b', { text: d.total }), h('span', { class: 'of' }, `/ ${CAP}문${d.bonus ? ` (보너스 −${BONUS * d.bonus})` : ''}`), h('span', { class: 'nx' }, nx)),
    h('div', { class: 'bar', role: 'img', 'aria-label': `${d.n}문 / ${CAP}문` }, h('i', { style: `width:${pct(d.n)}%` }), CLUE_AT.map(t => h('s', { style: `left:${pct(t)}%` })), h('s', { class: 'end', style: 'left:calc(100% - 2px)' })),
    h('div', { class: 'ticks' }, CLUE_AT.map(t => h('span', { style: `left:${pct(t)}%` }, t)), h('span', { class: 'end', style: 'left:100%' }, CAP)),
    h('div', { class: 'm-sub' }, h('span', { class: 'tag' }, `질문 ${d.q}`), d.rej ? h('span', { class: 'tag' }, `반려 ${d.rej}`) : null, d.wrong ? h('span', { class: 'tag' }, `오답 ${d.wrong} · +${d.wrong * WRONG}`) : null, d.bought ? h('span', { class: 'tag' }, `긴급 열람 +${d.bought}`) : null));

  // 문제
  const here = viewersHere(pid).filter(x => !x.isMe);
  put($('#soupArea'), h('article', { class: 'soup-card' },
    h('div', { class: 'lbl' }, h('span', null, kind === 'versus' ? '문제 · 경쟁전' : '문제 · 함께 풀기'), bowls(p.level)),
    h('p', { class: 'story', text: p.story }),
    h('div', { class: 'kw' }, h('span', null, `키워드 ${d.need}개`), bonusN ? h('span', { class: 'bonus' }, `보너스 ${bonusN}개 (−${BONUS}문)`) : null, (p.tags || []).map(g => h('span', { class: 'plain' }, g)), h('span', { class: 'plain' }, '키워드 전부 + 인과관계를 맞혀야 정답')),
    h('div', { class: 'here' }, here.length
      ? [h('span', { class: 'faces' }, here.slice(0, 6).map(x => h('img', { src: who(x.id).av, alt: '' }))), `${here.slice(0, 3).map(x => who(x.id).name).join(', ')}${here.length > 3 ? ` 외 ${here.length - 3}명` : ''}이 이 사건을 보고 있어요`]
      : kind === 'versus' ? '경쟁전: 내 질문과 답은 내 화면에만 보이고, 문수는 점수판에 올라가요.' : `지금은 이 사건에 나 혼자예요. 방 코드 ${S.room.toUpperCase()}를 친구에게 알려 주세요.`)));

  // 단서판
  const seenKey = pid + ':' + kind;
  const seenOpen = S.seen[seenKey] || (S.seen[seenKey] = new Set(d.open));
  const fresh = new Set([...d.open].filter(x => !seenOpen.has(x)));
  const { plate, cap } = plateEl(pid, rv, fresh, false);
  const clueText = i => (rv.clues || []).find(c => c.i === i)?.text;
  const clueCards = d.clues.map(c => {
    if (c.open) return h('div', { class: 'card clue' + (fresh.has(c.id) ? ' fresh' : '') }, h('span', { class: 'n' }, '#' + (c.i + 1)), h('p', null, clueText(c.i) || h('span', { class: 'dots' }, '단서를 펼치는 중')), h('small', null, c.bought ? `긴급 열람 (+${BUY}문) · 삽화에 찍힘` : `${c.at}문 단서 · 삽화에 찍힘`));
    const isNext = d.nextClue === c;
    return h('div', { class: 'card locked' }, h('span', { class: 'n' }, '#' + (c.i + 1)), h('p', null, `${c.at}문에 열려요`),
      isNext && !d.over ? h('div', { class: 'act' }, h('button', { class: 'btn small', type: 'button', disabled: S.busy, onclick: buyClue }, `긴급 열람 · +${BUY}문`)) : null);
  });
  const kwCards = p.facts.map(f => {
    const r = d.revealed.get(f.id);
    if (!r && !d.over) return h('div', { class: 'card locked' + (f.need ? '' : ' bonus') }, h('span', { class: 'n' }, f.need ? '?' : '+'), h('p', null, f.need ? '아직 밝혀지지 않은 키워드' : `보너스 키워드 · 찾으면 −${BONUS}문`));
    return h('div', { class: 'card' + (f.need ? '' : ' bonus') + (fresh.has(f.id) ? ' fresh' : '') }, h('span', { class: 'n' }, f.need ? '★' : '+'),
      h('p', null, rv.facts?.[f.id] || h('span', { class: 'dots' }, '키워드를 펼치는 중')),
      h('small', null, r ? `${kind === 'versus' ? '' : who(r.by).name + '의 '}${r.via === 'guess' ? '진상 제출' : '질문'}로 밝혀짐 · ${ago(r.at)}` : '진상 공개로 열림'));
  });
  if (rv.clues?.length || Object.keys(rv.facts || {}).length) fresh.forEach(x => seenOpen.add(x));
  const ranks = kind === 'versus' ? rankFor(pid) : [];
  put($('#board'),
    h('figure', { class: 'print' }, plate, h('figcaption', null, cap)),
    h('section', { class: 'panel' }, h('h3', null, h('span', null, '단서'), h('span', null, `${d.clues.filter(c => c.open).length}/${d.clues.length}`)), h('div', { class: 'stack' }, clueCards)),
    h('section', { class: 'panel' }, h('h3', null, h('span', null, '키워드'), h('span', null, `${d.needFound}/${d.need}${bonusN ? ` · 보너스 ${d.bonus}/${bonusN}` : ''}`)), h('div', { class: 'stack' }, kwCards)),
    kind === 'versus' ? h('section', { class: 'panel' }, h('h3', null, h('span', null, '경쟁전 점수판'), h('span', null, '적을수록 위')),
      ranks.length ? h('div', { class: 'board-rank' }, ranks.map((r, i) => h('div', { class: 'rank-row' + (r.uid === me ? ' me' : '') },
        h('span', { class: 'r' }, i + 1), h('img', { src: who(r.uid).av, alt: '' }), h('span', { class: 'nm', text: who(r.uid).name }),
        h('span', { class: 'sc' }, r.st === 'solved' ? `${r.n}문 해결` : r.st === 'play' ? `${r.n}문 · 키워드 ${r.k}` : `${r.n}문 · 실패`))))
        : h('p', { class: 'count' }, '아직 이 사건에 도전한 사람이 없어요. 첫 질문을 하면 점수판에 올라가요.')) : null,
    h('div', { class: 'row' },
      !d.over && !d.capped ? h('button', { class: 'btn', type: 'button', disabled: S.busy, onclick: endQuestions }, '질문 끝내기 · 최종 추리') : null,
      !d.over ? h('button', { class: 'btn ghost warn', type: 'button', disabled: S.busy, onclick: giveUp }, `포기하고 진상 보기 · +${FAIL}문`) : null,
      d.L.length && (kind === 'versus' || S.host === me) ? h('button', { class: 'btn ghost', type: 'button', onclick: clearCase }, '식탁 치우기') : null));

  put($('#botBanner'), d.over ? null : botBanner());

  // 진상
  if (d.over) {
    const crew = new Map();
    const bump = (k, f) => { const c = crew.get(k) || { q: 0, f: 0 }; f(c); crew.set(k, c); };
    for (const x of d.L) if (x.kind === 'q' && x.status === 'done' && x.answer !== '반려') bump(x.player, c => c.q++);
    for (const r of d.revealed.values()) bump(r.by, c => c.f++);
    const by = who(d.overEv?.player).name;
    const title = d.over === 'solved' ? `해결 · ${grade(d)}` : d.over === 'failed' ? '최종 답안이 빗나갔어요' : '포기했어요';
    const sub = d.over === 'solved' ? `${kind === 'versus' ? '' : by + '이 '}진상을 맞혔어요 · 최종 ${d.total}문 · 질문 ${d.q}개` : `최종 ${d.total}문 · 질문 ${d.q}개`;
    put($('#verdictArea'), h('section', { class: 'verdict' },
      h('div', { class: 'vhead' }, stamp(d.over === 'solved' ? '네' : '아니오', true), h('div', null, h('h3', { text: title }), h('p', { class: 'count' }, sub))),
      h('p', { class: 'truth' }, rv.truth || h('span', { class: 'dots' }, '진상을 펼치는 중')),
      h('div', { class: 'crit' }, h('p', { class: 'count' }, `정답 기준 ${d.need}${bonusN ? ` · 보너스 ${bonusN}` : ''}`), p.facts.map(f => rv.facts?.[f.id] ? h('span', null, (f.need ? '★ ' : '+ ') + rv.facts[f.id]) : null)),
      kind === 'coop' && crew.size > 1 ? h('div', { class: 'crew' }, [...crew.entries()].map(([k, c]) => h('span', { class: 'crew-chip' }, h('img', { src: who(k).av, alt: '' }), `${who(k).name} · 질문 ${c.q} · 키워드 ${c.f}`))) : null));
  } else put($('#verdictArea'));

  // 기록
  const F = S.filter;
  const pinned = d.L.filter(x => S.pins.has(x.id)).length;
  const filters = [['all', '전체'], ['네', '네'], ['아니오', '아니오'], ['key', '키워드·중요'], ['note', `수사 노트 ${pinned}`], ...(kind === 'coop' ? [['mine', '내 질문'], ['chat', '의논']] : [])];
  put($('#filters'), filters.map(([k, t]) => h('button', { class: 'chip', type: 'button', 'aria-pressed': String(F === k), onclick: () => { S.filter = k; render(); } }, t)));
  const show = d.L.filter(x => {
    if (F === 'all') return true;
    if (F === 'note') return S.pins.has(x.id);
    if (F === 'chat') return x.kind === 'chat';
    if (F === 'mine') return x.player === me && x.kind !== 'chat';
    if (F === 'key') return (x.kind !== 'q' && x.kind !== 'chat') || (x.facts && x.facts.length) || x.hot || d.marks.has(x.id);
    return x.kind === 'q' && x.answer === F;
  });
  $('#logCount').textContent = S.loaded ? `기록 ${show.length}개` : '기록을 불러오는 중…';
  const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 200;
  const items = [];
  for (const x of show) {
    items.push(entry(pid, x, d, kind, rv));
    for (const i of d.marks.get(x.id) || []) items.push(h('li', { class: 'entry e-sys e-clue' }, h('span'), h('p', { class: 'qt', text: `${CLUE_AT[i]}문 도달 · 단서 #${i + 1}이 삽화에 찍혔어요` })));
  }
  put($('#log'), items);
  if (S.loaded && !d.L.length) {
    put($('#logEmpty'), h('div', { class: 'empty' },
      h('p', null, '아직 아무도 묻지 않았어요. 처음엔 이야기의 빈칸을 넓게 훑는 질문이 좋아요.'),
      h('div', { class: 'starter' }, (p.starters || []).map(q => h('button', { type: 'button', onclick: () => { S.compose = 'ask'; $('#draft').value = q; autosize(); $('#draft').focus(); syncComposer(d); } }, q)))));
  } else put($('#logEmpty'));

  syncComposer(d);
  renderTyping();
  const key = pid + kind;
  if (lastKey !== key) { lastKey = key; lastLen = d.L.length; }
  else if (d.L.length > lastLen) { lastLen = d.L.length; if (nearBottom) requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })); }
}
function entry(pid, x, d, kind, rv) {
  const w = who(x.player);
  const mine = kind === 'coop' && x.player === me;
  const stale = x.status === 'pending' && Date.now() - tms(x.updated_at) > STALE_MS;
  const cls = 'entry' + (mine ? ' mine' : '');
  const name = x.player === me ? (myName || '나') : (x.name || w.name);
  const av = h('img', { class: 'av', src: avatar(x.player, name), alt: '' });
  const head = extra => h('div', { class: 'who' }, h('b', { text: kind === 'versus' ? '나' : name }), extra, h('span', null, ago(x.created_at)));
  const waitBot = stale && S.judge === 'bot';
  const retryBtn = (x.status === 'error' || (stale && !waitBot)) && !d.over ? h('button', { class: 'btn small', type: 'button', disabled: S.busy, onclick: () => retry(x) }, '다시 묻기') : null;
  const errTag = x.status === 'error' && x.err ? h('span', { class: 'tag' }, errText(x.err)) : null;
  const label = f => rv.facts?.[f] || '…';
  if (x.kind === 'q') {
    const done = x.status === 'done';
    const side = done ? stamp(x.answer) : x.status === 'error' || (stale && !waitBot) ? h('span', { class: 'stamp pend' }, '답 없음') : h('span', { class: 'stamp pend' }, h('span', { class: 'dots' }, waitBot ? '출제자 기다리는 중' : '생각 중'));
    const meta = [];
    if (done && x.note && NOTES[x.note]) meta.push(h('span', { class: 'tag' }, NOTES[x.note]));
    if (done) for (const f of x.facts || []) { const ff = P[pid].facts.find(z => z.id === f); if (ff && d.revealed.get(f)?.ev === x.id) meta.push(h('span', { class: 'tag found' }, (ff.need ? '★ 키워드 발견: ' : '+ 보너스 키워드: ') + label(f))); }
    if (done && x.hot) meta.push(h('span', { class: 'tag hot' }, '중요한 질문'));
    if (x.appeal === 'pending') meta.push(h('span', { class: 'tag' }, h('span', { class: 'dots' }, '이의 제기 · 다시 판정 중')));
    else if (x.appeal === 'done') meta.push(h('span', { class: 'tag' }, x.prev && x.prev !== x.answer ? `이의 받아들여짐 · ${x.prev} → ${x.answer}` : '이의 검토 · 판정 유지'));
    else if (x.appeal === 'error') meta.push(h('span', { class: 'tag' }, '이의 검토 실패'));
    else if (done && x.answer !== '반려' && !d.over) meta.push(h('button', { class: 'flag', type: 'button', title: '판정이 이상하면 다시 판정을 요청해요', onclick: () => appeal(x) }, '🚩 이의'));
    if (done && x.answer !== '반려') meta.push(h('button', { class: 'flag' + (S.pins.has(x.id) ? ' on' : ''), type: 'button', 'aria-pressed': String(S.pins.has(x.id)), onclick: () => togglePin(x.id) }, S.pins.has(x.id) ? '노트에 담김' : '노트에 담기'));
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
function syncComposer(d) {
  if (!S.caseId) return;
  d = d || dOf(S.caseId);
  const coop = playing() === 'coop';
  if (!coop && S.compose === 'chat') S.compose = 'ask';
  if (d.capped && S.compose === 'ask') S.compose = 'guess';
  const mode = S.compose;
  $('#segAsk').setAttribute('aria-pressed', String(mode === 'ask'));
  $('#segChat').setAttribute('aria-pressed', String(mode === 'chat'));
  $('#segGuess').setAttribute('aria-pressed', String(mode === 'guess'));
  $('#segChat').hidden = !coop;
  const ta = $('#draft'); const btn = $('#sendBtn');
  ta.placeholder = mode === 'ask' ? '네 · 아니오로 답할 수 있게 물어 보세요' : mode === 'chat' ? '같은 방 사람들에게 하는 말 · 출제자는 듣지 않아요' : '무슨 일이 있었는지 처음부터 끝까지 설명해 보세요';
  btn.textContent = S.busy ? '보내는 중…' : mode === 'ask' ? '묻기' : mode === 'chat' ? '말하기' : d.capped ? '최종 제출' : '제출';
  let help = mode === 'ask' ? 'Enter로 보내기 · Shift+Enter 줄바꿈 · 반려된 질문은 세지 않아요'
    : mode === 'chat' ? '의논은 문수에 들어가지 않아요. 가설을 맞춰 보고 질문을 고르세요.'
    : d.capped ? `질문이 끝났어요. 최종 답안 한 번만 남았어요 · 틀리면 +${FAIL}문` : `키워드 ${d.need}개와 인과관계를 담아 주세요 · 틀리면 +${WRONG}문`;
  let block = false;
  if (mode !== 'chat' && d.over) { help = '이 사건은 끝났어요. 다른 사건을 골라 보세요.'; block = true; }
  else if (mode !== 'chat' && d.guessing) { help = '제출한 진상을 채점하는 중이에요…'; block = true; }
  ta.disabled = block; btn.disabled = block || S.busy;
  $('#segAsk').disabled = d.capped || !!d.over; $('#segGuess').disabled = !!d.over;
  $('#compHelp').textContent = help;
  $('#compErr').textContent = S.err || '';
}
function autosize() { const ta = $('#draft'); ta.style.height = 'auto'; ta.style.height = Math.min(180, ta.scrollHeight + 2) + 'px'; }
function renderTyping() {
  const t = playing() === 'coop' ? S.peers.filter(p => !p.isMe && p.ty && p.ty === S.caseId && p.m !== 'versus') : [];
  $('#typing').textContent = t.length ? `${t.map(p => who(p.id).name).slice(0, 2).join(', ')}이 적는 중…` : '';
}

/* ---------- 이동 ---------- */
function openCase(pid) {
  if (!S.room) {
    S.lobbyErr = '먼저 방을 만들거나 코드로 들어가 주세요.';
    render(); window.scrollTo({ top: 0, behavior: 'smooth' }); $('#lobbyCode')?.focus();
    return;
  }
  S.view = 'table'; S.caseId = pid; S.spot = null; S.err = ''; S.filter = 'all'; S.compose = 'ask';
  setHash(); track(); render(); window.scrollTo({ top: 0 });
}
function goHome() {
  S.view = 'home'; S.caseId = null; S.err = '';
  setHash(); track(); render(); window.scrollTo({ top: 0 });
}

/* ---------- 시작 ---------- */
function start() {
  $('#brand').addEventListener('click', goHome);
  $('#backBtn').addEventListener('click', goHome);
  $('#nameChip').addEventListener('click', nameSheet);
  $('#roomChip').addEventListener('click', roomSheet);
  $('#segAsk').addEventListener('click', () => { S.compose = 'ask'; syncComposer(); });
  $('#segChat').addEventListener('click', () => { S.compose = 'chat'; syncComposer(); });
  $('#segGuess').addEventListener('click', () => { S.compose = 'guess'; syncComposer(); });
  for (const b of $('#playSeg').querySelectorAll('button')) b.addEventListener('click', () => setPlay(b.dataset.play));
  $('#composer').addEventListener('submit', e => { e.preventDefault(); submitDraft(); });
  const ta = $('#draft');
  ta.addEventListener('input', () => { autosize(); if (ta.value.trim()) setTyping(true); });
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submitDraft(); } });
  setInterval(() => { if (S.view === 'table' && !$('#sheetRoot').childElementCount) render(); }, 30000);
  setInterval(() => { if (S.room) pollBot(); }, 20000);
  render();

  const [hRoom, hCase] = (location.hash || '').slice(1).toLowerCase().split('/');
  const target = /^[a-z0-9]{4}$/.test(hRoom || '') ? hRoom : lsGet('soup.room', null);
  if (target) joinRoom(target, true).then(ok => { if (ok && hCase && P[hCase]) openCase(hCase); });
}
start();
