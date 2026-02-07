# Fantasy Builder 문서

**최종 업데이트**: 2026-02-07  
**버전**: 1.0.0

---

## Fantasy Builder 문서에 오신 것을 환영합니다

Fantasy Builder는 작가, 게임 기획자, 만화가, 시나리오 작가 등 창작 전문가를 위해 설계된 **데스크톱 세계관 구축 도구**입니다. 이 포괄적인 문서는 애플리케이션을 이해하고 효과적으로 사용하는 데 도움을 줄 것입니다.

## 문서 구조

### 📁 [Architecture](./architecture/)
시스템 설계 및 기술 아키텍처 문서입니다.

- **[프로젝트 개요 (Project Overview)](./architecture/PROJECT_OVERVIEW.md)** - Fantasy Builder에 대한 고수준의 이해
- **[기술 아키텍처 (Technical Architecture)](./architecture/TECHNICAL_ARCHITECTURE.md)** - 상세 기술 구현 내용
- **[파일 구조 가이드 (File Structure Guide)](./architecture/FILE_STRUCTURE.md)** - 전체 디렉토리 및 파일 구성
- **[의존성 분석 (Dependencies Analysis)](./architecture/DEPENDENCIES_ANALYSIS.md)** - 포괄적인 라이브러리 분석 및 선정 근거
- **[기술 심층 분석 (Technology Deep Dive)](./architecture/TECHNOLOGY_DEEP_DIVE.md)** - 기술 구현 패턴 심층 분석
- **[프로젝트 분석 요약 (Project Analysis Summary)](./architecture/PROJECT_ANALYSIS_SUMMARY.md)** - 전체 프로젝트 분석 및 제언

### 📁 [API](./api/)
개발자를 위한 API 엔드포인트 및 데이터 스키마입니다.

- **[API 참조 (API Reference)](./api/API_REFERENCE.md)** - 전체 API 문서

### 📁 [Guides](./guides/)
사용자 및 개발 가이드입니다.

- **[사용자 가이드 (User Guide)](./guides/USER_GUIDE.md)** - Fantasy Builder 사용 방법

### 📁 [Development](./development/)
개발 환경 설정 및 기여 가이드라인입니다.

- **[개발 환경 설정 (Development Setup)](./development/DEVELOPMENT_SETUP.md)** - 개발자를 위한 시작하기 가이드
- **[개발 워크플로우 (Development Workflow)](./development/DEVELOPMENT_WORKFLOW.md)** - 포괄적인 개발 프로세스 및 모범 사례
- **[코드 스타일 가이드 (Code Style Guide)](./development/CODE_STYLE_GUIDE.md)** - 코딩 표준 및 규칙

### 📄 핵심 문서 (Core Documentation)

- **[데이터베이스 스키마 (Database Schema)](./DATABASE_SCHEMA.md)** - 전체 데이터베이스 설계 문서
- **[IPC 가이드 (IPC Guide)](./IPC_GUIDE.md)** - 프로세스 간 통신 (IPC) 문서
- **[엔드포인트 구현 계획 (Endpoint Implementation Plan)](./ENDPOINT_IMPLEMENTATION_PLAN.md)** - API 개발 로드맵

---

## 빠른 시작 (Quick Start)

### 사용자를 위해

1. **[사용자 가이드](./guides/USER_GUIDE.md)**를 읽고 Fantasy Builder 사용법을 익히세요.
2. **첫 프로젝트를 생성**하고 세계관 구축을 시작하세요.
3. 특성(Traits), 능력(Abilities), 엔티티 관계(Entity Relationships) 같은 **기능을 탐색**해 보세요.

### 개발자를 위해

1. **[개발 환경 설정](./development/DEVELOPMENT_SETUP.md)** 가이드를 따라 코드를 실행하세요.
2. **[기술 아키텍처](./architecture/TECHNICAL_ARCHITECTURE.md)**를 검토하여 시스템 설계를 이해하세요.
3. **[API 참조](./api/API_REFERENCE.md)**에서 통합 세부 정보를 확인하세요.
4. **[데이터베이스 스키마](./DATABASE_SCHEMA.md)**를 읽고 데이터 모델을 이해하세요.
5. **[개발 워크플로우](./development/DEVELOPMENT_WORKFLOW.md)**에서 모범 사례를 학습하세요.

---

## 애플리케이션 개요

### Fantasy Builder란 무엇인가요?

Fantasy Builder는 창작 전문가들이 다음 작업을 수행할 수 있도록 돕는 **데스크톱 세계관 구축 도구**입니다:

- 구조화된 데이터 관리로 **가상의 세계를 체계화**
- 특성과 능력을 통해 **캐릭터와 엔티티 관리**
- 거대한 창작 프로젝트 전반의 **일관성 유지**
- 다양한 세계관 요소 간의 **관계 구축**
- 로컬 데이터 저장소로 **오프라인 작업** 가능

### 주요 기능

- **프로젝트 기반 관리**: 각 창작물에 대한 독립적인 전용 공간 제공
- **특성 & 능력 시스템**: 전역 및 프로젝트별 캐릭터 속성 관리
- **엔티티 관리**: 캐릭터, 크리처, 조직, 장소 등 다양한 요소 관리
- **관계 매핑**: 세계관 요소 간의 연결 관계 정의
- **오프라인 우선**: 인터넷 없이 핵심 기능 동작
- **크로스 플랫폼**: Windows, macOS, Linux 지원

### 기술 스택

- **Frontend**: Vue 3 + TypeScript + Tailwind CSS
- **Backend**: Electron + Node.js + Hono.js
- **Database**: SQLite (로컬) 및 PostgreSQL 지원 (원격)
- **Build System**: electron-vite + pnpm
- **State Management**: Pinia stores
- **Validation**: 런타임 타입 체크를 위한 Zod 스키마

---

## 문서 하이라이트

### 🆕 새로운 포괄적 분석 (New Comprehensive Analysis)

프로젝트에 대한 더 깊은 통찰력을 제공하기 위해 심층 분석 문서를 최근 추가했습니다:

#### **[의존성 분석 (Dependencies Analysis)](./architecture/DEPENDENCIES_ANALYSIS.md)**
- 85개 이상의 모든 의존성 완전 분해
- 각 기술 선정에 대한 근거
- 보안 및 성능 영향 분석
- 의존성 관리 전략

#### **[기술 심층 분석 (Technology Deep Dive)](./architecture/TECHNOLOGY_DEEP_DIVE.md)**
- 상세 구현 패턴
- 코드 예제 및 모범 사례
- 보안 구현 분석
- 성능 최적화 전략

#### **[개발 워크플로우 (Development Workflow)](./development/DEVELOPMENT_WORKFLOW.md)**
- 전체 개발 환경 설정
- 빌드 시스템 분석 및 최적화
- 테스트 전략 및 디버깅 기법
- 배포 프로세스 및 품질 보증(QA)

#### **[프로젝트 분석 요약 (Project Analysis Summary)](./architecture/PROJECT_ANALYSIS_SUMMARY.md)**
- 프로젝트 상태에 대한 요약 보고
- 전체 아키텍처 평가
- 리스크 분석 및 완화 전략
- 향후 개발 제언

---

## 도움 받기

### 문서 리소스

- **📖 사용자 가이드**: 포괄적인 사용 설명서
- **🔧 개발 환경 설정**: 환경 설정 및 기여 가이드
- **🏗️ 기술 아키텍처**: 시스템 설계 및 구현 세부 사항
- **📡 API 참조**: 전체 엔드포인트 문서
- **🗄️ 데이터베이스 스키마**: 데이터 모델 및 관계
- **📋 의존성 분석**: 전체 기술 스택 분석
- **💻 개발 워크플로우**: 포괄적인 개발 프로세스

### 자주 묻는 질문 (FAQ)

**Q: Fantasy Builder는 어떤 플랫폼에서 실행되나요?**
A: Windows, macOS, Linux (데스크톱 애플리케이션)를 지원합니다.

**Q: 오프라인에서 사용할 수 있나요?**
A: 네, 핵심 기능은 로컬 SQLite 저장소를 사용하여 완전히 오프라인으로 작동합니다.

**Q: 내 데이터는 비공개인가요?**
A: 네, 기본적으로 모든 데이터는 로컬에 저장됩니다. 온라인 기능은 선택 사항입니다.

**Q: 데이터를 가져오거나 내보낼 수 있나요?**
A: 네, 다양한 포맷의 가져오기/내보내기를 지원합니다.

**Q: 어떤 기술이 사용되었나요?**
A: [의존성 분석](./architecture/DEPENDENCIES_ANALYSIS.md) 문서에서 전체 기술 스택을 확인할 수 있습니다.

---

## 개발자를 위해

### 기여하기 (Contributing)

커뮤니티의 기여를 환영합니다! 시작하는 방법은 다음과 같습니다:

1. GitHub에서 **저장소를 포크(Fork)**합니다.
2. 개발 환경 설정 가이드를 통해 **개발 환경을 구성**합니다.
3. 기여할 기능을 위한 **피처 브랜치(Feature branch)를 생성**합니다.
4. 코딩 표준([코드 스타일 가이드](./development/CODE_STYLE_GUIDE.md))에 따라 **변경 사항을 작성**합니다.
5. UI, API, 데이터베이스 테스트를 포함하여 **철저히 테스트**합니다.
6. 명확한 설명과 함께 **풀 리퀘스트(Pull Request)를 제출**합니다.

### 개발 중점 분야

현재 다음 기능들을 작업 중입니다:

- **🚧 특성 & 능력 UI**: 백엔드가 준비된 기능에 대한 프론트엔드 구현
- **🚧 엔티티 관리 UI**: 캐릭터, 크리처, 조직, 장소 관리
- **🚧 관계 시각화**: 엔티티 연결 관계의 시각적 표시
- **📋 검색 & 필터링**: 고급 엔티티 탐색 기능
- **📋 가져오기/내보내기**: 데이터 휴대성 기능

### 코드 표준

- **TypeScript**: 런타임 유효성 검사를 포함한 완전한 타입 커버리지
- **Zod Schemas**: 모든 데이터 구조에 대한 런타임 검증
- **Component Pattern**: 일관된 Vue 컴포넌트 구조
- **API First**: UI 구현 전 백엔드 API 설계 우선
- **Testing**: 모든 기능에 대한 포괄적인 테스트 커버리지

### 아키텍처 패턴

- **계층형 아키텍처 (Layered Architecture)**: Controller → Service → Repository 패턴
- **타입 우선 개발 (Type-First Development)**: Zod 스키마로 데이터 계약 정의
- **컴포넌트 기반 UI**: Tailwind 스타일링을 적용한 재사용 가능한 Vue 컴포넌트
- **RESTful APIs**: 일관된 응답을 갖춘 표준화된 HTTP 엔드포인트
- **데이터베이스 마이그레이션**: Drizzle ORM을 이용한 스키마 버전 관리

---

## 프로젝트 상태

### 현재 버전: 1.0.0

#### ✅ 완료됨
- 전체 UI를 포함한 프로젝트 CRUD 작업
- 핵심 규칙 관리 시스템
- 전체 데이터베이스 아키텍처 구성
