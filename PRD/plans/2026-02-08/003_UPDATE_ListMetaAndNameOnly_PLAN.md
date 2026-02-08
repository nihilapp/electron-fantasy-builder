# PLAN: 목록 API 메타·이름만 반환 및 엔티티 공통 규칙 정리

> **Date:** 2026-02-08  
> **Task ID:** 003_UPDATE_ListMetaAndNameOnly  
> **Language:** Korean (Required)

## 1. Objective

- **목록 API**: 설정(엔티티) 목록 조회 시 **메타정보(공통 컬럼)와 이름(식별용)** 만 반환하도록 변경하여, 상세 본문(defDesc, aplyScope 등)은 **개별 상세 페이지 진입 시에만** 조회하도록 한다.
- **PRD 규칙**: 위 원칙을 "모든 엔티티 기본 규칙"으로 Coding Rules & Guidelines에 기록한다.

## 2. Context Analysis

- **Target Files:**
  - `PRD/Coding Rules & Guidelines.md` — 규칙 추가
  - `src/types/vo.types.ts` — 목록용 VO 타입 추가
  - `src/zod-schema/coreRule.schema.ts` — 목록 항목 스키마 추가(선택)
  - `src/main/server/db/mapper/CoreRuleMapper.ts` — selectList 시 선택 컬럼 제한
  - `src/main/server/service/CoreRuleService.ts` — getList 반환 타입을 목록용 VO로
  - `src/renderer` — 목록 응답 타입을 목록용 VO로 사용(필요 시)
- **Current Issue:**  
  GET /core-rules 목록이 전체 CoreRuleVo( defDesc, aplyScope, strcElem, mechDesc, narrAply, linkDocs, rmk, tags 등 포함)를 반환하여, 목록만 볼 때도 불필요한 상세 데이터가 내려옴. 개별 페이지 진입 시 GET /core-rules/:coreNo 로 상세만 조회하면 됨.

## 3. Strategy

### 3.1 PRD 규칙 추가 (Coding Rules & Guidelines)

- **위치:** Architectural Principles 또는 API/엔티티 관련 섹션.
- **내용:**  
  - 목록 API(List) 응답: **식별자(id/pk) + 이름(표시명) + 메타정보(공통 컬럼: useYn, delYn, shrnYn, crtNo, crtDt, updtNo, updtDt, delNo, delDt)** 만 반환한다.  
  - 상세 본문(긴 텍스트, 설명, 연관 데이터 등)은 **개별 상세 API(GetByNo 등)에서만** 조회·반환한다.  
  - 이 원칙은 **모든 엔티티(주요 설정, 특성, 능력 등)** 에 공통 적용한다.

### 3.2 코어 설정 목록용 타입·스키마

- **목록 항목 VO:**  
  `CoreRuleListItemVo` (또는 `CoreRuleListVo`):  
  `coreNo`, `prjNo`(선택), `coreNm` + 공통 메타(commonSchema 필드: useYn, delYn, shrnYn, crtNo, crtDt, updtNo, updtDt, delNo, delDt, rowNo, totalCnt 등).  
  defDesc, aplyScope, strcElem, mechDesc, narrAply, linkDocs, rmk, tags 는 **포함하지 않음**.
- **Zod:**  
  `coreRuleListItemSchema` 를 두고, Mapper에서 row → list item 변환 시 사용하거나, 타입만 정의하고 Mapper에서 필요한 컬럼만 select 후 매핑.

### 3.3 CoreRuleMapper.selectList

- **Local/Remote 공통:**  
  `select()` 시 컬럼을 제한:  
  `coreNo`, `prjNo`, `coreNm`, `useYn`, `shrnYn`, `delYn`, `crtNo`, `crtDt`, `updtNo`, `updtDt`, `delNo`, `delDt`.  
  (검색 조건은 기존대로 coreNm, defDesc like 유지 시, defDesc는 where에만 사용하고 select 목록에는 넣지 않음. 단 defDesc like 시 해당 컬럼을 select에 포함해야 할 수 있음 — DB에 따라 서브쿼리/존재 검사만 할 수 있으면 제외 가능. 단순화를 위해 목록 select에서는 coreNo, prjNo, coreNm + common만 반환하고, 검색은 coreNm/이름 검색만 지원하거나, defDesc 검색 시에도 select 목록에는 defDesc를 넣지 않고 where에만 사용 가능한지 확인. SQLite/Postgres 모두 like(table.defDesc, keyword)는 select에 defDesc가 없어도 where에서 사용 가능하므로, select는 메타+이름만으로 유지.)
- **반환:**  
  `{ list: CoreRuleListItemVo[], totalCnt: number }`.  
  row → CoreRuleListItemVo 변환 시 새 스키마/타입 사용.

### 3.4 CoreRuleService.getList

- **반환 타입:**  
  `ListResponseType<CoreRuleListItemVo>`.
- **동작:**  
  Mapper.selectList 결과를 그대로 data.list로 넣어 반환.

### 3.5 Controller / Renderer

- **Controller:**  
  변경 없음. getList 응답이 ListResponseType<CoreRuleListItemVo>로 바뀌면 응답 body 구조는 동일(data.list, data.totalCnt 등).
- **Renderer:**  
  목록 API 응답의 `data.list`를 `CoreRuleListItemVo[]`로 타입.  
  CoreRulesSection, CoreRuleFormSection 등에서는 이미 `coreNo`, `coreNm` (및 필요 시 rowNo)만 사용하므로, 목록 항목 타입만 CoreRuleListItemVo로 맞추면 됨.  
  상세 데이터는 기존대로 개별 페이지 진입 시 GET /core-rules/:coreNo 로 조회.

## 4. Impact Analysis

- **Affected Files:**  
  PRD/Coding Rules & Guidelines.md, src/types/vo.types.ts, src/zod-schema/coreRule.schema.ts(목록용 스키마), CoreRuleMapper.ts, CoreRuleService.ts, (선택) renderer의 list 응답 타입 참조处.
- **Side Effects:**  
  - 기존에 목록 응답에서 defDesc 등 본문 필드를 쓰는 코드가 있다면 제거 또는 상세 API 호출로 대체 필요.  
  - 현재 렌더러는 목록에서 coreNo, coreNm 위주로 사용하므로 영향 최소.

## 5. Task List

- [x] 1. PRD Coding Rules & Guidelines에 "목록 API는 메타+이름만, 상세는 개별 진입 시에만" 규칙 추가
- [x] 2. coreRuleListItemSchema(zod) 및 CoreRuleListItemVo(vo.types) 정의
- [x] 3. CoreRuleMapper.selectList: select 컬럼을 coreNo, prjNo, coreNm + common 메타로 제한, 반환 타입 CoreRuleListItemVo[]
- [x] 4. CoreRuleService.getList: ListResponseType<CoreRuleListItemVo> 반환
- [x] 5. Renderer 목록 응답 타입을 CoreRuleListItemVo 기준으로 정리(필요 시)
- [x] 6. 빌드·목록/상세 흐름 회귀 확인

## 6. Verification Plan

- GET /core-rules 응답 body.data.list 항목에 coreNo, coreNm, useYn, delYn, crtDt, updtDt 등만 있고, defDesc, aplyScope 등 본문 필드가 없음을 확인.
- GET /core-rules/:coreNo 응답에는 기존처럼 전체 상세 필드가 있음을 확인.
- 프로젝트 내 주요 설정 목록·사이드바·상세 진입이 정상 동작하는지 앱에서 확인.
