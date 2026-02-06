# TODO — Fantasy Builder (Electron + Vue + Hono)

**작성일**: 2026-02-01  
**상태**: 진행 중인 작업 및 향후 개선 사항

---

## 중요 (기능 완성)

### 0. ProjectDetailView 상세 구현 (`src/renderer/views/ProjectDetailView.vue`)

프로젝트 상세 화면의 사이드바·메인 영역을 아래 **순서대로** 구현한다.

#### 0-1. 공통·기반
- [ ] **사이드바 메뉴 정리**: 현재 `categoryItems`(기본 정보, 캐릭터, 세계관, 규칙)를 아래 **표시 순서**로 교체.
  - 표시 순서(위→아래):  
    1. **프로젝트 개요** (path: `overview`) — 현재 선택 시 강조(활성)  
    2. **전체 설정** (path: `settings`)  
    3. **특성/능력 관리** (path: `traits-abilities`)  
    4. **코어 설정** (path: `core-rules`)  
    5. **종족/생물** (path: `creatures`)  
    6. **인물** (path: `characters`)  
    7. **지역** (path: `regions`)  
    8. **국가** (path: `nations`)  
    9. **단체** (path: `organizations`)  
    10. **도구** (path: `items`)  
    11. **역사** (path: `events`)  
    12. **신화/전설/설화** (path: `lores`)
- [ ] **아이콘**: 이미지/디자인에 맞게 각 메뉴 아이콘 지정 (lucide 또는 기존 아이콘 세트).
- [ ] **라우트·쿼리 연동**: `activeCategory`를 URL과 동기화 (예: `/project/:prjNo?section=overview` 또는 중첩 라우트). 목록으로 돌아가기 링크는 유지.
- [ ] **메인 영역**: 카테고리별로 전환되는 메인 컨텐츠 영역 구조 (하나의 `<main>` 안에서 `section` 또는 라우트별 컴포넌트로 분기).

#### 0-2. 카테고리별 메인 뷰 구현 (순서대로)
- [ ] **1. 프로젝트 개요** (`overview`): 프로젝트 기본 정보 표시·수정 (이미 `project` 로드 있음). 요약 카드 또는 폼.
- [ ] **2. 전체 설정** (`settings`): 프로젝트 메타·공통 설정 UI (필요 시 API/스키마 정의 후 연동).
- [ ] **3. 특성/능력 관리** (`traits-abilities`): 전역·프로젝트 특성/어빌리티 목록·검색·CRUD. `/traits`, `/abilities`, `/project-traits`, `/project-abilities`, `/search` API 연동. (필요 시 store/composable 정리.)
- [ ] **4. 코어 설정** (`core-rules`): 코어 규칙 목록·상세·CRUD. `/core-rules?prjNo=` API 연동.
- [ ] **5. 종족/생물** (`creatures`): 생물/종족 목록·상세·CRUD. `/creatures?prjNo=` API 연동. (필요 시 creature-trait-maps, creature-ability-maps 연동.)
- [ ] **6. 인물** (`characters`): 인물 목록·상세·CRUD. `/characters?prjNo=` API 연동. (필요 시 char-trait-maps, char-ability-maps 연동.)
- [ ] **7. 지역** (`regions`): 지역 목록·상세·CRUD. `/regions?prjNo=` API 연동.
- [ ] **8. 국가** (`nations`): 국가 목록·상세·CRUD. `/nations?prjNo=` API 연동.
- [ ] **9. 단체** (`organizations`): 단체 목록·상세·CRUD. `/organizations?prjNo=` API 연동.
- [ ] **10. 도구** (`items`): 아이템 목록·상세·CRUD. `/items?prjNo=` API 연동.
- [ ] **11. 역사** (`events`): 사건 목록·상세·CRUD. `/events?prjNo=` API 연동.
- [ ] **12. 신화/전설/설화** (`lores`): 전승/설화 목록·상세·CRUD. `/lores?prjNo=` API 연동.

#### 0-3. 데이터·API 연동
- [ ] **Store/Composable**: 프로젝트 상세용 `prjNo` 기반 API 호출을 공통화 (기존 projectStore 확장 또는 카테고리별 composable).
- [ ] **에러·로딩**: 각 목록/상세 요청에 대한 로딩 상태·에러 메시지 표시.
- [ ] **목록 공통**: 페이징·검색(엔티티별 searchKeyword/searchType) UI 및 API 파라미터 연동.

### 0-5. 앱 초기 로딩 UI (PRD §3.3)
- [ ] **로딩 화면**: 앱 최초 실행 시 DB·Hono 등 초기화 동안 "로딩 중" 전용 화면 표시 (스피너·문구).
- [ ] **준비 완료 감지**: Health API 또는 IPC(ping)로 백엔드 준비 확인 후 본문 UI로 전환.
- [ ] **App.vue 또는 루트**: 초기 상태는 로딩 화면만 노출, 준비 완료 시 타이틀바·RouterView 노출.

#### 0-4. UI·UX
- [ ] **반응형**: 사이드바 260px 등 레이아웃이 작은 창에서도 동작하도록 조정 (필요 시 토글/접기).
- [ ] **접근성**: 포커스·키보드 이동·ARIA 등 필요 시 보강.

---

### 1. 사용 현황 조회 기능
- **위치**: Trait/Ability Service (또는 전용 SearchService)
- **상태**: 매핑 테이블(char_trait_maps, char_ability_maps, creature_trait_maps, creature_ability_maps) 구현 후 사용 현황 조회 로직 완성
- **의존성**: Phase 6 (매핑 테이블 CRUD) 완료 후 작업

### 2. 이메일 인증
- [ ] 이메일 인증 토큰 생성
- [ ] 이메일 인증 처리 (users.eml_auth_yn)

### 3. JWT·인증 미들웨어
- [ ] Hono 미들웨어 또는 라우트 레벨에서 JWT 검증
- [ ] 현재 사용자 추출 (IPC 또는 API 컨텍스트)

---

## 개선 사항

### 4. 검증 강화 (진행 중)
- [x] Zod 스키마로 요청 body/query 검증 (Project 등 주요 도메인 적용 완료)
- [x] VO(Value Object) 패턴 적용하여 타입 안전성 확보
- [ ] 이메일 형식, 비밀번호 강도, 필수 필드 검증 (User 도메인 구현 시)

### 5. 에러 코드 통일
- [ ] NOT_FOUND, VALIDATION_ERROR, ACCOUNT_LOCKED 등 코드 상수화
- [ ] 표준 에러 응답 포맷 (code, message) 유지

### 6. 로깅
- [ ] 주요 비즈니스 로직(생성/수정/삭제, 로그인) 로깅
- [ ] 프로덕션용 로그 레벨·정책

---

## Phase별 미완료

- **Phase 2**: GlobalExceptionHandler, types 일부 보강
- **Phase 3**: User/Auth Mapper·Service·Controller, JWT·bcrypt
- **Phase 4**: Trait, Ability, ProjectTrait, ProjectAbility, 통합 검색 (**Projects 완료**)
- **Phase 5~6**: 설정 엔티티 CRUD, 매핑 테이블 CRUD
- **Phase 7~8**: 권한, 테스트, 문서화

---

## 기술적

- [ ] 원격 DB 마이그레이션 적용 방식 확인 (drizzle/remote 적용 스크립트 또는 수동)
- [ ] 단위/통합 테스트 (Vitest 등) 도입 여부
- [ ] API 문서 (OpenAPI/Swagger) 도입 여부

---

*문서 끝*