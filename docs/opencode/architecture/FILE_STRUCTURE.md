# 파일 구조 가이드 - Fantasy Builder

**최종 업데이트**: 2026-02-07  
**버전**: 1.0.0

---

## 개요 (Overview)

이 문서는 Fantasy Builder 프로젝트 구조에 대한 포괄적인 개요를 제공하며, 각 디렉토리와 주요 파일의 목적 및 구성을 설명합니다.

---

## 루트 디렉토리 구조 (Root Directory Structure)

```
electron-fantasy-builder/
├── src/                    # 모든 소스 코드
├── docs/                   # 문서 파일
├── PRD/                    # 제품 요구사항 문서 (Product Requirements Document)
├── out/                    # 빌드 출력 디렉토리
├── data/                   # 로컬 데이터베이스 파일
├── resources/              # 애플리케이션 리소스 (아이콘 등)
├── scripts/                # 빌드 및 유틸리티 스크립트
├── references/             # 참조 파일 및 문서
├── package.json            # 프로젝트 의존성 및 스크립트
├── pnpm-lock.yaml          # 의존성 잠금 파일
├── electron.vite.config.ts # 빌드 설정
├── tsconfig.json           # TypeScript 설정
├── drizzle.config.*.ts     # 데이터베이스 설정
├── eslint.config.mjs       # ESLint 설정
└── README.md               # 프로젝트 README
```

### 루트 설정 파일 (Root Configuration Files)

#### `package.json`
- **목적**: 프로젝트 메타데이터, 의존성, npm 스크립트
- **주요 섹션**:
  - `name`, `version`: 프로젝트 식별 정보
  - `main`: Electron 메인 프로세스 진입점
  - `scripts`: 개발 및 빌드 명령어
  - `dependencies`: 런타임 의존성
  - `devDependencies`: 개발 전용 의존성

#### `electron.vite.config.ts`
- **목적**: Electron의 3개 프로세스를 위한 Vite 설정
- **섹션**: main, preload, renderer 설정
- **기능**: 경로 별칭(Alias), 외부 의존성, 플러그인 설정

#### `tsconfig.json`
- **목적**: TypeScript 컴파일러 설정
- **설정**: 경로 매핑, 컴파일러 옵션, 타겟 설정

---

## 소스 코드 구조 (`src/`)

```
src/
├── main/                   # Electron 메인 프로세스 (Node.js 백엔드)
│   ├── api/               # API 클라이언트 함수
│   ├── server/            # Hono HTTP 서버
│   │   ├── controller/    # 라우트 핸들러
│   │   ├── service/       # 비즈니스 로직 계층
│   │   ├── schema/        # 데이터베이스 스키마 정의
│   │   │   ├── local/     # SQLite 스키마
│   │   │   └── remote/    # PostgreSQL 스키마
│   │   └── db/            # 데이터베이스 연결 관리
│   ├── window/            # 윈도우 관리
│   ├── ipc/               # IPC 핸들러
│   ├── logger.ts          # 로깅 설정
│   └── index.ts           # 메인 프로세스 진입점
├── renderer/             # Vue.js 프론트엔드
│   ├── views/             # 페이지 컴포넌트
│   │   └── project-detail/ # 기능별 상세 컴포넌트
│   ├── stores/            # Pinia 상태 관리
│   ├── components/        # 재사용 가능한 UI 컴포넌트
│   │   └── common/        # 공통 UI 컴포넌트
│   ├── utils/             # 프론트엔드 유틸리티
│   ├── router/            # Vue Router 설정
│   ├── api/               # 프론트엔드 API 클라이언트
│   ├── types/             # 프론트엔드 TypeScript 타입
│   ├── data/              # 정적 데이터 및 생성된 파일
│   ├── composables/       # Vue 컴포저블
│   └── index.ts           # 프론트엔드 진입점
├── preload/               # Preload 스크립트 (보안 브리지)
│   └── index.ts           # Preload 스크립트 진입점
├── types/                 # 공유 TypeScript 타입
├── zod-schema/            # 런타임 검증 스키마
├── config/                # 애플리케이션 설정
├── constants/             # 애플리케이션 상수
└── drizzle/               # 데이터베이스 마이그레이션
    ├── local/             # SQLite 마이그레이션
    └── remote/            # PostgreSQL 마이그레이션
```

---

## 메인 프로세스 (`src/main/`)

### 진입점: `index.ts`
- **목적**: 메인 프로세스 초기화 및 수명 주기 관리
- **책임**:
  - 데이터베이스 컨텍스트 초기화
  - IPC 핸들러 설정
  - Hono 서버 시작
  - 윈도우 생성 및 관리
  - 애플리케이션 이벤트 처리

### API 계층 (`api/`)
```typescript
// 프론트엔드 통신을 위한 API 클라이언트 함수
├── apiProject.ts          # 프로젝트 관련 API 함수
├── apiTrait.ts            # 특성 관리 API
├── apiAbility.ts          # 능력 관리 API
├── apiProjectTrait.ts     # 프로젝트 특성 API
├── apiProjectAbility.ts   # 프로젝트 능력 API
├── apiCoreRule.ts         # 핵심 규칙 API
├── apiHealth.ts           # 헬스 체크 API
└── index.ts               # API 모듈 집계
```

### 서버 계층 (`server/`)

#### 컨트롤러 (`controller/`)
```typescript
// HTTP 요청 핸들러
├── projectController.ts   # 프로젝트 CRUD 엔드포인트
├── traitController.ts     # 특성 관리 엔드포인트
├── abilityController.ts   # 능력 관리 엔드포인트
├── coreRuleController.ts  # 핵심 규칙 엔드포인트
└── index.ts              # 컨트롤러 집계
```

#### 서비스 (`service/`)
```typescript
// 비즈니스 로직 및 데이터 처리
├── projectService.ts      # 프로젝트 비즈니스 로직
├── traitService.ts        # 특성 비즈니스 로직
├── abilityService.ts      # 능력 비즈니스 로직
├── coreRuleService.ts     # 핵심 규칙 비즈니스 로직
└── index.ts               # 서비스 집계
```

#### 스키마 (`schema/`)
```typescript
// 데이터베이스 테이블 정의
├── local/                 # SQLite 테이블 스키마
│   ├── common.columns.ts  # 공통 컬럼 정의
│   ├── projects.table.ts  # 프로젝트 테이블
│   ├── traits.table.ts    # 특성 테이블
│   ├── abilities.table.ts # 능력 테이블
│   └── ...                # 기타 로컬 테이블
└── remote/                # PostgreSQL 테이블 스키마
    ├── common.columns.ts  # 공통 컬럼
    ├── users.table.ts     # 사용자 테이블 (원격 전용)
    └── ...                # 기타 원격 테이블
```

#### 데이터베이스 (`db/`)
```typescript
// 데이터베이스 연결 및 컨텍스트 관리
├── index.ts               # 데이터베이스 초기화
├── localDb.ts             # 로컬 SQLite 연결
├── remoteDb.ts            # 원격 PostgreSQL 연결
└── context.ts             # 데이터베이스 컨텍스트 전환
```

### 윈도우 관리 (`window/`)
```typescript
├── index.ts              # 윈도우 관리 진입점
├── mainWindow.ts         # 메인 애플리케이션 윈도우
└── tray.ts               # 시스템 트레이 통합
```

### IPC (`ipc/`)
```typescript
// 프로세스 간 통신 핸들러
├── ipcWindowControl.ts   # 윈도우 제어 IPC
└── index.ts              # IPC 핸들러 집계
```

---

## 렌더러 프로세스 (`src/renderer/`)

### 진입점: `index.ts`
- **목적**: Vue 애플리케이션 초기화
- **책임**:
  - Vue 앱 생성
  - 라우터 설정
  - 스토어 등록
  - 전역 컴포넌트 등록

### 뷰 (`views/`)
```vue
# 다양한 라우트를 위한 페이지 수준 컴포넌트
├── MainView.vue           # 애플리케이션 홈페이지
├── ProjectListView.vue    # 프로젝트 관리
├── ProjectDetailView.vue  # 프로젝트 상세 컨테이너
├── CreateProjectView.vue  # 프로젝트 생성
└── project-detail/        # 중첩된 프로젝트 상세 뷰
    ├── OverviewSection.vue      # 프로젝트 개요
    ├── CoreRulesSection.vue     # 핵심 규칙 관리
    ├── CoreRuleDetailSection.vue # 핵심 규칙 상세
    ├── CoreRuleAddSection.vue    # 핵심 규칙 생성
    ├── TraitsAbilitiesSection.vue # 특성 & 능력
    └── PlaceholderSection.vue     # 미구현 기능 플레이스홀더
```

### 스토어 (`stores/`)
```typescript
// Pinia 상태 관리
├── projectStore.ts        # 프로젝트 상태 관리
├── traitStore.ts          # 특성 상태 관리
├── abilityStore.ts        # 능력 상태 관리
└── [other]Store.ts        # 기능별 스토어
```

### 컴포넌트 (`components/`)
```vue
# 재사용 가능한 UI 컴포넌트
├── common/                # 공통 UI 컴포넌트
│   ├── AppTitleBar.vue    # 커스텀 타이틀 바
│   ├── AppLoadingScreen.vue # 로딩 화면
│   └── [other]Common.vue  # 기타 공통 컴포넌트
├── forms/                 # 폼 컴포넌트
├── lists/                 # 리스트 표시 컴포넌트
└── [feature]/             # 기능별 컴포넌트
```
