# IMPLEMENTATION PLAN: Design Overhaul & Feature Synchronization
> **Date:** 2026-02-07
> **Task ID:** 001_UPDATE_DesignAndGap
> **Language:** Korean

## 1. Objective
- **디자인 개편**: 데스크탑 앱스러운 트렌디한 디자인 및 라이트/다크 모드 시스템 구축 (Tailwind v4 CSS Variables 활용).
- **구현 격차 해소**: 백엔드/DB에는 존재하나 프론트엔드(Renderer)에 구현되지 않은 엔티티 관리 뷰(Character, Creature, Item 등) 추가 계획 수립 및 PRD 갱신.

## 2. Context Analysis
- **Current Status**:
    - **Backend**: Hono + Drizzle로 대부분의 엔티티(Character, Creature, Item, Region, Nation, Organization, Event, Lore)에 대한 스키마 및 컨트롤러 준비됨.
    - **Frontend**: `ProjectDetailView` 내에 `CoreRulesSection` 외에는 대부분 구현되지 않음 (`PlaceholderSection`으로 대체 추정).
    - **Design**: `bg-indigo-950` 등 하드코딩된 색상 사용 중. 다크 모드 고정 상태.
- **Gap**:
    - DB 스키마에 정의된 10종 이상의 엔티티에 대한 뷰 부재.
    - 테마 시스템(Light/Dark) 부재.

## 3. Strategy

### 3.1. Design System Overhaul (Theme Protocol)
- **Tech**: Tailwind CSS v4 CSS Variables.
- **Color Palette**:
    - **Base**: `background`, `foreground` (App 배경, 기본 텍스트)
    - **Surface**: `card`, `card-foreground`, `popover`, `popover-foreground` (카드/패널, 모달)
    - **Primary**: `primary`, `primary-foreground` (브랜드 컬러, 강조 버튼)
    - **Muted**: `muted`, `muted-foreground` (보조 텍스트, 비활성)
    - **Border**: `border`, `input` (테두리)
- **Implementation**:
    - `src/renderer/assets/base.css` (또는 `styles.css`)에 `:root` (Light) 및 `.dark` (Dark) 변수 정의.
    - `App.vue` 및 공통 컴포넌트(`AppTitleBar`, `AppLoadingScreen` 등) 리팩토링.

### 3.2. Frontend Gap Filling (Phase-wise)
- **Phase 1 (This Task)**: 디자인 시스템 구축 및 PRD 갱신. `ProjectDetailView`의 레이아웃 개편(사이드바 네비게이션 적용).
- **Phase 2 (Next)**: 주요 엔티티(Character, Trait, Ability) 뷰 구현.
- **Phase 3 (Follow-up)**: 세계관 엔티티(Region, Nation, Organization, Item, Creature) 뷰 구현.

## 4. Impact Analysis
- **Modified Files**:
    - `PRD/PRD.md`: 구현 상태 업데이트.
    - `src/renderer/assets/*.css`: 글로벌 스타일 정의.
    - `src/renderer/App.vue`: 최상위 레이아웃 및 테마 적용.
    - `src/renderer/views/ProjectDetailView.vue`: 하위 섹션 네비게이션 구조 변경.
- **Side Effects**:
    - 기존 하드코딩된 스타일이 일시적으로 깨질 수 있음 (전수 검사 필요).

## 5. Task List

### Phase 1: Design & PRD (Current)
- [ ] **Gap Analysis & PRD Update**
    - [ ] `PRD.md`에 미구현 기능 목록화 및 상태 업데이트.
- [ ] **Design System Setup**
    - [ ] `src/renderer/assets/styles/theme.css` 생성 및 CSS 변수 정의 (Light/Dark).
    - [ ] `src/renderer/assets/base.css`에 Tailwind `@theme` 설정.
- [ ] **Layout & Component Refactor**
    - [ ] `App.vue`: 테마 적용 및 전역 배경색 변경.
    - [ ] `AppTitleBar.vue`: 테마 토글 버튼 추가.
    - [ ] `ProjectDetailView.vue`: 사이드바 레이아웃으로 변경 (엔티티 목록 접근성 향상).

## 6. Verification Plan
### Automated Tests
- 현재 UI 테스트 없음. `pnpm dev`로 실행하여 육안 검증.

### Manual Verification
1. **Theme Switching**:
    - 타이틀바의 테마 토글 버튼 클릭 시 즉시 색상 반전 확인.
    - 앱 재시작 시 마지막 테마 유지 여부 확인 (`localStorage`).
2. **Visual Consistency**:
    - Light/Dark 모드에서 텍스트 가독성 확인.
    - 카드, 버튼, 입력 필드의 경계 및 호버 효과 확인.
3. **Backend Sync**:
    - `ProjectDetailView` 사이드바 메뉴가 DB의 엔티티 목록(Character, Item 등)과 일치하는지 확인 (기능은 Placeholder라도 메뉴는 존재해야 함).
