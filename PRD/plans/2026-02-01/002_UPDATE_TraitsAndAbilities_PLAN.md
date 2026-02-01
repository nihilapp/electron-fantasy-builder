# Implementation Plan - Global Traits & Abilities CRUD

**작성일**: 2026-02-01
**목표**: 전역 특성(Traits) 및 어빌리티(Abilities) 테이블의 CRUD API 구현 (VO 패턴 및 동적 검색 적용)

---

## 1. 개요
`PRD/Coding Rules & Guidelines.md`에 정의된 **VO 패턴**과 **동적 검색 로직**을 준수하여 `traits`와 `abilities` 도메인을 구현한다.
이 두 도메인은 프로젝트에 종속되지 않은 전역 리소스(Global Pool) 역할을 하며, 향후 프로젝트별 커스텀 리소스의 기반이 된다.

## 2. 작업 상세

### 2.1. VO 스키마 정의 (src/zod-schema/)
*   **공통 규칙**: `commonSchema` 및 `searchSchema`를 확장(`extend`)하고 모든 필드는 `optional`로 정의.
*   **파일**:
    *   `src/zod-schema/trait.schema.ts`: `traitNm` ~ `cnflTraitNo` 등 정의.
    *   `src/zod-schema/ability.schema.ts`: `abilityNm` ~ `useCnd` 등 정의.
*   **타입**: `src/types/vo.types.ts`에 `TraitVo`, `AbilityVo` 타입 추가.

### 2.2. Traits 도메인 구현 (src/main/server/)
1.  **Mapper (`db/mapper/TraitMapper.ts`)**
    *   `selectList(params: TraitVo)`: 페이징 + 검색 (traitNm, traitExpln - `like`, `or` 검색).
    *   `selectByNo(traitNo)`
    *   `insert(vo: TraitVo)`
    *   `update(traitNo, vo: TraitVo)`
    *   `delete(traitNo)`: 소프트 삭제 (`del_yn = 'Y'`).
2.  **Service (`service/TraitService.ts`)**
    *   `getList(params: TraitVo)`: 매퍼 호출 및 `ListResponseType` 변환.
    *   `getByNo`, `create`, `update`, `delete` 메서드 구현.
3.  **Controller (`controller/TraitController.ts`)**
    *   REST API 엔드포인트 구현 (GET, POST, PATCH, DELETE).
    *   Zod 스키마(`traitSchema`)를 통한 요청 검증.

### 2.3. Abilities 도메인 구현 (src/main/server/)
1.  **Mapper (`db/mapper/AbilityMapper.ts`)**
    *   `selectList(params: AbilityVo)`: 페이징 + 검색 (abilityNm, abilityExpln - `like`, `or` 검색).
    *   `insert`, `update`, `delete` 등 Traits와 동일 패턴.
2.  **Service (`service/AbilityService.ts`)**
    *   Traits와 동일 패턴.
3.  **Controller (`controller/AbilityController.ts`)**
    *   Traits와 동일 패턴.

### 2.4. 서버 등록
*   `src/main/server/server/index.ts` (또는 `honoApp.ts`)에 라우트 등록.
    *   `/traits` -> `TraitController`
    *   `/abilities` -> `AbilityController`

## 3. 검증 계획
*   **빌드 확인**: `pnpm build` 시 타입 에러 없음 확인.
*   **구현 확인**: 파일 생성 및 코드 구조가 가이드라인을 준수하는지 확인.
*   **동작 확인**: (가능한 경우) 로컬 개발 서버 구동 후 curl 또는 클라이언트를 통한 간단한 호출 테스트.

---

## 4. 예상 파일 목록
*   `src/zod-schema/trait.schema.ts`
*   `src/zod-schema/ability.schema.ts`
*   `src/types/vo.types.ts` (수정)
*   `src/main/server/db/mapper/TraitMapper.ts`
*   `src/main/server/db/mapper/AbilityMapper.ts`
*   `src/main/server/service/TraitService.ts`
*   `src/main/server/service/AbilityService.ts`
*   `src/main/server/controller/TraitController.ts`
*   `src/main/server/controller/AbilityController.ts`
*   `src/main/server/controller/index.ts` (라우트 등록)
*   `src/main/api/apiGetTrait.ts`, `src/main/api/apiGetAbility.ts` (목록/상세/생성/수정/삭제 + IPC)
*   `src/main/api/index.ts`, `src/main/ipc/index.ts` (export·ipc 등록 연동)

---

## 5. 진척도 (2026-02-01 반영)

- [x] **2.1** VO 스키마 (trait.schema.ts, ability.schema.ts), vo.types.ts (TraitVo, AbilityVo)
- [x] **2.2** TraitMapper (selectList 검색, selectByNo, insert, update, delete) / TraitService / TraitController
- [x] **2.3** AbilityMapper / AbilityService / AbilityController
- [x] **2.4** `/traits`, `/abilities` 라우트 등록 (createControllerApp)
- [x] **2.5** API 레이어: apiGetTrait.ts, apiGetAbility.ts (목록/상세/생성/수정/삭제 + ipcGetTrait, ipcGetAbility), api/index·ipc/index 연동
