# remote-ddl.sql ↔ 원격 스키마(Postgres) 크로스체크

PostgreSQL 기준 `remote-ddl.sql`과 `src/main/server/schema/remote/` Drizzle 스키마를 비교한 결과입니다.

---

## 1. 테이블 매핑 요약

| DDL 테이블명 | 스키마 테이블 | 비고 |
|-------------|---------------|------|
| abilities | abilitiesTable | ✅ 동일 |
| users | usersTable | ✅ 동일 (컬럼/제약 일부 상이) |
| projects | projectsTable | ✅ 동일 (제약 상이) |
| **skills** | **abilitiesTable** | ⚠️ DDL은 "skills", 스키마는 "abilities" (개념 동일·테이블명만 상이) |
| traits | traitsTable | ✅ 동일 |
| core_rules | coreRulesTable | ✅ 동일 |
| creatures | creaturesTable | ✅ 동일 (스키마는 컬럼 축소) |
| events | eventsTable | ✅ 동일 |
| **group_relations** | groupRelationsTable | ✅ 추가됨 |
| items | itemsTable | ✅ 동일 (스키마는 컬럼 축소) |
| lores | loresTable | ✅ 동일 |
| nations | nationsTable | ✅ 동일 |
| **ntn_trait_maps** | ntnTraitMapsTable | ✅ 추가됨 |
| organizations | organizationsTable | ✅ 동일 |
| project_abilities | projectAbilitiesTable | ✅ 동일 |
| **project_skills** | — | ❌ 스키마에는 project_abilities만 있음 (skill→ability 통합 가정) |
| project_traits | projectTraitsTable | ✅ 동일 |
| regions | regionsTable | ✅ 동일 |
| characters | charactersTable | ✅ 동일 (스키마는 컬럼 축소) |
| **creature_skill_maps** | **creatureAbilityMapsTable** | ⚠️ DDL은 skill, 스키마는 ability (테이블명·컬럼명 상이) |
| creature_trait_maps | creatureTraitMapsTable | ✅ 동일 |
| **event_entries** | eventEntriesTable | ✅ 추가됨 |
| **item_skill_maps** | **itemAbilityMapsTable** | ✅ 추가됨 (스킬→어빌리티, item_ability_maps) |
| **item_trait_maps** | itemTraitMapsTable | ✅ 추가됨 |
| **lore_char_maps** | loreCharMapsTable | ✅ 추가됨 |
| **lore_item_maps** | loreItemMapsTable | ✅ 추가됨 |
| **org_trait_maps** | orgTraitMapsTable | ✅ 추가됨 |
| **region_trait_maps** | regionTraitMapsTable | ✅ 추가됨 |
| **char_group_relations** | charGroupRelationsTable | ✅ 추가됨 |
| **char_item_maps** | charItemMapsTable | ✅ 추가됨 |
| **char_relations** | charRelationsTable | ✅ 추가됨 |
| **char_skill_maps** | **charAbilityMapsTable** | ⚠️ DDL은 char_skill_maps, 스키마는 char_ability_maps |
| char_trait_maps | charTraitMapsTable | ✅ 동일 (PK/공통컬럼 상이) |
| example | exampleTable | ✅ 스키마만 존재 (DDL에는 없음) |

---

## 2. DDL에만 있는 테이블 (스키마에 없음)

- **skills** (전역; 스키마는 **abilities**로 대응)  
- **project_skills** (스키마는 project_abilities만 사용)

※ 매핑/관계 테이블(group_relations, event_entries, item_ability_maps, item_trait_maps, lore_char_maps, lore_item_maps, ntn_trait_maps, org_trait_maps, region_trait_maps, char_group_relations, char_item_maps, char_relations)은 스키마에 추가 완료. item_skill_maps → item_ability_maps 로 스킬→어빌리티 통일.

---

## 3. 명칭 차이 (Skill vs Ability)

| 구분 | DDL | 스키마 |
|------|-----|--------|
| 전역 | skills | abilities |
| 프로젝트 종속 | project_skills | project_abilities |
| 인물–스킬/어빌리티 매핑 | char_skill_maps | char_ability_maps |
| 종족–스킬/어빌리티 매핑 | creature_skill_maps | creature_ability_maps |

- DDL: "skill" 용어 사용.  
- 스키마: "ability" 용어 사용.  
- 애플리케이션은 스키마(abilities) 기준으로 동작하며, 실제 DB가 DDL(skills) 구조라면 마이그레이션/매핑 시 테이블·컬럼명 매핑이 필요함.

---

## 4. 공통 테이블별 상세 차이

### 4.1 users

| 항목 | DDL | 스키마 |
|------|-----|--------|
| user_eml | varchar(255) NULL | text NOT NULL |
| crt_no / updt_no / del_no | users(user_no) FK 있음 | commonColumns에만 있고 FK 없음 |
| crt_dt / updt_dt | DEFAULT CURRENT_TIMESTAMP | 기본값 없음 |

### 4.2 projects

| 항목 | DDL | 스키마 |
|------|-----|--------|
| user_no | int8 NULL | integer NOT NULL |
| shrn_yn | DEFAULT 'Y' | DEFAULT 'N' (commonColumns) |
| crt_no / updt_no / del_no | users(user_no) FK 있음 | FK 없음 |

### 4.3 abilities (DDL) vs abilities (스키마)

- DDL: ability_no int8 IDENTITY, ability_nm/lcls/type 등 varchar(255) 다수.  
- 스키마: serial, text 다수.  
- 의미상 동일, 타입만 varchar(255) vs text 차이 (호환 가능).

### 4.4 traits

- DDL: trait_no bigserial, trait_lcls/trait_mcls NOT NULL, crt_no/updt_no/del_no → users FK.  
- 스키마: serial, trait_lcls/trait_mcls nullable, commonColumns만 있고 crt/updt/del FK 없음.

### 4.5 char_trait_maps

| 항목 | DDL | 스키마 |
|------|-----|--------|
| PK | (char_no, trait_no) | (char_no, trait_no, trait_type) |
| 공통 컬럼 | use_yn, shrn_yn, del_yn, crt_no, crt_dt, updt_no, updt_dt, del_no, del_dt | 없음 |
| trait_rmk | varchar NULL | text NULL |

### 4.6 char_skill_maps (DDL) vs char_ability_maps (스키마)

| 항목 | DDL (char_skill_maps) | 스키마 (char_ability_maps) |
|------|------------------------|----------------------------|
| PK | (char_no, skill_no) 추정 | (char_no, ability_no, ability_type) |
| 컬럼 | skill_no, skill_type, prof_lvl, skill_rmk + 공통컬럼 | ability_no, ability_type, prof_lvl, ability_rmk, 공통컬럼 없음 |

### 4.7 creature_skill_maps (DDL) vs creature_ability_maps (스키마)

- DDL: skill_no, skill_type, 공통컬럼 있음.  
- 스키마: ability_no, ability_type, 공통컬럼 없음.  
- PK는 둘 다 map_no (serial).

### 4.8 creatures

- DDL: creature_type, ident_stat NOT NULL 및 bio_char, lifespan_growth, body_feat 등 많은 컬럼.  
- 스키마: creature_type, ident_stat nullable, 기본 컬럼만 정의 (축소 버전).

### 4.9 characters

- DDL: role_type NOT NULL, origin_desc, join_rsn, org_rel_stat 등 매우 많은 컬럼.  
- 스키마: role_type nullable, char_nm, alias_nm, role_type, logline, narr_func, race_no, ntn_no, org_no, org_rank + commonColumns만 (축소 버전).

### 4.10 items

- DDL: cls_main NOT NULL, sub_eff, spec_abil, ego_type, use_cond 등 다수 컬럼.  
- 스키마: cls_main nullable, 기본 컬럼만 (축소 버전).

### 4.11 project_abilities

- DDL: 공통 컬럼만 있고 crt_no/updt_no/del_no FK 없음.  
- 스키마: commonColumnsPg 포함.  
- 구조적으로 유사, 스키마가 공통 컬럼·타입을 더 명시함.

---

## 5. 공통 컬럼(commonColumns) 및 FK 정책

- **스키마**: `commonColumnsPg` (use_yn, shrn_yn, del_yn, crt_no, crt_dt, updt_no, updt_dt, del_no, del_dt) 사용.  
  crt_no / updt_no / del_no에 대한 **users(user_no) FK는 정의하지 않음**.  
- **DDL**: 대부분 테이블에서 crt_no, updt_no, del_no를 users(user_no) FK로 두고, crt_dt/updt_dt에 DEFAULT CURRENT_TIMESTAMP 사용.

→ 스키마와 DDL을 동일 DB에 맞출 경우,  
  - 공통 컬럼 기본값(use_yn/shrn_yn/del_yn) 및  
  - crt_no/updt_no/del_no FK,  
  - timestamp 기본값  
  중 하나로 통일할지 결정이 필요함.

---

## 6. 권장 사항

1. **용어 통일**  
   - 실제 DB가 DDL(skills)이면: 스키마를 abilities로 유지하고, 마이그레이션/쿼리에서 테이블명·컬럼명 매핑(skills↔abilities, skill_no↔ability_no 등) 적용.  
   - 새 DB라면: DDL을 스키마에 맞춰 abilities 기준으로 정리하는 것도 가능.

2. **누락 테이블**  
   - group_relations, event_entries, ntn_trait_maps, org_trait_maps, region_trait_maps, char_group_relations, char_item_maps, char_relations, lore_char_maps, lore_item_maps, item_skill_maps, item_trait_maps 등이 **필요하면** 스키마에 추가하고, 필요 없으면 DDL에서 제거 검토.

3. **공통 컬럼·FK**  
   - crt_no/updt_no/del_no → users FK 및 timestamp 기본값을 스키마에 반영할지, 반대로 DDL에서 제거할지 프로젝트 정책으로 결정.

4. **축소된 엔티티(creatures, characters, items)**  
   - 스키마는 최소 필드만 두고 있음. DDL의 추가 컬럼이 필요하면 스키마에 단계적으로 추가하는 것을 권장.

이 문서는 `remote-ddl.sql`과 `src/main/server/schema/remote/`를 Postgres 기준으로 크로스체크한 결과이며, 마이그레이션·스키마 동기화 시 참고용으로 사용하면 됩니다.
