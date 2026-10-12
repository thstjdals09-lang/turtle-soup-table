// 바다거북 수프 식탁 — 서버 함수 하나로 방 만들기, 질문 판정, 진상 채점, 단서 공개를 처리한다.
// 화면은 soup_events를 읽기만 하고, 쓰기는 모두 여기서 service role로 한다.
// 문제(진상 포함)는 soup_secrets 표에 있고, tools/seed.mjs 가 "seed" 동작으로 넣는다.
// 판정 순서: ANTHROPIC_API_KEY 가 있으면 Claude API, 아니면 Gemini 무료 키(soup_keys 표의 gemini 또는 GEMINI_API_KEY),
// 둘 다 없거나 Gemini가 한도에 걸리면 질문을 대기로 두고 방장 PC의 출제자 봇(tools/host-bot.mjs)이
// claude -p 로 판정해 "bot_done"으로 올린다.
// 선택 비밀 값: ANTHROPIC_API_KEY, SOUP_MODEL, SOUP_DAILY_LIMIT, GEMINI_API_KEY, GEMINI_MODELS
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";
import { STALE_MS, derive } from "./rules.js";
import { cleanGrade, cleanJudge, gradeSchema, gradeSystem, gradeUser, judgeSchema, judgeSystem, judgeUser, metaOf } from "./judge.js";

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
  if (!data) throw new Fail("bad_puzzle");
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
  const pending = list.filter((e) => e.player === c.player && e.status === "pending" && Date.now() - Date.parse(e.updated_at) < STALE_MS);
  if (pending.length >= 3) throw new Fail("too_many");
  await budget();
  const id = await insert({ room: r.code, puzzle: c.pid, scope: c.scope, player: c.player, name: c.name, kind: "q", body: text, status: "pending" });
  await judgeLater(() => judgeAndSave(id, null));
  return { id };
}
async function retry(b: Row) {
  const { player } = who(b);
  const r = await room(b.code);
  const e = await eventById(b.id, r.code);
  const stale = e.status === "pending" && (Date.now() - Date.parse(e.updated_at) > STALE_MS || !!e.err);
  if (!(e.status === "error" || stale) || (e.kind !== "q" && e.kind !== "guess")) throw new Fail("not_retryable");
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
  if (e.kind !== "q" || e.status !== "done" || e.answer === "반려" || e.appeal) throw new Fail("not_appealable");
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
  if (appealing) row.appeal = "done";
  await patchIfWaiting(e.id, row, appealing ? "appeal" : "status");
}
async function saveGrade(e: Row, out: unknown) {
  const s = await puzzleOf(e.puzzle);
  await patchIfWaiting(e.id, { status: "done", ...cleanGrade(s, out), err: null }, "status");
}
async function patchIfWaiting(id: number, row: Row, field: string) {
  const { error } = await db.from("soup_events").update({ ...row, updated_at: now() }).eq("id", id).eq(field, "pending");
  if (error) console.error("soup patch:", error);
}
// 판정 실패: 무료 AI가 바쁘면 대기로 남겨 PC 봇이나 다시 묻기가 받게 하고, 그 밖엔 실패로 표시한다
async function failJudge(id: number, err: unknown, appealing: boolean) {
  const code = errCode(err);
  console.error("soup judge:", code, err);
  if (code === "gemini_busy") await patch(id, { err: code });
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
