# 기술 아키텍처 - Fantasy Builder

**최종 업데이트**: 2026-02-07  
**버전**: 1.0.0

---

## 시스템 아키텍처 개요 (System Architecture Overview)

Fantasy Builder는 메인 프로세스(백엔드)와 렌더러 프로세스(프론트엔드)가 명확히 분리된 **하이브리드 Electron 아키텍처**를 사용합니다. 통신은 HTTP API와 IPC(프로세스 간 통신)의 조합을 통해 이루어집니다.

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Application                    │
├─────────────────────┬───────────────────────────────────────┤
│   Main Process       │         Renderer Process             │
│   (Node.js Backend)  │         (Vue.js Frontend)           │
│                     │                                       │
│ ┌─────────────────┐ │ ┌─────────────────────────────────┐ │
│ │   Hono Server   │ │ │        Vue Application          │ │
│ │   (Port 3456)   │ │ │                                 │ │
│ └─────────────────┘ │ │ ┌─────────────┐ ┌─────────────┐ │ │
│         │           │ │ │  Components │ │   Stores    │ │ │
│         ▼           │ │ └─────────────┘ └─────────────┘ │ │
│ ┌─────────────────┐ │ │ ┌─────────────┐ ┌─────────────┐ │ │
│ │ Drizzle ORM     │ │ │ │    Router   │ │   Utils     │ │ │
│ │ (DB Layer)      │ │ │ └─────────────┘ └─────────────┘ │ │
│ └─────────────────┘ │ └─────────────────────────────────┘ │
29: └─────────────────────┴───────────────────────────────────────┘
                               │
                               ▼ HTTP API (localhost:3456)
                    ┌─────────────────────────────────┐
                    │         Database Layer          │
                    │  ┌─────────┐    ┌─────────────┐ │
                    │  │ SQLite  │    │ PostgreSQL  │ │
                    │  │ (Local) │    │ (Remote)    │ │
                    │  └─────────┘    └─────────────┘ │
                    └─────────────────────────────────┘
```

---

## 핵심 컴포넌트 (Core Components)

### 1. 메인 프로세스 (백엔드)

#### Hono HTTP 서버
- **목적**: 메인-렌더러 통신을 위한 내부 API 서버
- **포트**: 3456 (설정 가능)
- **프레임워크**: Hono.js (TypeScript)
- **기능**:
  - RESTful API 엔드포인트
  - 렌더러 프로세스를 위한 CORS 지원
  - 전역 예외 처리
  - 요청/응답 로깅

#### 데이터베이스 계층
- **ORM**: Drizzle ORM (TypeScript)
- **이중 지원**: 
  - **로컬**: better-sqlite3를 통한 SQLite
  - **원격**: pg를 통한 PostgreSQL
- **스키마 관리**: 버전 제어를 통한 자동화된 마이그레이션
- **연결 관리**: 컨텍스트 기반 DB 전환

#### IPC 핸들러
- **목적**: 설정 및 시스템 레벨 작업
- **기능**:
  - 데이터베이스 모드 전환 (로컬/원격)
  - 애플리케이션 설정 관리
  - 윈도우 제어 작업
  - 시스템 정보 접근

### 2. 렌더러 프로세스 (프론트엔드)

#### Vue.js 애플리케이션
- **프레임워크**: Vue 3 (Composition API)
- **아키텍처**: SPA (Single Page Application)
- **라우팅**: 해시 히스토리를 사용하는 Vue Router
- **상태 관리**: Pinia 스토어
- **빌드 도구**: Vite (electron-vite)

#### 컴포넌트 시스템
- **디자인 시스템**: 커스텀 컴포넌트를 포함한 Tailwind CSS v4
- **아이콘 시스템**: 다중 아이콘 세트를 지원하는 Unplugin-icons
- **자동 임포트**: Vue, Pinia, 유틸리티 자동 임포트
- **컴포넌트 자동 등록**: 컴포넌트 자동 감지 및 임포트

#### API 클라이언트
- **HTTP 클라이언트**: Axios 기반 API 통신
- **타입 안전성**: 전체 TypeScript 통합
- **에러 처리**: 중앙 집중식 에러 처리
- **응답 구조**: 표준화된 ResponseType 포맷

### 3. Preload 스크립트 (보안 브리지)

#### 컨텍스트 격리 (Context Isolation)
- **보안**: Node 통합 비활성화, 컨텍스트 격리 활성화
- **API 노출**: 메인 프로세스 API의 제어된 노출
- **타입 안전성**: 노출된 모든 API에 대한 전체 TypeScript 정의
- **검증**: 모든 IPC 통신에 대한 런타임 검증

---

## 데이터 흐름 아키텍처 (Data Flow Architecture)

### 요청-응답 사이클
1. 사용자 액션 (Vue 컴포넌트)
2. 스토어 액션 (Pinia)
3. API 클라이언트 (Axios)
4. HTTP 요청 (localhost:3456)
5. Hono 라우트 핸들러
6. 서비스 계층 (비즈니스 로직)
7. 데이터베이스 작업 (Drizzle ORM)
8. 응답 처리
9. 프론트엔드 상태 업데이트
10. UI 리렌더링

### 데이터베이스 모드 전환
헤더 또는 쿼리 파라미터를 통한 런타임 컨텍스트 스위칭으로, 설정 기반 DB 선택이 이루어집니다.

---

## 데이터베이스 아키텍처 (Database Architecture)

### 스키마 설계 원칙

#### 1. 개체-관계 모델 (Entity-Relationship Model)
- **Projects**: 중앙 엔티티, 모든 세계관 구축 데이터를 포함
- **Global Entities**: 특성, 능력 (프로젝트 간 공유됨)
- **Project Entities**: 캐릭터, 크리처, 장소 (프로젝트 전용)
- **Mapping Tables**: 엔티티 간 다대다 관계

#### 2. 공통 필드 (CommonEntity)
모든 테이블은 감사 및 소프트 삭제를 위한 표준 필드를 포함합니다:
- useYn, shrnYn, delYn (상태 플래그)
- crtNo, crtDt, updtNo, updtDt (생성/수정 추적)
- delNo, delDt (삭제 추적)

#### 3. 프로젝트 범위 (Project Scoping)
- **로컬 DB**: 단일 사용자 모드, 사용자 관리 테이블 없음
- **원격 DB**: 인증 및 소유권을 포함한 다중 사용자 지원

---

## API 아키텍처 (API Architecture)

### 설계 원칙

#### 1. 리소스 기반 엔드포인트
리소스당 GET/POST/PATCH/DELETE 패턴을 따르는 RESTful 엔드포인트

#### 2. 쿼리 파라미터를 통한 프로젝트 스코핑
프로젝트 범위(Scoped) 데이터는 쿼리 파라미터 또는 요청 바디를 통해 전달

#### 3. 표준화된 응답 포맷
모든 API는 데이터, 에러 상태, 코드, 메시지를 포함하는 표준화된 ResponseType 래퍼와 함께 HTTP 200을 반환합니다.

### Controller-Service-Repository 패턴
3계층 아키텍처:
- Controllers: HTTP 요청 처리
- Services: 비즈니스 로직 및 검증
- Repositories: Drizzle을 통한 데이터베이스 작업

---

## 프론트엔드 아키텍처 (Frontend Architecture)

### Vue.js 컴포넌트 구조

#### 1. 뷰 컴포넌트 (페이지)
위치: src/renderer/views/
주요 기능을 위한 라우트 레벨 컴포넌트

#### 2. 기능 컴포넌트
위치: src/renderer/views/[feature]/
기능별 컴포넌트

#### 3. 공통 컴포넌트
위치: src/renderer/components/
재사용 가능한 UI 컴포넌트

### 상태 관리 패턴
Composition API를 사용한 Pinia 스토어:
- ref를 사용한 상태 관리
- computed 게터
- API 호출을 위한 비동기 액션

### 라우팅 아키텍처
프로젝트 상세 뷰를 위한 중첩 라우트를 포함하는 Vue Router

---

## 빌드 및 개발 아키텍처 (Build and Development Architecture)

### electron-vite 설정
경로 별칭 및 외부 의존성과 함께 Main, Preload, Renderer 프로세스를 위한 별도 설정

### 개발 워크플로우
1. 의존성 설치
2. 네이티브 모듈(SQLite) 리빌드
3. 핫 리로드를 포함한 개발 시작

### 빌드 프로세스
프로덕션 빌드는 모든 프로세스에 대해 최적화된 번들을 생성합니다.

---

## 보안 아키텍처 (Security Architecture)

### 1. 컨텍스트 격리
- 렌더러에서 Node 통합 비활성화
- 컨텍스트 격리 활성화
- Preload 스크립트를 통한 제어된 API 노출

### 2. API 보안
- CORS 제한
- Zod 스키마 검증
- Drizzle ORM을 통한 SQL 인젝션 방지

### 3. 데이터 보안
- 로컬 SQLite 암호화
- 원격 PostgreSQL을 위한 HTTPS
- 완전한 감사 추적

---

## 성능 고려사항 (Performance Considerations)

### 1. 데이터베이스 최적화
- 전략적 인덱싱
- 커넥션 풀링
- 대용량 데이터셋을 위한 페이지네이션

### 2. 프론트엔드 성능
- 코드 분할 (Code splitting)
- 컴포넌트 지연 로딩 (Lazy loading)
- 가상 스크롤링 (Virtual scrolling)

### 3. 메모리 관리
- 스토어의 적절한 정리
- 이벤트 리스너 정리
- 데이터베이스 연결 수명 주기 관리

---

## 모니터링 및 디버깅 (Monitoring and Debugging)

### 1. 개발 도구
- Vue DevTools
- Electron DevTools
- 데이터베이스 쿼리 로깅

### 2. 에러 처리
- 전역 예외 처리
- 사용자 친화적 에러 메시지
- 구조화된 로깅

### 3. 성능 모니터링
- API 응답 시간 추적
- 데이터베이스 성능 모니터링
- 메모리 사용량 추적

---

*이 기술 아키텍처 문서는 Fantasy Builder 애플리케이션의 내부 설계에 대한 포괄적인 개요를 제공합니다. 구체적인 구현 세부 사항은 개별 컴포넌트 문서를 참조하세요.*
