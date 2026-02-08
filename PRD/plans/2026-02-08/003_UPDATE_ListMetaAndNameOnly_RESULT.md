# RESULT: 목록 API 메타·이름만 반환 및 엔티티 공통 규칙 정리

> **Date:** 2026-02-08  
> **Task ID:** 003_UPDATE_ListMetaAndNameOnly  
> **Status:** ✅ SUCCESS  
> **Language:** Korean

## 1. Execution Summary

플랜 §5 Task List 전 항목을 순서대로 수행했습니다. 목록 API(GET /core-rules)는 **메타정보(공통 컬럼) + 이름(coreNm) + 식별자(coreNo, prjNo)** 만 반환하도록 변경했고, 상세 본문(defDesc, aplyScope 등)은 **GET /core-rules/:coreNo** 호출 시에만 조회됩니다. PRD Coding Rules에 "목록 API vs 상세 API" 규칙을 추가해 모든 엔티티 기본 원칙으로 기록했습니다.

## 2. Modified Files

- **[수정]** `PRD/Coding Rules & Guidelines.md` — "목록 API vs 상세 API (모든 엔티티 공통)" 섹션 추가. 목록은 식별자+이름+메타만, 상세는 개별 페이지 진입 시에만 조회.
- **[수정]** `src/zod-schema/coreRule.schema.ts` — `coreRuleListItemSchema` 추가( coreNo, prjNo, coreNm + commonSchema ). 목록 응답 검증용.
- **[수정]** `src/types/vo.types.ts` — `CoreRuleListItemVo` 타입 추가, `coreRuleListItemSchema` import.
- **[수정]** `src/main/server/db/mapper/CoreRuleMapper.ts` — `selectList`에서 select 컬럼을 `coreNo, prjNo, coreNm` + 공통 메타(useYn, shrnYn, delYn, crtNo, crtDt, updtNo, updtDt, delNo, delDt)로 제한. `coreRuleListRowToVo` 추가, 반환 타입 `CoreRuleListItemVo[]`.
- **[수정]** `src/main/server/service/CoreRuleService.ts` — `getList` 반환 타입을 `ListResponseType<CoreRuleListItemVo>`로 변경.
- **[수정]** `src/renderer/composables/query/coreRule/useGetCoreRuleList.ts` — `ListResponseType<CoreRuleListItemVo>` 사용.
- **[수정]** `src/renderer/types/electron.d.ts` — `CoreRuleListItemVo` import, `getCoreRuleList` 반환 타입을 `ListResponseType<CoreRuleListItemVo>`로 변경.
- **[수정]** `src/renderer/views/project-detail/core-rules/CoreRuleFormSection.vue` — 사이드바 목록 항목 타입을 `CoreRuleListItemVo`로 지정.
- **[수정]** `src/renderer/views/project-detail/core-rules/CoreRulesSection.vue` — 목록 항목·`removeItem` 인자 타입을 `CoreRuleListItemVo`로 지정.

## 3. Key Changes

- **PRD 규칙:** 목록 API는 식별자+이름+메타만 반환, 상세 API는 개별 진입 시에만 조회. 주요 설정·특성·능력 등 모든 설정 엔티티에 공통 적용.
- **목록 항목 타입:** `CoreRuleListItemVo` = coreNo, prjNo, coreNm + commonSchema(useYn, delYn, shrnYn, crtNo, crtDt, updtNo, updtDt, delNo, delDt, rowNo, totalCnt, tags). defDesc, aplyScope, strcElem, mechDesc, narrAply, linkDocs, rmk 은 목록에 포함하지 않음.
- **Mapper:** `selectList`가 `listColumns(table)`로 위 컬럼만 select, `coreRuleListRowToVo`로 변환. 검색( coreNm / defDesc like )은 기존대로 where에만 사용.
- **Renderer:** 목록 응답을 `CoreRuleListItemVo[]`로 타입. 상세 화면·폼은 기존처럼 `CoreRuleVo`( getCoreRule 단건) 사용.

## 4. Verification Results

- **빌드:** `pnpm run build` 성공 (main / preload / renderer).
- **린트:** 수정·추가한 파일 기준 오류 없음.
- **동작:** GET /core-rules 응답의 `data.list` 항목에는 coreNo, coreNm, useYn, delYn, crtDt, updtDt 등만 포함되고, defDesc·aplyScope 등 본문 필드는 포함되지 않음. GET /core-rules/:coreNo 는 기존과 동일하게 전체 상세 필드 반환. 목록·사이드바·상세 진입·삭제 플로우는 기존과 동일하게 동작.
