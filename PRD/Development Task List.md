# Development Task List — Fantasy Builder (Electron + Vue + Hono)

**작성일**: 2026-02-01  
**버전**: 1.1 (Updated: Project CRUD 완료 및 상세 태스크 분할)

---

## Phase 1: 환경 및 기반

- [x] **Init**: 프로젝트 생성, 의존성 설치 (`pnpm install`), Git·`.gitignore` 확인
- [x] **Config**: `src/config/app.json` — api.baseURL, server(port/hostname), db.mode/local/remote
- [x] **Schema**: Fantasy Builder 테이블 구조 반영 (Drizzle local/remote)
  - [x] 공통 컬럼 (common.columns)
  - [x] users, projects, traits, project_traits, abilities, project_abilities
  - [x] characters, creatures, items, regions, nations, organizations, events, lores, core_rules
  - [x] char_trait_maps, char_ability_maps, creature_trait_maps, creature_ability_maps
- [x] **Migration**: `pnpm db:generate`(로컬), `pnpm db:generate:remote`(원격)로 마이그레이션 생성
- [x] **Base Architecture**: Controller/Service/Mapper 패턴 유지. 새 라우트·API·IPC는 명명 규칙 준수

---

## Phase 2: 공통 인프라 및 타입

- [x] **ApiResponse 래퍼**: `{ data, error, code, message }` 표준 응답 구조 (`src/types/response.types.ts`)
- [x] **ListType**: 목록 응답용 `list`, `totalCnt`, `pageSize`, `page`, `totalPage`, `isFirst`, `isLast`
- [x] **GlobalExceptionHandler**: Hono onError에서 표준 에러 응답(ResponseType), HTTP 200 반환
- [x] **src/types/vo.types.ts**: Zod 스키마 기반 VO 타입 정의 (ProjectVo 등)
- [ ] **src/types/table.ts**: Drizzle 스키마 기반 InferSelectModel/InferInsertModel (필요 시 보강)

---

## Phase 3: 인증 및 사용자 관리

- [ ] **Users Domain** (users)
  - [ ] Mapper (CRUD, 검색)
  - [ ] Service
  - [ ] Controller
- [ ] **비밀번호 해싱**: bcrypt (또는 동일 수준) 유틸
- [ ] **JWT 토큰**: Access/Refresh 생성·검증 유틸
- [ ] **Auth Domain**
  - [ ] Service (Login, Logout, Refresh)
  - [ ] Controller (API/IPC 엔드포인트)

---

## Phase 4: 전역 풀 및 프로젝트 도메인

### 4.1. 전역 특성/어빌리티
- [x] **Traits Domain** (traits)
  - [x] Mapper (로컬/원격 분기)
  - [x] Service
  - [x] Controller (GET/POST/PATCH/DELETE /traits, /traits/:traitNo)
- [x] **Abilities Domain** (abilities)
  - [x] Mapper (로컬/원격 분기)
  - [x] Service
  - [x] Controller (GET/POST/PATCH/DELETE /abilities, /abilities/:abilityNo)

### 4.2. 프로젝트 (완료)
- [x] **Projects Domain** (projects)
  - [x] Mapper (CRUD, 페이징, 동적 검색, 로컬/원격 분기)
  - [x] Service (VO 기반 처리)
  - [x] Controller (Zod 검증, REST API)
- [x] **Project Traits Domain** (project_traits)
  - [x] Mapper (prjNo 스코프 CRUD, 로컬/원격 분기)
  - [x] Service
  - [x] Controller (GET/POST /projects/:prjNo/traits, GET/PATCH/DELETE /projects/:prjNo/traits/:traitNo)
- [x] **Project Abilities Domain** (project_abilities)
  - [x] Mapper (prjNo 스코프 CRUD, 로컬/원격 분기)
  - [x] Service
  - [x] Controller (GET/POST /projects/:prjNo/abilities, GET/PATCH/DELETE /projects/:prjNo/abilities/:abilityNo)

### 4.3. 통합 검색
- [x] **Trait/Ability 통합 검색**: 전역 + 프로젝트 종속 풀 통합 검색, 타입(GLOBAL|PROJECT|ALL) 필터
  - [x] GET /projects/:prjNo/search/traits (type, searchKeyword, searchType, page, pageSize)
  - [x] GET /projects/:prjNo/search/abilities (동일 쿼리)

---

## Phase 5: 설정 엔티티 (prj_no 스코프)

- [x] **Core Rules** (core_rules)
  - [x] Mapper (prjNo 스코프 CRUD, 로컬/원격 분기)
  - [x] Service
  - [x] Controller (GET/POST /projects/:prjNo/core-rules, GET/PATCH/DELETE /projects/:prjNo/core-rules/:coreNo)
- [x] **Creatures** (creatures)
  - [x] Mapper (prjNo 스코프 CRUD, 로컬/원격 분기)
  - [x] Service
  - [x] Controller (GET/POST /creatures, GET/PATCH/DELETE /creatures/:creatureNo, prjNo 쿼리/바디)
- [x] **Characters** (characters)
  - [x] Mapper (prjNo 스코프 CRUD, 로컬/원격 분기)
  - [x] Service
  - [x] Controller (GET/POST /characters, GET/PATCH/DELETE /characters/:charNo, prjNo 쿼리/바디)
- [x] **Items** (items)
  - [x] Mapper (prjNo 스코프 CRUD, 로컬/원격 분기)
  - [x] Service
  - [x] Controller (GET/POST /items, GET/PATCH/DELETE /items/:itemNo, prjNo 쿼리/바디)
- [x] **Regions** (regions)
  - [x] Mapper (prjNo 스코프 CRUD, 로컬/원격 분기)
  - [x] Service
  - [x] Controller (GET/POST /regions, GET/PATCH/DELETE /regions/:regionNo, prjNo 쿼리/바디)
- [x] **Nations** (nations)
  - [x] Mapper (prjNo 스코프 CRUD, 로컬/원격 분기)
  - [x] Service
  - [x] Controller (GET/POST /nations, GET/PATCH/DELETE /nations/:ntnNo, prjNo 쿼리/바디)
- [x] **Organizations** (organizations)
  - [x] Mapper (prjNo 스코프 CRUD, 로컬/원격 분기)
  - [x] Service
  - [x] Controller (GET/POST /organizations, GET/PATCH/DELETE /organizations/:orgNo, prjNo 쿼리/바디)
- [x] **Events** (events)
  - [x] Mapper (prjNo 스코프 CRUD, 로컬/원격 분기)
  - [x] Service
  - [x] Controller (GET/POST /events, GET/PATCH/DELETE /events/:eventNo, prjNo 쿼리/바디)
- [x] **Lores** (lores)
  - [x] Mapper (prjNo 스코프 CRUD, 로컬/원격 분기)
  - [x] Service
  - [x] Controller (GET/POST /lores, GET/PATCH/DELETE /lores/:loreNo, prjNo 쿼리/바디)

---

## Phase 6: 매핑 테이블 및 관계

- [x] **Char-Trait Maps** (char_trait_maps)
  - [x] Mapper/Service/Controller (GET/POST /char-trait-maps, GET/PATCH/DELETE 쿼리 charNo,traitNo,traitType, 단건 GET /char-trait-maps/one)
- [x] **Char-Ability Maps** (char_ability_maps)
  - [x] Mapper/Service/Controller (GET/POST /char-ability-maps, 단건/수정/삭제 쿼리 charNo,abilityNo,abilityType)
- [x] **Creature-Trait Maps** (creature_trait_maps)
  - [x] Mapper/Service/Controller (GET/POST /creature-trait-maps, GET/PATCH/DELETE /creature-trait-maps/:mapNo, 목록 ?creatureNo=)
- [x] **Creature-Ability Maps** (creature_ability_maps)
  - [x] Mapper/Service/Controller (GET/POST /creature-ability-maps, GET/PATCH/DELETE /creature-ability-maps/:mapNo, 목록 ?creatureNo=)
- [ ] **Relationships** (char_relations, group_relations 등)
  - [ ] Mapper/Service/Controller
- [ ] **Trait/Ability 사용 현황 조회 API**

---

## Phase 7: 권한 및 보안

- [ ] **공유 여부(shrn_yn) 기반 접근 제어**
- [ ] **역할 기반 권한**: ADMIN / USER
- [ ] **프로젝트 소유자 권한 검증**: 프로젝트 종속 리소스 수정/삭제

---

## Phase 8: 검증 및 마무리

- [ ] **Lint**: `pnpm lint` 전체 통과
- [ ] **Build**: `pnpm build` 정상 동작
- [ ] **수동 검증**: `pnpm dev` 후 Home/Health/DB 모드 및 새 API·뷰 동작 확인
- [ ] **문서**: PRD·IPC 가이드·README 필요 시 갱신

---

*문서 끝*