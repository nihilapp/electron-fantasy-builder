# PLAN: 모든 설정 테이블에 lore_type 컬럼 추가 (통합 검색 기반)

> **Date:** 2026-02-08  
> **Task ID:** 004_UPDATE_CoreRulesLoreTypeColumn  
> **Language:** Korean (Required)

## 1. Objective

**모든 설정(엔티티) 테이블**에 **lore_type**(카테고리 구분자)과 **sub_lore_type**(서브 로어 타입) 컬럼을 추가한다. lore_type은 조인·통합 검색용, sub_lore_type은 nullable 문자열(기본값 없음)로 엔티티별 세부 구분(예: lores에서는 신화/전설/설화)에 쓴다.

- **lore_type:** 카테고리 상수. 테이블별 default 값 부여.
- **sub_lore_type:** text, nullable, 기본값 없음. lores는 기존 lore_type 용도(신화·전설·설화 구분)를 이 컬럼으로 이전.

대상 테이블(9개) 및 lore_type 값:

| 테이블         | lore_type 값  |
|----------------|----------------|
| core_rules     | CORE_RULE      |
| creatures      | CREATURE       |
| characters     | CHARACTER      |
| regions        | REGION         |
| nations        | NATION         |
| organizations  | ORGANIZATION   |
| items          | ITEM           |
| events         | EVENT          |
| lores          | LORE           |

마이그레이션 SQL 생성·실행은 마스터가 `drizzle-kit generate` 및 `migrate`로 수행한다. 에이전트는 스키마·Zod·Mapper 등 코드만 수정한다.

## 2. Context Analysis

- **core_rules:** 현재 lore_type 없음 → 추가. 목록 select가 명시 컬럼이므로 select 목록에 loreType 추가.
- **creatures, characters, regions, nations, organizations, items, events:** 동일하게 lore_type 없음 → 스키마에 추가, Zod·Mapper insert/update 반영. 목록은 select() 전체이므로 스키마만 추가하면 됨.
- **lores:** 이미 `lore_type` 컬럼 존재. 카테고리 구분자로 활용하고, insert 시 기본값 `'LORE'` 설정. 스키마는 기존 컬럼에 `.default('LORE')` 추가 여부만 선택(기존 데이터 호환 고려 시 nullable 유지 가능).

## 3. Strategy

- **스키마 (local + remote)**  
  - 모든 9개 테이블: `loreType: text('lore_type').default('상수')`, `subLoreType: text('sub_lore_type')` (nullable, 기본값 없음) 추가.  
  - lores: loreType에 .default('LORE'); sub_lore_type 추가로 신화/전설/설화 구분 이전.
- **Zod:** 각 엔티티 스키마에 `loreType`, `subLoreType` (z.string().nullable().optional().default(null)) 추가.
- **Mapper:** insert/update 시 `loreType`, `subLoreType` 반영. CoreRuleMapper selectList에 loreType, subLoreType 포함.
- **SQL:** 작성하지 않음. 마스터가 generate 후 migrate 수행.

## 4. Impact Analysis

- **수정 파일 (예시)**  
  - 스키마: `schema/local`, `schema/remote` 의 core_rules, creatures, characters, regions, nations, organizations, items, events, lores 테이블 파일.  
  - Zod: coreRule, creature, character, region, nation, organization, item, event (lore는 이미 loreType 있음).  
  - Mapper: CoreRuleMapper, CreatureMapper, CharacterMapper, RegionMapper, NationMapper, OrganizationMapper, ItemMapper, EventMapper, LoreMapper.  
- **부작용:** 없음. 기존 API에 loreType 필드가 추가되는 수준.
- **PRD:** 필요 시 Coding Rules에 "설정 엔티티 통합 검색을 위해 lore_type 컬럼을 모든 설정 테이블에 공통으로 둠" 문구 추가 가능.

## 5. Task List

### 5.1 스키마 (local + remote)

- [ ] 9개 테이블 공통: `loreType: text('lore_type').default('상수')`, `subLoreType: text('sub_lore_type')` (nullable, 기본값 없음) 추가
- [ ] lores: loreType에 .default('LORE'); sub_lore_type 추가로 신화/전설/설화 구분 이전

### 5.2 Zod

- [ ] 9개 엔티티 스키마: loreType, subLoreType 필드 추가 (lore는 loreType 이미 있음, subLoreType 추가)

### 5.3 Mapper (insert / update / selectList)

- [ ] 9개 Mapper: insert/update values에 loreType, subLoreType 반영
- [ ] CoreRuleMapper: selectList select에 loreType, subLoreType 포함

### 5.4 PRD (선택)

- [ ] Coding Rules & Guidelines에 lore_type 공통 컬럼 목적·대상 테이블 간단 기록

## 6. Verification Plan

- 수정 후 타입 체크 통과.
- 마스터가 generate/migrate 수행 후 앱 기동하여 각 설정 목록·상세·등록·수정 시 loreType이 해당 상수로 저장·조회되는지 확인.
