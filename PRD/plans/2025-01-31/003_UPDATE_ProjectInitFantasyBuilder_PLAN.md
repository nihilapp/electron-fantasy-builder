# PLAN: 프로젝트 초기화 — Fantasy Builder (Electron + Vue + Hono)

> **Date:** 2025-01-31
> **Task ID:** 003_UPDATE_ProjectInitFantasyBuilder
> **Language:** Korean (Required)

## 1. Objective

- **PRD copy**는 Java/Spring Boot 기반 Fantasy Builder API 문서이다. 이번 프로젝트는 동일 제품을 **Electron + Vue + Hono**로 구현하는 것이 목적이다.
- **테이블 구조**: PRD copy의 Data Structure(Schema)를 그대로 가져와 `src/main/server` DB(Drizzle)에 세팅한다.
- **문서**: PRD copy의 PRD.md, Coding Rules, Development Task List, TODO를 **TypeScript / Electron + Vue / Hono** 환경에 맞게 변환하여 기존 `PRD/` 폴더를 갱신한다.

## 2. Context Analysis

- **Target Files:**
  - `src/main/server/schema/local/`, `src/main/server/schema/remote/` — Drizzle 스키마
  - `PRD/PRD.md`, `PRD/Coding Rules & Guidelines.md`, `PRD/Development Task List.md`
  - (신규) `PRD/TODO.md`
- **Current Issue:**
  - 현재 서버 스키마는 `example` 테이블만 존재. Fantasy Builder 도메인 테이블(users, projects, traits, project_traits, abilities, project_abilities, characters, creatures, items, regions, nations, organizations, events, lores, 매핑 테이블 등)이 없음.
  - PRD 폴더는 Electron 템플릿용 일반 PRD로 되어 있음. Fantasy Builder 제품 목표 + Electron+Vue+Hono 스택으로 맞춰야 함.

## 3. Strategy

### 3.1. DB 스키마 (테이블 구조)

- **공통 필드(CommonEntity)**  
  PRD copy의 `useYn`, `shrnYn`, `delYn`, `crtNo`, `crtDt`, `updtNo`, `updtDt`, `delNo`, `delDt`를 모든 엔티티 테이블에 포함. Drizzle에서는 공통 컬럼 객체를 만들어 각 테이블에 spread.
- **로컬(SQLite)**: `integer` PK autoIncrement, `text`(날짜는 ISO 8601 문자열), `integer`(Long → integer).
- **원격(Postgres)**: `serial` PK, `timestamp`, `bigint` 등 Postgres 타입 사용.
- **테이블 목록** (PRD copy Section 4 기준):
  - **핵심**: users, projects, traits, project_traits, abilities, project_abilities
  - **설정 엔티티**: characters, creatures, items, regions, nations, organizations, events, lores, core_rules (Phase 5.1)
  - **매핑**: char_trait_maps, char_ability_maps, creature_trait_maps, creature_ability_maps (우선). 나머지 매핑(ItemTraitMap, RegionTraitMap, NtnTraitMap, OrgTraitMap, CharRelation, CharGroupRelation 등)은 동일 패턴으로 추가 가능하나, 초기화 범위에서는 핵심 + 설정 엔티티 + 위 4개 매핑까지 정의.
- **파일 구성**:  
  `schema/local/common.columns.ts`, `schema/remote/common.columns.ts`(공통 컬럼),  
  엔티티별 `*.table.ts` (users.table.ts, projects.table.ts 등),  
  `schema/local/index.ts`, `schema/remote/index.ts`에서 export.
- **example 테이블**: Fantasy Builder와 무관한 템플릿용이므로 유지할지 제거할지 선택. 초기화에서는 **유지**하고, Fantasy Builder 테이블만 추가한다.

### 3.2. PRD 문서 변환

- **PRD.md**:  
  - Goal, Target User, Key Value는 PRD copy와 동일(World Building Tool, 창작자 타깃).  
  - Tech Stack을 **Electron, Vue 3, TypeScript, Hono, Drizzle, SQLite/PostgreSQL**로 변경.  
  - System Architecture는 Main/Preload/Renderer, Hono API, 이중 DB(local/remote) 구조로 기술.  
  - Data Structure(Schema)는 PRD copy Section 4를 유지하되, Java 엔티티 대신 **테이블명·컬럼명(snake_case)** 및 Drizzle 스키마 파일 위치만 명시.
- **Coding Rules & Guidelines.md**:  
  - Spring Boot/JPA/Java 문법을 **Electron + Vue + Hono + Drizzle** 규칙으로 전환.  
  - 폴더 구조는 `src/main/` (main, server, api, ipc), `src/renderer/`, `types/`, `config/` 기준.  
  - Entity/VO/Repository → Schema(table), Mapper, Service, Controller, DTO 타입.  
  - 명명 규칙: 파일 kebab-case, Controller/Service/Mapper, DTO는 types/dto.ts·table.ts.
- **Development Task List.md**:  
  - Phase를 Electron 환경에 맞게 재구성.  
  - Phase 1: 환경·설정(Config, DB 모드).  
  - Phase 2: 스키마·Mapper·타입(users, projects, traits 등).  
  - Phase 3~: 기능 구현(인증, 프로젝트, 전역/프로젝트 특성·어빌리티, 설정 엔티티, 매핑).  
  - 각 항목을 [ ] 체크리스트로 두고, Java 엔티티/VO/Repository 대신 **Schema, Mapper, Service, Controller, API/IPC** 태스크로 기술.
- **TODO.md**:  
  - PRD copy의 TODO.md 내용을 **Electron + Vue** 맥락으로 옮김.  
  - 사용 현황 조회, 이메일 인증, 검증·에러 처리 등은 “Phase 6(매핑) 이후” 또는 “Hono 서비스 레이어에서 구현” 등으로 정리.

## 4. Impact Analysis

- **Affected Files:**
  - 신규: `src/main/server/schema/local/common.columns.ts`, `schema/remote/common.columns.ts`,  
    `schema/local/users.table.ts`, `projects.table.ts`, `traits.table.ts`, `project_traits.table.ts`,  
    `abilities.table.ts`, `project_abilities.table.ts`, `characters.table.ts`, `creatures.table.ts`,  
    `items.table.ts`, `regions.table.ts`, `nations.table.ts`, `organizations.table.ts`,  
    `events.table.ts`, `lores.table.ts`, `core_rules.table.ts`,  
    `char_trait_maps.table.ts`, `char_ability_maps.table.ts`, `creature_trait_maps.table.ts`, `creature_ability_maps.table.ts`  
    (로컬/원격 각각 또는 공통 정의 후 dialect 분기).
  - 수정: `schema/local/index.ts`, `schema/remote/index.ts`,  
    `drizzle/local/`, `drizzle/remote/` (마이그레이션 재생성 가능).
  - PRD: `PRD/PRD.md`, `PRD/Coding Rules & Guidelines.md`, `PRD/Development Task List.md`, `PRD/TODO.md`(신규).
- **Side Effects:**
  - 기존 example 테이블만 사용하던 Controller/Service/Mapper는 그대로 두면 됨.  
  - 새 마이그레이션 적용 시 로컬 DB 파일이 있다면 `drizzle-kit generate` 후 `drizzle-kit migrate` 또는 앱 기동 시 마이그레이션 적용 로직 확인 필요.

## 5. Task List

- [ ] 공통 컬럼 정의: `schema/local/common.columns.ts`, `schema/remote/common.columns.ts` (useYn, shrnYn, delYn, crtNo, crtDt, updtNo, updtDt, delNo, delDt)
- [ ] users, projects 테이블 스키마 (local + remote)
- [ ] traits, project_traits, abilities, project_abilities 테이블 스키마 (local + remote)
- [ ] characters, creatures, items, regions, nations, organizations, events, lores, core_rules 테이블 스키마 (local + remote)
- [ ] char_trait_maps, char_ability_maps, creature_trait_maps, creature_ability_maps 스키마 (local + remote)
- [ ] schema/local/index.ts, schema/remote/index.ts 에 모든 테이블 export
- [ ] Drizzle 마이그레이션 생성: `pnpm db:generate`, `pnpm db:generate:remote` (또는 프로젝트 스크립트 확인)
- [ ] PRD/PRD.md — Fantasy Builder + Electron + Vue + Hono 버전으로 갱신
- [ ] PRD/Coding Rules & Guidelines.md — TS/Electron/Vue/Hono 규칙으로 갱신
- [ ] PRD/Development Task List.md — Phase별 태스크 TS/Electron/Hono 버전으로 갱신
- [ ] PRD/TODO.md — Electron+Vue 맥락으로 생성

## 6. Verification Plan

- `pnpm db:generate`(로컬), `pnpm db:generate:remote`(원격) 실행 시 에러 없이 마이그레이션 파일 생성되는지 확인.
- `pnpm dev` 또는 서버 기동 시 getDb()로 스키마 로드 시 타입/import 에러가 없는지 확인.
- PRD 문서들이 Java/Spring 참조 없이 Electron/Vue/Hono/Drizzle 기준으로 읽히는지 검토.
