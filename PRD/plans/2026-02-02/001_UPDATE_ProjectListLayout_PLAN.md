# PLAN: 프로젝트 리스트·레이아웃 구조 변경 (사이드바/메인을 뷰 단위로 이전)

> **Date:** 2026-02-02  
> **Task ID:** 001_UPDATE_ProjectListLayout  
> **Language:** Korean (Required)

## 1. Objective

- **현재 문제**: App.vue에 [AppSidebar | main(RouterView)] 구조가 있어, 모든 라우트가 공통으로 좌측 사이드바 + 우측 main을 가짐. 프로젝트 리스트 화면에서는 **좌측에 프로젝트 목록**, **우측에 선택한 프로젝트 정보**가 보여야 하며, 추후 **단일 프로젝트 뷰**에서도 별도의 사이드바·목록·메인 구조가 필요함.
- **목표**: (1) App.vue의 전역 [사이드바 | main] 구조를 제거하고, (2) **ProjectListView**가 자체적으로 [좌측 프로젝트 목록 | 우측 프로젝트 상세] 레이아웃을 갖도록 이전. (3) CreateProjectView는 폼만 풀페이지로 유지. (4) 추후 프로젝트 뷰에서도 동일 패턴(뷰별 사이드바·목록·메인) 적용 가능하도록 설계.

## 2. Context Analysis

- **Target Files**
  - `src/renderer/App.vue` — 전역 레이아웃(사이드바 + main) 제거
  - `src/renderer/views/ProjectListView.vue` — [목록 | 상세] 레이아웃 소유, 좌측 리스트 + 우측 main
  - `src/renderer/components/common/AppSidebar.vue` — 전역에서 제거 후, ProjectListView 좌측 영역에 통합 또는 재사용
- **Current Issue**
  - App.vue 19–24행: `flex flex-row` 안에 `AppSidebar` + `main(RouterView)` 고정. 프로젝트 리스트 화면에서 “좌측=프로젝트 목록, 우측=선택 프로젝트 정보”를 만들려면 이 구조가 **뷰 내부**에 있어야 함.
- **CreateProjectView**
  - 프로젝트 생성 폼만 존재. Hono로 전송. 레이아웃 변경 없이 풀페이지 유지.
- **Future**
  - 단일 프로젝트 뷰: 자체 사이드바(예: 트레잇/어빌리티 목록) + 목록 + main 영역 필요.

## 3. Strategy

### 3.1 App.vue 변경

- **제거**: `<div class="flex flex-row ...">` + `AppSidebar` + `<main>...</main>` 구조.
- **유지**: `AppTitleBar` + `RouterView`만. RouterView가 전체 콘텐츠 영역을 차지하도록 구성.
- **초기화**: `onMounted`에서 `projectStore.getProjectList()` 호출은 유지 (앱 진입 시 목록 로드).

### 3.2 ProjectListView 레이아웃

- **구조**: 한 화면 안에 **두 영역**.
  - **좌측**: 고정 너비(예: 300px) — “프로젝트 생성” 링크 + 프로젝트 목록(스토어 `projectList`). 목록 항목 클릭 시 우측에 해당 프로젝트 정보 표시.
  - **우측**: `flex-1` — 선택된 프로젝트 정보(main). 미선택 시 빈 상태 또는 안내 문구.
- **선택 상태**: 선택한 프로젝트 식별자(예: `prjNo`)를 **라우트 쿼리/파라미터** 또는 **스토어/로컬 상태**로 보관. 권장: `/project-list?prjNo=123` 또는 `/project-list/:prjNo`로 URL 반영 시 뒤로가기·공유 대응 용이.
- **AppSidebar 역할**: 현재 AppSidebar에 있는 “프로젝트 목록”·“프로젝트 생성” 링크는 ProjectListView 좌측 패널에 포함. AppSidebar 컴포넌트는 (a) ProjectListView 내부에서만 사용하거나, (b) 좌측 패널을 ProjectListView 전용 컴포넌트(예: ProjectListSidebar)로 새로 만들어 “프로젝트 생성” + 목록만 넣음.

### 3.3 CreateProjectView

- 변경 없음. RouterView만 풀페이지로 렌더되므로 폼 그대로 유지.

### 3.4 라우팅

- `/project-list`: ProjectListView 전체(좌측 목록 + 우측 main).
- 선택 프로젝트 반영: `path: '/project-list/:prjNo?'` 또는 쿼리 `?prjNo=` 사용 시 우측에서 `prjNo`로 상세 조회.
- MainView(/) 유지: 프로젝트 유무에 따라 “프로젝트 생성” CTA 또는 `/project-list` 리다이렉트는 기존 로직 유지.

### 3.5 추후 프로젝트 뷰 확장

- 단일 프로젝트 뷰(예: `/project/:prjNo`)에서도 **뷰 자체가** [사이드바 | 목록 | main] 레이아웃을 소유.
- 공통 레이아웃 컴포넌트(예: `TwoColumnLayout`, `SidebarMainLayout`)를 두고, ProjectListView와 추후 프로젝트 뷰에서 각각 다른 좌측/우측 내용을 넣는 방식으로 재사용 가능.

## 4. Impact Analysis

- **Affected Files**
  - `src/renderer/App.vue` — 레이아웃 단순화, AppSidebar 제거
  - `src/renderer/views/ProjectListView.vue` — [목록 | 상세] 레이아웃 구현, 좌측 목록 + 우측 main, 선택 상태 연동
  - `src/renderer/router/index.ts` — (선택) `/project-list/:prjNo?` 또는 쿼리로 선택 프로젝트 반영
  - `src/renderer/components/common/AppSidebar.vue` — App에서 제거 후, ProjectListView 내부에서만 사용하거나 좌측 전용 컴포넌트로 대체
- **Side Effects**
  - “프로젝트 목록”·“프로젝트 생성” 진입점이 AppSidebar에서 ProjectListView 좌측으로 이동. MainView 등 다른 뷰에서는 전역 사이드바가 사라짐.

## 5. Task List

- [x] App.vue: [AppSidebar | main] 제거, TitleBar + RouterView만 남기기
- [x] ProjectListView: 좌측(프로젝트 생성 링크 + projectList 목록) + 우측(선택 프로젝트 정보) 레이아웃 구현
- [x] 프로젝트 선택 시 우측에 해당 프로젝트 정보 표시 (라우트 쿼리 `?prjNo=` 사용)
- [x] AppSidebar: App에서 제거 후, ProjectListView 좌측에 링크·목록 통합(인라인 구현)
- [x] (선택) 라우터: 쿼리 `?prjNo=`로 선택 프로젝트 반영
- [x] CreateProjectView: 구조 변경 없음, 동작 확인

## 6. Verification Plan

- App 실행 시 App.vue에 전역 사이드바 없음, RouterView만 보임.
- `/project-list` 진입 시 ProjectListView에서 좌측에 프로젝트 목록, 우측에 main 영역 표시.
- 목록 항목 클릭 시 우측에 선택한 프로젝트 정보 표시(또는 placeholder).
- “프로젝트 생성” 링크로 CreateProjectView 이동 정상.
- CreateProjectView는 기존처럼 풀페이지 폼으로 동작.
