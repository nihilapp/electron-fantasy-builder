# PLAN: 주요 설정 상세 화면 사이드바 목록 및 선택 상태 UI

> **Date:** 2026-02-08
> **Task ID:** 001_UPDATE_CoreRuleDetailSidebarList
> **Language:** Korean (Required)

## 1. Objective

주요 설정 목록(CoreRulesSection)에서 항목을 클릭해 상세(보기/수정) 화면으로 들어갔을 때, **해당 카테고리(주요 설정)의 설정 목록을 사이드바에 표시**하고, **현재 보고 있는 설정이 선택된 상태임을 시각적으로 알 수 있게** 한다.

**확장 전제:** 종족/생물, 인물, 지역, 국가, 단체, 도구, 역사, 신화·전설·설화 등 **다른 카테고리에서도 상세 진입 시 “목록 사이드바 + 현재 항목 선택 상태”를 동일한 방식으로 적용할 예정**이므로, 이번 구현은 **재사용 가능한 공통 컴포넌트**를 도입하여 모든 카테고리에서 같은 UI·동작을 쓰도록 설계한다.

## 2. Context Analysis

- **Target Files:**
  - `src/renderer/views/project-detail/core-rules/CoreRuleFormSection.vue` (소비처)
  - 신규: `src/renderer/components/common/CategoryListSidebar.vue` (공통 컴포넌트)
- **Current State:**
  - 상세/수정 진입 시 레이아웃: `[ 메인 컨텐츠 | SettingSidebar(메타·태그·연관설정) ]` 두 칼럼.
  - 목록으로 돌아가기는 상단 "목록으로" 버튼뿐이며, 같은 카테고리 내 다른 설정으로 바로 이동하는 목록 사이드바는 없음.
- **User Need:** 상세 화면에서도 좌측에 해당 카테고리의 설정 목록을 두고, 현재 선택된 설정을 강조하여 컨텍스트를 파악하기 쉽게 한다.

## 3. Strategy

- **공통 컴포넌트 도입:** “카테고리별 설정 목록 사이드바 + 선택 상태”를 **한 번만** 구현하기 위해 `CategoryListSidebar.vue`를 둔다. 이 컴포넌트는 **데이터·라우트에 무관**하게 동작하도록 props만 받는다.
  - **Props 예시:** `title`(사이드바 제목), `items`(배열, 항목당 `id`, `label`), `selectedId`(현재 선택 id), `getTo(item)`(항목별 `RouteLocationRaw`). 선택 시 스타일은 `ProjectDetailView` 카테고리 활성과 동일(`bg-accent`, `text-accent-foreground`, `font-semibold`).
  - **역할:** 목록 렌더링, 선택 상태 스타일, `RouterLink :to="getTo(item)"`로 이동만 담당. 목록 **조회(API 호출)는 부모(각 상세 뷰)가 수행**하고, 조회 결과를 props로 넘긴다.
- **표시 조건:** `CoreRuleFormSection`에서 **등록 모드가 아닐 때**(상세/수정, `coreNo` 존재)에만 좌측에 `CategoryListSidebar`를 노출. 등록 모드(`/core-rules/new`)는 기존 2단(메인 + SettingSidebar) 유지.
- **CoreRuleFormSection 책임:** 상세/수정일 때만 목록 API(`getCoreRuleList`) 호출 → `sidebarList` 등 state에 보관 → `CategoryListSidebar`에 `title="주요 설정"`, `items`, `selectedId=coreNoNum`, `getTo(item)` 전달. 레이아웃은 `[ CategoryListSidebar | 메인 | SettingSidebar ]` 3단.
- **다른 카테고리:** 추후 종족/생물, 인물 등 상세 뷰를 구현할 때 동일하게 해당 목록 API를 호출한 뒤 `CategoryListSidebar`에 각자의 `title`, `items`, `selectedId`, `getTo`만 넘기면 되도록 설계.
- **Coding Rules 준수:** CVA·섹션 순서·경계 주석, JSDoc, 이벤트 핸들러 `on*` 명명, 한 줄 공백, 시맨틱 토큰(Custom Only), `rounded-2` 등 radius 숫자 사용.

## 4. Impact Analysis

- **Affected Files:**
  - **신규:** `src/renderer/components/common/CategoryListSidebar.vue` — 카테고리 무관 목록 사이드바 + 선택 상태 UI.
  - **수정:** `src/renderer/views/project-detail/core-rules/CoreRuleFormSection.vue` — 상세/수정 시 목록 state·loadSidebarList·3단 레이아웃 및 `CategoryListSidebar` 사용.
- **Side Effects:**
  - 상세 진입 시 목록 API 1회 추가 호출. 좌측 사이드바로 메인 영역 폭 감소. 반응형·min-width는 기존 패턴 유지.
  - 다른 카테고리 상세 뷰 구현 시 동일 컴포넌트 재사용으로 일관된 UX·유지보수 이점.

## 5. Task List

- [ ] **공통:** `CategoryListSidebar.vue` 생성. Props: `title`, `items`(id, label), `selectedId`, `getTo(item)`. 로딩/에러는 부모에서 처리하거나 optional props로. 선택 항목 스타일 `bg-accent text-accent-foreground font-semibold`, 고정 폭·스크롤, 시맨틱 토큰·CVA·섹션 주석·JSDoc 준수.
- [ ] CoreRuleFormSection에 상세/수정 모드 전용 목록 state 추가 (`sidebarList`, `sidebarListLoading`, `sidebarListError`).
- [ ] 상세/수정 모드일 때만 목록 조회하는 `loadSidebarList()` 액션 추가. `prjNo`·`coreNoNum` 또는 loadItem 성공 후 호출.
- [ ] 상세/수정일 때 템플릿을 3단으로 변경: `CategoryListSidebar`(title="주요 설정", items, selectedId=coreNoNum, getTo로 project-core-rule-detail 링크) + 기존 메인 + 기존 SettingSidebar.
- [ ] 등록 모드일 때는 기존 2단(메인 + SettingSidebar) 유지.
- [ ] JSDoc·한 줄 공백·이벤트 핸들러 명명 규칙 점검.

## 6. Verification Plan

- 등록 모드(`/core-rules/new`) 진입 시: 목록 사이드바가 보이지 않고, 기존과 동일하게 메인 + SettingSidebar만 표시되는지 확인.
- 목록에서 항목 클릭 후 상세 진입 시: 좌측에 주요 설정 목록이 보이고, 클릭한 항목이 선택 상태(강조)로 표시되는지 확인.
- 목록에서 다른 항목 클릭 시: 해당 상세로 이동하고, 선택 강조가 바뀌는지 확인.
- "목록으로" 버튼으로 목록 화면(CoreRulesSection) 복귀 시 정상 동작하는지 확인.
- `CategoryListSidebar`가 라우트/도메인에 의존하지 않고 props만으로 동작하는지 확인(다른 카테고리에서 재사용 가능성).
- Coding Rules(시맨틱 토큰, CVA, 섹션 순서) 및 린트 위반 없음 확인.
