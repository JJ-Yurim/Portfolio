import { access, readFile } from 'node:fs/promises';
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

test('project cards expose measurable outcomes before the modal opens', async () => {
  const html = await read('index.html');

  for (const outcome of ['19\\+ 화면', '84% 절감', '60클라이언트', '27 API', '22 테이블']) {
    assert.match(html, new RegExp(outcome));
  }
  assert.match(html, /class="tile-outcome"/);
});

test('project dialog declares modal semantics and accessible slide updates', async () => {
  const html = await read('index.html');

  assert.match(html, /role="dialog"[^>]*aria-modal="true"/);
  assert.match(html, /class="detail-slide-caption"[^>]*aria-live="polite"/);
});

test('project dialog manages focus and restores it to the opener', async () => {
  const js = await read('script.js');

  assert.match(js, /lastFocusedElement/);
  assert.match(js, /projectModalClose\?\.focus\(\)/);
  assert.match(js, /lastFocusedElement\?\.focus\(\)/);
  assert.match(js, /getFocusableElements/);
  assert.match(js, /event\.key === 'Tab'/);
});

test('portfolio includes submission metadata and lightweight image loading', async () => {
  const html = await read('index.html');

  assert.match(html, /rel="canonical"/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /rel="icon"[^>]*href="assets\/favicon\.svg"/);
  assert.match(html, /loading="lazy"/);
});

test('public snapshot repositories explain where collaboration history lives', async () => {
  const html = await read('index.html');

  assert.match(html, /공개용 스냅샷/);
  assert.match(html, /원본 협업 이력은 GitLab/);
});

test('itdam state diagram keeps the main flow linear and pendingDraft auxiliary', async () => {
  const svg = await read('assets/diagrams/itdam-state-flow.svg');
  const states = Object.fromEntries(
    [...svg.matchAll(/<rect[^>]*data-state="([^"]+)"[^>]*x="(\d+)"[^>]*y="(\d+)"/g)]
      .map(([, state, x, y]) => [state, { x: Number(x), y: Number(y) }]),
  );
  const mainStates = ['draftInput', 'isSaving', 'savedVersion', 'AI Review', 'Library'];

  for (const state of [...mainStates, 'pendingDraft']) {
    assert.ok(states[state], `missing positioned state: ${state}`);
  }
  assert.deepEqual(mainStates.map((state) => states[state].y), [238, 238, 238, 238, 238]);
  assert.deepEqual(mainStates.map((state) => states[state].x), [72, 308, 544, 780, 1016]);
  assert.ok(states.pendingDraft.y > states.isSaving.y);
  assert.match(svg, /id="pending-flow"/);
  assert.match(svg, /stroke-dasharray="10 10"/);
  assert.doesNotMatch(svg, /id="pending-to-saved"/);
});

test('itdam concurrency note is split into readable lines inside its panel', async () => {
  const svg = await read('assets/diagrams/itdam-state-flow.svg');
  const noteLines = [...svg.matchAll(/<text[^>]*data-note-line="\d+"[^>]*>([^<]+)<\/text>/g)]
    .map(([, line]) => line);

  assert.equal(noteLines.length, 2);
  assert.ok(noteLines.every((line) => line.length <= 34));
});

test('every project slide asset exists and modal images never crop content', async () => {
  const [js, css] = await Promise.all([read('script.js'), read('styles.css')]);
  const slideSources = [...js.matchAll(/src: '([^']+)'/g)].map((match) => match[1]);

  assert.equal(slideSources.length, 22);
  await Promise.all(slideSources.map((source) => access(new URL(`../${source}`, import.meta.url))));
  assert.match(css, /\.detail-slide-image\s*{[^}]*object-fit:\s*contain/s);
});

test('GotYA data relationships expose direction on every curved connector', async () => {
  const svg = await read('assets/diagrams/gotya-data-model.svg');

  for (const id of ['content-to-book', 'content-to-culture', 'action-to-content']) {
    assert.match(svg, new RegExp(`id="${id}"[^>]*marker-end="url\\(#arrow-teal\\)"`));
  }
});
