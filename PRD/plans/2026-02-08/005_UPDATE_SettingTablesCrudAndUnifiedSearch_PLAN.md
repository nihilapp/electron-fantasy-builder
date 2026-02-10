# PLAN: 설정 테이블 전반 CRUD UI 및 전체 설정 통합 조회·검색

> **Date:** 2026-02-08  
> **Task ID:** 005_UPDATE_SettingTablesCrudAndUnifiedSearch  
> **Language:** Korean (Required)

## 1. Objective

- **1단계**: 주요 설정(core_rules)에 이어, 나머지 설정 테이블(종족/생물, 인물, 지역, 국가, 단체, 도구, 역사, 신화/전설/설화)에 대해 **CRUD UI**를 구현한다. 각 엔티티별 목록·상세(보기)·등록·수정·삭제 화면을 제공한다.
- **2단계**: **전체 설정** 화면에서 모든 설정 테이블을 한곳에서 **조회·검색**하는 통합 시스템을 만든다. 카테고리 필터·키워드 검색으로 결과를 보여 주고, 항목 클릭 시 해당 엔티티 상세로 이동한다.

## 2. Context Analysis

- **Target Files:**
  - 라우터: `src/renderer/router/index.ts`
  - 프로젝트 상세 사이드바: `src/renderer/views/ProjectDetailView.vue`
  - 기존 참조: `src/renderer/views/project-detail/core-rules/` (CoreRulesSection, CoreRuleFormSection, CoreRuleFormBody), `src/renderer/composables/query/coreRule/`, `src/renderer/composables/useCoreRuleForm.ts`
  - 공통 컴포넌트: `SettingItemCard`, `CategoryListSidebar`, `DetailField`, `CommonButton`, `FormInput`, `FormTextarea`, `IconButton`, `LoreListLayout`, `LoreDetailLayout`
- **Current Issue:**
  - 주요 설정(core_rules)만 CRUD UI가 구현되어 있고, creatures / characters / regions / nations / organizations / items / events / lores 는 모두 `PlaceholderSection`으로만 연결되어 있음.
  - **전체 설정**(project-settings) 역시 PlaceholderSection이며, “모든 설정 테이블 조회·검색” 기능이 없음.
- **Backend:** Development Task List Phase 5 기준, 위 엔티티는 모두 Mapper/Service/Controller 및 REST API(목록 GET, 단건 GET/PATCH/DELETE, POST)가 이미 구현되어 있음. API 경로: `/core-rules`, `/creatures`, `/characters`, `/items`, `/regions`, `/nations`, `/organizations`, `/events`, `/lores` (prjNo 쿼리/바디).
- **PRD:** 목록 API는 PK+이름+메타만, 상세는 진입 시 조회. SettingItemCard·시맨틱 토큰·Vue 섹션 순서 등 Coding Rules 준수.

## 3. Strategy

### 3.1. 1단계 — 엔티티별 CRUD UI

- **패턴:** 기존 core_rules와 동일한 3종 구조를 각 엔티티에 적용.
  1. **목록 Section**: `*ListLayout` 또는 동일 레이아웃 + `CategoryListSidebar` + 목록(SettingItemCard) + “추가” 버튼. useGet*List, useDelete* 훅 사용.
  2. **상세/폼 Section**: `*FormSection` (new | :id) + `*FormBody`: 보기 모드(DetailField 나열) / 편집 모드(FormInput, FormTextarea). use*Form 훅으로 로드·저장·삭제.
  3. **라우트:** `project/:prjNo/creatures`, `project/:prjNo/creatures/new`, `project/:prjNo/creatures/:id` 형태로 자식 라우트 추가. `ProjectDetailView`의 `ROUTES_WITH_DETAIL_LAYOUT`에 각 엔티티의 new/:id 라우트 name 추가.
- **공통화 검토:**
  - 엔티티별 API 경로·PK명·라벨만 다른 **제네릭 목록/폼 훅** 또는 **공통 Section 컴포넌트**로 줄일 수 있으면, 중복 최소화. 단, PRD “도메인별 구성”과 유지보수성을 고려해, 1차는 엔티티별 Section/훅으로 구현하고, 반복이 명확해지면 추상화를 도입하는 순서를 권장.
- **목록용 VO/스키마:** Coding Rules에 따라 목록 응답은 “식별자 + 이름(표시명) + 메타”만. 이미 있는 `CoreRuleListItemVo`와 동일하게, 각 엔티티에 `*ListItemVo`(또는 목록용 Zod 스키마)가 없으면 추가. 백엔드가 이미 전체 Vo를 목록으로 반환하는 경우, 프론트에서는 필요한 필드만 사용하거나 백엔드에 목록 전용 DTO를 요청할 수 있음.
- **엔티티 순서(사이드바 표시):** PRD/ProjectDetailView 기준 — 종족/생물, 인물, 지역, 국가, 단체, 도구, 역사, 신화/전설/설화. 기존 라우트와 동일한 path/name 유지.

### 3.2. 2단계 — 전체 설정 통합 조회·검색

- **화면:** `project-settings` 라우트에서 `PlaceholderSection`을 제거하고, **전체 설정 전용 뷰** 컴포넌트로 교체.
- **기능 요구사항:**
  - **통합 조회:** 프로젝트 내 모든 설정 테이블(core_rules, creatures, characters, regions, nations, organizations, items, events, lores)의 항목을 한 목록에서 볼 수 있음.
  - **검색:** 키워드(이름/표시명 기준)로 필터. 선택 시 카테고리(엔티티 타입) 필터.
  - **표시:** 각 항목은 (카테고리 라벨, 이름, 메타 요약) 형태. SettingItemCard 또는 동일한 UX로 표시. 클릭 시 해당 엔티티의 상세 라우트로 이동(예: core_rules → project-core-rule-detail, characters → project-character-detail).
- **API 전략 (선택):**
  - **A. 통합 검색 API 신설:** `GET /projects/:prjNo/settings/search?q=...&categories=...&page=...&pageSize=...`  
    응답: `{ list: [{ settingCategory, settingNo, displayName, meta?, ... }], totalCnt, ... }`.  
    백엔드에서 각 설정 테이블을 조회해 하나의 목록으로 합치고, 카테고리·키워드 필터 적용.  
    장점: 한 번의 요청, 일관된 페이징·정렬.  
    단점: 새 API·Service·Mapper 로직 필요.
  - **B. 프론트에서 기존 목록 API 병렬 호출:** 각 엔티티별 `GET /creatures?prjNo=`, `GET /characters?prjNo=`, … 를 병렬 호출한 뒤, 결과를 카테고리 라벨과 함께 합쳐 클라이언트에서 필터·정렬·페이징.  
    장점: 기존 API만 사용.  
    단점: 요청 수 많음, 페이징/정렬이 클라이언트 단에서만 가능.
- **권장:** 초기에는 **B**로 구현하여 전체 설정 화면을 빠르게 동작하게 하고, 데이터량·UX 요구가 커지면 **A**로 통합 검색 API를 도입하는 단계적 접근.
- **설정 카테고리 코드:** DESIGN_SettingProtectionFavoritesAndDocLinks와 일치시키기. 예: `CORE_RULE`, `CREATURE`, `CHARACTER`, `REGION`, `NATION`, `ORGANIZATION`, `ITEM`, `EVENT`, `LORE`. 전체 설정 화면의 카테고리 필터와 상세 이동 시 사용.

## 4. Impact Analysis

- **Affected Files:**
  - **라우터:** `src/renderer/router/index.ts` — settings를 새 뷰로 연결, creatures/characters/…/lores 자식 라우트에 목록·new·:id 라우트 추가, ROUTES_WITH_DETAIL_LAYOUT 확장은 ProjectDetailView에서.
  - **뷰:** `src/renderer/views/ProjectDetailView.vue` — ROUTES_WITH_DETAIL_LAYOUT에 각 엔티티 상세/등록 라우트 name 추가.
  - **신규 뷰:**  
    - 1단계: 엔티티별 `*Section.vue`(목록), `*FormSection.vue`, `*FormBody.vue` (또는 도메인 폴더 내 배치, 예: `project-detail/creatures/`, `project-detail/characters/` 등).  
    - 2단계: `project-detail/settings/` 또는 `views/` 직하위에 전체 설정 전용 뷰(예: `SettingsUnifiedView.vue`).
  - **Composables:** 엔티티별 `useGet*List`, `useDelete*`, `use*Form` 훅 (또는 공통 훅 + 설정 맵). `src/renderer/api/honoClient.ts` 또는 엔티티별 API 함수.
  - **타입/스키마:** `src/types/vo.types.ts`, `src/zod-schema/*.schema.ts` — 목록용 스키마/VO 추가 시.
  - **2단계 시:** 전체 설정용 composable(예: useUnifiedSettingsSearch), 필요 시 백엔드에 통합 검색 API 추가 시 Controller/Service/Mapper.
- **Side Effects:**
  - 라우트·뷰가 늘어나 번들 크기 증가. 필요 시 lazy load 고려.
  - 전체 설정에서 “카테고리 + settingNo”로 상세 이동 시, 엔티티별 라우트 name·params 규칙을 통일해야 함.

## 5. Task List

- [ ] **1단계 — 공통 준비:** 목록용 Zod 스키마/VO가 없는 엔티티(creature, character, item, region, nation, organization, event, lore)에 *ListItemVo 또는 목록용 스키마 정의. (백엔드가 이미 목록 전용 필드만 반환하면 생략 가능.)
- [ ] **1단계 — Creatures:** CreaturesSection(목록), CreatureFormSection, CreatureFormBody, useGetCreatureList, useDeleteCreature, useCreatureForm. 라우트: creatures, creatures/new, creatures/:creatureNo.
- [ ] **1단계 — Characters:** 동일 패턴. 라우트: characters, characters/new, characters/:charNo.
- [ ] **1단계 — Regions:** 동일 패턴. 라우트: regions, regions/new, regions/:regionNo.
- [ ] **1단계 — Nations:** 동일 패턴. 라우트: nations, nations/new, nations/:ntnNo.
- [ ] **1단계 — Organizations:** 동일 패턴. 라우트: organizations, organizations/new, organizations/:orgNo.
- [ ] **1단계 — Items:** 동일 패턴. 라우트: items, items/new, items/:itemNo.
- [ ] **1단계 — Events:** 동일 패턴. 라우트: events, events/new, events/:eventNo.
- [ ] **1단계 — Lores:** 동일 패턴. 라우트: lores, lores/new, lores/:loreNo.
- [ ] **1단계 — 라우터·레이아웃:** router/index.ts에 위 자식 라우트 등록. ProjectDetailView에 ROUTES_WITH_DETAIL_LAYOUT에 각 엔티티의 new·detail 라우트 name 추가.
- [ ] **2단계 — 전체 설정 뷰:** project-settings용 컴포넌트 생성. 기존 목록 API 병렬 호출로 통합 목록 구성, 카테고리 필터·키워드 검색(클라이언트 필터), SettingItemCard 스타일로 표시, 클릭 시 해당 엔티티 상세 라우트로 이동.
- [ ] **2단계 — (선택) 통합 검색 API:** 필요 시 GET /projects/:prjNo/settings/search 구현 및 프론트 전환.

## 6. Verification Plan

- [ ] 1단계: 각 엔티티(creatures, characters, …) 목록 진입 시 목록이 로드되고, 추가·보기·수정·삭제가 정상 동작하는지 확인. 라우트 이동(목록 ↔ 상세 ↔ 등록)이 의도대로 동작하는지 확인.
- [ ] 1단계: ProjectDetailView 사이드바에서 각 메뉴 클릭 시 해당 Section이 표시되는지 확인.
- [ ] 2단계: 전체 설정 화면에서 모든 카테고리 항목이 보이고, 키워드·카테고리 필터 적용 시 목록이 갱신되는지 확인. 항목 클릭 시 해당 엔티티 상세로 이동하는지 확인.
- [ ] PRD/Coding Rules: SettingItemCard·시맨틱 토큰·Vue 컴포넌트 섹션 순서·목록 API(메타+이름만) 원칙 준수 여부 확인.
- [ ] `pnpm dev` 실행 후 수동으로 위 시나리오 테스트.
