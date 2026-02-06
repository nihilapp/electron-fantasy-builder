# API 엔드포인트 구상 명세

**작성일**: 2026-02-01  
**목적**: 구현 전 확인용 — “어떤 엔드포인트가 있을지” 구상 결과. 확인 후 실제 구현에 반영.  
**참조**: [DDL_SCHEMA_TABLE_COMPARISON.md](./DDL_SCHEMA_TABLE_COMPARISON.md), [ENDPOINT_IMPLEMENTATION_PLAN.md](./ENDPOINT_IMPLEMENTATION_PLAN.md)

---

## 1. 공통 규칙

- **API는 테이블 단위**: 리소스 경로는 **테이블(엔티티) 단위**로 한다. 한 리소스 = 한 테이블 대응.
- **프로젝트 종속(prj_no 스코프)**: 요청 시 **JSON(body)** 으로 넘긴다. 목록은 쿼리 `?prjNo=`, 생성·수정은 body에 `prjNo` 등 포함. 경로에 `:prjNo` 중첩하지 않음.
- **추가(생성) UI**: 해당 리소스 루트로 **POST** 하는 폼 화면과 링크한다. 예: 코어 설정 추가 → `POST /core-rules` 로 전송하는 폼 페이지로 이동.
- **패스**: **테이블(리소스)명 + 기능(HTTP 메서드)**. 리소스는 복수형·플랫하게 두고, `/projects/:prjNo/...` 처럼 깊이 파고들지 않는다.
- **리소스 경로**: `/{리소스}`(목록·생성), `/{리소스}/:pkNo`(상세·수정·삭제). 예: `/projects`, `/projects/:prjNo`, `/core-rules`, `/core-rules/:coreNo`.
- **메서드**: GET(목록·상세), POST(생성), PATCH(수정), DELETE(삭제).
- **응답**: HTTP 200, `ResponseType<TData>` / 목록은 `ListResponseType<TData>` (페이징: `?page`, `?pageSize`).
- **삭제**: 소프트 삭제 시 `del_yn` 처리.

---

## 2. 엔드포인트 전체 목록 (구상)

**설계**: 리소스당 `/{테이블명}`(목록·생성), `/{테이블명}/:pkNo`(상세·수정·삭제). 기능은 HTTP 메서드로만 구분. 프로젝트 스코프는 경로 중첩 없이 `?prjNo=`·body로 처리.

### Phase 1 — 프로젝트 (projects)

| 메서드 | 패스 | 설명 |
|--------|------|------|
| GET | `/projects` | 목록 (페이징) |
| GET | `/projects/:prjNo` | 상세 1건 |
| POST | `/projects` | 생성 |
| PATCH | `/projects/:prjNo` | 수정 |
| DELETE | `/projects/:prjNo` | 삭제(소프트 삭제) |

---

### Phase 2 — 전역 트레잇 (traits)

| 메서드 | 패스 | 설명 |
|--------|------|------|
| GET | `/traits` | 목록 (페이징·검색) |
| GET | `/traits/:traitNo` | 상세 1건 |
| POST | `/traits` | 생성 |
| PATCH | `/traits/:traitNo` | 수정 |
| DELETE | `/traits/:traitNo` | 삭제 |

---

### Phase 2 — 전역 어빌리티 (abilities)

| 메서드 | 패스 | 설명 |
|--------|------|------|
| GET | `/abilities` | 목록 (페이징·검색) |
| GET | `/abilities/:abilityNo` | 상세 1건 |
| POST | `/abilities` | 생성 |
| PATCH | `/abilities/:abilityNo` | 수정 |
| DELETE | `/abilities/:abilityNo` | 삭제 |

---

### Phase 2 — 프로젝트 트레잇 (project_traits, prj_no 스코프)

| 메서드 | 패스 | 설명 |
|--------|------|------|
| GET | `/project-traits` | 목록. `?prjNo=` 필수(프로젝트 스코프). 페이징 `?page`, `?pageSize` |
| GET | `/project-traits/:traitNo` | 상세 1건 |
| POST | `/project-traits` | 생성. body에 `prjNo` 포함 |
| PATCH | `/project-traits/:traitNo` | 수정 |
| DELETE | `/project-traits/:traitNo` | 삭제 |

---

### Phase 2 — 프로젝트 어빌리티 (project_abilities, prj_no 스코프)

| 메서드 | 패스 | 설명 |
|--------|------|------|
| GET | `/project-abilities` | 목록. `?prjNo=` 필수(프로젝트 스코프). 페이징 `?page`, `?pageSize` |
| GET | `/project-abilities/:abilityNo` | 상세 1건 |
| POST | `/project-abilities` | 생성. body에 `prjNo` 포함 |
| PATCH | `/project-abilities/:abilityNo` | 수정 |
| DELETE | `/project-abilities/:abilityNo` | 삭제 |

---

### Phase 3 — 코어·설정 엔티티 (prj_no 스코프)

모든 리소스: 목록은 `GET /{리소스}?prjNo=` 필수, 생성은 body에 `prjNo` 포함. 상세·수정·삭제는 `/{리소스}/:pkNo`.

| 리소스(테이블) | 메서드 | 패스 | 설명 |
|----------------|--------|------|------|
| core_rules | GET | `/core-rules` | 목록. `?prjNo=` 필수 |
| | GET | `/core-rules/:coreNo` | 상세 |
| | POST | `/core-rules` | 생성. body에 `prjNo` |
| | PATCH | `/core-rules/:coreNo` | 수정 |
| | DELETE | `/core-rules/:coreNo` | 삭제 |
| creatures | GET | `/creatures` | 목록. `?prjNo=` 필수 |
| | GET | `/creatures/:creatureNo` | 상세 |
| | POST | `/creatures` | 생성. body에 `prjNo` |
| | PATCH | `/creatures/:creatureNo` | 수정 |
| | DELETE | `/creatures/:creatureNo` | 삭제 |
| characters | GET | `/characters` | 목록. `?prjNo=` 필수 |
| | GET | `/characters/:charNo` | 상세 |
| | POST | `/characters` | 생성. body에 `prjNo` |
| | PATCH | `/characters/:charNo` | 수정 |
| | DELETE | `/characters/:charNo` | 삭제 |
| items | GET | `/items` | 목록. `?prjNo=` 필수 |
| | GET | `/items/:itemNo` | 상세 |
| | POST | `/items` | 생성. body에 `prjNo` |
| | PATCH | `/items/:itemNo` | 수정 |
| | DELETE | `/items/:itemNo` | 삭제 |
| regions | GET | `/regions` | 목록. `?prjNo=` 필수 |
| | GET | `/regions/:regionNo` | 상세 |
| | POST | `/regions` | 생성. body에 `prjNo` |
| | PATCH | `/regions/:regionNo` | 수정 |
| | DELETE | `/regions/:regionNo` | 삭제 |
| nations | GET | `/nations` | 목록. `?prjNo=` 필수 |
| | GET | `/nations/:ntnNo` | 상세 |
| | POST | `/nations` | 생성. body에 `prjNo` |
| | PATCH | `/nations/:ntnNo` | 수정 |
| | DELETE | `/nations/:ntnNo` | 삭제 |
| organizations | GET | `/organizations` | 목록. `?prjNo=` 필수 |
| | GET | `/organizations/:orgNo` | 상세 |
| | POST | `/organizations` | 생성. body에 `prjNo` |
| | PATCH | `/organizations/:orgNo` | 수정 |
| | DELETE | `/organizations/:orgNo` | 삭제 |
| events | GET | `/events` | 목록. `?prjNo=` 필수 |
| | GET | `/events/:eventNo` | 상세 |
| | POST | `/events` | 생성. body에 `prjNo` |
| | PATCH | `/events/:eventNo` | 수정 |
| | DELETE | `/events/:eventNo` | 삭제 |
| lores | GET | `/lores` | 목록. `?prjNo=` 필수 |
| | GET | `/lores/:loreNo` | 상세 |
| | POST | `/lores` | 생성. body에 `prjNo` |
| | PATCH | `/lores/:loreNo` | 수정 |
| | DELETE | `/lores/:loreNo` | 삭제 |

---

### Phase 3 — 매핑·관계 테이블 (후순위)

- **범위**: char_trait_maps, char_ability_maps, creature_trait_maps, creature_ability_maps, item_trait_maps, item_ability_maps, ntn_trait_maps, org_trait_maps, region_trait_maps, char_relations, char_group_relations, char_item_maps, group_relations, lore_char_maps, lore_item_maps, event_entries 등.
- **구상**: 위 엔티티 CRUD 완료 후, 스키마·비즈니스 정리하여 엔드포인트 범위와 패스 설계 예정. 본 구상 문서에는 목록만 적고, 상세 패스·메서드는 별도 확정.

---

## 3. 요약

| Phase | 리소스 수 | 엔드포인트 수(CRUD 5개 기준) |
|-------|------------|------------------------------|
| 1 | projects | 5 |
| 2 | traits, abilities, project_traits, project_abilities | 4 × 5 = 20 |
| 3 (엔티티) | core_rules, creatures, characters, items, regions, nations, organizations, events, lores | 9 × 5 = 45 |
| 3 (매핑) | 후순위 | 별도 확정 |
| **합계 (Phase 1·2·3 엔티티)** | | **70** |

---

*구상 확인 후, 이 명세에 맞춰 실제 엔드포인트 구현을 진행합니다.*
