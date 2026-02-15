# PDCA Report: DDL 동기화

## 1. 개요
본 보고서는 `references/DDL.sql` 파일을 Hono 코드베이스의 스키마 정의와 동기화하기 위해 수행된 변경 사항을 기록합니다.

## 2. 변경 사항 구현

### 2.1. 불필요한 테이블 제거
`Abilities` 시스템으로 대체됨에 따라 다음 테이블 및 관련 시퀀스를 제거했습니다:
- `public.skills`
- `public.project_skills`
- `public.char_skill_maps`
- `public.creature_skill_maps`
- `public.item_skill_maps`

### 2.2. 누락된 컬럼 추가
`commonColumnsPg` 및 다형성 Lore 정의에 맞춰 다음 테이블에 `tags`, `lore_type`, `sub_lore_type` 컬럼을 추가했습니다:
- `users` (tags 추가)
- `projects` (tags 추가)
- `traits` (tags 추가)
- `project_traits` (tags 추가)
- `core_rules`
- `creatures`
- `events`
- `items`
- `lores` (`tags`, `sub_lore_type` 추가; `lore_type` 기본값 업데이트)
- `nations`
- `organizations`
- `regions`
- `characters`

### 2.3. 타입 및 구조 업데이트
- **Abilities**: `abilities` 및 `project_abilities` 테이블의 기본 키(PK)를 Hono의 `serial()` 정의와 일치하도록 `serial4` (int4)로 업데이트했습니다. 기존의 `int8 GENERATED ...` 방식에서 변경되었습니다.

### 2.4. 신규 테이블 생성
다음 테이블 정의를 `DDL.sql` 파일 끝에 추가했습니다:
- `public.char_ability_maps`
- `public.creature_ability_maps`
- `public.item_ability_maps`

## 3. 검증
- **수동 확인**: `DDL.sql` 파일 내에 신규 컬럼과 테이블이 정확히 반영되었음을 확인했습니다.
- **유효성**: 신규 테이블의 SQL 구문이 기존 패턴(PostgreSQL 호환)을 따르고 있음을 확인했습니다.

## 4. 결론
`references/DDL.sql` 파일이 Hono의 `remote` 스키마 정의와 성공적으로 동기화되었습니다.
