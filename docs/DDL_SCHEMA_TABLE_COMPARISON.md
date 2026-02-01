# DDL vs Drizzle 스키마 테이블 개수 대조

**작성일**: 2026-02-01  
**목적**: API CRUD 구현 전 `references/DDL.sql`과 Drizzle 로컬/원격 스키마의 테이블 개수·이름 일치 여부 확인.

---

## 1. 기준

- **참조 DDL**: `references/DDL.sql` (PostgreSQL 기준 DDL, 33개 `CREATE TABLE`)
- **로컬 스키마**: `src/main/server/schema/local/` — SQLite, **users 없음** (단일 사용자 가정)
- **원격 스키마**: `src/main/server/schema/remote/` — PostgreSQL, users 포함

---

## 2. DDL.sql 테이블 목록 (33개)

| # | 테이블명 |
|---|----------|
| 1 | abilities |
| 2 | users |
| 3 | projects |
| 4 | skills |
| 5 | traits |
| 6 | core_rules |
| 7 | creatures |
| 8 | events |
| 9 | group_relations |
| 10 | items |
| 11 | lores |
| 12 | nations |
| 13 | ntn_trait_maps |
| 14 | organizations |
| 15 | project_abilities |
| 16 | project_skills |
| 17 | project_traits |
| 18 | regions |
| 19 | characters |
| 20 | creature_skill_maps |
| 21 | creature_trait_maps |
| 22 | event_entries |
| 23 | item_skill_maps |
| 24 | item_trait_maps |
| 25 | lore_char_maps |
| 26 | lore_item_maps |
| 27 | org_trait_maps |
| 28 | region_trait_maps |
| 29 | char_group_relations |
| 30 | char_item_maps |
| 31 | char_relations |
| 32 | char_skill_maps |
| 33 | char_trait_maps |

---

## 3. Drizzle 스키마 테이블 (index 기준)

### 3.1. 로컬 (local) — 31개

- **users 없음** (의도된 차이).
- **example** 포함 (개발/예제용).

| # | 테이블 (export명) | 대응 DDL |
|---|-------------------|----------|
| 1 | example | (없음, 개발용) |
| 2 | projects | projects |
| 3 | traits | traits |
| 4 | project_traits | project_traits |
| 5 | abilities | abilities |
| 6 | project_abilities | project_abilities |
| 7 | creatures | creatures |
| 8 | nations | nations |
| 9 | organizations | organizations |
| 10 | characters | characters |
| 11 | items | items |
| 12 | regions | regions |
| 13 | events | events |
| 14 | lores | lores |
| 15 | core_rules | core_rules |
| 16 | char_trait_maps | char_trait_maps |
| 17 | char_ability_maps | char_ability_maps |
| 18 | creature_trait_maps | creature_trait_maps |
| 19 | creature_ability_maps | creature_ability_maps |
| 20 | group_relations | group_relations |
| 21 | event_entries | event_entries |
| 22 | item_ability_maps | item_ability_maps |
| 23 | item_trait_maps | item_trait_maps |
| 24 | lore_char_maps | lore_char_maps |
| 25 | lore_item_maps | lore_item_maps |
| 26 | ntn_trait_maps | ntn_trait_maps |
| 27 | org_trait_maps | org_trait_maps |
| 28 | region_trait_maps | region_trait_maps |
| 29 | char_group_relations | char_group_relations |
| 30 | char_item_maps | char_item_maps |
| 31 | char_relations | char_relations |

### 3.2. 원격 (remote) — 32개

- **users** 포함.
- **example** 포함.

로컬 31개 + **users** = 32개 (example 포함).

---

## 4. 명칭 차이 (skill vs ability)

DDL에서는 **skill** 계열 테이블이 5개 있습니다.

| DDL 테이블명 | Drizzle 테이블명 |
|--------------|------------------|
| skills | **(없음)** |
| project_skills | project_abilities |
| creature_skill_maps | creature_ability_maps |
| item_skill_maps | item_ability_maps |
| char_skill_maps | char_ability_maps |

- PRD/도메인에서는 **어빌리티(Abilities)** 로 통일.
- Drizzle은 **ability** 명칭만 사용.
- DDL의 **skills** 테이블은 Drizzle에 **별도 테이블 없음** (abilities 한 종류로 보는 설계로 추정).

---

## 5. 개수 요약

| 구분 | 테이블 수 | 비고 |
|------|-----------|------|
| **DDL.sql** | **33** | users, abilities, skills, skill_maps 5개 등 |
| **Drizzle 로컬** | **31** | users 없음, skills 없음, example 포함 |
| **Drizzle 원격** | **32** | users 포함, skills 없음, example 포함 |

- **로컬 = DDL − users − skills + example**  
  → 33 − 1 − 1 + 0(example은 DDL에 없으므로 “추가”) = 31로 일치.
- **원격 = 로컬 + users**  
  → 31 + 1 = 32로 일치.

---

## 6. 결론 및 CRUD 작업 시 참고

1. **개수**
   - 로컬: users 제외 시 DDL과 1:1로 맞추면 32개. 여기서 **skills** 를 제외하고 **example** 을 넣어 31개로 정리된 상태.
   - 원격: 로컬 + users 로 32개. DDL의 33개와 차이는 **skills 미구현** 1개.

2. **의도된 차이**
   - **로컬에 users 없음**: 단일 사용자 가정 (PRD 반영).
   - **skill vs ability**: Drizzle은 ability 로 통일, DDL의 `skills` 테이블은 현재 스키마에 없음. CRUD 구현 시 **abilities** 기준으로 진행하면 됨.

3. **API CRUD 구현**
   - 로컬/원격 각 스키마의 **index에 export된 테이블** 기준으로 엔드포인트 설계.
   - **example** 은 개발/예제용으로만 사용.
   - **users** 는 원격 전용, 인증·멀티유저 구현 시 사용.

---

*문서 끝*
