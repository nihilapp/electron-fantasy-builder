# TODO — Fantasy Builder (Electron + Vue + Hono)

**작성일**: 2026-02-01  
**상태**: 진행 중인 작업 및 향후 개선 사항

---

## 중요 (기능 완성)

### 🎯 진척도 현황 (2026-02-08 기준)

| 카테고리 | 진척도 | 상태 |
|---------|--------|------|
| **기반 구조** | 95% | ✅ 거의 완료 |
| **백엔드 API** | 90% | ✅ 대부분 구현됨 |
| **프론트엔드 UI** | 30% | 🔄 일부만 구현됨 |
| **설정 보호/즐겨찾기** | 0% | ❌ 설계만 완료 |
| **인증/보안** | 0% | ❌ 미구현 |

### ✅ 최근 완료 작업 (2026-02-08)
- **005**: 설정 테이블 CRUD UI 및 통합 검색 (1차 - Creatures 완료, 나머지 7개 엔티티 남음)
- **004**: 모든 설정 테이블에 lore_type 컬럼 추가 (완료)
- **003**: ListMetaAndNameOnly 최적화 (완료)
- **002**: Three 레이아웃 컴포넌트 개선 (완료)
- **001**: CoreRuleDetailSidebarList 업데이트 (완료)

### 🔄 진행 중인 작업
- 나머지 7개 설정 엔티티 UI 구현 (Characters, Regions, Nations, Organizations, Items, Events, Lores)

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
- [x] **2. 전체 설정** (`settings`): 통합 검색 API 및 UI 구현 완료. 카테고리 필터·키워드 검색 지원.
- [ ] **3. 특성/능력 관리** (`traits-abilities`): 전역·프로젝트 특성/어빌리티 목록·검색·CRUD. `/traits`, `/abilities`, `/project-traits`, `/project-abilities`, `/search` API 연동. (필요 시 store/composable 정리.)
- [x] **4. 코어 설정** (`core-rules`): 코어 규칙 목록·상세·CRUD 완료. `/core-rules?prjNo=` API 연동.
- [x] **5. 종족/생물** (`creatures`): 생물/종족 목록·상세·CRUD 완료. `/creatures?prjNo=` API 연동. (creature-trait-maps, creature-ability-maps 연동 포함.)
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

### 🎯 다음 우선순위 (2026-02-08 이후)

1. **나머지 7개 설정 엔티티 UI 구현**
   - Characters, Regions, Nations, Organizations, Items, Events, Lores
   - Creatures와 동일 패턴 적용 (목록·상세·CRUD)

2. **특성/어빌리티 관리 UI**
   - 전역·프로젝트 특성/어빌리티 목록·검색·CRUD
   - `/traits`, `/abilities`, `/project-traits`, `/project-abilities`, `/search` API 연동

3. **설정 보호/즐겨찾기 기능**
   - setting_protections, setting_favorites 테이블 구현
   - 관련 API 및 UI 개발

4. **앱 초기 로딩 화면**
   - DB·Hono 초기화 동안 로딩 UI 표시
   - Health API 또는 IPC로 준비 완료 감지

5. **사용자 인증 시스템**
   - JWT 토큰, 비밀번호 해싱
   - 이메일 인증, 권한 관리

---

### 1. 설정 보호/즐겨찾기 기능 구현
- **상태**: 설계 문서 완료 (`DESIGN_SettingProtectionFavoritesAndDocLinks.md`)
- **필요 작업**:
  - [ ] `setting_protections` 테이블 DDL 및 Drizzle 스키마
  - [ ] `setting_favorites` 테이블 DDL 및 Drizzle 스키마
  - [ ] 보호/즐겨찾기 API (Mapper/Service/Controller)
  - [ ] 프론트엔드 UI 컴포넌트 (SettingItemCard 토글 기능)
  - [ ] 전체 설정 검색 결과에 즐겨찾기/보호 상태 표시

---

### 2. 사용 현황 조회 기능
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

## Phase별 진행 상황

### ✅ 완료된 Phase
- **Phase 1**: 환경 및 기반 (완료)
- **Phase 2**: 공통 인프라 및 타입 (대부분 완료)
- **Phase 4**: 전역 풀 및 프로젝트 도메인 (완료)

### 🔄 진행 중인 Phase
- **Phase 5**: 설정 엔티티 (Core Rules, Creatures 완료, 나머지 7개 진행 중)

### ❌ 미완료 Phase
- **Phase 3**: 사용자 인증 및 관리
- **Phase 6**: 매핑 테이블 및 관계 (일부 완료, Relationships 미구현)
- **Phase 7**: 권한 및 보안
- **Phase 8**: 검증 및 마무리

---

## 📊 상세 진척도 분석 (2026-02-08)

### 🏗️ 기반 구조 (95%)
**완료된 항목:**
- ✅ 프로젝트 초기 설정 및 의존성
- ✅ Drizzle 스키마 (local/remote) - 9개 테이블 전체
- ✅ 공통 컬럼 구조 (CommonEntity)
- ✅ lore_type 컬럼 추가 (모든 설정 테이블)
- ✅ API 응답 표준화 (ResponseType)
- ✅ 전역 예외 핸들러

**남은 작업:**
- ⏳ 앱 초기 로딩 UI 구현

### 🔧 백엔드 API (90%)
**완료된 항목:**
- ✅ 전역 특성/어빌리티 API
- ✅ 프로젝트 관리 API
- ✅ 설정 엔티티 CRUD API (전체 9개 테이블)
- ✅ 매핑 테이블 API (char/creature trait/ability maps)
- ✅ 통합 검색 API (/settings/search)

**남은 작업:**
- ⏳ 설정 보호/즐겨찾기 API
- ❌ 사용자 인증 API

### 🎨 프론트엔드 UI (30%)
**완료된 항목:**
- ✅ 프로젝트 목록/상세
- ✅ 코어 설정 CRUD UI
- ✅ 테마 시스템 (dark/light)
- ✅ 공통 컴포넌트 (SettingItemCard)
- ✅ 종족/생물(Creatures) CRUD UI
- ✅ 전체 설정 통합 검색 화면

**진행 중:**
- 🔄 나머지 7개 설정 엔티티 UI (Characters, Regions, Nations, Organizations, Items, Events, Lores)

**남은 작업:**
- ⏳ 특성/어빌리티 관리 UI
- ⏳ 프로젝트 개요 화면
- ⏳ 앱 초기 로딩 화면

### 🛡️ 설정 보호/즐겨찾기 (0%)
**완료된 항목:**
- ✅ 설계 문서 (DESIGN_SettingProtectionFavoritesAndDocLinks.md)

**남은 작업:**
- ❌ setting_protections 테이블
- ❌ setting_favorites 테이블
- ❌ 관련 API 및 UI

### 🔐 인증/보안 (0%)
**남은 작업:**
- ❌ 사용자 도메인 구현
- ❌ JWT 토큰 처리
- ❌ 비밀번호 해싱
- ❌ 권한 관리
- ❌ 이메일 인증

---

## 기술적

- [ ] 원격 DB 마이그레이션 적용 방식 확인 (drizzle/remote 적용 스크립트 또는 수동)
- [ ] 단위/통합 테스트 (Vitest 등) 도입 여부
- [ ] API 문서 (OpenAPI/Swagger) 도입 여부

---

*문서 끝*