# Electron Template

Electron + Vue 3 + TypeScript를 기반으로 한 데스크톱 애플리케이션 개발 템플릿입니다.  
메인 프로세스 내 **Hono** HTTP 서버, **Controller → Service → DB(Mapper)** 3계층 구조, **로컬 SQLite / 원격 Postgres** 전환을 지원합니다.

## 📋 목차

- [기술 스택](#-기술-스택)
- [주요 기능](#-주요-기능)
- [프로젝트 구조](#-프로젝트-구조)
- [설정](#-설정)
- [시작하기](#-시작하기)
- [개발 가이드](#-개발-가이드)
- [빌드 및 배포](#-빌드-및-배포)
- [문서](#-문서)

---

## 🛠 기술 스택

### 핵심 기술

- **Electron** - 크로스 플랫폼 데스크톱 애플리케이션
- **Vue 3** - 프론트엔드 (Composition API)
- **TypeScript** - 타입 안전성
- **electron-vite** - Main / Preload / Renderer 빌드

### 메인 프로세스 (서버·DB)

- **Hono** - 메인 프로세스 내부 HTTP API (Controller → Service → Mapper)
- **@hono/node-server** - Hono Node.js 어댑터
- **Drizzle ORM** - 로컬 SQLite · 원격 Postgres 공통 스키마·쿼리
- **better-sqlite3** - 로컬 SQLite 드라이버
- **pg** - 원격 Postgres 드라이버

### UI 및 스타일링

- **Tailwind CSS** - 유틸리티 우선 CSS
- **class-variance-authority** · **tailwind-merge** - 컴포넌트 variant·클래스 병합

### 기타

- **Pinia** - Vue 상태 관리
- **Axios** - 외부 API 호출 (Main Process 경유)
- **Luxon** · **UUID** · **Zod** - 날짜·ID·스키마 검증

---

## ✨ 주요 기능

### 보안

- ✅ **Context Isolation** · **Node Integration** 비활성화
- ✅ **Preload Script**를 통한 안전한 API 노출

### 메인 프로세스

- 🌐 **Hono HTTP 서버** - `config/app.json`의 `server.port`(기본 3456)에서 동작
- 📐 **3계층 구조** - Controller(HTTP) → Service(비즈니스) → DB(Mapper, Drizzle)
- 🗄️ **이중 DB** - 기본 로컬 SQLite, 설정 전환 시 원격 Postgres (`db.mode`, `db.remote.connectionUrl`)
- 🔗 **CORS** - 렌더러(localhost:3000)에서 Hono API fetch 허용

### 렌더러

- 📡 **Hono API 클라이언트** - IPC로 base URL 취득 후 `fetch` (예: `/health`)
- 🛣️ **Vue Router** - Hash 모드, Home / Health 등

### 설정

- 📄 **config/app.json** - API, server, db 설정
- 📝 **config/types.ts** - `AppConfig`, `ServerConfig`, `ApiConfig`, `DbConfig` 등 타입 정의 (메인 전역 재활용)

---

## 📁 프로젝트 구조

```
electron-template/
├── config/                     # 설정
│   ├── app.json               # API baseURL, server(port/hostname), db(mode/local/remote)
│   └── types.ts               # AppConfig, ServerConfig, ApiConfig, DbConfig
├── src/
│   ├── main/                   # Main Process
│   │   ├── index.ts            # 앱 진입점, IPC·Hono 서버·DB context·윈도우
│   │   ├── api/                # Hono API (axios 단일 인스턴스) - IPC 경유 호출
│   │   │   ├── index.ts        # apiClient, IPC 등록
│   │   │   ├── clients.ts      # apiClient (config.api.baseURL = Hono)
│   │   │   ├── apiGetExample.ts
│   │   │   └── apiGetHealth.ts
│   │   ├── ipc/                # IPC 핸들러
│   │   │   ├── index.ts        # 핸들러 등록
│   │   │   ├── ipcGetPing.ts
│   │   │   └── ipcGetHonoBaseUrl.ts  # Hono base URL (렌더러용)
│   │   ├── server/             # Hono 서버 (Controller → Service → DB)
│   │   │   ├── index.ts        # startHonoServer, closeHonoServer
│   │   │   ├── honoApp.ts      # Hono 앱, CORS, 라우트 마운트
│   │   │   ├── controller/     # HTTP 요청/응답
│   │   │   │   ├── index.ts    # createControllerApp()
│   │   │   │   ├── HomeController.ts
│   │   │   │   ├── HealthController.ts
│   │   │   │   └── ExampleController.ts
│   │   │   ├── service/        # 비즈니스 로직
│   │   │   │   ├── index.ts
│   │   │   │   ├── HealthService.ts
│   │   │   │   └── ExampleService.ts
│   │   │   ├── db/             # DB 레이어 (getDb, context, mapper)
│   │   │   │   ├── index.ts    # getDb, getDbMode, initDbContext, closeDb
│   │   │   │   ├── context.ts  # mode 결정, 연결 캐시, 마이그레이션
│   │   │   │   ├── client/     # 연결 생성
│   │   │   │   │   ├── types.ts   # DbMode, DbConfig
│   │   │   │   │   ├── local.ts   # better-sqlite3 + Drizzle
│   │   │   │   │   └── remote.ts # pg + Drizzle
│   │   │   │   └── mapper/     # 데이터 접근
│   │   │   │       ├── index.ts
│   │   │   │       └── HealthMapper.ts
│   │   │   └── schema/         # Drizzle 스키마 (로컬/원격 분리)
│   │   │       ├── local/      # SQLite
│   │   │       │   ├── index.ts
│   │   │       │   └── example.table.ts
│   │   │       └── remote/     # Postgres
│   │   │           ├── index.ts
│   │   │           └── example.table.ts
│   │   └── window/
│   │       ├── index.ts
│   │       └── mainWindow.ts   # BrowserWindow, preload 경로
│   ├── preload/
│   │   └── index.ts            # ipc(getHonoBaseUrl 등), api 노출
│   └── renderer/               # Renderer Process (Vue)
│       ├── api/
│       │   └── honoClient.ts   # getHealth(), ipc.getHonoBaseUrl() 활용
│       ├── assets/
│       │   ├── images/
│       │   └── styles/
│       ├── types/
│       │   └── electron.d.ts   # Electron API 타입
│       ├── utils/
│       ├── views/
│       │   ├── Home.vue        # Example (IPC api.getExample)
│       │   └── Health.vue      # Hono /health
│       ├── router/
│       ├── App.vue
│       ├── index.html
│       └── index.ts
├── drizzle/                    # 마이그레이션 SQL (generate로 생성)
│   ├── local/                  # 로컬 스키마 마이그레이션
│   └── remote/                 # 원격 스키마 마이그레이션
├── drizzle.config.local.ts     # 로컬 SQLite 스키마 → drizzle/local
├── drizzle.config.remote.ts    # 원격 Postgres 스키마 → drizzle/remote
├── docs/
│   └── IPC_GUIDE.md
├── PRD/                        # PRD 문서 및 Plan & Result (선택)
│   ├── PRD.md
│   ├── Coding Rules & Guidelines.md
│   ├── Development Task List.md
│   └── plans/                 # 플랜·결과 같은 폴더 (YYYY-MM-DD/ 아래 *_PLAN.md, *_RESULT.md)
├── out/                       # 빌드 출력
├── electron.vite.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

---

## ⚙️ 설정

### config/app.json

| 키 | 설명 |
|----|------|
| `api.baseURL` | 외부 API base URL (axios) |
| `api.timeout` | 타임아웃(ms) |
| `server.port` | Hono 서버 포트 (기본 3456) |
| `server.hostname` | Hono 바인드 주소 (기본 localhost) |
| `db.mode` | `"local"` \| `"remote"` |
| `db.local.path` | 로컬 SQLite 파일 경로 |
| `db.remote.connectionUrl` | 원격 Postgres 연결 문자열 (mode=remote 시 필수) |

### config/types.ts

`AppConfig`, `ServerConfig`, `ApiConfig`, `DbConfig`, `DbMode` 타입을 정의하며, 메인 프로세스 전역에서 `appConfig as AppConfig` 형태로 재활용합니다.

---

## 🚀 시작하기

### 필수 요구사항

- **Node.js** 18.x 이상
- **pnpm** (프로젝트 지정 버전 사용 권장)

### 설치

```bash
pnpm install
```

### 개발 모드

```bash
pnpm dev
```

- Main · Preload는 변경 시 재빌드
- Renderer는 Vite HMR
- Hono 서버: `http://localhost:3456` (config 기준)
- Renderer: `http://localhost:3000`

### 빌드

```bash
pnpm build
```

출력: `out/` (main, preload, renderer)

### 미리보기

```bash
pnpm preview
```

### DB 마이그레이션 생성

```bash
# 로컬 SQLite 스키마 → drizzle/local
pnpm db:generate

# 원격 Postgres 스키마 → drizzle/remote
pnpm db:generate:remote
```

로컬 DB는 앱 기동 후 `getDb()` 호출 시 `drizzle/local` 마이그레이션이 자동 적용됩니다.

---

## 📖 개발 가이드

### IPC 추가

1. **Main** - `main/ipc/ipc<행위><대상>.ts`에 핸들러 구현
2. **등록** - `main/ipc/index.ts`에서 해당 함수 호출
3. **Preload** - `preload/index.ts`에서 `invoke` 노출
4. **타입** - `renderer/types/electron.d.ts`에 시그니처 추가
5. **Renderer** - `window.electron.*` 로 사용

자세한 내용은 [IPC 통신 가이드](./docs/IPC_GUIDE.md)를 참고하세요.

### Hono API 추가 (Controller → Service → Mapper)

1. **스키마** - `main/server/schema/local` 또는 `remote`에 테이블 정의 (필요 시)
2. **Mapper** - `main/server/db/mapper/` 에 조회·저장 함수 (getDb() 사용)
3. **Service** - `main/server/service/` 에 비즈니스 로직, Mapper 호출
4. **Controller** - `main/server/controller/` 에 Hono 라우트, Service 호출
5. **라우트 등록** - `main/server/controller/index.ts` 에 `app.route(...)` 추가

### 렌더러에서 Hono API 호출

- `window.electron.ipc.getHonoBaseUrl()` 으로 base URL 취득
- `renderer/api/honoClient.ts` 에 `getHealth()` 등 추가 후 `fetch(baseUrl + '/경로')` 사용

### 스타일링

Tailwind CSS 사용. 커스텀 스타일은 `renderer/assets/styles/` 에 추가.

**경로 별칭**

- `~/*` → `renderer/*`
- `@main/*` → `main/*`
- `@preload/*` → `preload/*`
- `@config/*` → `config/*`
- `@/*` → 프로젝트 루트

### 상태 관리

Pinia 사용. Store는 `renderer/stores/` 에 생성합니다.

---

## 🏗 빌드 및 배포

빌드 설정은 `electron.vite.config.ts`에서 Main / Preload / Renderer 별로 관리합니다.

배포 시 [electron-builder](https://www.electron.build/) 또는 [electron-forge](https://www.electronforge.io/) 등 패키징 도구를 사용하세요.

---

## 📚 문서

- [IPC 통신 가이드](./docs/IPC_GUIDE.md) - IPC 추가 및 사용 방법

---

## 🛡️ 보안

- **Context Isolation** 활성화
- **Node Integration** 비활성화
- **Preload** - contextBridge로 필요한 API만 노출

[Electron 보안 가이드](https://www.electronjs.org/docs/latest/tutorial/security)를 참고하세요.

---

## 📝 라이선스

ISC

---

**프로젝트 이름**: keyword-manager  
**버전**: 1.0.0  
**패키지 매니저**: pnpm@10.28.2
