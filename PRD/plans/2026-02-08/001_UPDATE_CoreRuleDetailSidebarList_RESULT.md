# RESULT: 주요 설정 상세 화면 사이드바 목록 및 선택 상태 UI

> **Date:** 2026-02-08
> **Task ID:** 001_UPDATE_CoreRuleDetailSidebarList
> **Status:** ✅ SUCCESS
> **Language:** Korean

## 1. Execution Summary

주요 설정 상세(보기/수정) 진입 시 좌측에 해당 프로젝트의 주요 설정 목록을 보여 주고, 현재 보고 있는 설정을 선택 상태로 강조하는 UI를 구현했다. 다른 카테고리(종족/생물, 인물 등)에서도 동일한 패턴을 쓸 수 있도록 **공통 컴포넌트 `CategoryListSidebar`**를 신규 생성하고, `CoreRuleFormSection`에서 이를 사용하는 3단 레이아웃으로 연동했다.

## 2. Modified Files

- **[New]** `src/renderer/components/common/CategoryListSidebar.vue` — 카테고리 무관 목록 사이드바 + 선택 상태 + 로딩/에러 표시
- **[Modified]** `src/renderer/views/project-detail/core-rules/CoreRuleFormSection.vue` — 목록 state·loadSidebarList·getToCoreRuleDetail·3단 레이아웃 및 CategoryListSidebar 사용

## 3. Key Changes

- **CategoryListSidebar.vue**
  - Props: `title`, `items`(id, label), `selectedId`, `getTo(item)`, optional `loading`, `errorMessage`
  - 선택 항목 스타일: `bg-accent text-accent-foreground font-semibold` (ProjectDetailView 카테고리 활성과 동일)
  - 고정 폭 `w-65`, 세로 스크롤, 시맨틱 토큰·CVA·섹션 주석·JSDoc 준수. 로딩/에러 시 문구 표시
- **CoreRuleFormSection.vue**
  - 상세/수정 모드 전용 state: `sidebarList`, `sidebarListLoading`, `sidebarListError`
  - `sidebarItems` computed: CoreRuleVo[] → { id, label }[]
  - `loadSidebarList()`: getCoreRuleList(prjNo, { page: 1, pageSize: 100 }) 호출 후 sidebarList 반영
  - `getToCoreRuleDetail(listItem)`: project-core-rule-detail 라우트 반환 (CategoryListSidebar getTo용)
  - watch에서 `!isCreateMode`일 때 loadItem()과 함께 loadSidebarList() 호출
  - 「상세: 데이터 있음」 블록을 3단 구성으로 변경: CategoryListSidebar | 메인 section | SettingSidebar. 등록 모드는 기존 2단 유지

## 4. Verification Results

- 등록 모드(`/core-rules/new`): 목록 사이드바 없음, 메인 + SettingSidebar만 표시됨
- 상세 진입 시: 좌측에 「주요 설정」 목록 표시, 현재 항목 선택(강조) 스타일 적용
- 목록에서 다른 항목 클릭 시 해당 상세로 이동, 선택 강조 갱신
- CategoryListSidebar는 라우트/도메인에 의존하지 않고 props만으로 동작하여 다른 카테고리에서 재사용 가능
- 린트·Coding Rules(시맨틱 토큰, CVA, 섹션 순서) 위반 없음
