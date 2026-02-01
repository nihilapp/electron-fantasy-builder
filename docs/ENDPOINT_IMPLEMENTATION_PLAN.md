# API 엔드포인트 구현 계획

**작성일**: 2026-02-01  
**목적**: CRUD API 엔드포인트 구현 우선순위 및 단계별 계획.  
**참조**: [DDL_SCHEMA_TABLE_COMPARISON.md](./DDL_SCHEMA_TABLE_COMPARISON.md), [PRD/Development Task List.md](../PRD/Development%20Task%20List.md)

---

## 1. 우선순위 원칙

1. **프로젝트(projects)** — 모든 프로젝트 종속 리소스의 상위. 먼저 구현.
2. **트레잇·어빌리티·프로젝트 트레잇·프로젝트 어빌리티** — 전역 풀 + 프로젝트 종속. PRD 핵심 도메인.
3. **나머지** — 코어 규칙, 생물/인물/아이템/지역/국가/조직/사건/전승, 매핑 테이블 순.

---

## 2. 공통 설계 (RESTful)

- **패스**: 리소스 복수형, PK는 `no` 접미사 (예: `:prjNo`, `:traitNo`, `:abilityNo`).
- **메서드**: GET(목록·상세), POST(생성), PATCH(수정), DELETE(삭제).
- **응답**: HTTP 200, `ResponseType<TData>` / 목록은 `ListResponseType<TData>`.
- **계층**: Controller → Service → Mapper, `getDb()`로 로컬/원격 연결 취득.
- **API 레이어 (src/main/api)**: 렌더러에서 호출 시 Hono 대신 `apiClient`로 요청하는 함수 + IPC 핸들러 등록. 각 리소스 CRUD 구현 시 대응하는 apiGet* 파일(목록/상세/생성/수정/삭제 + ipcGet*)을 추가하고 `api/index.ts`, `ipc/index.ts`에 연동한다.

| 메서드 | 패스 예시 | 설명 |
|--------|-----------|------|
| GET | `/projects` | 목록 (페이징: `?page`, `?pageSize`) |
| GET | `/projects/:prjNo` | 상세 1건 |
| POST | `/projects` | 생성 |
| PATCH | `/projects/:prjNo` | 수정 |
| DELETE | `/projects/:prjNo` | 삭제 (소프트 삭제 시 del_yn 처리) |

---

## 3. Phase 1: 프로젝트 (projects)

**목표**: 프로젝트 CRUD. 이후 모든 프로젝트 종속 리소스의 `prj_no` 스코프 기준.

| 순서 | 작업 | 비고 |
|------|------|------|
| 1.1 | ProjectMapper | selectList(페이징), selectByNo, insert, update, delete(del_yn) |
| 1.2 | ProjectService | Mapper 호출, ListType/ResponseType 감싸기 |
| 1.3 | ProjectController | GET /projects, GET /projects/:prjNo, POST, PATCH, DELETE |
| 1.4 | DTO·타입 | ProjectVo(projectSchema), 테이블 타입 (src/types) |
| 1.5 | API 레이어 | apiGetProject.ts (목록/상세/생성/수정/삭제 + ipcGetProject), api/index·ipc/index 연동 |

**엔드포인트**

- `GET /projects` — 목록 (page, pageSize)
- `GET /projects/:prjNo` — 상세
- `POST /projects` — 생성
- `PATCH /projects/:prjNo` — 수정
- `DELETE /projects/:prjNo` — 삭제(또는 소프트 삭제)

---

## 4. Phase 2: 트레잇·어빌리티·프로젝트 트레잇·프로젝트 어빌리티

**순서**: 전역 풀(traits, abilities) → 프로젝트 종속(project_traits, project_abilities).  
프로젝트 종속은 `prj_no` 필수이므로 projects 이후 구현.

### 4.1. 전역 트레잇 (traits)

| 순서 | 작업 | 비고 |
|------|------|------|
| 2.1.1 | TraitMapper | selectList(페이징·검색), selectByNo, insert, update, delete |
| 2.1.2 | TraitService | ListType/ResponseType 감싸기 |
| 2.1.3 | TraitController | GET /traits, GET /traits/:traitNo, POST, PATCH, DELETE |
| 2.1.4 | TraitVo, 타입 | src/types (vo.types) |
| 2.1.5 | API 레이어 | apiGetTrait.ts (목록/상세/생성/수정/삭제 + ipcGetTrait), api/index·ipc/index 연동 |

**엔드포인트**: `GET/POST /traits`, `GET/PATCH/DELETE /traits/:traitNo`

### 4.2. 전역 어빌리티 (abilities)

| 순서 | 작업 | 비고 |
|------|------|------|
| 2.2.1 | AbilityMapper | selectList(페이징·검색), selectByNo, insert, update, delete |
| 2.2.2 | AbilityService | ListType/ResponseType 감싸기 |
| 2.2.3 | AbilityController | GET /abilities, GET /abilities/:abilityNo, POST, PATCH, DELETE |
| 2.2.4 | AbilityVo, 타입 | src/types (vo.types) |
| 2.2.5 | API 레이어 | apiGetAbility.ts (목록/상세/생성/수정/삭제 + ipcGetAbility), api/index·ipc/index 연동 |

**엔드포인트**: `GET/POST /abilities`, `GET/PATCH/DELETE /abilities/:abilityNo`

### 4.3. 프로젝트 트레잇 (project_traits)

- **스코프**: `prj_no` 필수. 경로에 `prjNo` 포함 권장.
| 순서 | 작업 | 비고 |
|------|------|------|
| 2.3.1 | ProjectTraitMapper | prj_no 기준 목록/상세/생성/수정/삭제 |
| 2.3.2 | ProjectTraitService | ListType/ResponseType 감싸기 |
| 2.3.3 | ProjectTraitController | GET /projects/:prjNo/traits, GET /projects/:prjNo/traits/:traitNo, POST, PATCH, DELETE |
| 2.3.4 | ProjectTraitDto, 타입 | src/types |

**엔드포인트**: `GET/POST /projects/:prjNo/traits`, `GET/PATCH/DELETE /projects/:prjNo/traits/:traitNo`

### 4.4. 프로젝트 어빌리티 (project_abilities)

- **스코프**: `prj_no` 필수.
| 순서 | 작업 | 비고 |
|------|------|------|
| 2.4.1 | ProjectAbilityMapper | prj_no 기준 목록/상세/생성/수정/삭제 |
| 2.4.2 | ProjectAbilityService | ListType/ResponseType 감싸기 |
| 2.4.3 | ProjectAbilityController | GET /projects/:prjNo/abilities, GET /projects/:prjNo/abilities/:abilityNo, POST, PATCH, DELETE |
| 2.4.4 | ProjectAbilityDto, 타입 | src/types |

**엔드포인트**: `GET/POST /projects/:prjNo/abilities`, `GET/PATCH/DELETE /projects/:prjNo/abilities/:abilityNo`

---

## 5. Phase 3: 나머지 도메인

**순서**: 프로젝트 FK 있는 코어/설정 엔티티 → 매핑·관계 테이블.

### 5.1. 코어·설정 엔티티 (prj_no 스코프)

| 리소스 | 테이블 | 패스 예시 | 비고 |
|--------|--------|-----------|------|
| CoreRule | core_rules | /projects/:prjNo/core-rules, :coreNo | |
| Creature | creatures | /projects/:prjNo/creatures, :creatureNo | |
| Character | characters | /projects/:prjNo/characters, :charNo | race_no, ntn_no, org_no FK |
| Item | items | /projects/:prjNo/items, :itemNo | |
| Region | regions | /projects/:prjNo/regions, :regionNo | |
| Nation | nations | /projects/:prjNo/nations, :ntnNo | |
| Organization | organizations | /projects/:prjNo/organizations, :orgNo | |
| Event | events | /projects/:prjNo/events, :eventNo | |
| Lore | lores | /projects/:prjNo/lores, :loreNo | |

각 리소스별 Mapper → Service → Controller → DTO/타입 순으로 구현.

### 5.2. 매핑·관계 테이블

| 구분 | 테이블 예시 | 비고 |
|------|-------------|------|
| 특성/어빌리티 매핑 | char_trait_maps, char_ability_maps, creature_trait_maps, creature_ability_maps, item_ability_maps, item_trait_maps, ntn_trait_maps, org_trait_maps, region_trait_maps | 엔티티 CRUD 완료 후 |
| 관계 | char_relations, char_group_relations, char_item_maps, group_relations, lore_char_maps, lore_item_maps, event_entries | 스키마·비즈니스 정리 후 |

---

## 6. 구현 순서 요약

| Phase | 리소스 | 구현 순서 |
|-------|--------|-----------|
| **1** | **projects** | ProjectMapper → ProjectService → ProjectController → VO/타입 → **apiGetProject + IPC** |
| **2** | **traits** | TraitMapper → TraitService → TraitController → VO/타입 → **apiGetTrait + IPC** |
| **2** | **abilities** | AbilityMapper → AbilityService → AbilityController → VO/타입 → **apiGetAbility + IPC** |
| **2** | **project_traits** | ProjectTraitMapper → Service → Controller → DTO/타입 |
| **2** | **project_abilities** | ProjectAbilityMapper → Service → Controller → DTO/타입 |
| **3** | **나머지** | core_rules, creatures, characters, items, regions, nations, organizations, events, lores → 매핑 테이블 |

---

## 7. 체크리스트 (Phase 1·2)

- [x] **Phase 1**  
  - [x] ProjectMapper (list, getByNo, insert, update, delete)  
  - [x] ProjectService (ListResponseType/ResponseType)  
  - [x] ProjectController (GET/POST/PATCH/DELETE)  
  - [x] ProjectVo(projectSchema), 테이블 타입 (src/types)  
  - [x] API 레이어: apiGetProject (목록/상세/생성/수정/삭제 + ipcGetProject), api/index·ipc/index 연동  

- [ ] **Phase 2**  
  - [x] TraitMapper / TraitService / TraitController / TraitVo  
  - [x] AbilityMapper / AbilityService / AbilityController / AbilityVo  
  - [x] API 레이어: apiGetTrait, apiGetAbility (목록/상세/생성/수정/삭제 + IPC), api/index·ipc/index 연동  
  - [ ] ProjectTraitMapper / Service / Controller / DTO  
  - [ ] ProjectAbilityMapper / Service / Controller / DTO  

- [ ] **Phase 3**  
  - [ ] 나머지 엔티티 CRUD (core_rules ~ lores)  
  - [ ] 매핑 테이블 API (필요 범위 정리 후)

---

*문서 끝*
