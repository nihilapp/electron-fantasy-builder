# PLAN: 앱 초기 로딩 UI

> **Date:** 2026-02-04  
> **Task ID:** 001_UPDATE_AppInitialLoadingUI  
> **Language:** Korean (Required)

## 1. Objective

- 프로그램 **처음 열릴 때** DB 연결(initDbContext)·Hono 서버 기동 등으로 지연이 있어, 사용자가 빈 화면만 보는 구간이 있음.
- **목표**: 앱이 준비되기 전에는 **로딩 중** 상태를 명시적으로 보여 주는 UI를 도입한다. 준비 완료 후 본문(타이틀바·라우터 뷰)으로 전환한다.

## 2. Context Analysis

- **Target Files**
  - `src/renderer/App.vue`: 앱 루트. 현재는 곧바로 타이틀바 + RouterView를 렌더링하고, onMounted에서 projectStore.getProjectList() 호출.
  - `src/renderer/`: 로딩 전용 컴포넌트 또는 뷰 추가 가능.
- **Current Issue**
  - Main: `app.whenReady()` → initDbContext(), startHonoServer(), createMainWindow() 순서. 창이 뜬 뒤 loadURL/loadFile로 렌더러 로드.
  - 렌더러가 로드되어 Vue가 마운트될 때쯤에는 대부분 Hono·DB는 이미 준비된 상태일 수 있으나, 느린 환경에서는 Health API가 아직 실패할 수 있음.
  - 사용자 관점: 창이 뜨면 곧바로 본문이 보이거나, 아무것도 안 보이다가 갑자기 UI가 나타남. "로딩 중"이라는 인지가 없음.
- **관련**: Health API (GET /health), IPC (ipcGetPing, ipcGetHonoBaseUrl 등), projectStore.getProjectList()는 **앱 준비 이후** 호출하는 것이 자연스러움.

## 3. Strategy

### 3.1 준비 완료 정의

- **앱 준비 완료**: 백엔드(Hono)가 요청을 받을 수 있는 상태.
- **감지 방법 (택 1 또는 조합)**
  - **Health API**: `window.electron.api.getHealth()` (또는 honoClient fetch GET /health) 호출. 성공 시 준비 완료.
  - **IPC**: `window.electron.ipc.getPing()` 등으로 메인 프로세스 응답 확인. (실제로 Hono 리스닝과 무관할 수 있으므로, Health API가 더 정확.)
- **권장**: 렌더러에서 **Health API**(또는 baseURL + /health fetch) 호출. 성공하면 준비 완료로 간주하고 본문 UI로 전환. 실패 시 재시도(최대 N회·지연) 후 에러 메시지 표시 가능.

### 3.2 로딩 화면 UI

- **표시 시점**: App.vue 마운트 직후, `appReady === false`일 때.
- **내용**: 전체 화면 또는 메인 영역을 덮는 블록. 앱 이름("Fantasy Builder")·로고(선택)·"준비 중…" 또는 "로딩 중…" 문구, 스피너(또는 프로그레스 인디케이터).
- **스타일**: 기존 tailwind·커스텀 클래스 활용. 중앙 정렬, 배경은 레이아웃과 어울리게.

### 3.3 본문 전환

- **상태**: `appReady`(또는 `isAppReady`)를 ref로 두고, Health API 성공 시 true로 설정.
- **렌더링 분기**: `v-if="appReady"`일 때만 AppTitleBar + RouterView 노출. `v-else`일 때 로딩 화면 컴포넌트 노출.
- **데이터 로딩**: `appReady`가 true가 된 뒤 onMounted 또는 watch에서 projectStore.getProjectList() 호출 유지 (기존 동작).

### 3.4 에러 처리

- Health API 일정 횟수 실패 시: "연결할 수 없습니다. 잠시 후 다시 시도해 주세요." 등 메시지 + 재시도 버튼(선택).

## 4. Impact Analysis

- **Affected Files**
  - `src/renderer/App.vue`: appReady 상태 추가, 로딩/본문 분기, 준비 완료 감지 로직.
  - 신규: `src/renderer/components/common/AppLoadingScreen.vue` (또는 `views/AppLoadingView.vue`): 로딩 전용 UI.
- **Side Effects**
  - 프로젝트 목록 요청(getProjectList)은 앱 준비 후에만 수행하도록 하면, 불필요한 실패 재시도를 줄일 수 있음.
  - 개발 모드(loadURL)와 프로덕션(loadFile) 모두에서 동일하게 동작하도록 baseURL·API 호출 경로 확인 필요.

## 5. Task List

- [ ] **AppLoadingScreen.vue (또는 동일 역할 컴포넌트)**: "Fantasy Builder"·"준비 중…"·스피너 레이아웃. 기존 디자인 시스템(tailwind, button/typography) 활용.
- [ ] **App.vue**: `appReady` ref 추가. onMounted에서 Health API(또는 honoClient GET /health) 호출, 성공 시 `appReady = true`. 실패 시 재시도(선택) 또는 에러 메시지.
- [ ] **App.vue 템플릿**: `v-if="appReady"`일 때 AppTitleBar + main + RouterView, `v-else`일 때 AppLoadingScreen 노출.
- [ ] **getProjectList 시점**: appReady가 true가 된 이후에만 호출하도록 이동(예: watch(appReady) 또는 appReady 변경 후 nextTick에서 호출).
- [ ] **(선택)** Health API 실패 시 재시도 횟수·간격 정의 및 "다시 시도" 버튼 또는 안내 문구.
- [ ] **(선택)** Coding Rules & Guidelines에 로딩 화면 관련 스타일·접근성 규칙 보강.

## 6. Verification Plan

- `pnpm dev` 실행 후 창이 뜨면 **로딩 화면**이 먼저 보이는지 확인.
- 1~2초 이내(또는 Health 응답 시점)에 본문(타이틀바·메인 뷰)으로 전환되는지 확인.
- Hono 서버를 지연 기동하거나 DB 초기화를 느리게 한 시나리오(수동)에서도 로딩 화면이 유지되는지 확인.
- 프로젝트 목록이 기존처럼 로드되는지(준비 완료 후 getProjectList 호출) 확인.
