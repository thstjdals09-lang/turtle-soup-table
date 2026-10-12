// 문제 원본을 읽는다: private/puzzles.mjs + private/puzzles-more.mjs 위에 private/rewrite/<id>.json 고쳐 쓴 값을 덮는다.
// build.mjs 와 check-puzzles.mjs 가 함께 쓴다.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { PUZZLES } from '../private/puzzles.mjs';
import { MORE } from '../private/puzzles-more.mjs';
import { ART } from '../private/art/prompts.mjs';

export function loadPuzzles(root) {
  const dir = join(root, 'private/rewrite');
  const over = {};
  if (existsSync(dir)) for (const f of readdirSync(dir)) if (f.endsWith('.json')) over[f.slice(0, -5)] = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  return [...PUZZLES, ...MORE].map(p => {
    const o = over[p.id];
    const base = { ...p, art: p.art || ART[p.id] };
    if (!o) return base;
    const { secret, ...rest } = o;
    return { ...base, ...rest, secret: { ...p.secret, ...(secret || {}) }, rewritten: true };
  });
}
