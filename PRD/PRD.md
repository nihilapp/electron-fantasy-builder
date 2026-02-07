# PRD (Product Requirements Document) — Fantasy Builder

**작성일**: 2026-01-31  
**버전**: 1.0  
**프로젝트 상태**: Electron + Vue + Hono 기반 구현 중 (디자인 개편 및 프론트엔드 기능 동기화 진행 중)

---

## 1. Project Overview

### Goal
창작자(작가, 게임 기획자, 만화가, 시나리오 작가 등)가 창작 과정에서 필요한 세계관 설정을 체계적으로 정리하고 기록할 수 있는 World Building Tool을 **Electron 데스크톱 앱**으로 제공합니다. 각 프로젝트별로 독립적인 설정 공간을 제공하며, 전역 풀과 프로젝트 종속 특성/어빌리티를 통해 유연한 설정 관리가 가능합니다.

### Target User
- **주요 사용자**: 창작자 (작가, 게임 기획자, 만화가, 시나리오 작가 등)
- **사용 목적**: 작품/세계관 설정의 체계적 관리 및 기록
- **핵심 니즈**:
  - 프로젝트별 독립적인 설정 공간
  - 특성(Traits)과 어빌리티(Abilities)를 통한 설정의 특색 파악
  - 엔티티 간 관계 설정 및 관리

### Key Value
1. **프로젝트별 독립 관리**: 각 작품/세계관을 프로젝트 단위로 완전히 분리하여 관리
2. **전역 풀 + 프로젝트 종속 구조**: 범용 특성/어빌리티와 프로젝트 고유 특성/어빌리티를 모두 지원
3. **체계적인 데이터 구조화**: DB 스키마(Drizzle) 기반의 구조화된 데이터 입력 및 관리
4. **관계 시각화**: 엔티티 간 다대다 관계 설정 및 탐색
5. **트렌디한 UX/UI**: 몰입감을 주는 다크/라이트 모드 지원 및 유려한 디자인

### 오프라인 우선 · 온라인 프로젝트
- **기본 동작**: 앱은 평소 **오프라인**으로 동작하며, 모든 데이터는 **로컬 DB**에만 쌓인다.
- **로그인**: 로그인 기능을 붙이며, 로그인 시에만 **온라인 프로젝트**를 생성·관리할 수 있다.
- **로컬 DB**: 단일 사용자 환경이므로 **사용자(users) 테이블은 로컬 스키마에 두지 않는다.** 로컬에는 “나” 한 명만 있으므로 사용자 구분이 필요 없다.
- **원격 DB**: 로그인·멀티유저를 지원할 때는 **원격(PostgreSQL)** 스키마에 users 테이블을 두고, 온라인 프로젝트는 사용자 소유로 관리한다.

---

## 2. Tech Stack & Environment (Specific Versions)

### Runtime & Build
- **Node.js**: 18+
- **Electron**: v40
- **electron-vite**: v5 (Main / Preload / Renderer 분리 빌드)

### Language & Framework
- **TypeScript**: 5.9+
- **Vue**: 3.5+ (Composition API)
- **Vue Router**: 5 (Hash 모드)

### Main Process (API·DB)
- **Hono**: v4 (HTTP API)
- **@hono/node-server**: Hono 서버 기동
- **Drizzle ORM**: 0.45+ (스키마·마이그레이션)
- **better-sqlite3**: 로컬 SQLite
- **pg**: 원격 PostgreSQL
- **Axios**: API 클라이언트

### Database
- **로컬**: SQLite (better-sqlite3). 단일 사용자 가정으로 **users 테이블 없음**. 스키마·마이그레이션: `src/main/server/schema/local/`, `src/drizzle/local/`
- **원격**: PostgreSQL. users·멀티유저·온라인 프로젝트. 스키마·마이그레이션: `src/main/server/schema/remote/`, `src/drizzle/remote/`
- **전환**: `src/config/app.json`의 `db.mode` (`"local"` | `"remote"`)로 전환. 앱 재시작 시 적용.

### State / UI / Validation
- **Pinia**: Vue 상태 관리
- **Tailwind CSS**: v4 (CSS Variables 기반 테마 시스템)
- **Zod**, **Luxon**, **UUID**: 검증·유틸

### Infra
- **개발**: `pnpm dev` (electron-vite dev)
- **빌드 산출물**: `out/` (Main/Preload), `dist/` (Renderer)

### API 설계 원칙
- **테이블 단위**: API는 테이블(리소스) 단위로 구성한다.
- **프로젝트 종속**: prj_no 스코프 데이터는 **JSON(body)** 로 넘긴다. 목록은 `?prjNo=`, 생성·수정은 body에 포함.
- **추가 화면**: 해당 리소스 루트로 POST 하는 폼과 링크한다. (예: 코어 설정 추가 → `POST /core-rules` 폼 페이지.)

---

## 3. System Architecture & Features

### 3.1. Implementation Status (Gap Analysis)
> **Summary**: 백엔드와 DB 스키마는 대부분 준비되었으나, 프론트엔드(Renderer) 뷰 구현이 초기 단계임.

| Feature / Entity | Backend (API/DB) | Frontend (View) | 비고 |
|:--- |:---:|:---:|:---|
| **Project** | ✅ | ✅ | 목록/생성/상세 구현됨 |
| **Core Rules** | ✅ | ✅ | 상세 구현됨 |
| **Traits (Global/Project)** | ✅ | ❌ | UI 미구현 |
| **Abilities (Global/Project)** | ✅ | ❌ | UI 미구현 |
| **Characters** | ✅ | ❌ | UI 미구현 |
| **Creatures/Races** | ✅ | ❌ | UI 미구현 |
| **Items** | ✅ | ❌ | UI 미구현 |
| **Regions** | ✅ | ❌ | UI 미구현 |
| **Nations** | ✅ | ❌ | UI 미구현 |
| **Organizations** | ✅ | ❌ | UI 미구현 |
| **Events** | ✅ | ❌ | UI 미구현 |
| **Lores** | ✅ | ❌ | UI 미구현 |
| **Theme System (Dark/Light)** | - | ✅ | blue500 포인트 컬러, 시맨틱 토큰 적용 |
| **SettingItemCard (설정 목록 공통)** | - | ✅ | 카테고리·제목·컨트롤 emit, 재사용 컴포넌트 |

### 3.2. User Flow (Core Scenarios)

#### Flow 1: 사용자 등록 및 프로젝트 생성
1. 사용자 회원가입 (이메일, 비밀번호)
2. 로그인 (JWT 토큰 발급 — 향후 구현)
3. 프로젝트 생성 (프로젝트명, 장르, 설명 등)
4. 프로젝트별 설정 공간 접근

#### Flow 2: 특성/어빌리티 관리 및 매칭
1. 전역 특성/어빌리티 풀에서 검색 및 선택
2. 프로젝트 종속 특성/어빌리티 생성
3. 설정 엔티티(인물, 종족, 아이템 등)에 특성/어빌리티 매칭
4. 매칭된 특성/어빌리티를 통한 설정의 특색 파악

#### Flow 3: 설정 엔티티 생성 및 관계 설정
1. 프로젝트 내에서 설정 엔티티 생성 (인물, 종족, 아이템, 지역, 국가, 조직, 사건, 전승 등)
2. 엔티티 간 관계 설정 (인물-인물, 인물-조직, 국가-조직 등)
3. 관계 탐색 및 시각화

### 3.3. Core Features (Detailed)

#### Feature A: 사용자 인증 및 권한 관리
- **Logic**: JWT 기반 인증, 비밀번호 bcrypt 해싱, 이메일 인증(향후), 계정 잠금
- **Validation**: 이메일 형식, 비밀번호 강도, 중복 이메일 검증

#### Feature B: 프로젝트 관리
- **Logic**: 프로젝트 CRUD(소프트 삭제), 프로젝트별 설정 공간, 메타데이터 관리
- **Validation**: 프로젝트명 필수, 소유자 권한 검증

#### Feature C: 전역 특성/어빌리티 관리 ⭐ 최우선
- **Logic**: 전역 풀 관리, 키워드·대분류·중분류·적용 대상별 검색, 상충 관계, 사용 현황 추적
- **Validation**: 특성명/어빌리티명 필수, 전역 풀 내 중복 검증

#### Feature D: 프로젝트 종속 특성/어빌리티 관리 ⭐ 최우선
- **Logic**: 프로젝트별 고유 특성/어빌리티 CRUD, 전역과 동일 구조
- **Validation**: 프로젝트 소유자/편집자 권한, 프로젝트 내 중복 검증

#### Feature E: 특성/어빌리티 통합 검색
- **Logic**: 전역 + 프로젝트 종속 풀 통합 검색, 타입 구분(GLOBAL | PROJECT), 키워드·카테고리 필터

#### Feature F: 설정 엔티티 관리
- **Logic**: 코어 설정, 생물/종족, 인물, 아이템, 지역, 국가, 조직, 사건, 전승 CRUD, 페이징·검색

#### Feature G: 특성/어빌리티 매칭
- **Logic**: 설정 엔티티에 전역/프로젝트 종속 특성·어빌리티 매칭, 매핑 테이블 다대다 관리

#### Feature H: 엔티티 간 관계 관리
- **Logic**: 인물-인물, 인물-조직, 국가-조직 관계, 관계 유형·상세, 다형 참조

### 3.4. 앱 기동 및 초기 로딩 UX

- **배경**: 프로그램 최초 실행 시 Main Process에서 DB 연결(initDbContext)·Hono 서버 기동 등으로 지연이 발생할 수 있음. 사용자가 빈 화면만 보다가 갑자기 UI가 뜨면 체감 품질이 떨어짐.
- **요구사항**: 앱이 **준비되기 전**에는 렌더러에서 **로딩 중** 상태를 명시적으로 표시한다.
  - 렌더러 진입 시 곧바로 "로딩 중" 화면(스피너·문구)을 보여 주고, 백엔드 준비 완료(예: Health API 성공 또는 IPC 핑)를 확인한 뒤 본문 UI(타이틀바·라우터 뷰)로 전환한다.
  - 로딩 화면은 전체 화면 또는 메인 영역을 덮는 형태로, 앱 이름·로고·"준비 중…" 등 최소 정보만 노출한다.

### 3.5. 아키텍처 (Electron + Hono)

- **Main Process**: Hono HTTP API(Controller → Service → Mapper), DB context(`getDb()`), IPC·API 레이어
- **Renderer (Vue)**: `window.electron.api.*`로 Hono API 호출, `window.electron.ipc.*`로 설정·앱 통신
- **IPC vs API**: 엔드포인트 통신 = API(HTTP). 설정·DB 모드·base URL = IPC

### 3.6. UI 컴포넌트 및 디자인 규칙

#### 프로젝트 포인트 컬러
- **Primary / Accent / Ring**: **blue500** 계열로 통일. (`theme.css` — 라이트: primary·ring `blue-500`, accent `blue-100`/`blue-900`; 다크: 동일 계열.)
- 버튼(추가, 관리 등)·포커스 링·태그 등 브랜드 강조는 위 시맨틱 토큰(`bg-primary`, `text-accent-foreground` 등) 사용.

#### 설정 아이템 카드 (SettingItemCard)
- **용도**: 코어 설정, 특성/능력 등 **설정 목록의 한 행**을 공통으로 표현. 재사용 컴포넌트.
- **위치**: `src/renderer/components/common/SettingItemCard.vue`
- **레이아웃**:
  - 한 행에 **카테고리(라벨)** + **제목** + **컨트롤 아이콘**. `flex flex-row items-start`.
  - **카테고리**가 앞에 오고, 제목이 길어져도 카테고리 위치는 고정(`shrink-0`).
  - 컨트롤 아이콘은 **우측 상단** 정렬, 호버 시 **가로·세로 동일한 정사각형** 영역(`size-8`).
- **Props**: `title`, `category`, `isFavorite`(선택), `isProtected`(선택).
- **이벤트**: `@view`, `@edit`, `@toggle-favorite`, `@toggle-protected`, `@delete` — 부모에서 핸들러 구현 후 연결.
- **컨트롤**: 보기(eye), 수정(pencil), 즐겨찾기(star), 보호(shield), 삭제(trash-2). 아이콘은 컴포넌트 내부에 고정, 동작만 emit으로 전달.

#### 다크/라이트 공통
- **텍스트·배경**: `text-foreground`, `text-muted-foreground`, `bg-background`, `bg-card`, `border-border` 등 **시맨틱 토큰**만 사용. `text-slate-200`, `bg-violet-500/20` 등 하드코딩 색은 지양.
- **에러/삭제**: `text-destructive`, `hover:text-destructive` 등 시맨틱 토큰 사용.

> 코드 규칙(Vue 섹션 순서, 공백, JSDoc, 반환 타입 등)은 **PRD/Coding Rules & Guidelines.md**를 따른다.

---

## 4. Data Structure (Schema)

### 4.1. 공통 필드 (CommonEntity)

모든 엔티티 테이블에 포함되는 공통 컬럼:

- **useYn**, **shrnYn**, **delYn**: 사용/공유/삭제 여부 (기본값 'Y'/'N'/'N')
- **crtNo**, **crtDt**: 생성자 번호, 생성 일시
- **updtNo**, **updtDt**: 수정자 번호, 수정 일시
- **delNo**, **delDt**: 삭제자 번호, 삭제 일시

정의 위치: `src/main/server/schema/local/common.columns.ts`, `schema/remote/common.columns.ts`

### 4.2. 주요 테이블 (Drizzle 스키마)

- **로컬 스키마**: 사용자 테이블(users) 없음. 단일 사용자이므로 프로젝트·설정 데이터만 로컬에 저장.
- **원격 스키마**: 사용자·멀티유저·온라인 프로젝트 지원.
- **users** (원격 전용): user_no(PK), user_eml, user_nm, user_role, enpswd, resh_token, acnt_lck_yn, lgn_fail_nmtm 등
- **projects**: prj_no(PK), (원격 시) user_no(FK), prj_nm, genre_type, prj_desc, cvr_img_url, prj_expln, prj_ver
- **traits**: trait_no(PK), trait_nm, trait_expln, trait_lcls, trait_mcls, aply_trgt, cnfl_trait_no(자기참조)
- **project_traits**: trait_no(PK), prj_no(FK), trait_nm, cnfl_trait_no, cnfl_trait_type(GLOBAL|PROJECT)
- **abilities**: ability_no(PK), ability_nm, ability_type, ability_lcls, ability_expln, trgt_type, dmg_type 등
- **project_abilities**: ability_no(PK), prj_no(FK), ability_nm 등
- **characters**: char_no(PK), prj_no(FK), char_nm, alias_nm, role_type, logline, race_no, ntn_no, org_no 등
- **creatures**, **items**, **regions**, **nations**, **organizations**, **events**, **lores**, **core_rules**: 프로젝트 FK + 도메인 필드
- **char_trait_maps**, **char_ability_maps**: 복합 PK(char_no, trait_no/ability_no, trait_type/ability_type)
- **creature_trait_maps**, **creature_ability_maps**: map_no(PK), creature_no(FK), trait_no/ability_no, trait_type/ability_type

스키마 파일: `src/main/server/schema/local/*.table.ts`, `schema/remote/*.table.ts`  
마이그레이션: `src/drizzle/local/`, `src/drizzle/remote/`

### 4.3. 엔티티 관계 (요약)

- **로컬**: User 없음. Project 및 하위 엔티티만 단일 사용자 기준으로 관리.
- **원격**: User (1) ──< (N) Project (온라인 프로젝트 소유)
- Project (1) ──< (N) ProjectTrait, ProjectAbility, Character, Creature, Item, Region, Nation, Organization, Event, Lore
- Trait / ProjectTrait ──< CharTraitMap, CreatureTraitMap ──> Character / Creature
- Ability / ProjectAbility ──< CharAbilityMap, CreatureAbilityMap ──> Character / Creature

---

## 5. Non-Functional Requirements & Risks

### Performance
- API 응답: 목록 200ms 이내, 상세 100ms 이내 목표
- 페이징: 기본 20건, 최대 100건
- 인덱스: 검색 필드·외래키·복합키에 인덱스 활용

### Security
- 인증: JWT Access/Refresh Token (향후)
- 비밀번호: bcrypt 해싱
- Context Isolation·Node Integration 비활성화, Preload를 통해서만 `window.electron` 노출

### Data Integrity
- 소프트 삭제: del_yn = 'Y'로 표시
- 트랜잭션: Drizzle/Service 레이어에서 관리

### Risks
- 전역 풀 권한 정책 결정 필요
- 대량 데이터 시 페이징·인덱스·캐싱 고려
- 복합 키 매핑 테이블 설계·유지보수

---

## 6. API 설계 원칙

- **RESTful**: 리소스 중심, 복수형, GET/POST/PATCH/DELETE
- **패스**: PK는 no 형식 (예: :traitNo, :abilityNo, :charNo, :prjNo)
- **응답**: 모든 API는 **HTTP 200**으로 반환. 성공/실패는 본문의 **error**, **code** 로 구분.
- **응답 구조**: `src/types/response.types.ts` 의 **ResponseType&lt;TData&gt;** 사용 (`{ data, error, code, message }`).
- **목록 응답**: **ResponseType&lt;ListType&lt;TData&gt;&gt;** (즉 ListResponseType&lt;TData&gt;). data 안에 `list`, `totalCnt`, `pageSize`, `page`, `totalPage`, `isFirst`, `isLast` 포함.
- **페이징**: 목록 API는 항상 페이징을 갖는 것은 아님. 렌더러에서 쿼리스트링 `page`(선택 `pageSize`)를 넘기면 Hono에서 페이징 계산 후 내려줌. 기본 pageSize는 `src/config/app.json`의 `pagination.pageSize`(기본 10). 사용자가 `pageSize` 쿼리로 넘기면 그 값을 사용.
- **인증**: Public(로그인·회원가입) / Authenticated(대부분). 공유 여부(shrn_yn) 기반 접근 제어

---

*문서 끝*
