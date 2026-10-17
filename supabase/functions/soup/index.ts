// 바다거북 수프 식탁 — 서버 함수 하나로 방 만들기, 질문 판정, 진상 채점, 단서 공개를 처리한다.
// 화면은 soup_events를 읽기만 하고, 쓰기는 모두 여기서 service role로 한다.
// 문제(진상 포함)는 soup_secrets 표에 있고, tools/seed.mjs 가 "seed" 동작으로 넣는다.
// 판정 순서: ANTHROPIC_API_KEY 가 있으면 Claude API, 아니면 Gemini 무료 키(soup_keys 표의 gemini 또는 GEMINI_API_KEY),
// 둘 다 없거나 Gemini가 한도에 걸리면 질문을 대기로 두고 방장 PC의 출제자 봇(tools/host-bot.mjs)이
// claude -p 로 판정해 "bot_done"으로 올린다.
// 선택 비밀 값: ANTHROPIC_API_KEY, SOUP_MODEL, SOUP_DAILY_LIMIT, GEMINI_API_KEY, GEMINI_MODELS
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";
import { CALIB_MIN, STALE_MS, calibrate, derive, similarOf } from "./rules.js";
import { cleanGrade, cleanJudge, cleanReview, gradeSchema, gradeSystem, gradeUser, judgeSchema, judgeSystem, judgeUser, metaOf, reviewSchema, reviewSystem, reviewUser } from "./judge.js";

// deno-lint-ignore no-explicit-any
type Row = Record<string, any>;

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});
const API_KEY = Deno.env.get("ANTHROPIC_API_KEY") || "";
const GEMINI_ENV = Deno.env.get("GEMINI_API_KEY") || "";
const GEMINI_MODELS = (Deno.env.get("GEMINI_MODELS") || "gemini-flash-lite-latest,gemini-3.1-flash-lite").split(",").map((m) => m.trim()).filter(Boolean);
const MODEL = Deno.env.get("SOUP_MODEL") || "claude-opus-5-5";
const DAILY = Number(Deno.env.get("SOUP_DAILY_LIMIT") || "2000");
const FALLBACK_OK = ["claude-opus-5-5", "claude-opus-5", "claude-sonnet-5-5", "claude-fable-5-1"];
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const CODE_RE = /^[a-z0-9]{4}$/;
const PLAYER_RE = /^[A-Za-z0-9-]{8,64}$/;

class Fail extends Error {
  constructor(public code: string) { super(code); }
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const now = () => new Date().toISOString();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  try {
    return json(await handle(await req.json()));
  } catch (e) {
    if (e instanceof Fail) return json({ error: e.code }, 400);
    console.error("soup:", e);
    return json({ error: "server" }, 500);
  }
});

async function handle(b: Row) {
  switch (b.action) {
    case "create": return create(b);
    case "join": { const r = await room(b.code); return { code: r.code, host: r.host, judge: await judgeMode() }; }
    case "ask": return ask(b);
    case "guess": return guess(b);
    case "retry": return retry(b);
    case "appeal": return appeal(b);
    case "clue": case "end": case "giveup": return simple(b);
    case "chat": return chat(b);
    case "like": return like(b);
    case "rate": return rate(b);
    case "custom_list": return customList(b);
    case "custom_publish": return customPublish(b);
    case "custom_hide": return customHide(b);
    case "custom_rate": return customRate(b);
    case "custom_review": return customReview(b);
    case "custom_report": return customReport(b);
    case "custom_get": return customGet(b);
    case "rules": return setRules(b);
    case "skip": return skipTurn(b);
    case "proposal": return decideProposal(b);
    case "case_stats": return caseStats();
    case "reveal": return reveal(b);
    case "clear": return clear(b);
    case "seed": return seed(b);
    case "upload": return upload(b);
    case "bot_ping": return botPing(b);
    case "bot_done": return botDone(b);
    default: throw new Fail("bad_action");
  }
}

/* ---------- 문제 데이터 · 관리자 ---------- */
const puzzles = new Map<string, Row>();
async function puzzleOf(pid: string) {
  if (puzzles.has(pid)) return puzzles.get(pid)!;
  const { data, error } = await db.from("soup_secrets").select("data").eq("puzzle", pid).maybeSingle();
  if (error) throw error;
  if (!data || data.data?.stats) throw new Fail("bad_puzzle");
  const s = data.data as Row;
  s.meta = metaOf(s);
  puzzles.set(pid, s);
  return s;
}
async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (x) => x.toString(16).padStart(2, "0")).join("");
}
async function admin(token: unknown) {
  // 관리자 토큰의 해시는 soup_admin 표에만 있다 (화면에서 읽을 수 없음)
  const { data } = await db.from("soup_admin").select("token_hash").eq("id", 1).maybeSingle();
  if (!data?.token_hash || typeof token !== "string" || (await sha256(token)) !== data.token_hash) throw new Fail("forbidden");
}
async function seed(b: Row) {
  await admin(b.token);
  const rows = Object.entries(b.puzzles || {}).map(([puzzle, data]) => ({ puzzle, data }));
  if (!rows.length) throw new Fail("empty");
  const { error } = await db.from("soup_secrets").upsert(rows);
  if (error) throw error;
  puzzles.clear();
  return { ok: true, count: rows.length };
}

// 단서 사진 올리기 (tools/art.mjs). 무작위 이름이라 단서가 열리기 전까지 주소를 알 수 없다.
async function upload(b: Row) {
  await admin(b.token);
  const name = str(b.name, 80);
  if (!/^[a-f0-9]{32}[.]jpg$/.test(name) || typeof b.b64 !== "string") throw new Fail("bad_upload");
  const bytes = Uint8Array.from(atob(b.b64), (c) => c.charCodeAt(0));
  const { error } = await db.storage.from("soup-art").upload(name, bytes, { contentType: "image/jpeg", upsert: false });
  if (error) throw error;
  return { url: db.storage.from("soup-art").getPublicUrl(name).data.publicUrl };
}

/* ---------- 판정 방식 ---------- */
let gem = { key: GEMINI_ENV, at: 0 };
async function geminiKey() {
  if (GEMINI_ENV) return GEMINI_ENV;
  if (Date.now() - gem.at < 300000) return gem.key;
  const { data } = await db.from("soup_keys").select("value").eq("name", "gemini").maybeSingle();
  gem = { key: (data?.value as string) || "", at: Date.now() };
  return gem.key;
}
async function judgeMode() {
  if (API_KEY) return "api";
  if (await geminiKey()) return "gemini";
  return "bot";
}

/* ---------- 공통 ---------- */
function who(b: Row) {
  const player = str(b.player, 64);
  if (!PLAYER_RE.test(player)) throw new Fail("bad_player");
  return { player, name: str(b.name, 20) || "손님" };
}
async function ctx(b: Row) {
  const w = who(b);
  const pid = str(b.puzzle, 40);
  const s = await puzzleOf(pid);
  const scope = b.scope === "coop" ? "coop" : w.player; // 경쟁전은 자기 기록만
  return { ...w, pid, s, scope };
}
async function room(code: unknown) {
  const c = String(code ?? "").toLowerCase();
  if (!CODE_RE.test(c)) throw new Fail("bad_code");
  const { data, error } = await db.from("soup_rooms").select("code,host").eq("code", c).maybeSingle();
  if (error) throw error;
  if (!data) throw new Fail("no_room");
  return data as Row;
}
async function eventsOf(code: string, pid: string, scope: string) {
  const { data, error } = await db.from("soup_events").select("*")
    .eq("room", code).eq("puzzle", pid).eq("scope", scope).order("id").limit(3000);
  if (error) throw error;
  return (data || []) as Row[];
}
async function eventById(id: unknown, code?: string) {
  let q = db.from("soup_events").select("*").eq("id", Number(id));
  if (code) q = q.eq("room", code);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  if (!data) throw new Fail("no_event");
  return data as Row;
}
async function budget() {
  if (!API_KEY) return; // PC 봇은 방장 구독으로 판정하므로 여기서 세지 않는다
  const { data, error } = await db.rpc("soup_bump", { lim: DAILY });
  if (error) throw error;
  if (data !== true) throw new Fail("daily_limit");
}
async function insert(row: Row) {
  const { data, error } = await db.from("soup_events").insert(row).select("id").single();
  if (error) throw error;
  return (data as Row).id as number;
}
async function patch(id: number, row: Row) {
  const { error } = await db.from("soup_events").update({ ...row, updated_at: now() }).eq("id", id);
  if (error) console.error("soup patch:", error);
}
// Claude API나 Gemini가 있으면 여기서 판정하고, 없으면 대기로 두어 PC 봇이 가져가게 한다
async function judgeLater(p: () => Promise<unknown>) {
  if ((await judgeMode()) === "bot") return;
  // deno-lint-ignore no-explicit-any
  const rt = (globalThis as any).EdgeRuntime;
  const job = p();
  if (rt?.waitUntil) rt.waitUntil(job);
  else job.catch((e) => console.error("soup bg:", e));
}

/* ---------- 방 ---------- */
async function create(b: Row) {
  const { player } = who(b);
  const abc = "abcdefghjkmnpqrstuvwxyz23456789";
  for (let k = 0; k < 8; k++) {
    const code = Array.from(crypto.getRandomValues(new Uint8Array(4)), (x) => abc[x % abc.length]).join("");
    const { error } = await db.from("soup_rooms").insert({ code, host: player });
    if (!error) return { code, host: player };
    if (error.code !== "23505") throw error;
  }
  throw new Fail("busy");
}
async function clear(b: Row) {
  const c = await ctx(b);
  const r = await room(b.code);
  if (c.scope === "coop" && r.host !== c.player) throw new Fail("not_host");
  const { error } = await db.from("soup_events").delete().eq("room", r.code).eq("puzzle", c.pid).eq("scope", c.scope);
  if (error) throw error;
  return { ok: true };
}

/* ---------- 질문 ---------- */
async function ask(b: Row) {
  const c = await ctx(b);
  const r = await room(b.code);
  const text = str(b.text, 300);
  if (!text) throw new Fail("empty");
  const list = await eventsOf(r.code, c.pid, c.scope);
  const d = derive(c.s.meta, list);
  if (d.over) throw new Fail("over");
  if (d.capped) throw new Fail("capped");
  myTurn(d, c.player);
  const pending = list.filter((e) => e.player === c.player && e.status === "pending" && Date.now() - Date.parse(e.updated_at) < STALE_MS);
  if (pending.length >= 3) throw new Fail("too_many");
  const first = !list.some((e) => e.kind === "q");
  // 이미 판정이 난 질문과 거의 같으면 AI에 묻지 않고 같은 판정을 돌려준다 (1문은 쓴다)
  const same = similarOf(d.L, text);
  if (same) {
    const id = await insert({ room: r.code, puzzle: c.pid, scope: c.scope, player: c.player, name: c.name, kind: "q", body: text, status: "done", answer: same.answer, note: "cache", facts: [], hot: false });
    if (first) await customBump(c.pid, "plays");
    return { id, cached: same.id };
  }
  await budget();
  const id = await insert({ room: r.code, puzzle: c.pid, scope: c.scope, player: c.player, name: c.name, kind: "q", body: text, status: "pending" });
  if (first) await customBump(c.pid, "plays");
  await judgeLater(() => judgeAndSave(id, null));
  return { id };
}
async function retry(b: Row) {
  const { player } = who(b);
  const r = await room(b.code);
  const e = await eventById(b.id, r.code);
  const stale = e.status === "pending" && (Date.now() - Date.parse(e.updated_at) > STALE_MS || !!e.err);
  if (!(e.status === "error" || stale) || (e.kind !== "q" && e.kind !== "guess")) throw new Fail("not_retryable");
  if (e.note === "proposal" || e.err === "rejected" || e.err === "withdrawn") throw new Fail("not_retryable");
  if (e.scope !== "coop" && e.scope !== player) throw new Fail("not_yours");
  await budget();
  await patch(e.id, { status: "pending", err: null });
  await judgeLater(() => (e.kind === "q" ? judgeAndSave(e.id, null) : gradeAndSave(e.id)));
  return { id: e.id };
}
async function appeal(b: Row) {
  const { player } = who(b);
  const r = await room(b.code);
  const e = await eventById(b.id, r.code);
  // 질문마다 한 번 (검토가 실패했으면 다시). 끝난 사건도 받되 결과는 바꾸지 않는다 (saveJudge)
  if (e.kind !== "q" || e.status !== "done" || e.answer === "반려" || (e.appeal && e.appeal !== "error")) throw new Fail("not_appealable");
  if (e.scope !== "coop" && e.scope !== player) throw new Fail("not_yours");
  await budget();
  await patch(e.id, { appeal: "pending", prev: e.answer });
  await judgeLater(() => judgeAndSave(e.id, e.answer));
  return { id: e.id };
}
// 판정 결과(모델 답)를 기록에 넣는다. API와 PC 봇이 함께 쓴다.
async function saveJudge(e: Row, out: unknown, appealing: boolean) {
  const s = await puzzleOf(e.puzzle);
  const d = derive(s.meta, (await eventsOf(e.room, e.puzzle, e.scope)).filter((x) => x.id !== e.id));
  const row: Row = { status: "done", ...cleanJudge(s, d, out), err: null };
  if (appealing) {
    // 끝난 사건의 이의: 판정 · 키워드 · 문수는 그대로 두고, 다시 내린 판정만 prev 에 적는다 (appeal "late")
    if (d.over) {
      await patchIfWaiting(e.id, { appeal: "late", prev: row.answer, err: null }, "appeal");
      if (row.answer !== e.answer) await customFix(e, e.answer, row.answer, true);
      return;
    }
    row.appeal = "done";
    if (row.answer !== e.answer) await customFix(e, e.answer, row.answer, false);
  }
  await patchIfWaiting(e.id, row, appealing ? "appeal" : "status");
}
// 창작 사건: 이의로 판정이 바뀐 질문을 만든 사람의 "받은 후기"에 모은다 (판정 메모를 보강하라고)
async function customFix(e: Row, was: string, now_: string, late: boolean) {
  if (!CUSTOM_RE.test(e.puzzle)) return;
  try {
    const s = await customRow(e.puzzle);
    s.fixes = [...(s.fixes || []), { q: str(e.body, 160), was, now: now_, late, at: now() }].slice(-50);
    await customSave(e.puzzle, s);
  } catch (err) { console.error("custom fix:", err); }
}
async function saveGrade(e: Row, out: unknown) {
  const s = await puzzleOf(e.puzzle);
  const g = cleanGrade(s, out);
  await patchIfWaiting(e.id, { status: "done", ...g, err: null }, "status");
  if (!g.ok) return;
  try {
    const d = derive(s.meta, await eventsOf(e.room, e.puzzle, e.scope));
    await recordSolve(e.puzzle, d.total);
    if (e.scope !== "coop") await giftClues(e, s);
  } catch (err) { console.error("solve after:", err); }
}
async function patchIfWaiting(id: number, row: Row, field: string) {
  const { error } = await db.from("soup_events").update({ ...row, updated_at: now() }).eq("id", id).eq(field, "pending");
  if (error) console.error("soup patch:", error);
}
// 판정 실패: 무료 AI가 바쁘면 대기로 남겨 PC 봇이나 다시 묻기가 받게 하고, 그 밖엔 실패로 표시한다
async function failJudge(id: number, err: unknown, appealing: boolean) {
  const code = errCode(err);
  console.error("soup judge:", code, err);
  if (code === "gemini_busy" && !appealing) await patch(id, { err: code });
  else await patch(id, appealing ? { appeal: "error", err: code } : { status: "error", err: code });
}
async function judgeAndSave(id: number, appealFrom: string | null) {
  try {
    const e = await eventById(id);
    const s = await puzzleOf(e.puzzle);
    const d = derive(s.meta, (await eventsOf(e.room, e.puzzle, e.scope)).filter((x) => x.id !== id));
    const out = await callModel(judgeSystem(s), judgeUser(d, e.body, appealFrom), judgeSchema(s), appealFrom ? "high" : "low");
    await saveJudge(e, out, !!appealFrom);
  } catch (err) {
    await failJudge(id, err, !!appealFrom);
  }
}

/* ---------- 진상 제출 ---------- */
async function guess(b: Row) {
  const c = await ctx(b);
  const r = await room(b.code);
  const text = str(b.text, 1200);
  if (!text) throw new Fail("empty");
  const d = derive(c.s.meta, await eventsOf(r.code, c.pid, c.scope));
  if (d.over) throw new Fail("over");
  if (d.guessing) throw new Fail("guessing");
  if (d.proposal) throw new Fail("proposal_open");
  myTurn(d, c.player);
  // 함께 풀기 · 방장 승인: 방장이 아닌 사람의 제출은 제안으로 남고, 방장이 승인해야 채점한다
  if (c.scope === "coop" && d.rules.approve && r.host !== c.player) {
    const id = await insert({ room: r.code, puzzle: c.pid, scope: c.scope, player: c.player, name: c.name, kind: "guess", body: text, status: "pending", note: "proposal", final: d.capped });
    return { id, proposal: true };
  }
  await budget();
  const id = await insert({ room: r.code, puzzle: c.pid, scope: c.scope, player: c.player, name: c.name, kind: "guess", body: text, status: "pending", final: d.capped });
  await judgeLater(() => gradeAndSave(id));
  return { id };
}
async function gradeAndSave(id: number) {
  try {
    const e = await eventById(id);
    const s = await puzzleOf(e.puzzle);
    await saveGrade(e, await callModel(gradeSystem(s), gradeUser(e.body), gradeSchema(s), "medium"));
  } catch (err) {
    await failJudge(id, err, false);
  }
}

/* ---------- PC 출제자 봇 ---------- */
async function botPing(b: Row) {
  await admin(b.token);
  const { error } = await db.from("soup_status").upsert({ id: 1, bot_seen: b.off ? null : now() });
  if (error) throw error;
  return { ok: true, judge: await judgeMode() };
}
async function botDone(b: Row) {
  await admin(b.token);
  const e = await eventById(b.id);
  const mode = b.mode;
  const waiting = mode === "appeal" ? e.appeal === "pending" : e.status === "pending";
  if (!waiting) return { skipped: true };
  if (b.error) {
    await patch(e.id, mode === "appeal" ? { appeal: "error", err: str(b.error, 40) } : { status: "error", err: str(b.error, 40) });
    return { ok: true };
  }
  if (mode === "grade" && e.kind === "guess") await saveGrade(e, b.result);
  else if ((mode === "judge" || mode === "appeal") && e.kind === "q") await saveJudge(e, b.result, mode === "appeal");
  else throw new Fail("bad_mode");
  return { ok: true };
}

/* ---------- 단서 · 끝내기 · 포기 · 의논 ---------- */
async function simple(b: Row) {
  const c = await ctx(b);
  const r = await room(b.code);
  const d = derive(c.s.meta, await eventsOf(r.code, c.pid, c.scope));
  if (d.over) throw new Fail("over");
  if (c.scope === "coop" && (d.rules.turns || d.rules.approve) && r.host !== c.player) throw new Fail("host_only");
  const row: Row = { room: r.code, puzzle: c.pid, scope: c.scope, player: c.player, name: c.name, kind: b.action };
  if (b.action === "clue") {
    if (!d.nextClue) throw new Fail("no_clue");
    row.clue_i = d.nextClue.i;
  }
  if (b.action === "end" && d.capped) throw new Fail("capped");
  return { id: await insert(row) };
}
async function chat(b: Row) {
  const c = await ctx({ ...b, scope: "coop" });
  const r = await room(b.code);
  const text = str(b.text, 300);
  if (!text) throw new Fail("empty");
  return { id: await insert({ room: r.code, puzzle: c.pid, scope: "coop", player: c.player, name: c.name, kind: "chat", body: text }) };
}

/* ---------- 함께 풀기 규칙: 차례제 · 방장 승인 ---------- */
// 차례제가 켜져 있으면 내 차례에만 질문 · 제출할 수 있다
function myTurn(d: Row, player: string) {
  if (!d.turn) return;
  if (!d.rules.order.includes(player)) throw new Fail("not_in_order");
  if (d.turn !== player) throw new Fail("not_your_turn");
}
async function hostCtx(b: Row) {
  const c = await ctx({ ...b, scope: "coop" });
  const r = await room(b.code);
  if (r.host !== c.player) throw new Fail("not_host");
  return { c, r };
}
// 규칙 바꾸기 (방장): 차례제 켜고 끄기, 방장 승인 켜고 끄기, 차례 순서
async function setRules(b: Row) {
  const { c, r } = await hostCtx(b);
  const order = [...new Set((Array.isArray(b.order) ? b.order : []).map((x: unknown) => str(x, 64)).filter((x: string) => PLAYER_RE.test(x)))].slice(0, 12);
  if (b.turns && !order.length) throw new Fail("bad_rules");
  const body = JSON.stringify({ turns: !!b.turns, approve: !!b.approve, order: b.turns ? order : [] });
  return { id: await insert({ room: r.code, puzzle: c.pid, scope: "coop", player: c.player, name: c.name, kind: "chat", note: "rules", body }) };
}
// 자리를 비운 사람의 차례 넘기기 (방장)
async function skipTurn(b: Row) {
  const { c, r } = await hostCtx(b);
  const d = derive(c.s.meta, await eventsOf(r.code, c.pid, "coop"));
  if (!d.turn) throw new Fail("no_turn");
  return { id: await insert({ room: r.code, puzzle: c.pid, scope: "coop", player: c.player, name: c.name, kind: "chat", note: "skip", body: d.turn }) };
}
// 정답 제안: 방장이 승인하면 채점, 반려하면 끝. 제안한 사람은 거둘 수 있다
async function decideProposal(b: Row) {
  const { player } = who(b);
  const r = await room(b.code);
  const e = await eventById(b.id, r.code);
  if (e.kind !== "guess" || e.note !== "proposal" || e.status !== "pending") throw new Fail("not_proposal");
  const host = r.host === player;
  if (b.ok) {
    if (!host) throw new Fail("not_host");
    const s = await puzzleOf(e.puzzle);
    const d = derive(s.meta, await eventsOf(r.code, e.puzzle, e.scope));
    if (d.over) throw new Fail("over");
    if (d.guessing) throw new Fail("guessing");
    await budget();
    await patch(e.id, { note: "approved" });
    await judgeLater(() => gradeAndSave(e.id));
    return { ok: true };
  }
  if (!host && e.player !== player) throw new Fail("not_host");
  await patch(e.id, { status: "error", err: host && e.player !== player ? "rejected" : "withdrawn" });
  return { ok: false };
}

/* ---------- 끝난 뒤의 반응 ---------- */
// 질문 추천: 한 사람이 한 질문에 한 번, 다시 누르면 취소
async function like(b: Row) {
  const { player, name } = who(b);
  const r = await room(b.code);
  const t = await eventById(b.id, r.code);
  if (t.kind !== "q" || t.status !== "done" || t.answer === "반려") throw new Fail("bad_target");
  const { data: mine, error } = await db.from("soup_events").select("id")
    .eq("room", r.code).eq("puzzle", t.puzzle).eq("kind", "like").eq("player", player).eq("body", String(t.id)).limit(1);
  if (error) throw error;
  if (mine?.length) {
    const { error: e2 } = await db.from("soup_events").delete().eq("id", mine[0].id);
    if (e2) throw e2;
    return { on: false };
  }
  await insert({ room: r.code, puzzle: t.puzzle, scope: t.scope, player, name, kind: "like", body: String(t.id) });
  return { on: true };
}
// 체감 난이도: 사건마다 한 사람에 하나, 바꾸면 새로 적는다
async function rate(b: Row) {
  const { player, name } = who(b);
  const r = await room(b.code);
  const pid = str(b.puzzle, 40);
  await puzzleOf(pid);
  if (!["easy", "ok", "hard"].includes(b.value)) throw new Fail("bad_rate");
  const { error } = await db.from("soup_events").delete().eq("room", r.code).eq("puzzle", pid).eq("kind", "rate").eq("player", player);
  if (error) throw error;
  return { id: await insert({ room: r.code, puzzle: pid, scope: "coop", player, name, kind: "rate", body: b.value }) };
}

/* ---------- 창작마당 ---------- */
// 사람들이 만든 사건은 soup_secrets 에 id "u-xxxxxx" 로 들어간다 (data.custom = true).
// 진상 · 키워드 문장 · 단서는 그대로 비밀이고, custom_list 는 공개 정보(제목 · 이야기 · 키워드 칸 수 · 별점 · 플레이 수)만 내보낸다.
const CUSTOM_RE = /^u-[a-z0-9]{6}$/;
const NEED_RANGE: Record<number, [number, number]> = { 1: [2, 4], 2: [3, 5], 3: [4, 6] };
const REPORT_LIMIT = 3; // 신고가 이만큼 쌓이면 공개를 멈추고 검토로 돌린다
const REPORT_WHY = ["copy", "unfit", "judge", "broken"];
function publicCard(id: string, s: Row, player = "") {
  const r = Object.values(s.ratings || {}) as number[];
  const j = Object.values(s.judge || {}) as number[];
  const mine = !!player && s.author === player;
  return {
    id, title: s.title, story: s.story, level: s.level, tags: s.tags || [], author_name: s.author_name, mine,
    status: s.status, facts: (s.facts || []).map((f: Row) => ({ id: f.id, need: f.need })), clues: (s.clues || []).length,
    plays: s.plays || 0, solves: s.solves || 0, rating_n: r.length, rating_sum: r.reduce((a, x) => a + x, 0),
    judge_n: j.length, judge_sum: j.reduce((a, x) => a + x, 0), has_memo: !!s.memo,
    my_rating: player ? s.ratings?.[player] || 0 : 0, my_judge: player ? s.judge?.[player] || 0 : 0,
    my_note: player ? s.notes?.[player]?.t || "" : "", my_report: player ? s.reports?.[player] || "" : "",
    created_at: s.created_at, updated_at: s.updated_at || "", rev: s.rev || 1,
    short: !!s.short, cuts: calibrate(s.totals), calib_n: (s.totals || []).length,
    // 한 줄 후기와 신고 사유는 만든 사람에게만 (손질할 곳을 찾으라고)
    ...(mine ? {
      notes: Object.values(s.notes || {}).sort((a: Row, b: Row) => String(b.at).localeCompare(String(a.at))).slice(0, 50),
      reports: Object.values(s.reports || {}).reduce((m: Row, w) => ({ ...m, [w as string]: (m[w as string] || 0) + 1 }), {}),
      fixes: [...(s.fixes || [])].reverse().slice(0, 30),
    } : {}),
  };
}
async function customList(b: Row) {
  const player = typeof b.player === "string" && PLAYER_RE.test(b.player) ? b.player : "";
  const { data, error } = await db.from("soup_secrets").select("puzzle,data").like("puzzle", "u-%").limit(2000);
  if (error) throw error;
  const items = (data || []).filter((r: Row) => r.data?.custom && (r.data.status === "public" || r.data.author === player))
    .map((r: Row) => publicCard(r.puzzle, r.data, player));
  return { items };
}
const need = (v: unknown, min: number, max: number, code: string) => {
  const s = str(v, max);
  if ([...s].length < min) throw new Fail(code);
  return s;
};
function readDraft(b: Row) {
  const level = [1, 2, 3].includes(Number(b.level)) ? Number(b.level) : 2;
  const title = need(b.title, 2, 30, "bad_title");
  const story = need(b.story, 20, 400, "bad_story");
  const truth = need(b.truth, 80, 2000, "bad_truth");
  const raw = (Array.isArray(b.facts) ? b.facts : []).slice(0, 8) as Row[];
  const req = raw.filter((f) => f?.need !== false).map((f) => ({ label: need(f.label, 5, 60, "bad_fact"), check: str(f.check, 200) }));
  const bon = raw.filter((f) => f?.need === false).slice(0, 2).map((f) => ({ label: need(f.label, 5, 60, "bad_fact"), check: str(f.check, 200) }));
  const [lo, hi] = NEED_RANGE[level];
  if (req.length < lo || req.length > hi) throw new Fail("bad_fact_count");
  const facts = [
    ...req.map((f, i) => ({ id: "f" + (i + 1), need: true, label: f.label, check: f.check || f.label })),
    ...bon.map((f, i) => ({ id: "b" + (i + 1), need: false, label: f.label, check: f.check || f.label })),
  ];
  const clues = (Array.isArray(b.clues) ? b.clues : []).map((c: unknown) => str(c, 160)).filter(Boolean).slice(0, 3).map((text: string) => ({ text }));
  const canon = (Array.isArray(b.canon) ? b.canon : []).slice(0, 20)
    .filter((x: unknown) => Array.isArray(x) && x.length === 2)
    .map(([q, a]: unknown[]) => [str(q, 120), str(a, 80)])
    .filter(([q, a]: string[]) => q && /^(네|아니오|관계없음|애매함)/.test(a));
  const tags = (Array.isArray(b.tags) ? b.tags : []).map((t: unknown) => str(t, 12)).filter(Boolean).slice(0, 4);
  // 판정 메모: 판정관만 보는 사실 정리 ("아닌 것", 헷갈리는 말의 뜻, 정답에 필요 없는 세부)
  const memo = str(b.memo, 800);
  return { level, title, story, truth, facts, clues, canon, tags, memo, short: !!b.short };
}
async function customRow(id: string) {
  if (!CUSTOM_RE.test(id)) throw new Fail("bad_puzzle");
  const { data, error } = await db.from("soup_secrets").select("data").eq("puzzle", id).maybeSingle();
  if (error) throw error;
  if (!data?.data?.custom) throw new Fail("bad_puzzle");
  return data.data as Row;
}
async function customSave(id: string, s: Row) {
  delete s.meta;
  const { error } = await db.from("soup_secrets").update({ data: s }).eq("puzzle", id);
  if (error) throw error;
  puzzles.delete(id);
}
async function customPublish(b: Row) {
  const { player, name } = who(b);
  const draft = readDraft(b);
  // 고쳐 올리기: 같은 id 를 그대로 두고 내용만 바꾼다 (별점 · 플레이 수 · 후기는 남는다)
  if (b.edit !== undefined) {
    const id = str(b.edit, 40);
    const s = await customRow(id);
    if (s.author !== player) throw new Fail("not_yours");
    const next = { ...s, ...draft, author_name: name, updated_at: now(), rev: (s.rev || 1) + 1 };
    await customSave(id, next);
    return { id, card: publicCard(id, next, player) };
  }
  const { data: rows, error } = await db.from("soup_secrets").select("data").like("puzzle", "u-%").limit(2000);
  if (error) throw error;
  const day = Date.now() - 86400000;
  if ((rows || []).filter((r: Row) => r.data?.author === player && Date.parse(r.data.created_at) > day).length >= 5) throw new Fail("custom_limit");
  const abc = "abcdefghjkmnpqrstuvwxyz23456789";
  for (let k = 0; k < 8; k++) {
    const id = "u-" + Array.from(crypto.getRandomValues(new Uint8Array(6)), (x) => abc[x % abc.length]).join("");
    const data = { custom: true, status: "public", author: player, author_name: name, created_at: now(), sceneNote: "", spots: [], plays: 0, solves: 0, ratings: {}, ...draft };
    const { error: e2 } = await db.from("soup_secrets").insert({ puzzle: id, data });
    if (!e2) return { id, card: publicCard(id, data, player) };
    if (e2.code !== "23505") throw e2;
  }
  throw new Fail("busy");
}
async function customHide(b: Row) {
  const { player } = who(b);
  const id = str(b.puzzle, 40);
  const s = await customRow(id);
  if (s.author !== player) throw new Fail("not_yours");
  if (s.status === "review" && !b.hide) throw new Fail("under_review");
  s.status = b.hide ? (s.status === "review" ? "review" : "hidden") : "public";
  s.updated_at = now();
  await customSave(id, s);
  return { card: publicCard(id, s, player) };
}
// 만든 사람이 고치려고 자기 사건 원고를 불러온다
async function customGet(b: Row) {
  const { player } = who(b);
  const id = str(b.puzzle, 40);
  const s = await customRow(id);
  if (s.author !== player) throw new Fail("not_yours");
  return {
    draft: {
      title: s.title, level: s.level, short: !!s.short, story: s.story, truth: s.truth, memo: s.memo || "", canon: s.canon || [],
      facts: (s.facts || []).map((f: Row) => ({ label: f.label, check: f.check === f.label ? "" : f.check, need: f.need })),
      clues: (s.clues || []).map((c: Row) => c.text || ""),
    },
  };
}
// 풀어 본 사람만 (만든 사람은 빼고) 평가 · 신고할 수 있다
async function playedBy(id: string, s: Row, player: string) {
  if (s.author === player) throw new Fail("own_puzzle");
  const { count, error } = await db.from("soup_events").select("id", { count: "exact", head: true })
    .eq("puzzle", id).eq("player", player).in("kind", ["q", "guess", "giveup"]);
  if (error) throw error;
  if (!count) throw new Fail("not_played");
}
const starOf = (v: unknown) => {
  if (v === undefined || v === null) return null;
  const n = Math.round(Number(v));
  if (!(n >= 1 && n <= 5)) throw new Fail("bad_rate");
  return n;
};
// 이야기 별점(stars) · 판정 만족(judge) · 한 줄 후기(note, 만든 사람만 봄) — 보낸 것만 바꾼다
async function customRate(b: Row) {
  const { player, name } = who(b);
  const id = str(b.puzzle, 40);
  const s = await customRow(id);
  const stars = starOf(b.stars), judge = starOf(b.judge);
  const note = b.note === undefined ? null : str(b.note, 200);
  if (stars === null && judge === null && note === null) throw new Fail("bad_rate");
  await playedBy(id, s, player);
  if (stars !== null) s.ratings = { ...(s.ratings || {}), [player]: stars };
  if (judge !== null) s.judge = { ...(s.judge || {}), [player]: judge };
  if (note !== null) {
    const notes = { ...(s.notes || {}) };
    if (note) notes[player] = { t: note, name, at: now(), stars: s.ratings?.[player] || 0, judge: s.judge?.[player] || 0 };
    else delete notes[player];
    s.notes = notes;
  }
  await customSave(id, s);
  return { card: publicCard(id, s, player) };
}
// 신고: 사유 하나, 다시 보내면 바뀐다. 쌓이면 공개를 멈춘다
async function customReport(b: Row) {
  const { player } = who(b);
  const id = str(b.puzzle, 40);
  const s = await customRow(id);
  const why = str(b.why, 10);
  if (why && !REPORT_WHY.includes(why)) throw new Fail("bad_reason");
  await playedBy(id, s, player);
  const reports = { ...(s.reports || {}) };
  if (why) reports[player] = why; else delete reports[player];
  s.reports = reports;
  if (s.status === "public" && Object.keys(reports).length >= REPORT_LIMIT) { s.status = "review"; s.review_at = now(); }
  await customSave(id, s);
  return { card: publicCard(id, s, player) };
}
// 해결한 판의 최종 문수를 모아 등급 기준을 맞춘다. 창작 사건은 data.totals, 기본 사건은 "stats-<id>" 행
async function recordSolve(pid: string, total: number) {
  if (CUSTOM_RE.test(pid)) {
    const s = await customRow(pid);
    s.solves = (s.solves || 0) + 1;
    s.totals = [...(s.totals || []), total].slice(-300);
    await customSave(pid, s);
    return;
  }
  const key = "stats-" + pid;
  const { data, error } = await db.from("soup_secrets").select("data").eq("puzzle", key).maybeSingle();
  if (error) throw error;
  const totals = [...((data?.data?.totals as number[]) || []), total].slice(-300);
  const { error: e2 } = await db.from("soup_secrets").upsert({ puzzle: key, data: { stats: true, totals } });
  if (e2) throw e2;
}
// 기본 사건의 맞춘 등급 기준 (풀이가 충분히 쌓인 것만)
async function caseStats() {
  const { data, error } = await db.from("soup_secrets").select("puzzle,data").like("puzzle", "stats-%").limit(500);
  if (error) throw error;
  const cuts: Row = {}, n: Row = {};
  for (const r of data || []) {
    const pid = String(r.puzzle).slice(6), t = (r.data?.totals as number[]) || [];
    n[pid] = t.length;
    const c = calibrate(t);
    if (c) cuts[pid] = c;
  }
  return { cuts, n, min: CALIB_MIN };
}
// 따로 풀기: 이 사건을 방에서 처음 푼 사람이 나오면, 아직 푸는 다른 수사관에게 다음 단서를 한 장씩 열어 준다
async function giftClues(e: Row, s: Row) {
  const { data: rows, error } = await db.from("soup_events").select("*").eq("room", e.room).eq("puzzle", e.puzzle).neq("scope", "coop").order("id").limit(5000);
  if (error) throw error;
  const all = (rows || []) as Row[];
  if (all.some((x) => x.kind === "guess" && x.ok && x.id !== e.id)) return;   // 이미 먼저 푼 사람이 있다
  const by = new Map<string, Row[]>();
  for (const x of all) { if (!by.has(x.scope)) by.set(x.scope, []); by.get(x.scope)!.push(x); }
  for (const [scope, list] of by) {
    if (scope === e.scope) continue;
    const d = derive(s.meta, list);
    if (d.over || !d.nextClue) continue;
    await insert({ room: e.room, puzzle: e.puzzle, scope, player: e.player, name: e.name, kind: "clue", note: "gift", clue_i: d.nextClue.i });
  }
}
// 플레이 수(그 방·그 범위에서 첫 질문) · 해결 수(첫 정답)
async function customBump(id: string, what: "plays" | "solves") {
  if (!CUSTOM_RE.test(id)) return;
  try {
    const s = await customRow(id);
    s[what] = (s[what] || 0) + 1;
    await customSave(id, s);
  } catch (e) { console.error("custom bump:", e); }
}
// AI 검수: 반전 · 공정성 · 키워드 겹침을 보고, 출제자 메모(자주 나올 질문의 판정)와 채점 기준을 만들어 준다
async function customReview(b: Row) {
  who(b);
  const draft = readDraft(b);
  const out = await callModel(reviewSystem(), reviewUser(draft), reviewSchema(draft), "medium");
  return cleanReview(draft, out);
}

/* ---------- 공개된 것 ---------- */
async function reveal(b: Row) {
  const r = await room(b.code);
  const pid = str(b.puzzle, 40);
  const s = await puzzleOf(pid);
  const scope = b.scope === "coop" ? "coop" : str(b.scope, 64);
  const d = derive(s.meta, await eventsOf(r.code, pid, scope));
  const facts: Row = {};
  for (const f of s.facts) if (d.over || d.revealed.has(f.id)) facts[f.id] = f.label;
  return {
    facts,
    clues: d.clues.filter((c: Row) => c.open).map((c: Row) => ({ i: c.i, text: s.clues[c.i]?.text || "", layer: s.layers?.[c.id] || "", img: s.clues[c.i]?.img || "" })),
    truth: d.over ? s.truth : null,
  };
}

/* ---------- 모델 호출 ---------- */
function callModel(system: string, user: string, schema: Row, effort: string) {
  return API_KEY ? callClaude(system, user, schema, effort) : callGemini(system, user, schema);
}
// Gemini 무료 등급: 분당 한도에 걸리면 다음 모델로, 모두 막히면 gemini_busy
async function callGemini(system: string, user: string, schema: Row) {
  const key = await geminiKey();
  if (!key) throw new Fail("no_key");
  for (const model of GEMINI_MODELS) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { responseMimeType: "application/json", responseJsonSchema: schema },
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (r.status === 429 || r.status >= 500) { console.error("gemini busy:", model, r.status); continue; }
    if (!r.ok || j.error) { console.error("gemini error:", model, r.status, j.error?.message); throw new Fail("gemini_error"); }
    if (j.promptFeedback?.blockReason || j.candidates?.[0]?.finishReason === "SAFETY") throw new Fail("refused");
    const text = (j.candidates?.[0]?.content?.parts || []).map((p: Row) => p.text || "").join("");
    try { return JSON.parse(text); } catch { throw new Fail("bad_json"); }
  }
  throw new Fail("gemini_busy");
}

/* ---------- Claude API ---------- */
let client: Anthropic | null = null;
function anthropic() {
  if (!API_KEY) throw new Fail("no_key");
  return client ??= new Anthropic({ apiKey: API_KEY });
}
async function callClaude(system: string, user: string, schema: Row, effort: string) {
  const params: Row = {
    model: MODEL,
    max_tokens: 8000,
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: user }],
    output_config: { format: { type: "json_schema", schema } },
  };
  if (!MODEL.startsWith("claude-haiku")) params.output_config.effort = effort;
  // deno-lint-ignore no-explicit-any
  let res: any;
  if (FALLBACK_OK.includes(MODEL)) {
    // 안전 분류기가 판정을 거절하면 서버가 다른 모델로 대신 답하게 한다
    // deno-lint-ignore no-explicit-any
    res = await anthropic().beta.messages.create({ ...params, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" } as any);
  } else {
    // deno-lint-ignore no-explicit-any
    res = await anthropic().messages.create(params as any);
  }
  if (res.stop_reason === "refusal") throw new Fail("refused");
  const text = res.content.filter((x: Row) => x.type === "text").map((x: Row) => x.text).join("");
  try { return JSON.parse(text); } catch { throw new Fail("bad_json"); }
}
function errCode(e: unknown) {
  if (e instanceof Fail) return e.code;
  if (e instanceof Anthropic.AuthenticationError) return "no_key";
  if (e instanceof Anthropic.RateLimitError) return "rate_limited";
  if (e instanceof Anthropic.BadRequestError) return "bad_request";
  if (e instanceof Anthropic.APIError) return "upstream";
  return "server";
}
