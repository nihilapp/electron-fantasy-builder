# 002_UPDATE_TableTypes_PLAN

**작성일**: 2026-02-07
**작성자**: Anti-Gravity

## 1. Goal Description

- `src/renderer/types/table.types.ts` (또는 `src/types/table.types.ts`) 파일에, 현재 정의된 모든 Drizzle 스키마(Local/Remote)에 대한 `InferSelectModel`, `InferInsertModel` 타입을 정의합니다.
- 이를 통해 클라이언트(Renderer)나 공통 로직에서 DB Row 타입을 타입 안전하게 사용할 수 있도록 합니다.

## 2. User Review Required

> [!NOTE]
> `src/types/table.types.ts` 파일의 기존 `exampleTable` 관련 내용은 제거됩니다.
> 로컬(`local`)과 리모트(`remote`) 스키마 양쪽 모두에 대해 타입을 생성하며, 필요 시 `Local...`, `Remote...` 접두사를 사용해 구분합니다.

## 3. Proposed Changes

### src/types

#### [MODIFY] [table.types.ts](file:///c:/Users/nihil/coding/electron/electron-fantasy-builder/src/types/table.types.ts)

- **Import**: `drizzle-orm`의 `InferSelectModel`, `InferInsertModel`.
- **Import**: `@main/server/schema/local` 및 `@main/server/schema/remote`의 모든 테이블 스키마.
- **Export**:
  - `Project` (projects) → `ProjectsGet`, `ProjectsPost`
  - `User` (users) → `UsersGet`, `UsersPost`
  - `Trait` (traits) → `TraitsGet`, `TraitsPost`
  - `Ability` (abilities) → `AbilitiesGet`, `AbilitiesPost`
  - `CoreRule` (core_rules) → `CoreRulesGet`, `CoreRulesPost`
  - ... (모든 테이블에 대해 반복)
  - `remote` 스키마에 대해서도 동일하게 `RemoteProjectsGet` 등으로 export (혹은 타입이 동일하다면 유니온/단일 타입 사용 고려, 우선은 명시적 분리 제안).

## 4. Verification Plan

### Automated Tests
- `pnpm type-check` (또는 빌드) 실행하여 타입 에러가 없는지 확인.
- `src/types/table.types.ts`에서 export된 타입들이 정상적으로 추론되는지 확인 (IDE 상에서 호버링 등).
