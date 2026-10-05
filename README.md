# Jung Yurim Portfolio

정유림 프론트엔드 개발자 포트폴리오 웹사이트입니다. 기존 PDF 포트폴리오를 웹에서 더 읽기 쉬운 형태로 재구성했고, 프로젝트별 실제 화면, 핵심 역할, 기술적 의사결정, 성과를 한 페이지에서 확인할 수 있도록 만들었습니다.

## 배포 주소

GitHub Pages 배포 후 아래 형식으로 접속할 수 있습니다.

```text
https://JJ-Yurim.github.io/Portfolio/
```

## 주요 구성

- About Me: 개발자로 전환하게 된 배경과 강점
- Skills: 사용 경험이 있는 언어, 프론트엔드, 백엔드, 협업 도구
- Archiving: GitHub, Email
- Projects: 잇담, 까꿍, GotYA, 개인 포트폴리오
- Awards: SSAFY 프로젝트 수상 이력

## 대표 프로젝트

### 잇담

매일 다섯 단어를 조합해 문장을 만들고, AI 평가 결과를 바탕으로 보스 레이드에 참여하는 창작 게임 서비스입니다.

- 역할: 팀장, 프론트엔드 주요 화면 구현
- 담당 화면: 홈, 튜토리얼, 문장 작성, 도서관, 내 서고, 보스 레이드
- 핵심 구현: 자동 저장과 수동 저장이 겹쳐도 마지막 입력을 잃지 않도록 입력 상태와 저장 상태 분리
- 성과: 19개 이상 화면 구현, 28개 테스트 작성, SSAFY 2학기 프로젝트 우수상

### 까꿍

웹캠 동작으로 캐릭터를 조작하는 실시간 3D 멀티플레이 숨바꼭질 게임입니다.

- 역할: 프론트엔드 게임 UI, 플레이 HUD, 장비 인터랙션, 장치 점검 화면 구현
- 핵심 구현: 서버 원본 GameState를 역할별 StateView로 변환해 술래/도망자에게 필요한 정보만 전달
- 성과: 지도 전송량 약 84% 절감, 60클라이언트 30분 부하 테스트 검증, SSAFY 특화 프로젝트 우수상

### GotYA

13문항 취향 테스트 결과를 바탕으로 영화, 도서, 문화생활을 추천하는 큐레이션 서비스입니다.

- 역할: 백엔드 데이터 모델링, API 설계, 추천 흐름 구현
- 핵심 구현: 영화/도서/문화생활 공통 콘텐츠 모델과 상세 테이블을 분리해 추천과 사용자 상호작용 재사용
- 성과: 27개 API, 22개 테이블 구성, SSAFY 1학기 프로젝트 최우수상

## 기술 스택

- HTML
- CSS
- JavaScript
- 반응형 UI
- GitHub Pages 배포 가능 구조

## 로컬 실행

정적 웹사이트라 별도 빌드 없이 실행할 수 있습니다.

```bash
npx serve .
```

또는 `index.html` 파일을 브라우저로 열어 확인할 수 있습니다.

## 테스트

```bash
npm test
```

## GitHub Pages 배포 방법

1. GitHub에서 `Portfolio` 이름의 새 저장소를 생성합니다.
2. 이 폴더를 저장소에 push합니다.
3. 저장소의 `Settings > Pages`에서 배포 소스를 `Deploy from a branch`로 선택합니다.
4. Branch를 `main`, Folder를 `/root`로 설정합니다.
5. 배포가 완료되면 `https://JJ-Yurim.github.io/Portfolio/` 주소로 접속합니다.

## 폴더 구조

```text
.
├── index.html
├── styles.css
├── script.js
├── assets
│   ├── captures
│   └── diagrams
├── tests
└── README.md
```
