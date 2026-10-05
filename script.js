const revealItems = document.querySelectorAll('.reveal');
const topButton = document.querySelector('.top-button');
const scrollButtons = document.querySelectorAll('[data-scroll]');
const projectTiles = document.querySelectorAll('.project-tile[data-project]');
const projectModal = document.querySelector('.project-modal');
const projectModalClose = document.querySelector('.project-modal-close');
const detailPanels = document.querySelectorAll('.project-detail-panel');

const projectSlides = {
  itdam: [
    { src: 'assets/captures/itdam-home.png', alt: '잇담 홈 화면', caption: '잇담 · 홈' },
    { src: 'assets/captures/itdam-tutorial-real.png', alt: '잇담 튜토리얼 모달 화면', caption: '잇담 · 튜토리얼' },
    { src: 'assets/captures/itdam-library.png', alt: '잇담 도서관 화면', caption: '잇담 · 도서관' },
    { src: 'assets/captures/itdam-archive.png', alt: '잇담 내 서고 화면', caption: '잇담 · 내 서고' },
    { src: 'assets/captures/itdam-hall-of-fame.png', alt: '잇담 이야기의 전당 화면', caption: '잇담 · 이야기의 전당' },
    { src: 'assets/diagrams/itdam-state-flow.svg', alt: '잇담 저장 상태 구조 다이어그램', caption: '잇담 · 저장 상태 구조' },
  ],
  kkakkung: [
    { src: 'assets/captures/kkakkung-tagger-game.png', alt: '까꿍 술래 플레이 HUD 화면', caption: '까꿍 · 플레이 HUD' },
    { src: 'assets/captures/kkakkung-tagger-trap-installed.png', alt: '까꿍 술래 화면 덫 설치 상태', caption: '까꿍 · 덫 설치 상태' },
    { src: 'assets/captures/kkakkung-tagger-sensor-installed.png', alt: '까꿍 술래 화면 감지기 설치 상태', caption: '까꿍 · 감지기 설치 상태' },
    { src: 'assets/captures/kkakkung-preview-exchange.png', alt: '까꿍 지도 교환 화면', caption: '까꿍 · 지도 교환' },
    { src: 'assets/diagrams/kkakkung-stateview-flow.svg', alt: '까꿍 역할별 StateView 구조 다이어그램', caption: '까꿍 · StateView 구조' },
  ],
  gotya: [
    { src: 'assets/captures/gotya-home.png', alt: 'GotYA 홈 화면', caption: 'GotYA · 홈' },
    { src: 'assets/captures/gotya-taste-question-a.png', alt: 'GotYA 취향 테스트 질문 화면', caption: 'GotYA · 취향 테스트 질문' },
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

  if (image) {
    image.src = slide.src;
    image.alt = slide.alt;
    image.classList.toggle('diagram-slide', slide.src.includes('/diagrams/'));
  }
  if (caption) caption.textContent = slide.caption;
}

function openProject(projectId) {
  if (!projectModal || !projectSlides[projectId]) return;
  activeProject = projectId;
  activeSlideIndex = 0;
  detailPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.project === projectId);
  });
  updateSlide(projectId);
  projectModal.classList.add('open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProject() {
  if (!projectModal) return;
  projectModal.classList.remove('open');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  activeProject = null;
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
  if (event.key === 'Escape') closeProject();
  if (event.key === 'ArrowLeft' && activeProject) updateSlide(activeProject, -1);
  if (event.key === 'ArrowRight' && activeProject) updateSlide(activeProject, 1);
});

function copyEmail() {
  navigator.clipboard.writeText('dbfan98@naver.com');
}
