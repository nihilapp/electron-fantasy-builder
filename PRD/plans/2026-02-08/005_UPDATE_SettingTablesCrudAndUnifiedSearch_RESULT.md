# RESULT: 설정 테이블 전반 CRUD UI 및 전체 설정 통합 조회·검색

> **Date:** 2026-02-08  
> **Task ID:** 005_UPDATE_SettingTablesCrudAndUnifiedSearch  
> **Status:** ✅ SUCCESS (1차 범위 완료)  
> **Language:** Korean

## 1. Execution Summary

- **통합 검색 API (2단계 A안)** 를 메인 프로세스에 구현하고, **전체 설정** 화면에서 이 API를 사용하도록 했다.
- **1단계** 중 **종족/생물(Creatures)** 에 대해 CRUD UI를 전부 구현했다. (목록·등록·상세·수정·삭제, 라우터·상세 레이아웃 포함.)
- **나머지 7개 엔티티**(Characters, Regions, Nations, Organizations, Items, Events, Lores) CRUD UI는 동일 패턴으로 추후 구현 예정이다.

## 2. Modified Files

- **[Added]** `src/zod-schema/settingsSearch.schema.ts` — 통합 검색 파라미터·결과 스키마, SETTING_CATEGORIES, SETTING_CATEGORY_LABELS
- **[Added]** `src/main/server/service/SettingsSearchService.ts` — searchUnified(prjNo, params): 각 설정 서비스 getList 병렬 호출 후 통합·정렬·페이징
- **[Added]** `src/main/server/controller/SettingsSearchController.ts` — GET /settings/search
- **[Modified]** `src/main/server/controller/index.ts` — SettingsSearchController 라우트 등록
- **[Modified]** `src/types/vo.types.ts` — UnifiedSettingItemVo, SettingsSearchParamsVo 추가
- **[Added]** `src/main/api/apiCreature.ts` — 생물/종족 API·IPC 핸들러
- **[Added]** `src/main/api/apiSettingsSearch.ts` — 통합 검색 API·IPC 핸들러
- **[Modified]** `src/main/api/index.ts` — apiCreature, apiSettingsSearch export
- **[Modified]** `src/main/ipc/index.ts` — ipcGetCreature, ipcGetSettingsSearch 등록
- **[Modified]** `src/preload/index.ts` — getCreatureList/getCreature/postCreature/patchCreature/deleteCreature, getSettingsSearch 노출
- **[Modified]** `src/renderer/types/electron.d.ts` — CreatureVo, UnifiedSettingItemVo 및 해당 api 타입 추가
- **[Added]** `src/renderer/composables/query/creature/useGetCreatureList.ts`, `useDeleteCreature.ts`
- **[Added]** `src/renderer/composables/query/settings/useGetSettingsSearch.ts`
- **[Added]** `src/renderer/composables/useCreatureForm.ts`
- **[Added]** `src/renderer/views/project-detail/creatures/CreaturesSection.vue`, `CreatureFormSection.vue`, `CreatureFormBody.vue`
- **[Added]** `src/renderer/views/project-detail/settings/SettingsUnifiedView.vue`
- **[Modified]** `src/renderer/router/index.ts` — settings → SettingsUnifiedView, creatures → CreaturesSection + creatures/new + creatures/:creatureNo (CreatureFormSection)
- **[Modified]** `src/renderer/views/ProjectDetailView.vue` — ROUTES_WITH_DETAIL_LAYOUT에 project-creature-new, project-creature-detail 추가

## 3. Key Changes

- **GET /settings/search:** prjNo, q, categories, page, pageSize 쿼리. SettingsSearchService에서 core_rules·creatures·characters·regions·nations·organizations·items·events·lores 각각 getList(검색어·페이징) 호출 후 통합·정렬(카테고리 라벨·이름)·메모리 페이징. 응답은 ListType&lt;UnifiedSettingItemVo&gt;.
- **전체 설정 뷰:** SettingsUnifiedView에서 useGetSettingsSearch로 통합 검색 호출, 키워드(q)·카테고리 필터·검색 버튼, SettingItemCard 목록, 클릭 시 CORE_RULE/CREATURE는 상세 라우트로, 나머지는 해당 목록 라우트로 이동.
- **종족/생물 CRUD:** Core Rules와 동일 패턴 — CreaturesSection(목록), CreatureFormSection(사이드바+폼), CreatureFormBody(보기/폼), useGetCreatureList/useDeleteCreature/useCreatureForm, 라우트 project-creatures / project-creature-new / project-creature-detail, ROUTES_WITH_DETAIL_LAYOUT 반영.

## 4. Verification Results

- [x] 통합 검색 API: GET /settings/search 구현 및 컨트롤러 등록 완료.
- [x] 전체 설정 화면: SettingsUnifiedView 연결, 검색·카테고리 필터·항목 클릭 시 이동 동작 구현.
- [x] Creatures: 목록·추가·상세·수정·삭제·라우터·상세 레이아웃 적용.
- [x] 라우터·ProjectDetailView: creatures 자식 라우트 3개 및 ROUTES_WITH_DETAIL_LAYOUT 확장 반영.
- [ ] Characters ~ Lores 7개 엔티티 CRUD UI: 미구현. 동일 패턴(api*·IPC·preload·types·useGet*List·useDelete*·use*Form·*Section·*FormSection·*FormBody·라우트·ROUTES_WITH_DETAIL_LAYOUT)으로 추후 적용 예정.
- [ ] 수동 검증: `pnpm dev` 실행 후 전체 설정 검색·종족/생물 CRUD 시나리오 확인 권장.

## 5. Remaining Work (Follow-up)

- **1단계 — 나머지 7개 엔티티:** Characters, Regions, Nations, Organizations, Items, Events, Lores 각각에 대해 Creatures와 동일한 구조로 API 레이어(api*.ts·IPC·preload·electron.d.ts)·composables(useGet*List·useDelete*·use*Form)·뷰(*Section·*FormSection·*FormBody)·라우터 자식 라우트·ROUTES_WITH_DETAIL_LAYOUT 추가.
- **전체 설정 뷰:** 상세 라우트가 구현된 엔티티가 늘어나면 SettingsUnifiedView의 goToItem 내 routeMap/listNames를 해당 엔티티만큼 확장.
