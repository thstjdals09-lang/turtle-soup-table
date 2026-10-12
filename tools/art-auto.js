// 힉스필드 이미지 생성 화면의 개발자 도구 콘솔에 붙여 넣어 돌리는 코드 (tools/art-sheet.mjs 가 프롬프트를 채워 넣는다).
// 프롬프트를 하나씩 입력칸에 넣고 생성하기를 누른 뒤, "남은 무료 생성" 숫자가 줄어든 걸 확인하고 다음으로 넘어간다.
// 숫자가 안 줄면(무료가 아니거나 막힘) 바로 멈춘다. 끝낸 것은 이 사이트의 localStorage 에 적어 두어 다시 붙여 넣으면 이어서 한다.
(async () => {
  const ITEMS = __ITEMS__;
  const GAP = 15000, WAIT = 90000, KEY = 'soupArtDone';
  if (window.__soupArt) { window.__soupArt.stop = true; await new Promise(r => setTimeout(r, 1200)); }
  const run = window.__soupArt = { stop: false };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  let done = new Set(); try { done = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify([...done])); } catch {} };

  // 진행판
  document.getElementById('soup-art-panel')?.remove();
  const box = document.createElement('div');
  box.id = 'soup-art-panel';
  box.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647;width:300px;background:#0b0f14;color:#d6dde6;border:1px solid #8db9d9;border-radius:10px;padding:12px 14px;font:13px/1.5 system-ui,"Malgun Gothic",sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.5)';
  box.innerHTML = '<b style="color:#8db9d9">수프 사진 자동 생성</b><div id="sap-msg" style="margin:6px 0 8px;white-space:pre-wrap"></div><button id="sap-stop" style="background:#c9524b;color:#fff;border:0;border-radius:6px;padding:5px 12px;font-weight:700;cursor:pointer">멈추기</button>';
  document.body.appendChild(box);
  const msg = t => { box.querySelector('#sap-msg').textContent = t; console.log('[수프]', t); };
  box.querySelector('#sap-stop').onclick = () => { run.stop = true; msg('멈추는 중… (지금 것까지만)'); };

  const findBtn = () => [...document.querySelectorAll('button')].filter(vis)
    .filter(b => /생성하기|Generate/i.test(b.innerText || ''))
    .sort((a, b) => b.getBoundingClientRect().width * b.getBoundingClientRect().height - a.getBoundingClientRect().width * a.getBoundingClientRect().height)[0];
  const findInput = () => {
    const all = [...document.querySelectorAll('textarea,[contenteditable="true"]')], shown = all.filter(vis), c = shown.length ? shown : all;
    const ph = el => (el.getAttribute('placeholder') || '') + ' ' + (el.getAttribute('data-placeholder') || '') + ' ' + [...el.querySelectorAll('[data-placeholder]')].map(x => x.getAttribute('data-placeholder')).join(' ');
    return c.find(el => /장면|설명|Describe|prompt/i.test(ph(el))) || c[c.length - 1];
  };
  const freeLeft = () => { const m = (document.body.innerText || '').match(/남은\s*무료\s*생성\s*([\d,]+)/); return m ? Number(m[1].replace(/,/g, '')) : null; };
  const textOf = el => el.tagName === 'TEXTAREA' ? el.value : el.innerText;
  const setText = (el, t) => {
    el.focus();
    if (el.tagName === 'TEXTAREA') {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(el, t);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // 편집기(contenteditable): 입력 → 붙여넣기 → 직접 넣기 순서로 시도
      const has = () => textOf(el).includes(t.slice(-40).trim());
      const r = document.createRange(); r.selectNodeContents(el);
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      document.execCommand('insertText', false, t);
      if (!has()) {
        const dt = new DataTransfer(); dt.setData('text/plain', t);
        el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
      }
      if (!has()) { el.textContent = t; el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: t })); }
    }
  };

  const todo = ITEMS.filter(([k]) => !done.has(k));
  if (!findInput() || !findBtn()) { msg('입력칸이나 생성하기 버튼을 못 찾았어요.\nSoul Cinema 이미지 생성 화면에서 다시 붙여 넣어 주세요.'); return; }
  msg(`남은 ${todo.length}장 시작 (전체 ${ITEMS.length}장)\n이 탭을 띄워 둔 채로 두세요.`);
  await sleep(1500);

  let n = 0;
  for (const [key, prompt] of todo) {
    if (run.stop) break;
    const input = findInput(), btn = findBtn();
    if (!input || !btn) { msg('화면이 바뀌어 입력칸을 못 찾았어요. 멈춥니다.'); return; }
    // 생성하기 버튼이 다시 눌릴 수 있을 때까지 기다린다 (동시 생성 한도)
    for (let t = 0; btn.disabled && t < 600 && !run.stop; t++) await sleep(1000);
    setText(input, prompt);
    await sleep(800);
    if (!textOf(input).includes(prompt.slice(-40).trim())) { msg('프롬프트가 입력칸에 안 들어갔어요. 멈춥니다.\n(' + key + ')'); return; }
    const before = freeLeft();
    findBtn().click();
    msg(`${done.size + 1}/${ITEMS.length} 보냄: ${key}\n남은 무료 ${before ?? '?'}회`);
    if (before != null) {
      let ok = false;
      for (let t = 0; t < WAIT / 1000 && !run.stop; t++) { await sleep(1000); const now = freeLeft(); if (now != null && now < before) { ok = true; break; } }
      if (!ok && !run.stop) { msg(`보낸 게 확인되지 않았어요 (${key}).\n무료 횟수가 줄지 않아서 멈춥니다. 화면의 오류 문구를 확인해 주세요.`); return; }
    }
    done.add(key); save(); n++;
    await sleep(GAP);
  }
  const left = ITEMS.filter(([k]) => !done.has(k)).length;
  msg(run.stop ? `멈췄어요. 이번에 ${n}장 보냄, 남은 ${left}장.\n다시 붙여 넣으면 이어서 해요.` : `끝! 이번에 ${n}장 보냄.\n생성이 다 끝나면 Claude에게 "다 뽑았어"라고 알려 주세요.`);
})();
