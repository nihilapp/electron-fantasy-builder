# PLAN: main / preload / renderer를 src 폴더로 이전

> **Date:** 2025-01-31  
> **Task ID:** 002_UPDATE_MoveToSrc  
> **Language:** Korean (Required)

## 1. Objective

- **main**, **preload**, **renderer** 세 디렉터리를 루트가 아닌 **src** 폴더 안으로 이동한다.
- **config**, **types**, **drizzle**, **docs**, **PRD** 등은 루트에 유지한다.
- 빌드·개발 서버·타입 해석이 모두 새 경로를 사용하도록 설정을 일괄 수정하고, 문서를 갱신한다.

## 2. Context Analysis

### 2.1 현재 구조

- 루트 직하위: `main/`, `preload/`, `renderer/`, `config/`, `types/`, `drizzle/`, `docs/`, `PRD/` 등
- electron-vite: `main/index.ts`, `preload/index.ts`, `renderer/index.html`을 진입점으로 사용
- 출력: `out/main/`, `out/preload/`, `out/renderer/` (electron-vite 기본값 유지 가정)

### 2.2 목표 구조

```
electron-template/
├── config/           # (변경 없음)
├── docs/             # (변경 없음)
├── drizzle/         # (변경 없음)
├── PRD/              # (변경 없음)
├── types/            # (변경 없음)
├── src/
│   ├── main/         # 기존 main/ 이동
│   ├── preload/      # 기존 preload/ 이동
│   └── renderer/     # 기존 renderer/ 이동
├── electron.vite.config.ts
├── tsconfig.json
├── drizzle.config.local.ts
├── drizzle.config.remote.ts
└── ...
```

### 2.3 영향 받는 항목

| 구분 | 대상 | 변경 내용 |
|------|------|-----------|
| **빌드/진입점** | electron.vite.config.ts | main/preload/renderer 경로 → `src/main`, `src/preload`, `src/renderer`; alias 및 rollup input 전부 수정 |
| **타입/경로** | tsconfig.json | `paths`, `include`를 `src/main`, `src/preload`, `src/renderer` 기준으로 수정 |
| **스키마** | drizzle.config.local.ts, drizzle.config.remote.ts | schema 경로 `./main/...` → `./src/main/...` |
| **런타임 경로** | main/window/mainWindow.ts | **변경 없음** (빌드 결과물은 여전히 `out/main`, `out/preload`, `out/renderer`) |
| **package.json** | main 필드 | **변경 없음** (`./out/main/index.js` 유지) |
| **소스 import** | @main, @preload, ~ alias 사용처 | **파일 내용 변경 없음** (alias만 src 하위로 맞추면 됨) |
| **문서** | README.md, docs/IPC_GUIDE.md | 프로젝트 구조·파일 위치 설명을 `src/main`, `src/preload`, `src/renderer` 기준으로 수정 |

## 3. Strategy

### 3.1 이동 방식

- `main` → `src/main`
- `preload` → `src/preload`
- `renderer` → `src/renderer`  
(폴더 단위 이동 후 루트의 기존 폴더 제거)

### 3.2 설정 수정 원칙

- **electron.vite.config.ts**: `resolve(__dirname, 'main')` → `resolve(__dirname, 'src/main')` 등으로 일괄 치환. `renderer`의 `root`는 `'src/renderer'`로 지정. rollupOptions.input 경로도 `src/` 접두사 적용.
- **tsconfig.json**: `paths`의 `~/*` → `src/renderer/*`, `@main/*` → `src/main/*`, `@preload/*` → `src/preload/*`. `include`에 `src/main/**/*`, `src/preload/**/*`, `src/renderer/**/*` 추가(기존 main/preload/renderer 제거).
- **drizzle**: schema 경로만 `./src/main/server/schema/...` 로 변경.

### 3.3 유지 사항

- **mainWindow.ts** 내 `join(__dirname, '../preload/index.js')`, `join(__dirname, '../../renderer/index.html')` 는 **그대로**. 빌드 결과물이 `out/main`, `out/preload`, `out/renderer`에 나가므로 런타임 `__dirname` 기준 상대 경로는 동일하게 동작한다.
- **package.json** 의 `"main": "./out/main/index.js"` 유지.

## 4. Impact Analysis

### 4.1 수정/이동 대상

| 유형 | 경로 | 조치 |
|------|------|------|
| 디렉터리 이동 | main, preload, renderer | → src/main, src/preload, src/renderer |
| 설정 | electron.vite.config.ts | 경로·alias·root·input 전부 src 기준으로 수정 |
| 설정 | tsconfig.json | paths, include 수정 |
| 설정 | drizzle.config.local.ts | schema → ./src/main/server/schema/local/index.ts |
| 설정 | drizzle.config.remote.ts | schema → ./src/main/server/schema/remote/index.ts |
| 문서 | README.md | 프로젝트 구조 트리·설명을 src 포함 구조로 수정 |
| 문서 | docs/IPC_GUIDE.md | main/, preload/, renderer/ → src/main/, src/preload/, src/renderer/ 로 문구·경로 수정 |

### 4.2 변경하지 않는 것

- package.json (main 필드)
- main/window/mainWindow.ts (런타임 경로)
- 소스 코드 내 import 문 (alias만 설정에서 맞추면 됨)
- config, types, drizzle, docs, PRD, .gitignore, eslint.config.mjs (경로 하드코딩 없음)

### 4.3 Side Effects

- 기존 `main/`, `preload/`, `renderer/` 를 참조하는 외부 스크립트·CI·문서가 있다면 `src/` 하위로 참조를 바꿔야 함.
- IDE/TypeScript는 tsconfig paths·include 반영 후 자동으로 새 구조 인식.

## 5. Task List

- [ ] **T1** `src` 디렉터리 생성 후 `main`, `preload`, `renderer` 폴더를 `src/` 안으로 이동 (기존 루트의 main, preload, renderer 삭제)
- [ ] **T2** `electron.vite.config.ts` 수정: alias 및 rollup input 경로를 `src/main`, `src/preload`, `src/renderer` 기준으로 변경, renderer root를 `src/renderer`로 지정
- [ ] **T3** `tsconfig.json` 수정: `paths`와 `include`를 src 기준으로 변경
- [ ] **T4** `drizzle.config.local.ts`의 schema 경로를 `./src/main/server/schema/local/index.ts`로 변경
- [ ] **T5** `drizzle.config.remote.ts`의 schema 경로를 `./src/main/server/schema/remote/index.ts`로 변경
- [ ] **T6** `README.md`의 프로젝트 구조 섹션을 `src/` 포함 구조로 수정
- [ ] **T7** `docs/IPC_GUIDE.md` 내 main/, preload/, renderer/ 경로 표기를 src/main/, src/preload/, src/renderer/로 일괄 수정
- [ ] **T8** `pnpm run dev` 및 `pnpm run build`로 동작·빌드 검증

## 6. Verification Plan

1. **개발**: `pnpm run dev` 실행 후 앱 기동, 윈도우·Hono·렌더러 로드 정상 여부 확인
2. **빌드**: `pnpm run build` 후 `out/main`, `out/preload`, `out/renderer` 생성 및 실행 파일 기동 확인
3. **타입**: `tsc --noEmit` 또는 IDE에서 main/preload/renderer 소스에 대한 경로·타입 에러 없음 확인
4. **Drizzle**: `pnpm db:generate`, `pnpm db:generate:remote` 실행하여 스키마 경로 인식 확인
5. **문서**: README·IPC_GUIDE에서 경로가 src 기준으로 일치하는지 훑어보기

---

마스터, `[ 002_UPDATE_MoveToSrc_PLAN.md ]` 계획을 수립했습니다. 진행하겠습니까?
