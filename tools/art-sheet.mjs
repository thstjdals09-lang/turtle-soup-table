// 힉스필드 사이트에서 직접 뽑을 사진 작업표를 만든다 (사이트의 무료 생성 횟수는 연결 도구로는 쓸 수 없어서).
// 결과: private/art/sheet.html (브라우저로 열어 프롬프트 복사 → 사이트에 붙여 넣기)
//       private/art/sheet.json (key → 프롬프트, 생성 기록과 짝지을 때 쓴다)
// 이미 넣은 사진(private/art/jobs.json 의 placed)은 빠진다.  실행: node tools/art-sheet.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUZZLES } from '../private/puzzles.mjs';
import { MORE } from '../private/puzzles-more.mjs';
import { ART } from '../private/art/prompts.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const jobsPath = join(root, 'private/art/jobs.json');
const jobs = existsSync(jobsPath) ? JSON.parse(readFileSync(jobsPath, 'utf8')).jobs : [];
const placed = new Set(jobs.filter(j => j.placed || j.url).map(j => j.key));

const items = [];
for (const [n, p] of [...PUZZLES, ...MORE].entries()) {
  const art = p.art || ART[p.id];
  if (!art) continue;
  const no = String(n + 1).padStart(2, '0');
  items.push({ key: p.id + ':base', step: 1, no, title: p.title, kind: '사건 사진', prompt: art.base });
  art.clues.forEach((c, i) => items.push({ key: `${p.id}:c${i + 1}`, step: 2, no, title: p.title, kind: `단서 #${i + 1}`, prompt: c }));
}
const todo = items.filter(x => !placed.has(x.key));
writeFileSync(join(root, 'private/art/sheet.json'), JSON.stringify(Object.fromEntries(items.map(x => [x.key, x.prompt])), null, 1));

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const row = (x, i) => `<li data-key="${esc(x.key)}"><div class="h"><label><input type="checkbox"> <b>${i + 1}.</b> No.${x.no} ${esc(x.title)} · <span class="k">${esc(x.kind)}</span></label><button type="button">복사</button></div><textarea readonly rows="3">${esc(x.prompt)}</textarea></li>`;
const s1 = todo.filter(x => x.step === 1), s2 = todo.filter(x => x.step === 2);
// 콘솔 자동 실행 코드: 1단계부터 순서대로
const auto = readFileSync(join(root, 'tools/art-auto.js'), 'utf8').replace('__ITEMS__', JSON.stringify([...s1, ...s2].map(x => [x.key, x.prompt])));
writeFileSync(join(root, 'private/art/auto.js'), auto);
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>사진 작업표</title><style>
:root{color-scheme:dark}body{margin:0;background:#0b0f14;color:#d6dde6;font:15px/1.6 system-ui,"Malgun Gothic",sans-serif}
main{max-width:860px;margin:0 auto;padding:24px 16px 80px}h1{font-size:22px;margin:0 0 8px}h2{font-size:17px;margin:32px 0 8px;color:#8db9d9}
.set{background:#121821;border:1px solid #233041;border-radius:8px;padding:12px 16px}.set li{margin:2px 0}
ol.list{list-style:none;padding:0;margin:0}ol.list li{border:1px solid #1d2733;border-radius:8px;padding:10px 12px;margin:8px 0;background:#0f141b}
ol.list li.done{opacity:.4}.h{display:flex;justify-content:space-between;align-items:center;gap:8px}.k{color:#e0b44c}
textarea{width:100%;box-sizing:border-box;margin-top:6px;background:#0b0f14;color:#9fb0c2;border:1px solid #1d2733;border-radius:6px;padding:6px 8px;font:12px/1.5 ui-monospace,Consolas,monospace;resize:vertical}
button{background:#8db9d9;color:#0b0f14;border:0;border-radius:6px;padding:6px 14px;font-weight:700;cursor:pointer}button.ok{background:#5fa36b}
.bar{position:sticky;top:0;background:#0b0f14;padding:8px 0;border-bottom:1px solid #1d2733;z-index:1}</style></head><body><main>
<h1>사진 작업표 · 남은 ${todo.length}장</h1>
<div class="set"><b>사이트 설정 (한 번만)</b><ul>
<li>모델: <b>Soul Cinema</b> · 비율: <b>4:3</b> · 화질: 2k 그대로 · 개수: <b>1</b></li>
<li>프롬프트 다듬기(마법봉 "켬")는 <b>끄기</b> — 켜 두면 기록에서 어느 사건 사진인지 찾기 어려워요</li>
<li>카메라·컬러 설정은 건드리지 않기</li></ul>
<b>하는 법</b>: [복사] → 사이트 입력칸에 붙여 넣기 → 생성하기. 결과가 마음에 안 들면 같은 프롬프트로 다시 뽑아도 돼요(제가 가장 최근 것을 씁니다).<br>
1단계만 끝내도 모든 사건에 사진이 들어갑니다. 다 되면 Claude에게 "다 뽑았어"라고 알려 주세요.</div>
<div class="set" style="margin-top:12px;border-color:#8db9d9"><b>자동으로 하기</b> <button type="button" id="autoBtn">자동 실행 코드 복사</button><ol style="margin:8px 0 0;padding-left:20px">
<li>로그인된 크롬에서 힉스필드 <b>Soul Cinema 생성 화면</b>을 열고 위 설정을 맞춰 두기</li>
<li>그 탭에서 <b>F12</b> → 위쪽 <b>Console(콘솔)</b> 탭 클릭</li>
<li>처음 붙여 넣을 때 경고가 나오면 경고문이 시키는 대로 <b>붙여넣기 허용</b>(allow pasting)을 입력하고 Enter</li>
<li>Ctrl+V → Enter. 오른쪽 아래에 진행판이 뜨고 한 장씩 넣어요(15초 간격, 약 40분)</li>
<li>그 탭은 띄워 둔 채로 두세요(최소화하면 느려져요). 멈췄다가 다시 붙여 넣으면 이어서 해요</li></ol>
<textarea id="autoCode" readonly rows="2" style="display:none">${esc(auto)}</textarea></div>
<div class="bar" id="bar"></div>
<h2>1단계 · 사건 사진 ${s1.length}장</h2><ol class="list">${s1.map(row).join('')}</ol>
<h2>2단계 · 단서 사진 ${s2.length}장</h2><ol class="list">${s2.map((x, i) => row(x, s1.length + i)).join('')}</ol>
</main><script>
const KEY='soup.sheet';let done={};try{done=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){}};
const bar=document.getElementById('bar');const all=[...document.querySelectorAll('ol.list li')];
const count=()=>{bar.textContent='완료 '+all.filter(li=>done[li.dataset.key]).length+' / '+all.length};
for(const li of all){const cb=li.querySelector('input'),bt=li.querySelector('button'),ta=li.querySelector('textarea');
cb.checked=!!done[li.dataset.key];li.classList.toggle('done',cb.checked);
cb.onchange=()=>{done[li.dataset.key]=cb.checked;li.classList.toggle('done',cb.checked);save();count()};
bt.onclick=async()=>{try{await navigator.clipboard.writeText(ta.value)}catch(e){ta.select();document.execCommand('copy')}
bt.textContent='복사됨';bt.classList.add('ok');cb.checked=true;cb.onchange();setTimeout(()=>{bt.textContent='복사';bt.classList.remove('ok')},1500)}}
count();
document.getElementById('autoBtn').onclick=async e=>{const t=document.getElementById('autoCode').value;try{await navigator.clipboard.writeText(t)}catch(x){const ta=document.getElementById('autoCode');ta.style.display='block';ta.select();document.execCommand('copy');ta.style.display='none'}e.target.textContent='복사됨 — 힉스필드 콘솔에 붙여 넣기';e.target.classList.add('ok')};</script></body></html>`;
writeFileSync(join(root, 'private/art/sheet.html'), html);
console.log(`작업표: 1단계 ${s1.length}장 + 2단계 ${s2.length}장 = ${todo.length}장 → private/art/sheet.html`);
