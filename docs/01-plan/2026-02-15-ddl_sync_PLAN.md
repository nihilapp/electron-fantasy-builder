# PDCA Plan: DDL 동기화

## 1. 목표 설명
`references/DDL.sql` 파일을 현재 `src/main/hono/src/common/db/schema/remote` 경로의 Hono 원격 스키마 정의와 동기화합니다. Hono 스키마가 진실의 원천(Source of Truth)입니다.

**주요 목표:**
- 스키마 변경 사항 반영 (신규 컬럼: `tags`, `lore_type`, `sub_lore_type`).
- 용어 변경 사항 반영 (`skills` → `abilities`).
- 불필요한 테이블 제거 (구 `skills` 관련 테이블).
- 신규 테이블 존재 여부 확인 (`*_ability_maps`).
- 데이터 타입 정렬 (예: `serial` vs `bigserial`).

## 2. 현황 분석

### 2.1. 용어 변경 (`Skills` → `Abilities`)
- **Hono Schema**: `abilities`, `project_abilities`, `char_ability_maps`, `creature_ability_maps`, `item_ability_maps` 사용.
- **DDL.sql**: `abilities`와 `skills` 테이블이 혼재되어 있음.
  - 유지: `abilities`, `project_abilities` (단, DDL에 능력치 매핑 테이블이 누락되었는지 확인 필요).
  - 폐기: `skills`, `project_skills`, `char_skill_maps`, `creature_skill_maps`, `item_skill_maps`.

### 2.2. 누락된 컬럼
대부분의 Hono 테이블은 `commonColumnsPg`를 사용하여 `tags`를 포함하지만, DDL 테이블에는 `tags`가 누락되어 있습니다.
또한 많은 엔티티가 다형성 Lore(`lore_type`, `sub_lore_type`)를 지원하도록 변경되었습니다.

| 테이블 | DDL 누락 컬럼 |
| :--- | :--- |
| `users` | `tags` |
| `projects` | `tags` |
| `characters` | `tags`, `lore_type`, `sub_lore_type` |
| `creatures` | `tags`, `lore_type`, `sub_lore_type` |
| `items` | `tags`, `lore_type`, `sub_lore_type` |
| `nations` | `tags`, `lore_type`, `sub_lore_type` |
| `organizations` | `tags`, `lore_type`, `sub_lore_type` |
| `regions` | `tags`, `lore_type`, `sub_lore_type` |
| `events` | `tags`, `lore_type`, `sub_lore_type` |
| `core_rules` | `tags`, `lore_type`, `sub_lore_type` |
| `lores` | `tags`, `sub_lore_type` (`lore_type`은 존재하나 기본값 확인 필요) |

### 2.3. 타입 불일치
- Hono는 PK에 `serial` (int4)을 사용합니다. DDL은 일부 테이블(`users`, `projects`, `abilities`)에서 `bigserial` (int8) 또는 `int8 generated...`를 사용합니다.
- **결정**: 코드가 우선이므로 DDL을 `serial` (int4)로 업데이트하여 Hono 정의와 정확히 일치시킵니다. 이는 향후 불필요한 비교 차이를 줄이기 위함입니다. `bigserial`은 필요 시 다시 논의합니다.
- *(참고)*: 운영 중인 DB 마이그레이션이 아니라 참고용 DDL 파일 수정이므로, 코드와 맞추는 것이 깔끔합니다.

## 3. 변경 계획

### 3.1. 불필요 테이블 제거
- DROP `public.skills`
- DROP `public.project_skills`
- DROP `public.char_skill_maps`
- DROP `public.creature_skill_maps`
- DROP `public.item_skill_maps`
- 관련 시퀀스 제거.

### 3.2. 기존 테이블 업데이트
- `commonColumnsPg`를 사용하는 모든 테이블에 `tags text NULL` 추가.
- 관련 테이블에 `lore_type text NULL DEFAULT '...'`, `sub_lore_type text NULL` 추가.

### 3.3. 신규 테이블 생성 (누락 시)
- `char_ability_maps`: DDL 존재 여부 확인 후 생성.
- `creature_ability_maps`: DDL 존재 여부 확인 후 생성.
- `item_ability_maps`: DDL 존재 여부 확인 후 생성.
- `project_abilities`: 이미 존재함, 컬럼 확인.

### 3.4. DDL 구문 정리
- `use_yn` 등의 기본값 확인 (`'Y'`, `'N'`).
- PK/FK 제약조건 정렬.

## 4. 검증 계획
- **수동 검증**: 업데이트된 `DDL.sql`을 Hono 스키마 파일과 육안으로 비교.
- **SQL 유효성**: PostgreSQL 표준 문법 준수 여부 확인.
