# PLAN: 3단계 레이아웃 컴포넌트 도입 및 뷰 정리

> **Date:** 2026-02-08
> **Task ID:** 002_UPDATE_ThreeLayoutComponents
> **Language:** Korean (Required)

## 1. Objective

프로젝트 내 설정 관련 화면을 **세 가지 레이아웃**으로 명확히 구분하고, 현재 ProjectDetailView·CoreRuleFormSection에 흩어져 있는 레이아웃 로직을 **재사용 가능한 레이아웃 컴포넌트**로 옮겨 일관된 구조와 추후 카테고리 확장을 쉽게 한다.

| 레이아웃 | 용도 | 좌측 | 우측 |
|----------|------|------|------|
| **ProjectMenuLayout** | 1차 뎁스 — 설정 목록이 보이는 페이지 | 설정 카테고리(첫 화면, 목록으로, 프로젝트 개요, 주요 설정 등) | 설정 목록 콘텐츠 |
| **LoreListLayout** | 2차 — 설정(카테고리) 클릭 후 | 해당 카테고리의 설정 리스트(목록으로·처음으로 + 항목 목록) | 설정 상세 영역(본문+메타를 담는 영역) |
| **LoreDetailLayout** | 상세 영역 내부 | 설정 본문 컬럼(폼/보기) | 설정 메타데이터(태그, 연관 설정, 메타 필드) |

## 2. Context Analysis

- **Current State:**
  - **ProjectDetailView**: 목록 라우트일 때 좌측 aside(카테고리) + main(RouterView), 상세 라우트일 때 main만 전체 폭. 카테고리 네비·ROUTES_WITH_DETAIL_LAYOUT 등 레이아웃이 뷰에 직접 구현됨.
  - **CoreRuleFormSection**: 상세 시 [CategoryListSidebar] [section] [SettingSidebar] 3단을 인라인으로 구성. 등록/에러/로딩 등 분기 많음.
  - **layouts 폴더**: ProjectMenuLayout, LoreListLayout, LoreDetailLayout 은 스텁(placeholder) 상태.
- **Target:** 위 세 레이아웃을 **슬롯 기반**으로 구현하고, ProjectDetailView·CoreRuleFormSection(및 추후 다른 카테고리)이 이 레이아웃을 사용하도록 정리.

## 3. Strategy

### 3.1 ProjectMenuLayout

- **역할:** 1차 뎁스. 좌측 = 프로젝트 진입 후 보이는 설정 카테고리 사이드바, 우측 = 메인 콘텐츠(설정 목록 등).
- **구조:** `[aside] + [main]`. aside 내부: 첫 화면, 목록으로, 설정(카테고리 목록). main = **default slot**.
- **데이터:** 카테고리 목록·프로젝트·활성 판별은 **부모가 제공**. Props: `project` (ProjectVo | null), `categoryItems` (라벨·name·path·icon), `activeRouteName` (string, 활성 카테고리 판별용). 또는 `prjNo` + inject 보조. 첫 화면/목록으로 링크는 project 기반으로 생성.
- **스타일:** 기존 ProjectDetailView의 aside·main과 동일한 클래스(w-65, border-r, overflow 등). 시맨틱 토큰·CVA·섹션 주석 준수.

### 3.2 LoreListLayout

- **역할:** 설정(카테고리) 클릭 후 화면. 좌측 = 해당 카테고리의 설정 리스트, 우측 = 상세 영역.
- **구조:** `[좌측 slot] + [우측 default slot]`. 좌측은 **#sidebar** slot으로 받아, CategoryListSidebar를 부모가 넣을 수 있게 함. 우측 default = 상세 전체(본문+메타를 포함한 영역).
- **Props:** class 등 최소한. 데이터·네비게이션은 부모(CoreRuleFormSection 등)가 CategoryListSidebar에 넘기고, LoreListLayout은 레이아웃만 담당.
- **스타일:** flex row, 좌측 고정 폭·스크롤, 우측 flex-1 min-w-0 overflow-hidden. 기존 CoreRuleFormSection의 3단 래퍼와 동일한 느낌.

### 3.3 LoreDetailLayout

- **역할:** 상세 영역 내부. 좌측 = 설정 본문(폼/보기), 우측 = 메타데이터(태그, 연관 설정, 메타 필드).
- **구조:** `[본문 default slot] + [메타 #meta slot]`. SettingSidebar는 부모가 #meta에 넣거나, LoreDetailLayout이 #meta slot만 제공하고 부모가 SettingSidebar를 채움.
- **Props:** class 등. 스타일: 좌측 flex-2 overflow-auto, 우측 w-80 shrink-0(SettingSidebar와 유사).

### 3.4 뷰 연동

- **ProjectDetailView**
  - 목록 라우트(`!isDetailLayoutRoute`): 기존 aside+main 대신 `<ProjectMenuLayout :project="project" :category-items="categoryItems" :active-route-name="route.name">` + default slot에 `<RouterView />`. project·categoryItems·route는 기존 그대로 사용. isActiveCategory는 ProjectMenuLayout으로 이전하거나 props로 전달.
  - 상세 라우트: 변경 없음(메인 전체 폭에 RouterView).
- **CoreRuleFormSection**
  - 상세/수정일 때: 기존 `<div class="flex ...">` + CategoryListSidebar + section + SettingSidebar 를 `<LoreListLayout>` + `<LoreDetailLayout>` 조합으로 교체.
    - LoreListLayout #sidebar = CategoryListSidebar(기존 props 동일).
    - LoreListLayout default = LoreDetailLayout.
    - LoreDetailLayout default = 기존 section(헤더+보기/폼).
    - LoreDetailLayout #meta = SettingSidebar(기존 :meta, #tags, #linkDocs 동일).
  - 등록 모드: LoreDetailLayout만 사용 가능(좌측 본문, 우측 메타). 리스트 사이드바 없음.
- **다른 목록 뷰(예: CoreRulesSection):** 변경 없음. ProjectDetailView가 ProjectMenuLayout을 쓰면 RouterView로 CoreRulesSection이 slot에 렌더되므로 그대로 동작.

### 3.5 라우트·레이아웃 매핑 유지

- `ROUTES_WITH_DETAIL_LAYOUT`(상세 시 카테고리 사이드바 숨김) 로직은 ProjectDetailView에 유지. 상세 라우트에서는 ProjectMenuLayout을 쓰지 않고, 자식이 LoreListLayout으로 전체를 그리므로 레이아웃이 “교체”된 상태가 유지됨.

## 4. Impact Analysis

- **Affected Files:**
  - **수정·구현:** `src/renderer/components/layouts/ProjectMenuLayout.vue`, `LoreListLayout.vue`, `LoreDetailLayout.vue` (슬롯·스타일 구현)
  - **수정:** `src/renderer/views/ProjectDetailView.vue` (목록 시 ProjectMenuLayout 사용)
  - **수정:** `src/renderer/views/project-detail/core-rules/CoreRuleFormSection.vue` (상세 시 LoreListLayout + LoreDetailLayout 사용)
- **Side Effects:**
  - 레이아웃 책임이 뷰에서 분리되어, 다른 카테고리(종족/생물, 인물 등)에서도 동일 레이아웃 재사용 가능.
  - CategoryListSidebar·SettingSidebar는 그대로 두고, 레이아웃이 슬롯으로 감싸기만 함.

## 5. Task List

- [ ] **ProjectMenuLayout**: props(project, categoryItems, activeRouteName) 및 default slot. 좌측 aside(첫 화면, 목록으로, 설정 목록 RouterLink), 우측 main(slot). CVA·섹션·시맨틱 토큰·JSDoc.
- [ ] **LoreListLayout**: #sidebar slot + default slot. flex row, 좌측 고정 폭·우측 flex-1. CVA·섹션·JSDoc.
- [ ] **LoreDetailLayout**: default slot(본문) + #meta slot(메타). flex row, 본문 flex-2·메타 w-80. CVA·섹션·JSDoc.
- [ ] **ProjectDetailView**: 목록 라우트일 때 ProjectMenuLayout 사용. categoryItems·project·activeRouteName 전달, default에 RouterView. 기존 aside 블록 제거.
- [ ] **CoreRuleFormSection**: 상세/수정 블록에서 LoreListLayout > LoreDetailLayout 구조로 변경. #sidebar에 CategoryListSidebar, LoreDetailLayout default에 section, #meta에 SettingSidebar. 등록 모드는 LoreDetailLayout만 사용하거나 기존 2단 유지.
- [ ] 린트·Coding Rules 점검 및 동작 확인(목록 진입·상세 진입·등록 모드).

## 6. Verification Plan

- 프로젝트 진입 후 목록 화면(주요 설정 등): ProjectMenuLayout으로 좌측 카테고리·우측 목록 표시.
- 목록에서 항목 클릭 → 상세: LoreListLayout(좌측 항목 목록) + LoreDetailLayout(본문 + 메타) 표시.
- 등록 모드(/core-rules/new): 기대한 2단(본문|메타) 유지.
- 기존 “목록으로”·“처음으로”·선택 강조 동작 유지.
- PRD·Coding Rules(시맨틱 토큰, CVA, 섹션 순서) 및 린트 준수.

---

## 7. 설정 목록 캐싱 및 Vue Query 도입 (분석·제안)

### 7.1 현재 문제 분석

- **목록 이중 조회:**  
  - **CoreRulesSection**(목록 화면): `loadList()` → `getCoreRuleList(prjNo, { page, pageSize })` (onMounted, watch(prjNo), onActivated).  
  - **CoreRuleFormSection**(상세 화면): `loadSidebarList()` → 동일 `getCoreRuleList(...)` (watch([prjNo, coreNoNum, isCreateMode]) 시 `!isCreateMode`일 때마다 호출).  
  → 목록 진입 시 1회, 상세 진입 시 또 1회, **같은 prjNo 목록을 두 곳에서 각각 요청**하며 공유 캐시 없음.

- **상세 내 항목 전환 시 매번 목록 재요청:**  
  watch가 `[prjNo, coreNoNum, isCreateMode]`이므로 **coreNoNum이 바뀔 때마다**(다른 설정 클릭) `loadSidebarList()`가 다시 호출됨.  
  → 사이드바에서 "자연신" → "질서신" → "혼돈신"만 눌러도 목록 API가 3번 호출되는 비효율.

- **직접 호출만 사용:**  
  현재 렌더러는 `window.electron.api.*`(IPC → 메인에서 axios)만 사용. 캐시·stale·무효화 전략이 없음.

### 7.2 제안: TanStack Vue Query 도입

- **선택 이유:**  
  - **서버 상태 캐시:** queryKey 단위로 캐싱. `['core-rules', prjNo]`를 목록 화면과 상세 사이드바에서 **동일 키**로 쓰면 한 번 불러온 목록을 공유.  
  - **staleTime:** 일정 시간(예: 30s~1분) 동안은 재요청 생략. 항목만 바꿀 때 목록 재조회 방지.  
  - **무효화:** POST/PATCH/DELETE 성공 시 `invalidateQueries({ queryKey: ['core-rules', prjNo] })`로 목록만 갱신.  
  - Vue 3 Composition API와 호환(`useQuery`, `useMutation`, `useQueryClient`).  
  - 공식 Vue 바인딩 `@tanstack/vue-query` 사용. queryFn에서 `window.electron.api.getCoreRuleList(...)` 호출하면 됨. Vue Query는 “어떤 함수를 실행해 데이터를 가져올지”만 알면 되므로, 메인 프로세스의 axios 사용과 무관하게 렌더러에서 적용 가능.

- **도입 범위(권장):**  
  - **1단계:** 주요 설정 목록·상세만 Vue Query 적용(목록: useQuery, 상세 1건: useQuery, 등록/수정/삭제: useMutation + invalidate).  
  - **2단계:** 프로젝트 목록·특성/능력 등 다른 API도 필요 시 동일 패턴으로 확장.

### 7.3 queryKey·staleTime·무효화 전략

| 데이터 | queryKey | staleTime | 무효화 시점 |
|--------|-----------|-----------|-------------|
| 주요 설정 목록 | `['core-rules', prjNo]` | 60_000 (1분) | postCoreRule, patchCoreRule, deleteCoreRule 성공 시 |
| 주요 설정 1건 | `['core-rule', prjNo, coreNo]` | 30_000 | patchCoreRule(해당 coreNo)·deleteCoreRule 성공 시 |

- **목록 공유:** CoreRulesSection과 CoreRuleFormSection 모두 동일 `queryKey: ['core-rules', prjNo]`로 useQuery 사용 → 한 번 불러온 목록을 캐시로 공유. 상세에서 다른 설정을 눌러도 목록은 재요청하지 않음.
- **상세 1건(선택):** loadItem을 useQuery(`['core-rule', prjNo, coreNo]`)로 바꾸면, 항목 전환 시 이전 항목은 캐시에서, 새 항목만 fetch.

### 7.4 Task List 추가 (캐싱·Vue Query)

- [ ] **의존성:** `@tanstack/vue-query` 추가(package.json).
- [ ] **앱 등록:** `src/renderer/index.ts`에서 `VueQueryPlugin` 등록. QueryClient 기본 옵션에 `staleTime`(예: 60_000) 설정 가능.
- [ ] **목록 쿼리 공통화:** CoreRulesSection·CoreRuleFormSection에서 `getCoreRuleList` 호출을 **useQuery**로 교체. queryKey: `['core-rules', prjNo]`, queryFn: 기존 API 호출, staleTime: 60_000.
- [ ] **상세 1건(선택):** CoreRuleFormSection의 loadItem을 useQuery(`['core-rule', prjNo, coreNo]`)로 바꾸고, enabled: !isCreateMode && coreNo != null.
- [ ] **Mutation + invalidate:** 등록(POST)·수정(PATCH)·삭제(DELETE) 시 useMutation 사용, onSuccess에서 `queryClient.invalidateQueries({ queryKey: ['core-rules', prjNo] })`. 수정/삭제 시 해당 `['core-rule', prjNo, coreNo]`도 invalidate.
- [ ] **watch 정리:** CoreRuleFormSection의 watch에서 `loadSidebarList()` 호출 제거. useQuery가 prjNo 반응으로 자동 실행. coreNo 변경 시에는 목록 쿼리는 그대로 두고, 상세 쿼리만 coreNo에 따라 실행되도록 함.

---

## 8. Composables(훅) 1:1 매칭 및 자동 임포트

### 8.1 목적

- 메인 프로세스(preload)에 정의된 **API 함수 개수만큼** 렌더러 쪽 **훅(composable)** 을 두어, **엔드포인트와 훅이 1:1로 매칭**되게 한다.
- **베이스 훅**으로 공통 패턴(useGet, usePost, usePatch, usePut, useDelete)을 두고, **엔티티 훅은 이 베이스 훅을 사용**해 구현한다. 인자는 **객체 한 개**로 전달해 순서에 의존하지 않도록 한다.

### 8.2 디렉터리 구조

```
src/renderer/composables/
└── query/
    ├── base/          # 공통 쿼리 훅 (5개)
    │   ├── useGet.ts      # useQuery 래퍼. queryKey, queryFn, options(인자 객체·enabled·staleTime 등) 받음.
    │   ├── usePost.ts     # useMutation 래퍼. mutationFn, invalidateKeys 등.
    │   ├── usePatch.ts
    │   ├── usePut.ts
    │   └── useDelete.ts
    ├── health/        # getHealth (1개) — useGet 사용
    ├── project/       # 5개 — useGet / usePost / usePatch / useDelete 사용
    ├── trait/         # 5개
    ├── ability/       # 5개
    ├── coreRule/      # 5개
    ├── projectTrait/  # 5개
    └── projectAbility/# 5개
```

- **베이스 훅 역할:**  
  - **useGet:** useQuery를 감싸서, `queryKey`, `queryFn`, `options`(enabled, staleTime, gcTime 등)를 **객체 인자**로 받음. queryFn은 옵션에서 넘긴 인자(예: `args.prjNo`, `args.coreNo`)를 사용해 `window.electron.api.xxx` 호출.  
  - **usePost / usePatch / usePut / useDelete:** useMutation을 감싸서, `mutationFn`, `invalidateKeys`(성공 시 무효화할 queryKey 배열), 기타 옵션을 **객체**로 받음.  
- **엔티티 훅:** 베이스 훅을 호출할 때 해당 API에 맞는 queryKey·queryFn·mutationFn·invalidateKeys만 넘긴다. **엔티티 훅의 인자도 객체 하나**로 통일 (예: `useGetCoreRule({ prjNo, coreNo })`, `useGetCoreRuleList({ prjNo, params })`) → 인자 순서 무관.

### 8.2.1 베이스 훅 시그니처 (예시)

- **useGet(options):**  
  `{ queryKey, queryFn, enabled?, staleTime?, ... }`  
  queryFn은 `() => api.xxx(...)` 형태로, 옵션에 담긴 인자 객체를 풀어서 API 인자로 전달.
- **usePost(options):**  
  `{ mutationFn, invalidateKeys?, ... }`  
  mutationFn: `(variables: TBody) => api.xxx(variables)` 또는 인자 객체를 받아 API 시그니처에 맞게 호출.
- **usePatch / usePut / useDelete:**  
  동일하게 mutationFn·invalidateKeys를 객체로 받고, useMutation 래퍼.

### 8.2.2 엔티티 훅 구현 방식

- 엔티티 훅은 **베이스 훅만 사용**해 구현. 예: `useGetCoreRuleList` → `useGet({ queryKey: ['core-rules', args.prjNo], queryFn: () => window.electron.api.getCoreRuleList(args.prjNo, args.params), staleTime: 60_000, ... })`를 호출하고, **인자 args는 객체** (`{ prjNo, params? }`).  
- `useGetCoreRule` → `useGet({ queryKey: ['core-rule', args.prjNo, args.coreNo], queryFn: () => window.electron.api.getCoreRule(args.prjNo, args.coreNo), enabled: args.prjNo != null && args.coreNo != null, ... })`, 인자: `{ prjNo, coreNo }`.  
- POST/PATCH/DELETE 계열은 usePost/usePatch/useDelete에 mutationFn과 invalidateKeys(해당 목록·상세 queryKey)를 넘기고, **인자(prjNo, coreNo, body 등)는 객체**로 전달.

### 8.3 API ↔ 훅 매핑 (엔티티별)

| 엔티티 | API 함수 (electron.api) | 훅 파일 (composables/query/{entity}/) |
|--------|--------------------------|----------------------------------------|
| health | getHealth | useGetHealth.ts |
| project | getProjectList, getProjectByNo, postProject, patchProject, deleteProject | useGetProjectList.ts, useGetProjectByNo.ts, usePostProject.ts, usePatchProject.ts, useDeleteProject.ts |
| trait | getTraitList, getTraitByNo, postTrait, patchTrait, deleteTrait | useGetTraitList.ts, … |
| ability | getAbilityList, getAbilityByNo, postAbility, patchAbility, deleteAbility | useGetAbilityList.ts, … |
| coreRule | getCoreRuleList, getCoreRule, postCoreRule, patchCoreRule, deleteCoreRule | useGetCoreRuleList.ts, useGetCoreRule.ts, usePostCoreRule.ts, usePatchCoreRule.ts, useDeleteCoreRule.ts |
| projectTrait | getProjectTraitList, getProjectTraitByNo, postProjectTrait, patchProjectTrait, deleteProjectTrait | useGetProjectTraitList.ts, … |
| projectAbility | getProjectAbilityList, getProjectAbilityByNo, postProjectAbility, patchProjectAbility, deleteProjectAbility | useGetProjectAbilityList.ts, … |

- GET 계열: useGet 사용. queryKey에 식별자(prjNo, coreNo 등) 포함. **인자: 객체** (예: `{ prjNo, params? }`, `{ prjNo, coreNo }`).
- POST/PATCH/DELETE 계열: usePost/usePatch/useDelete 사용. onSuccess(invalidateKeys)에서 해당 목록/상세 queryKey 무효화. **인자: 객체** (예: `{ prjNo, body }`, `{ prjNo, coreNo, body }`).

### 8.4 자동 임포트 점검

- **현재:** `electron.vite.config.ts`의 unplugin-auto-import에 `imports: ['vue', 'vue-router', 'pinia']`만 있으며, **dirs** 옵션 없음. 따라서 `composables/` 아래 export는 자동 임포트되지 않음.
- **개선:**  
  - `AutoImport`에 **`dirs: ['composables']`** 추가. (renderer root가 `src/renderer`이므로 `composables`는 `src/renderer/composables`를 가리킴.)  
  - 이렇게 하면 `composables/**/*.ts`에서 **export된 함수**가 전역 자동 임포트 후보가 됨. (unplugin-auto-import는 dirs 내 파일의 export를 수집해 auto-imports.d.ts에 반영.)  
  - **점검:** `pnpm dev` 또는 빌드 후 `src/renderer/auto-imports.d.ts`에 `useGetCoreRuleList` 등 훅 이름이 선언되는지 확인. ESLint `no-undef`가 풀리려면 `.eslintrc-auto-import.json`에 해당 전역이 포함되어야 하며, `dirs` 사용 시 보통 자동 갱신됨.
- **Task:**  
  - [ ] `electron.vite.config.ts` renderer 플러그인 `AutoImport`에 `dirs: ['composables']` 추가.  
  - [ ] `composables/query` 및 엔티티별 폴더·훅 파일 생성 후, dev/빌드로 auto-imports.d.ts·ESLint 전역에 훅이 포함되는지 확인.

### 8.5 Task List 추가 (Composables·자동 임포트)

- [ ] **베이스 훅:** `composables/query/base/` 생성 후 **useGet**, **usePost**, **usePatch**, **usePut**, **useDelete** 구현. 각각 useQuery/useMutation을 감싸고, 옵션(queryKey, queryFn, mutationFn, invalidateKeys 등)을 **객체 인자**로 받도록 정의.
- [ ] **composables 디렉터리:** `src/renderer/composables/query/` 및 하위 엔티티 폴더(health, project, trait, ability, coreRule, projectTrait, projectAbility) 생성.
- [ ] **엔티티 훅 1:1 구현:** 메인 API 함수별로 §8.3 표에 따라 훅 파일 추가. **반드시 베이스 훅(useGet/usePost/usePatch/usePut/useDelete)을 사용**해 구현. 모든 훅의 **인자는 객체 한 개**로 전달(예: `useGetCoreRule({ prjNo, coreNo })`)해 순서 무관하게 함. queryKey·invalidate 전략은 §7.3과 맞춤.
- [ ] **자동 임포트:** `electron.vite.config.ts`의 AutoImport에 `dirs: ['composables']` 추가. 필요 시 `dts: 'src/renderer/auto-imports.d.ts'` 등 경로 확인.
- [ ] **점검:** dev 실행 후 `auto-imports.d.ts` 및 `.eslintrc-auto-import.json`에 composables export가 반영되는지 확인. 뷰/스토어에서 `useGetCoreRuleList` 등 import 없이 사용 가능한지 확인.
