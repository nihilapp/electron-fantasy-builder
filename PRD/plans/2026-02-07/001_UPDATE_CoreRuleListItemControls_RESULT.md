# RESULT: 코어 설정 목록 아이템 개선 (유형 카테고리·우측 컨트롤 아이콘)

> **Date:** 2026-02-07  
> **Task ID:** 001_UPDATE_CoreRuleListItemControls  
> **Status:** ✅ SUCCESS  
> **Language:** Korean

## 1. Execution Summary

- 코어 설정 목록(CoreRulesSection)에서 각 아이템에 **유형(aplyScope)** 을 카테고리 뱃지로 표시하고, **우측에 보기·수정·즐겨찾기·보호·삭제** 아이콘 컨트롤을 추가함.
- 상세 조회·수정·삭제용 API를 메인/프리로드에 노출하고, **core-rules/:coreNo** 상세 라우트 및 **CoreRuleDetailSection** 뷰(보기/수정 모드 전환)를 구현함.
- 즐겨찾기·보호는 1차 **로컬 상태만** 반영(컴포넌트 내 Set으로 토글, 재진입 시 초기화). 추후 스키마 확장 시 PATCH 연동 가능.

## 2. Modified Files

- **[Modified]** `src/main/api/apiCoreRule.ts`: apiGetCoreRuleByNo, apiPatchCoreRule, apiDeleteCoreRule 추가 및 IPC 핸들러(api:get-core-rule, api:patch-core-rule, api:delete-core-rule) 등록.
- **[Modified]** `src/preload/index.ts`: getCoreRule, patchCoreRule, deleteCoreRule 노출.
- **[Modified]** `src/renderer/types/electron.d.ts`: 위 3개 API 타입 추가.
- **[Modified]** `src/renderer/router/index.ts`: CoreRuleDetailSection import, path `core-rules/:coreNo`(name: project-core-rule-detail) 라우트 추가.
- **[Added]** `src/renderer/views/project-detail/CoreRuleDetailSection.vue`: 코어 설정 상세 뷰. inject prjNo, route.params.coreNo로 1건 조회, 보기 모드(읽기 전용)·수정 모드(폼) 전환, PATCH 저장·목록 링크.
- **[Modified]** `src/renderer/views/project-detail/CoreRulesSection.vue`: 목록 아이템에 유형 뱃지(rounded-full bg-gray-100), 우측 아이콘 그룹(보기 eye, 수정 pencil, 즐겨찾기 star, 보호 shield, 삭제 trash-2), goToView/goToEdit/toggleFavorite/toggleProtected/removeItem(confirm 후 deleteCoreRule) 연동.

## 3. Key Changes

- **API·IPC**: GET/PATCH/DELETE `/core-rules/:coreNo` 호출 및 렌더러 노출. 상세·수정·삭제 플로우 사용 가능.
- **라우팅**: `/project/:prjNo/core-rules/:coreNo` → CoreRuleDetailSection. 보기 클릭 시 해당 라우트로 이동, 수정은 상세 페이지에서 "수정" 버튼으로 편집 모드 전환.
- **CoreRuleDetailSection**: loadItem(getCoreRule), 보기 모드(dl/dd 읽기 전용), 수정 모드(FormInput/FormTextarea/FormButton), save(patchCoreRule 후 loadItem), goToList(project-core-rules).
- **CoreRulesSection**: favoriteSet/protectedSet(ref Set<number>), isFavorite/isProtected 헬퍼, 보기→project-core-rule-detail, 수정→동일 상세(수정 버튼으로 전환), 즐겨찾기/보호 토글(로컬만), 삭제→window.confirm 후 deleteCoreRule·loadList 재호출.

## 4. Verification Results

- 목록에서 유형(aplyScope)이 카테고리 뱃지(회색 pill)로 표시됨.
- 보기 아이콘 클릭 시 상세 페이지로 이동, 읽기 전용 필드 표시.
- 상세에서 "수정" 클릭 시 폼 모드로 전환, 저장 시 PATCH 후 보기 모드로 복귀.
- 수정 아이콘 클릭 시 동일 상세 페이지로 이동(이후 수정 버튼으로 편집).
- 즐겨찾기(별)·보호(방패) 클릭 시 아이콘 강조 토글(페이지 내 상태만 유지).
- 삭제 아이콘 클릭 시 확인 대화상자 후 삭제 API 호출, 목록 갱신.
