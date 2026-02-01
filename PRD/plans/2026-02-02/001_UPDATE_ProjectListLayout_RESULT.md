# RESULT: 프로젝트 리스트·레이아웃 구조 변경 (사이드바/메인을 뷰 단위로 이전)

> **Date:** 2026-02-02  
> **Task ID:** 001_UPDATE_ProjectListLayout  
> **Status:** ✅ SUCCESS  
> **Language:** Korean

## 1. Execution Summary

001_UPDATE_ProjectListLayout_PLAN.md에 정의된 **App.vue 전역 레이아웃 제거** 및 **ProjectListView 자체 [목록 | 상세] 레이아웃 이전** 작업을 완료하였다. 앱 전체는 스크롤 없이 고정하고, ProjectListView 좌측(목록)·우측(main)은 각각 별도 스크롤되도록 적용하였다.

## 2. Modified / Confirmed Files

- [Modified] `src/renderer/App.vue` — AppSidebar·flex-row 제거, TitleBar + main(RouterView)만 유지, main에 `min-h-0 overflow-hidden` 적용
- [Modified] `src/renderer/views/ProjectListView.vue` — [좌측 aside | 우측 main] 레이아웃 구현, 쿼리 `?prjNo=` 기반 선택·상세 표시, 좌/우 각각 `overflow-y-auto`·`overflow-auto` 적용
- [Unchanged] `src/renderer/router/index.ts` — `/project-list` 유지, 쿼리로 선택 반영(경로 변경 없음)
- [Unchanged] `src/renderer/components/common/AppSidebar.vue` — App에서 제거됨, ProjectListView에서 인라인으로 대체(컴포넌트 미사용)
- [Unchanged] `src/renderer/views/CreateProjectView.vue` — 구조 변경 없음

## 3. Key Changes

- **App.vue**: 전역 [AppSidebar | main] 제거. TitleBar + `<main class="flex-1 min-h-0 min-w-0 shrink overflow-hidden">` + RouterView만 유지. 앱 레벨 스크롤 없음.
- **ProjectListView**: 루트 `flex h-full min-h-0 overflow-hidden`. 좌측 aside(300px): "프로젝트 생성" 링크 + projectList 목록, `overflow-y-auto`. 우측 main: `flex-1 min-h-0 overflow-auto`, 선택 프로젝트 상세(prjNm, prjNo, prjDesc, genreType) 또는 "좌측 목록에서 프로젝트를 선택하세요." 표시.
- **선택 상태**: `route.query.prjNo` 파싱 → `selectedPrjNo`, `projectList`에서 매칭 → `selectedProject`. 클릭 시 `router.replace({ path: '/project-list', query: { prjNo: String(prjNo) } })`로 URL 반영.
- **스크롤**: 앱 전체 스크롤 없음. ProjectListView 내부만 좌측·우측 각각 독립 스크롤.

## 4. Verification Results

- **플랜 Task List**: 5개 항목 모두 완료(체크 반영 완료).
- **App**: 전역 사이드바 없음, RouterView만 전체 콘텐츠 영역 사용.
- **ProjectListView**: 좌측 목록 + 우측 상세, 쿼리 `?prjNo=`로 선택·상세 표시, 좌/우 별도 스크롤 동작.
- **CreateProjectView**: 구조 변경 없이 풀페이지 폼 유지.
- **RESULT 문서**: 본 파일(001_UPDATE_ProjectListLayout_RESULT.md) 생성 완료.
