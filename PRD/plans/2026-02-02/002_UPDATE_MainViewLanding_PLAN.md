# PLAN: MainView 랜딩/웰컴 화면 구성

> **Date:** 2026-02-02  
> **Task ID:** 002_UPDATE_MainViewLanding  
> **Language:** Korean (Required)

## 1. Objective

- **현재**: MainView는 프로젝트가 없을 때 "프로젝트 생성" 버튼 하나만 노출하고, 프로젝트가 있으면 `/project-list`로 즉시 리다이렉트함. 버튼 하나만 덩그러니 있는 구성이라 빈약함.
- **목표**: MainView를 **랜딩/웰컴 화면**으로 재구성하여, 첫 진입 시 앱 소개·시작 유도가 자연스럽도록 한다. (1) 프로젝트 없을 때: 웰컴 문구·간단 설명 + CTA. (2) 프로젝트 있을 때: 기존 리다이렉트 유지 또는 짧은 안내 후 이동. (3) 로딩 중일 때: 스켈레톤 또는 로딩 문구로 처리.

## 2. Context Analysis

- **Target File**: `src/renderer/views/MainView.vue`
- **Current Issue**
  - `showCreatePrompt`(isLoaded && !hasProjects)일 때 `RouterLink` + 버튼 하나만 표시.
  - 로딩 중(`!isLoaded`)일 때는 `showCreatePrompt`가 false라 아무것도 안 보임(빈 화면).
  - 프로젝트 있을 때는 watch로 바로 `/project-list` 이동 → 사용자가 "/" 에 머무를 일이 거의 없음.
- **관련**: projectStore(isLoaded, hasProjects), RouterLink(to="/create-project", to="/project-list"), 기존 버튼 스타일(button-base, text-h4, rounded-2).

## 3. Strategy

### 3.1 랜딩 화면 구성 (프로젝트 없을 때)

- **상단**: 앱 이름 또는 로고 영역 (선택). "Fantasy Builder" 등 타이틀 노출.
- **본문**: 짧은 웰컴/소개 문구 1~2줄. 예: "세계관과 캐릭터를 위한 프로젝트를 만들어 보세요."
- **CTA**: "프로젝트 생성" 버튼(기존 동작 유지). 버튼 스타일은 기존 디자인 시스템 유지하되, 카드 또는 섹션 안에 두면 덩그러니 보이지 않음.
- **레이아웃**: 중앙 정렬 유지. 카드/박스로 감싸서 여백·구분을 주거나, 타이틀·설명·버튼을 세로로 배치.

### 3.2 로딩 상태

- **현재**: `!isLoaded`이면 `showCreatePrompt`가 false → 아무 UI 없음.
- **개선**: `!isLoaded`일 때 전용 블록 표시. "로딩 중…" 문구 또는 스켈레톤(플레이스홀더 카드). 레이아웃은 랜딩과 비슷한 중앙 영역에 두어 깜빡임 최소화.

### 3.3 프로젝트 있을 때

- **선택**: 메인 화면은 항상 보이게 하고, "프로젝트 관리" 버튼을 눌러 `/project-list`로 이동.
- **구현**: 자동 리다이렉트(watch) 제거. `hasProjects`일 때 "프로젝트 관리" 버튼(RouterLink to="/project-list") 노출. "프로젝트 생성"은 항상 노출(보조 스타일: `button-outline-gray-500`).

### 3.4 UI 요소

- 기존 `button-base`, `text-h4`, `rounded-2` 등 프로젝트 공통 클래스 활용.
- 필요 시 `VueIcon`으로 아이콘 추가 (예: 프로젝트 생성 아이콘).
- 카드/섹션 배경·테두리는 tailwind 기존 스타일(예: `rounded-2 border border-gray-200 bg-white p-6`)로 통일.

## 4. Impact Analysis

- **Affected Files**: `src/renderer/views/MainView.vue` 만 수정.
- **Side Effects**: 없음. 라우팅·스토어·다른 뷰와의 관계는 유지.

## 5. Task List

- [x] 로딩 상태 UI: `!isLoaded`일 때 "로딩 중…" 표시
- [x] 웰컴 영역: 타이틀 "Fantasy Builder" + 짧은 소개 문구, 카드 섹션
- [x] CTA: "프로젝트 관리"(hasProjects 시) + "프로젝트 생성" 버튼을 카드 안에 배치
- [x] (선택) 아이콘 추가: "프로젝트 관리" lucide:folder-open, "프로젝트 생성" lucide:plus
- [x] 프로젝트 있을 때: 메인 화면 유지, "프로젝트 관리" 버튼으로 `/project-list` 이동 (자동 리다이렉트 제거)
- [x] 버튼 아이콘 크기 개선: MainView CTA 버튼에 VueIcon `class="size-6 shrink-0"` 적용
- [x] 프로젝트 생성 폼: CreateProjectView에 prjNm(필수)·genreType·prjDesc 입력, postProject 호출 후 목록 갱신·/project-list 이동

## 6. Verification Plan

- "/" 진입 시 로딩 중이면 로딩 UI 표시.
- 로딩 완료 후 프로젝트 없으면 웰컴 문구 + "프로젝트 생성" 버튼이 보이고, 버튼 클릭 시 `/create-project` 이동.
- 프로젝트 있으면 기존처럼 `/project-list`로 이동.
- 전체적으로 버튼 하나만 덩그러니 있지 않고, 문맥이 있는 랜딩 화면으로 보이면 성공.
