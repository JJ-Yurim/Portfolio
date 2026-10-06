const revealItems = document.querySelectorAll('.reveal');
const topButton = document.querySelector('.top-button');
const scrollButtons = document.querySelectorAll('[data-scroll]');
const projectTiles = document.querySelectorAll('.project-tile[data-project]');
const projectModal = document.querySelector('.project-modal');
const projectModalClose = document.querySelector('.project-modal-close');
const detailPanels = document.querySelectorAll('.project-detail-panel');

const projectSlides = {
  itdam: [
    { src: 'assets/captures/itdam-drive-library.png', alt: '잇담 도서관의 공동 책 목록 화면', caption: '잇담 · 도서관 / 공동 책' },
    { src: 'assets/captures/itdam-drive-writing.png', alt: '오늘의 단어 카드로 문장을 작성하는 잇담 화면', caption: '잇담 · 오늘의 문장 만들기' },
    { src: 'assets/captures/itdam-drive-archive.png', alt: 'AI 평가 점수와 원정 제출 상태를 보여주는 잇담 내 서고 화면', caption: '잇담 · 내 서고 / 평가된 문장' },
    { src: 'assets/captures/itdam-drive-raids.png', alt: '클리어한 이야기 원정을 모아 보는 잇담 화면', caption: '잇담 · 이야기 원정' },
    { src: 'assets/captures/itdam-drive-tutorial.png', alt: '캐릭터 다미가 서비스를 안내하는 잇담 튜토리얼 화면', caption: '잇담 · 다미의 튜토리얼' },
    { src: 'assets/diagrams/itdam-state-flow.svg', alt: '잇담 저장 상태 구조 다이어그램', caption: '잇담 · 저장 상태 구조' },
  ],
  kkakkung: [
    { src: 'assets/captures/kkakkung-runner-facing-tagger.jpg', alt: '까꿍 도망자 시점에서 정면으로 마주 본 빨간 술래 인형', caption: '까꿍 · 도망자 시점의 술래 대면 · 실제 게임 인형 데모' },
    { src: 'assets/captures/kkakkung-tagger-equipment.jpg', alt: '까꿍 술래가 설치한 왼쪽 벽 감지기와 앞쪽 바닥 덫을 뒤에서 보는 화면', caption: '까꿍 · 술래의 덫·감지기 설치 · 실제 게임 인형 데모' },
    { src: 'assets/captures/kkakkung-map-exchange-complete.jpg', alt: '까꿍 도망자끼리 지도 교환 후 완료 알림이 표시된 화면', caption: '까꿍 · 도망자 간 지도 교환 완료 · 실제 게임 인형 데모' },
    { src: 'assets/diagrams/kkakkung-stateview-flow.svg', alt: '까꿍 역할별 StateView 구조 다이어그램', caption: '까꿍 · StateView 구조' },
  ],
  gotya: [
    { src: 'assets/captures/gotya-taste-question-a.png', alt: 'GotYA 취향 테스트 질문 화면', caption: 'GotYA · 취향 테스트 질문' },
    { src: 'assets/captures/gotya-home.png', alt: 'GotYA 홈 화면의 오류 안내 상태', caption: 'GotYA · 홈 오류 안내' },
    { src: 'assets/captures/gotya-taste-result-recommend.png', alt: 'GotYA 취향 테스트 결과 화면', caption: 'GotYA · 취향 결과' },
    { src: 'assets/captures/gotya-movie-recommend.png', alt: 'GotYA 영화 추천 화면', caption: 'GotYA · 영화 추천' },
    { src: 'assets/captures/gotya-culture-recommend.png', alt: 'GotYA 문화 추천 화면', caption: 'GotYA · 문화 추천' },
    { src: 'assets/captures/gotya-content-lounge.png', alt: 'GotYA 콘텐츠 탐색 화면', caption: 'GotYA · 콘텐츠 탐색' },
    { src: 'assets/captures/gotya-culture-map.png', alt: 'GotYA 문화지도 화면', caption: 'GotYA · 문화지도' },
    { src: 'assets/diagrams/gotya-data-model.svg', alt: 'GotYA 콘텐츠 데이터 모델 다이어그램', caption: 'GotYA · 데이터 모델' },
  ],
  portfolio: [
    { src: 'assets/captures/portfolio-project-list-check-2.png', alt: '개인 포트폴리오 프로젝트 목록 화면', caption: 'Portfolio · 프로젝트 목록' },
    { src: 'assets/captures/portfolio-project-modal-check-2.png', alt: '개인 포트폴리오 프로젝트 상세 모달 화면', caption: 'Portfolio · 상세 모달' },
    { src: 'assets/captures/portfolio-itdam-ui-check-3.png', alt: '개인 포트폴리오 이전 프로젝트 상세 화면', caption: 'Portfolio · UI 개선 과정' },
  ],
};

let activeProject = null;
let activeSlideIndex = 0;
let lastFocusedElement = null;

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
  ).filter((element) => element.offsetParent !== null);
}
function setPageInert(isInert) {
  document.querySelectorAll('.site-header, main, .top-button').forEach((element) => {
    element.inert = isInert;
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 },
);

revealItems.forEach((item) => observer.observe(item));

scrollButtons.forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' });
  });
});

window.addEventListener('scroll', () => {
  topButton.classList.toggle('visible', window.scrollY > 600);
});

topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function updateSlide(projectId, direction = 0) {
  const slides = projectSlides[projectId];
  const panel = document.querySelector(`.project-detail-panel[data-project="${projectId}"]`);
  if (!slides || !panel) return;

  activeSlideIndex = (activeSlideIndex + direction + slides.length) % slides.length;
  const slide = slides[activeSlideIndex];
  const image = panel.querySelector('.detail-slide-image');
  const caption = panel.querySelector('.detail-slide-caption');
  const counter = panel.querySelector('.slide-counter');

  if (image) {
    image.src = slide.src;
    image.alt = slide.alt;
    image.classList.toggle('diagram-slide', slide.src.includes('/diagrams/'));
  }
  if (caption) caption.textContent = slide.caption;
  if (counter) {
    counter.textContent = `${activeSlideIndex + 1} / ${slides.length}`;
    counter.setAttribute('aria-label', `전체 ${slides.length}장 중 ${activeSlideIndex + 1}번째 화면`);
  }
}

function openProject(projectId) {
  if (!projectModal || !projectSlides[projectId]) return;
  lastFocusedElement = document.activeElement;
  activeProject = projectId;
  activeSlideIndex = 0;
  detailPanels.forEach((panel) => {
    const isActive = panel.dataset.project === projectId;
    panel.classList.toggle('active', isActive);
    panel.setAttribute('aria-hidden', String(!isActive));
  });
  updateSlide(projectId);
  projectModal.classList.add('open');
  projectModal.scrollTop = 0;
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setPageInert(true);
  projectModalClose?.focus();
}

function closeProject() {
  if (!projectModal?.classList.contains('open')) return;
  projectModal.classList.remove('open');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setPageInert(false);
  activeProject = null;
  lastFocusedElement?.focus();
  lastFocusedElement = null;
}

projectTiles.forEach((tile) => {
  tile.addEventListener('click', () => {
    openProject(tile.dataset.project);
  });
});

detailPanels.forEach((panel) => {
  panel.querySelector('.prev')?.addEventListener('click', () => {
    if (activeProject) updateSlide(activeProject, -1);
  });
  panel.querySelector('.next')?.addEventListener('click', () => {
    if (activeProject) updateSlide(activeProject, 1);
  });
});

projectModalClose?.addEventListener('click', closeProject);
projectModal?.addEventListener('click', (event) => {
  if (event.target === projectModal) closeProject();
});
window.addEventListener('keydown', (event) => {
  if (!activeProject) return;

  if (event.key === 'Escape') {
    closeProject();
    return;
  }
  if (event.key === 'ArrowLeft') updateSlide(activeProject, -1);
  if (event.key === 'ArrowRight') updateSlide(activeProject, 1);

  if (event.key === 'Tab') {
    const focusableElements = getFocusableElements(projectModal);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);
    if (!firstElement || !lastElement) return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
});

function copyEmail() {
  navigator.clipboard.writeText('dbfan98@naver.com');
}
