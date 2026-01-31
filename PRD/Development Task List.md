# Development Task List — Fantasy Builder (Electron + Vue + Hono)

**작성일**: 2026-01-31  
**버전**: 1.0

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
- [ ] **Base Architecture**: Controller/Service/Mapper 패턴 유지. 새 라우트·API·IPC는 명명 규칙 준수

---

## Phase 2: 공통 인프라 및 타입

- [ ] **ApiResponse 래퍼**: `{ data, error, code, message }` 표준 응답 구조 (src/types 또는 server 공통)
- [ ] **ListType**: 목록 응답용 `list`, `totalCnt`, `pageSize`, `page`, `totalPage`, `isFirst`, `isLast`
- [ ] **GlobalExceptionHandler**: Hono 미들웨어 또는 onError에서 표준 에러 응답
- [ ] **src/types/table.ts**: Drizzle 스키마 기반 InferSelectModel/InferInsertModel (users, projects, traits 등)
- [ ] **src/types/dto.ts**: API 요청/응답 DTO (UserDto, ProjectDto, TraitDto 등)

---

## Phase 3: 인증 및 사용자 관리

- [ ] **User Mapper/Service/Controller**: users 테이블 CRUD, 페이징·검색
- [ ] **비밀번호 해싱**: bcrypt (또는 동일 수준) 유틸
- [ ] **JWT 토큰**: Access/Refresh 생성·검증 유틸
- [ ] **Auth Service/Controller**: 로그인, 로그아웃, 토큰 갱신, 비밀번호 재설정(향후)
- [ ] **API·IPC**: 회원가입, 로그인 엔드포인트 및 IPC 노출

---

## Phase 4: 전역 풀 및 프로젝트 도메인

### 4.1. 전역 특성/어빌리티
- [ ] **Trait Mapper/Service/Controller**: traits CRUD, 검색·페이징, 사용 현황(매핑 테이블 연동 후)
- [ ] **Ability Mapper/Service/Controller**: abilities CRUD, 검색·페이징, 사용 현황

### 4.2. 프로젝트
- [ ] **Project Mapper/Service/Controller**: projects CRUD, 소유자 권한 검증
- [ ] **ProjectTrait Mapper/Service/Controller**: project_traits CRUD (prj_no 스코프)
- [ ] **ProjectAbility Mapper/Service/Controller**: project_abilities CRUD (prj_no 스코프)

### 4.3. 통합 검색
- [ ] **Trait/Ability 통합 검색**: 전역 + 프로젝트 종속 풀 통합 검색, 타입(GLOBAL|PROJECT) 필터

---

## Phase 5: 설정 엔티티

- [ ] **CoreRule**: core_rules CRUD (prj_no 스코프)
- [ ] **Creature**: creatures CRUD
- [ ] **Character**: characters CRUD (race_no, ntn_no, org_no FK)
- [ ] **Item, Region, Nation, Organization, Event, Lore**: 각 도메인 CRUD (prj_no 스코프)

---

## Phase 6: 매핑 테이블 및 관계

- [ ] **CharTraitMap / CharAbilityMap**: 인물-특성/어빌리티 매칭 CRUD
- [ ] **CreatureTraitMap / CreatureAbilityMap**: 종족-특성/어빌리티 매칭 CRUD
- [ ] **CharRelation, CharGroupRelation 등**: 인물-인물, 인물-조직 관계 (스키마 확장 후)
- [ ] **Trait/Ability 사용 현황 조회**: 매핑 테이블 기반 사용 현황 API 완성

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

## 우선순위 가이드

1. **Phase 1**: 환경·스키마·마이그레이션 (완료)
2. **Phase 2**: 공통 응답·타입·에러 처리
3. **Phase 3**: 인증·사용자
4. **Phase 4**: 전역 특성/어빌리티, 프로젝트, 통합 검색
5. **Phase 5~6**: 설정 엔티티, 매핑 테이블
6. **Phase 7~8**: 권한, 검증·문서

---

*문서 끝*
