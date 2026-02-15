# [Plan] Hono 프레임워크 구조 개선 (Layered -> DDD)

## 1. 개요 (Overview)
현재 `src/main/hono`는 `controller`, `service` 등 계층별(Layered) 구조로 되어 있으나, 이를 `src/main/hono/src`를 루트로 하는 도메인 주도 설계(DDD) 스타일의 모듈형 구조(`src/{Entity}/`)로 리팩토링합니다. `build-hono-framework` 스킬의 표준 구조와 일치시키는 것이 목표입니다.

## 2. 현황 분석 (Current State)
- **루트**: `src/main/hono`
- **구조**: Layered Architecture
    - `controller/`: 모든 엔티티의 컨트롤러 (25개 파일)
    - `service/`: 모든 엔티티의 서비스 (25개 파일)
    - `db/`: DB 컨텍스트
    - `schema/`: Drizzle 스키마 (local/remote)
    - `common/`: 공통 유틸리티
- **문제점**: 엔티티 관련 로직이 분산되어 있어 응집도가 낮고, 스킬 생성 표준(`src/{Entity}`)과 불일치함.

## 3. 목표 구조 (Target State)
- **루트**: `src/main/hono/src` (신규 생성)
- **구조**: Domain-Driven Design
    - `src/common/`: 공통 모듈 (`db`, `utils` 등)
    - `src/schema/`: DB 스키마 (`local`, `remote`)
    - `src/{Entity}/`: 엔티티별 모듈 (Controller, Service, Mapper, VO)
    - `src/main.ts`: 진입점

## 4. 수행 태스크 리스트 (Task List)

### 4.1. 환경 구성 (Phase 1)
- [ ] `src/main/hono/src` 디렉토리 생성
- [ ] 공통 모듈 이동
    - `common/` -> `src/common/`
    - `db/` -> `src/common/db/`
    - `schema/` -> `src/common/db/schema/`
- [ ] `tsconfig.json` 등의 경로 별칭(@) 수정 필요 여부 확인

### 4.2. 엔티티 리팩토링 (Phase 2)
각 엔티티별로 `controller`와 `service` 파일을 `src/{Entity}` 폴더로 이동하고, 파일명을 표준(`{Entity}Controller.ts`, `{Entity}Service.ts`)에 맞게 검증합니다.

**대상 엔티티 (24개):**
1.  **Auth**: `Auth` / `User`
2.  **Project**: `Project` / `ProjectAbility` / `ProjectTrait`
3.  **Character**: `Character` / `CharAbilityMap` / `CharTraitMap`
4.  **Creature**: `Creature` / `CreatureAbilityMap` / `CreatureTraitMap`
5.  **World**: `Nation` / `Region` / `Organization` / `Event` / `Lore` / `Item`
6.  **Mechanics**: `Ability` / `Trait` / `CoreRule` / `Health`
7.  **ETC**: `Home` / `Search` / `SettingsSearch`

### 4.3. 진입점 수정 (Phase 3)
- [ ] `honoApp.ts` 및 `index.ts` 위치 이동 및 임포트 수정
- [ ] `src/main/index.ts` (Electron Main)에서의 참조 수정

## 5. 검증 계획 (Verification)
- `pnpm run dev`를 통해 서버 정상 구동 확인
- API 동작 테스트 (주요 엔티티: Auth, Project 등)
