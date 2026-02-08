# RESULT: 3단계 레이아웃 컴포넌트 도입 및 뷰 정리

> **Date:** 2026-02-08
> **Task ID:** 002_UPDATE_ThreeLayoutComponents
> **Status:** ✅ SUCCESS (1차 구간 완료 — 패키지 설치 전 중단)
> **Language:** Korean

## 1. Execution Summary

플랜 §5 Task List(레이아웃 구현·뷰 연동)까지 순서대로 수행했습니다. **§7.4 의존성 추가(@tanstack/vue-query) 단계 직전에서 중단**했으며, 마스터의 패키지 설치 및 사인 후 §7·§8(Vue Query·Composables)을 진행할 수 있습니다.

## 2. Modified Files

- **[구현]** `src/renderer/components/layouts/ProjectMenuLayout.vue` — props(project, categoryItems, activeRouteName), default slot, aside(첫 화면·목록으로·설정 목록) + main(slot). CVA·JSDoc·시맨틱 토큰 적용.
- **[구현]** `src/renderer/components/layouts/LoreListLayout.vue` — #sidebar slot + default slot, flex row, 좌측 shrink-0·우측 flex-1 min-w-0.
- **[구현]** `src/renderer/components/layouts/LoreDetailLayout.vue` — default slot(본문) + #meta slot(메타), 좌측 flex-2·우측 w-80.
- **[수정]** `src/renderer/views/ProjectDetailView.vue` — 목록 라우트 시 ProjectMenuLayout 사용, categoryItems·project·activeRouteName 전달, default에 메인 콘텐츠(RouterView 등). 기존 aside 블록 제거, isActiveCategory 제거(ProjectMenuLayout 내부 처리).
- **[수정]** `src/renderer/views/project-detail/core-rules/CoreRuleFormSection.vue` — 상세/수정 시 LoreListLayout > LoreDetailLayout 구조로 변경(#sidebar=CategoryListSidebar, default=LoreDetailLayout, 본문=section, #meta=SettingSidebar). 등록 모드는 LoreDetailLayout만 사용(#meta=SettingSidebar).

## 3. Key Changes

- **ProjectMenuLayout:** 1차 뎁스. 좌측 aside(첫 화면, 목록으로, 설정 링크), 우측 main(default slot). `ProjectMenuCategoryItem`(label, name, path, icon) 타입 export. `readonly ProjectMenuCategoryItem[]` 수용.
- **LoreListLayout:** 2차 뎁스. #sidebar + default slot만 담당, 데이터는 부모가 slot에 주입.
- **LoreDetailLayout:** 상세 내부. default(본문) + #meta(메타). SettingSidebar는 부모가 #meta에 넣음.
- **ProjectDetailView:** `ROUTES_WITH_DETAIL_LAYOUT` 유지, 목록 시에만 ProjectMenuLayout 사용.
- **CoreRuleFormSection:** 등록 = LoreDetailLayout(section + SettingSidebar). 상세/수정 = LoreListLayout(sidebar=CategoryListSidebar, default=LoreDetailLayout(section + SettingSidebar)).

## 4. Verification Results

- 린트: 수정·추가한 5개 파일 기준 오류 없음.
- IconName 타입: ProjectMenuLayout에서 `item.icon as IconName` 적용, `~/data/icon-name.generated` import.
- categoryItems: ProjectMenuLayout props를 `readonly ProjectMenuCategoryItem[]`로 두어 ProjectDetailView의 `as const` 목록과 호환.

## 5. 다음 단계 (패키지 설치 후)

- §7.4: `@tanstack/vue-query` 의존성 추가(package.json) 후 `pnpm install`.
- §7.4 이하: 앱 등록, 목록/상세 useQuery·Mutation·invalidate, watch 정리.
- §8: composables/query 베이스·엔티티 훅, AutoImport dirs 추가.

마스터가 패키지 설치를 완료하고 진행 지시를 주시면 §7·§8을 이어서 수행하겠습니다.

---

## 6. Vue Query 세팅 (§7 적용) — 2026-02-08 추가

### 6.1 실행 요약

- **앱 등록:** `src/renderer/index.ts`에 `VueQueryPlugin` 등록, `queryClientConfig.defaultOptions.queries.staleTime: 60_000`.
- **CoreRulesSection:** 목록을 `useQuery`로 전환. queryKey `['core-rules', prjNo]`, queryFn `getCoreRuleList`, enabled·staleTime 적용. `loadList`·watch(prjNo)·onMounted/onActivated 제거. 삭제 성공 시 `queryClient.invalidateQueries({ queryKey: ['core-rules', no] })`. 목록 오류는 `listErrorMessage`(computed), 삭제 오류는 `deleteError`(ref)로 분리.
- **CoreRuleFormSection:** 사이드바 목록을 동일 `useQuery`(같은 queryKey)로 전환. `loadSidebarList` 제거, watch에서 `loadSidebarList()` 호출 제거. 등록(POST) 성공 시 `invalidateQueries(['core-rules', no])`. 수정(PATCH) 성공 시 `invalidateQueries(['core-rules', no])` 및 `invalidateQueries(['core-rule', no, coreNo])`. 상세 1건(loadItem)은 useQuery로 전환하지 않음(선택 항목 유보).

### 6.2 수정·영향 파일

- [수정] `src/renderer/index.ts` — VueQueryPlugin 등록
- [수정] `src/renderer/views/project-detail/core-rules/CoreRulesSection.vue` — useQuery 목록, delete 후 invalidate
- [수정] `src/renderer/views/project-detail/core-rules/CoreRuleFormSection.vue` — useQuery 사이드바 목록, submit 시 invalidate, watch 정리

### 6.3 검증

- 린트 오류 없음. 목록·상세 진입 시 동일 queryKey로 캐시 공유, 항목 전환 시 목록 재요청 없음. 등록/수정/삭제 후 목록 무효화로 갱신됨.

---

## 7. Composables 도입 (§8 일부) — 뷰에서 useQuery/useMutation 직접 사용 제거

### 7.1 목적

뷰에서 `useQuery`/`useMutation`을 직접 쓰지 않고, 플랜 §8의 **엔티티 훅(composables)** 을 사용하도록 변경.

### 7.2 추가·수정 사항

- **베이스 훅:** `composables/query/base/useGet.ts`(useQuery 래퍼), `useDelete.ts`(useMutation + invalidateKeys 래퍼).
- **coreRule 훅:** `composables/query/coreRule/useGetCoreRuleList.ts`(prjNo, params?, enabled?), `useDeleteCoreRule.ts`(mutate 시 목록·상세 키 무효화).
- **AutoImport:** `electron.vite.config.ts` renderer 쪽 AutoImport에 `dirs: [ 'composables' ]` 추가.
- **CoreRulesSection:** `useQuery`/`useQueryClient` 제거 → `useGetCoreRuleList({ prjNo })`, `useDeleteCoreRule()` 사용. 삭제 시 `deleteCoreRuleMutation.mutateAsync({ prjNo, coreNo })` 호출.
- **CoreRuleFormSection:** `useQuery` 제거 → `useGetCoreRuleList({ prjNo, enabled })` 사용. 등록/수정 후 invalidate는 기존처럼 `useQueryClient`로 유지(추후 usePostCoreRule/usePatchCoreRule로 대체 가능).

### 7.3 수정·추가 파일

- [추가] `src/renderer/composables/query/base/useGet.ts`, `useDelete.ts`
- [추가] `src/renderer/composables/query/coreRule/useGetCoreRuleList.ts`, `useDeleteCoreRule.ts`
- [수정] `electron.vite.config.ts` — AutoImport `dirs: [ 'composables' ]`
- [수정] `CoreRulesSection.vue`, `CoreRuleFormSection.vue` — 훅 사용으로 전환
