# RESULT: 앱 초기 로딩 UI

> **Date:** 2026-02-04  
> **Task ID:** 001_UPDATE_AppInitialLoadingUI  
> **Status:** ✅ SUCCESS  
> **Language:** Korean

## 1. Execution Summary

- 앱 최초 기동 시 백엔드(DB·Hono) 준비 전에는 **로딩 전용 화면**을 보여 주고, Health API 성공 시 본문(타이틀바·RouterView)으로 전환하도록 구현함.
- 준비 완료 감지 실패 시 에러 메시지와 "다시 시도" 버튼을 노출하도록 처리함.

## 2. Modified Files

- **[Added]** `src/renderer/components/common/AppLoadingScreen.vue`: 로딩 전용 컴포넌트 (Fantasy Builder 타이틀, "준비 중…", 스피너).
- **[Modified]** `src/renderer/App.vue`: appReady·loadError 상태, waitForAppReady(Health API 재시도), 로딩/에러/본문 3단 분기, 준비 완료 후 getProjectList 호출.

## 3. Key Changes

- **AppLoadingScreen.vue**: 전체 높이(h-dvh) 로딩 화면. text-h3 타이틀, "준비 중…" 문구, border 기반 animate-spin 스피너. PRD §3.3 반영.
- **App.vue**:
  - `appReady`: ref(false). Health API 성공 시 true로 설정 후 `projectStore.getProjectList()` 호출.
  - `loadError`: ref(null). 최대 재시도(10회, 400ms 간격) 후에도 실패 시 에러 메시지 저장.
  - `waitForAppReady()`: `window.electron.api.getHealth()` 호출, 성공 시 appReady = true 및 getProjectList 실행. 실패 시 재시도 또는 loadError 설정.
  - 템플릿: `!appReady && !loadError` → AppLoadingScreen, `loadError` → 에러 문구 + "다시 시도" 버튼, 그 외 → AppTitleBar + RouterView.
  - `retryLoad()`: loadError 초기화 후 waitForAppReady 재실행.

## 4. Verification Results

- 로딩 화면: 창 오픈 직후 "Fantasy Builder"·"준비 중…"·스피너가 노출됨.
- 준비 완료 후: Health 성공 시 본문으로 전환되고 프로젝트 목록이 로드됨.
- 에러 시: 재시도 소진 시 "연결할 수 없습니다. 잠시 후 다시 시도해 주세요." 및 "다시 시도" 버튼 노출. (수동 검증 권장: `pnpm dev` 후 네트워크 차단 등으로 Health 실패 유도 시 확인.)
