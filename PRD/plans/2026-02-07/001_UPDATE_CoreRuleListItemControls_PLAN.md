# PLAN: 코어 설정 목록 아이템 개선 (유형 카테고리·우측 컨트롤 아이콘)

> **Date:** 2026-02-07
> **Task ID:** 001_UPDATE_CoreRuleListItemControls
> **Language:** Korean (Required)

## 1. Objective

코어 설정 목록(CoreRulesSection)의 각 목록 아이템을 개선한다.

- **유형(aplyScope)** 을 카테고리 뱃지 형태로 표시한다.
- **우측 상단**에 행동 컨트롤 아이콘 5종을 배치한다.
  - **보기**: 클릭 시 해당 코어 설정 상세 페이지로 이동(뷰 모드).
  - **수정**: 상세 페이지에서 수정 가능 상태로 전환(같은 페이지, 편집 모드).
  - **즐겨찾기**: 토글 아이콘. 1차는 UI만(컴포넌트/로컬 상태). 추후 스키마 확장 시 PATCH 반영 가능.
  - **보호**: 토글 아이콘. 목록 전체 선택·일괄 삭제 시 제외되는 항목 표시. 1차는 UI만, 추후 스키마 확장 시 PATCH 반영.
  - **삭제**: 클릭 시 삭제 확인 후 API 호출로 삭제, 목록 갱신.

## 2. Context Analysis

- **Target Files:**
  - `src/renderer/views/project-detail/CoreRulesSection.vue` — 목록 아이템 UI 및 액션 연동
  - `src/main/api/apiCoreRule.ts` — 상세 조회·수정·삭제 API 호출 및 IPC 핸들러 추가
  - `src/preload/index.ts`, `src/renderer/types/electron.d.ts` — getCoreRule, patchCoreRule, deleteCoreRule 노출
  - `src/renderer/router/index.ts` — 코어 설정 상세 라우트 추가
  - 신규: `src/renderer/views/project-detail/CoreRuleDetailSection.vue` — 상세 보기/수정 뷰
- **Current Issue:**
  - 목록 아이템은 제목(coreNm)·유형(aplyScope) 텍스트만 있으며, 상세 이동·수정·삭제·즐겨찾기·보호 컨트롤이 없음.
  - 백엔드에는 GET/PATCH/DELETE `/core-rules/:coreNo` 가 있으나, 메인/프리로드에는 목록·생성만 노출되어 있음.

## 3. Strategy

1. **API·IPC**
   - `apiCoreRule.ts`: `apiGetCoreRuleByNo(prjNo, coreNo)`, `apiPatchCoreRule(prjNo, coreNo, body)`, `apiDeleteCoreRule(prjNo, coreNo)` 구현 및 기존 IPC에 핸들러 추가.
   - Preload·electron.d.ts에 `getCoreRule`, `patchCoreRule`, `deleteCoreRule` 추가.
2. **라우팅**
   - `path: 'core-rules/:coreNo'`, name: `project-core-rule-detail`, component: CoreRuleDetailSection. props: route params(prjNo, coreNo).
3. **CoreRuleDetailSection.vue**
   - inject prjNo, route param coreNo. GET으로 1건 조회 후 표시.
   - 보기 모드(기본): 읽기 전용 필드. 우측 상단에 "수정" 버튼 → 수정 모드 전환.
   - 수정 모드: CoreRuleAddSection과 동일한 폼 필드, PATCH로 저장 후 보기 모드로 전환 또는 목록으로 링크.
   - "목록" 링크: project-core-rules로 이동.
4. **CoreRulesSection.vue 목록 아이템**
   - 왼쪽: 제목(coreNm), 아래에 유형(aplyScope)을 **카테고리 뱃지**(작은 pill/rounded 라벨)로 표시.
   - 오른쪽: 아이콘 버튼 그룹(보기, 수정, 즐겨찾기, 보호, 삭제). VueIcon 사용, IconName 타입 준수.
   - 보기: `router.push({ name: 'project-core-rule-detail', params: { prjNo, coreNo } })`.
   - 수정: 동일 라우트로 이동 + 쿼리 `?mode=edit` 또는 상세 페이지 내 수정 모드 전환(상세에서 처리).
   - 삭제: 확인 대화상자 후 `deleteCoreRule(prjNo, coreNo)` 호출, 성공 시 loadList() 재호출.
   - 즐겨찾기/보호: 1차는 ref로 로컬 토글 상태만 유지(아이콘 채움/빈 상태). DB 필드 없음.
5. **컴포넌트 규칙**
   - Vue 컴포넌트 구조 규칙(.cursor/rules/vue-component-structure.mdc) 준수: BASE → STOREDATA → STATES → ACTIONS → WATCH → LIFECYCLE, 경계 주석 유지.

## 4. Impact Analysis

- **Affected Files:**
  - 수정: CoreRulesSection.vue, apiCoreRule.ts, preload/index.ts, electron.d.ts, router/index.ts
  - 신규: CoreRuleDetailSection.vue
- **Side Effects:**
  - 코어 설정 목록에서 상세로 진입 경로 생김. 기존 "추가" 플로우는 유지.

## 5. Task List

- [ ] apiCoreRule.ts: apiGetCoreRuleByNo, apiPatchCoreRule, apiDeleteCoreRule 구현 및 IPC 핸들러 등록
- [ ] preload/index.ts, electron.d.ts: getCoreRule, patchCoreRule, deleteCoreRule 노출
- [ ] router: core-rules/:coreNo 라우트 추가, CoreRuleDetailSection 연결
- [ ] CoreRuleDetailSection.vue 신규 작성(보기/수정 모드, inject prjNo, params coreNo)
- [ ] CoreRulesSection.vue: 목록 아이템에 유형 카테고리 뱃지 + 우측 보기/수정/즐겨찾기/보호/삭제 아이콘, 보기·수정·삭제 액션 연동

## 6. Verification Plan

- 코어 설정 목록에서 항목 우측 아이콘 클릭 시 보기(상세)·수정(상세에서 편집)·삭제(확인 후 목록 갱신) 동작 확인.
- 유형(aplyScope)이 카테고리 뱃지로 표시되는지 확인.
- 즐겨찾기·보호는 페이지 내 토글만 동작(재진입 시 초기화) 확인.
