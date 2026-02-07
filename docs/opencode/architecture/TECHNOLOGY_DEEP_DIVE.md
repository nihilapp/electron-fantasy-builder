# 기술 심층 분석 (Technology Deep Dive) - Fantasy Builder

**최종 업데이트**: 2026-02-07  
**버전**: 1.0.0  
**분석 일자**: 2026-02-07

---

## 개요 (Overview)

이 문서는 Fantasy Builder 프로젝트에 사용된 핵심 기술에 대한 심층 분석을 제공하며, 구현 패턴, 모범 사례, 아키텍처 결정 사항을 탐구합니다.

---

## Electron 아키텍처 분석 (Electron Architecture Analysis)

### 멀티 프로세스 아키텍처

#### 메인 프로세스 (Node.js 백엔드)
```typescript
// src/main/index.ts - 애플리케이션 진입점
app.whenReady().then(() => {
  initDbContext();        // 데이터베이스 초기화
  setupIpcHandlers();     // IPC 통신 설정
  startHonoServer();      // 내부 HTTP 서버
  createMainWindow();     // UI 윈도우 생성
  createTray();           // 시스템 트레이 통합
});
```

**주요 책임:**
- 데이터베이스 관리 및 연결
- 파일 시스템 접근
- 시스템 트레이 통합
- 네이티브 API 접근
- HTTP API 서버 (Hono)
- 프로세스 수명 주기 관리

#### 렌더러 프로세스 (Vue.js 프론트엔드)
```typescript
// src/renderer/index.ts - 프론트엔드 진입점
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount('#app');
```

**주요 책임:**
- 사용자 인터페이스 렌더링
- 사용자 상호작용 처리
- 상태 관리 (Pinia)
- 클라이언트 사이드 라우팅
- API 통신

#### Preload 스크립트 (보안 브리지)
```typescript
// src/preload/index.ts - 보안 브리지
contextBridge.exposeInMainWorld('electron', {
  api: {
    getProjectList: (params) => ipcRenderer.invoke('api:get-project-list', params),
    // ... 기타 API 메소드
  }
});
```

**주요 책임:**
- 렌더러에 대한 안전한 API 노출
- 컨텍스트 격리 강제
- 타입 안전한 IPC 통신
- 입력 검증 및 위생 처리(Sanitization)

### 통신 패턴

#### 1. HTTP API 통신 (주요 방식)
- **방식**: localhost:3456으로의 Axios HTTP 호출
- **프로토콜**: JSON 페이로드를 사용하는 RESTful API
- **사용 사례**: 비즈니스 로직 및 데이터 작업

#### 2. IPC 통신 (보조 방식)
- **방식**: Electron IPC invoke/handle 패턴
- **프로토콜**: 타입 안전한 메시지 패싱
- **사용 사례**: 시스템 작업 및 설정

---

## Vue.js 구현 분석 (Vue.js Implementation Analysis)

### Composition API 패턴

#### 반응형 상태 관리
```typescript
// 예시: Composition API를 사용한 Pinia 스토어
export const useProjectStore = defineStore('project', () => {
  // State
  const projects = ref<ProjectVo[]>([]);
  const currentProject = ref<ProjectVo | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const hasProjects = computed(() => projects.value.length > 0);
  const isLoaded = computed(() => !loading.value && !error.value);

  // Actions
  const fetchProjects = async () => {
    loading.value = true;
    try {
      const response = await window.electron.api.getProjectList();
      projects.value = response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    projects: readonly(projects),
    currentProject: readonly(currentProject),
    loading: readonly(loading),
    error: readonly(error),
    hasProjects,
    isLoaded,
    fetchProjects,
  };
});
```

### 컴포넌트 아키텍처 패턴

#### 1. 섹션 기반 구성
```
src/renderer/views/project-detail/
├── OverviewSection.vue          # 프로젝트 개요
├── CoreRulesSection.vue         # 핵심 규칙 관리
├── CoreRuleDetailSection.vue    # 개별 핵심 규칙
├── CoreRuleAddSection.vue       # 핵심 규칙 생성
├── TraitsAbilitiesSection.vue   # 특성 & 능력
└── PlaceholderSection.vue       # 미구현 기능
```

#### 2. 컴포넌트 구조 패턴
```vue
<script setup lang="ts">
// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva/cssVariants 등)
// ═══════════════════════════════════════════════════════════════
const props = defineProps<Props>();
const cssVariants = cva(/* ... */);

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────
const store = useProjectStore();
const { projects, loading } = storeToRefs(store);

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────
const localState = ref(/* ... */);

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────
const handleAction = () => { /* ... */ };

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────
watch(someRef, (newVal) => { /* ... */ });

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────
onMounted(() => { /* ... */ });
</script>
```

### 라우터 설정 분석

#### 중첩 라우트 전략
```typescript
// src/renderer/router/index.ts
{
  path: '/project/:prjNo',
  name: 'project-detail',
  component: ProjectDetailView,
  props: true,
  children: [
    {
      path: '',
      redirect: (to) => ({ 
        name: 'project-overview', 
        params: { prjNo: to.params.prjNo } 
      }),
    },
    {
      path: 'overview',
      name: 'project-overview',
      component: OverviewSection,
    },
    // ... 기타 중첩 라우트
  ],
}
```

**이점:**
- 관련 기능의 논리적 그룹화
- 깔끔한 URL 구조
- 컴포넌트 캡슐화
- 레이아웃 및 상태 공유

---

## Hono.js API 서버 분석 (Hono.js API Server Analysis)

### 미들웨어 아키텍처

#### 전역 예외 처리
```typescript
// src/main/server/globalExceptionHandler.ts
export const globalExceptionHandler = (err: Error, c: Context) => {
  console.error('Unhandled error:', err);
  
  return c.json<ResponseType<null>>({
    data: null,
    error: true,
    code: 500,
    message: 'Internal server error',
    timestamp: new Date().toISOString(),
  }, 200); // 항상 에러 래퍼와 함께 200 반환
};
```

#### 데이터베이스 컨텍스트 전환
```typescript
// src/main/server/honoApp.ts
app.use('*', async (context, next) => {
  const raw = context.req.header('X-Db-Target') ?? context.req.query('db');
  
  let mode: DbMode | undefined;
  if (raw === 'remote') mode = 'remote';
  else if (raw === 'local') mode = 'local';

  return runWithDbMode(mode, next);
});
```

### 라우트 핸들러 패턴

#### Controller-Service-Repository 아키텍처
```typescript
// Controller Layer
export const getProjectList = createRoute(app, {
  method: 'get',
  path: '/projects',
  handler: async (c) => {
    const params = c.req.query();
    const result = await projectService.getProjectList(params);
    return c.json(normalizeVoResponse(result));
  },
});

// Service Layer
export const getProjectList = async (params: ListParams): Promise<ProjectVo[]> => {
  // Business logic, validation, transformation
  const projects = await projectMapper.selectList(params);
  return projects.map(rowToProject);
};

// Repository Layer
export const selectList = async (params: ListParams): Promise<any[]> => {
  // Database operations
  const db = getDb();
  return db.select().from(projectsTable).limit(params.pageSize);
};
```

---

## Drizzle ORM 구현 (Drizzle ORM Implementation)

### 스키마 정의 패턴

#### 공통 엔티티 필드
```typescript
// src/main/server/schema/local/common.columns.ts
export const commonColumns = {
  useYn: boolean('use_yn').notNull().default(true),
  shrnYn: boolean('shrn_yn').notNull().default(false),
  delYn: boolean('del_yn').notNull().default(false),
  crtNo: integer('crt_no'),
  crtDt: text('crt_dt'),
  updtNo: integer('updt_no'),
  updtDt: text('updt_dt'),
  delNo: integer('del_no'),
  delDt: text('del_dt'),
};
```

#### 테이블 정의 예시
```typescript
// src/main/server/schema/local/projects.table.ts
export const projectsTable = sqliteTable('projects', { ... });
```
