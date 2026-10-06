import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const read = file => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('each project identifies itself and its role before its image gallery', async () => {
  const html = await read('index.html');
  const panels = [...html.matchAll(/<article class="project-detail-panel"[^>]*>([\s\S]*?)<\/article>/g)];
  assert.equal(panels.length, 4);
  for (const [, panel] of panels) {
    const header = panel.match(/<header class="detail-header">([\s\S]*?)<\/header>/);
    assert.ok(header, 'project needs an introductory header');
    assert.match(header[1], /<h3>/);
    assert.match(header[1], /담당 역할/);
    assert.ok(panel.indexOf('</header>') < panel.indexOf('class="detail-visual"'));
    for (const label of ['문제', '내가 한 일', '결과']) assert.ok(panel.includes(`<h4>${label}</h4>`));
  }
});

test('slide counter follows next, previous, wraparound, and project reopening', async () => {
  // Only browser interfaces are doubled; the production slide and modal handlers run unchanged.
  const element = () => ({ textContent: '', style: {}, offsetParent: {},
    classList: { add() {}, remove() {}, toggle() {}, contains: () => true },
    setAttribute() {}, addEventListener() {}, focus() {}, scrollTop: 99 });
  const selectors = new Map();
  const panels = new Map(['itdam', 'kkakkung', 'gotya', 'portfolio'].map(id => {
    const children = new Map(['.detail-slide-image', '.detail-slide-caption', '.slide-counter'].map(s => [s, element()]));
    const panel = { ...element(), dataset: { project: id }, querySelector: s => children.get(s), children };
    selectors.set(`.project-detail-panel[data-project="${id}"]`, panel);
    return [id, panel];
  }));
  const modal = element();
  const backgroundHeader = element();
  const detailHeader = element();
  const context = vm.createContext({
    document: {
      querySelector: s => selectors.get(s) || (s === '.project-modal' ? modal : element()),
      querySelectorAll: s => s === '.project-detail-panel' ? [...panels.values()] :
        s === 'header, main, .top-button' ? [backgroundHeader, detailHeader] :
        s === '.site-header, main, .top-button' ? [backgroundHeader] : [],
      body: element(), activeElement: element(),
    },
    window: { addEventListener() {}, scrollTo() {} },
    IntersectionObserver: class { observe() {} },
  });
  vm.runInContext(await read('script.js'), context);
  const run = code => vm.runInContext(code, context);
  const counter = id => panels.get(id).children.get('.slide-counter').textContent;
  run("openProject('kkakkung')");
  assert.equal(counter('kkakkung'), '1 / 4');
  run("updateSlide('kkakkung', 1)");
  assert.equal(counter('kkakkung'), '2 / 4');
  assert.match(panels.get('kkakkung').children.get('.detail-slide-image').src, /tagger-equipment/);
  run("updateSlide('kkakkung', -1); updateSlide('kkakkung', -1)");
  assert.equal(counter('kkakkung'), '4 / 4');
  run("updateSlide('kkakkung', 1)");
  assert.equal(counter('kkakkung'), '1 / 4');
  run("openProject('gotya')");
  assert.equal(counter('gotya'), '1 / 8');
  run("openProject('itdam')");
  assert.equal(counter('itdam'), '1 / 6');
  run("openProject('portfolio')");
  assert.equal(counter('portfolio'), '1 / 3');
  run("openProject('kkakkung')");
  assert.equal(counter('kkakkung'), '1 / 4');
  assert.equal(modal.scrollTop, 0, 'new project starts at its introductory header');
  assert.equal(backgroundHeader.inert, true, 'background is unavailable while the modal is open');
  assert.notEqual(detailHeader.inert, true, 'project introduction remains accessible inside the modal');
});
