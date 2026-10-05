import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('portfolio page contains the core recruiting sections', async () => {
  const html = await read('index.html');

  for (const label of ['About Me', 'Skills', 'Archiving', 'Projects', 'Awards', 'Contact']) {
    assert.match(html, new RegExp(label, 'i'));
  }
});

test('portfolio page links public GitHub projects', async () => {
  const html = await read('index.html');

  for (const repo of ['GotYA-project', 'itdam-project', 'kkakkung-project']) {
    assert.match(html, new RegExp(`https://github.com/JJ-Yurim/${repo}`));
  }
});

test('project stories explain problem, solution, and result', async () => {
  const html = await read('index.html');

  for (const keyword of ['핵심 성과', '데이터 구조', '상태 구조', '실시간 구조', '문제', '해결', '결과', 'README']) {
    assert.match(html, new RegExp(keyword));
  }
});

test('style and interaction files are present', async () => {
  const [css, js] = await Promise.all([read('styles.css'), read('script.js')]);

  assert.match(css, /hero-overlay/);
  assert.match(css, /section-title/);
  assert.match(js, /IntersectionObserver|copyEmail|filterProjects/);
});

test('hero has a focused developer portfolio message', async () => {
  const html = await read('index.html');

  assert.match(html, /고객의 불편을 직접 마주한 최전선 개발자/);
  assert.match(html, /응대하던 자리에서 서비스를 만드는 자리/);
  assert.match(html, /더 알아보기/);
});
