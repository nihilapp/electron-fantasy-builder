# PLAN: API 엔드포인트 CRUD 구현 계획

> **Date:** 2026-02-01  
> **Task ID:** 001_UPDATE_EndpointImplementation  
> **Language:** Korean (Required)

## 1. Objective

- CRUD API 엔드포인트를 **우선순위에 따라 단계적으로 구현**한다.
- **구현 가이드**: `docs/API_ENDPOINT_SPEC.md` — 패스·메서드·스코프 규칙은 해당 명세를 따른다.
- 우선순위: **프로젝트(projects)** → **트레잇·어빌리티·프로젝트 트레잇·프로젝트 어빌리티** → **나머지 도메인**.
- RESTful·ResponseType 규칙을 준수하고, Controller → Service → Mapper 계층을 유지한다.

## 2. Context Analysis

- **구현 가이드(필수)**: `docs/API_ENDPOINT_SPEC.md` — 엔드포인트 전체 목록·공통 규칙·플랫 경로 설계.
- **참조 문서**: `docs/DDL_SCHEMA_TABLE_COMPARISON.md` (테이블 개수·명칭 대조), `PRD/Development Task List.md` (Phase 4).
- **현재**: Health·Example·Home 컨트롤러만 존재. projects, traits, abilities 등 도메인 CRUD 미구현.
- **스키마**: 로컬(SQLite) 31개·원격(Postgres) 32개 테이블. 로컬은 users 없음. `getDb()`로 연결 취득.

## 3. Strategy

### 3.1 공통 설계 (API_ENDPOINT_SPEC.md 준수)

- **패스**: 테이블(리소스)명 + 기능(HTTP 메서드). 플랫 경로 `/{리소스}`, `/{리소스}/:pkNo`. `/projects/:prjNo/...` 중첩 사용하지 않음.
- **프로젝트 스코프(prj_no)**: 목록은 `?prjNo=`, 생성은 body에 `prjNo` 포함.
- **메서드**: GET(목록·상세), POST(생성), PATCH(수정), DELETE(삭제).
- **응답**: HTTP 200, `ResponseType<TData>` / 목록은 `ListResponseType<TData>`.
- **계층**: Controller → Service → Mapper, `getDb()`로 로컬/원격 연결 취득.

### 3.2 우선순위별 구현 순서

| Phase | 리소스 | 패스(명세 기준) |
|-------|--------|-----------------|
| **1** | **projects** | /projects, /projects/:prjNo |
| **2** | **traits** | /traits, /traits/:traitNo |
| **2** | **abilities** | /abilities, /abilities/:abilityNo |
| **2** | **project_traits** | /project-traits?prjNo=, /project-traits/:traitNo |
| **2** | **project_abilities** | /project-abilities?prjNo=, /project-abilities/:abilityNo |
| **3** | **나머지** | /core-rules, /creatures, /characters, /items, /regions, /nations, /organizations, /events, /lores (목록 시 ?prjNo=, 생성 시 body prjNo) → 매핑 테이블 후순위 |

### 3.3 Phase 1 상세 (projects)

- ProjectMapper: selectList(페이징), selectByNo, insert, update, delete(del_yn).
- ProjectService: Mapper 호출, ListType/ResponseType 감싸기.
- ProjectController: GET /projects, GET /projects/:prjNo, POST, PATCH, DELETE (명세와 동일).
- DTO·타입: ProjectDto, 테이블 타입 (src/types).

### 3.4 Phase 2 상세 (traits, abilities, project_traits, project_abilities)

- 각 리소스별 Mapper(목록·상세·생성·수정·삭제) → Service(ListType/ResponseType) → Controller(REST) → DTO/타입.
- project_traits, project_abilities: 목록은 `GET /project-traits?prjNo=`, `GET /project-abilities?prjNo=`. 생성 시 body에 `prjNo`. 상세·수정·삭제는 `/:traitNo`, `/:abilityNo`.

### 3.5 Phase 3 (나머지)

- 코어·설정 엔티티: 목록 `GET /{리소스}?prjNo=`, 상세 `GET /{리소스}/:pkNo`, 생성 body에 `prjNo`. 명세의 Phase 3 테이블과 동일.
- 매핑 테이블(char_trait_maps, char_ability_maps 등)은 엔티티 CRUD 완료 후 범위 정리하여 구현.

## 4. Impact Analysis

- **추가 파일**: 각 도메인별 Mapper, Service, Controller, DTO/타입 (src/main/server/controller, service, db/mapper, src/types).
- **수정 파일**: honoApp 또는 createControllerApp에서 새 라우트 등록, controller/index 등.
- **Side Effects**: 라우트·엔드포인트 증가. 페이징·소프트 삭제(del_yn) 일관 적용 필요.

## 5. Task List

- [x] **Phase 1 — projects**
  - [x] ProjectMapper (list, getByNo, insert, update, delete)
  - [x] ProjectService (ListResponseType/ResponseType)
  - [x] ProjectController (GET/POST/PATCH/DELETE)
  - [x] ProjectVo(projectSchema), 테이블 타입 (src/types)
  - [x] API 레이어: apiGetProject (목록/상세/생성/수정/삭제 + ipcGetProject), api/index·ipc/index 연동
- [ ] **Phase 2 — traits, abilities, project_traits, project_abilities**
  - [x] TraitMapper / TraitService / TraitController / TraitVo
  - [x] AbilityMapper / AbilityService / AbilityController / AbilityVo
  - [x] API 레이어: apiGetTrait, apiGetAbility (목록/상세/생성/수정/삭제 + IPC), api/index·ipc/index 연동
  - [ ] ProjectTraitMapper / Service / Controller / DTO
  - [ ] ProjectAbilityMapper / Service / Controller / DTO
- [ ] **Phase 3 — 나머지**
  - [ ] 나머지 엔티티 CRUD (core_rules ~ lores)
  - [ ] 매핑 테이블 API (범위 정리 후)

## 6. Verification Plan

- Phase 1 완료 후: GET /projects 목록·상세, POST/PATCH/DELETE 동작 확인 (로컬 DB 또는 원격 DB).
- Phase 2 완료 후: /traits, /abilities, /project-traits?prjNo=, /project-abilities?prjNo= CRUD 확인.
- 응답 구조: ResponseType/ListResponseType, HTTP 200, error/code 필드 확인.

---

**구현 가이드**: 엔드포인트 패스·메서드·스코프 규칙은 **`docs/API_ENDPOINT_SPEC.md`** 를 가이드 삼아 진행한다. 상세 작업 순서·체크리스트는 `docs/ENDPOINT_IMPLEMENTATION_PLAN.md` 참조.
