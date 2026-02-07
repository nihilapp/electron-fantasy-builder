# Technology Deep Dive - Fantasy Builder

**Last Updated**: 2026-02-07  
**Version**: 1.0.0  
**Analysis Date**: 2026-02-07

---

## Overview

This document provides an in-depth analysis of the key technologies used in the Fantasy Builder project, exploring implementation patterns, best practices, and architectural decisions.

---

## Electron Architecture Analysis

### Multi-Process Architecture

#### Main Process (Node.js Backend)
```typescript
// src/main/index.ts - Application entry point
app.whenReady().then(() => {
  initDbContext();        // Database initialization
  setupIpcHandlers();     // IPC communication setup
  startHonoServer();      // Internal HTTP server
  createMainWindow();     // UI window creation
  createTray();          // System tray integration
});
```

**Key Responsibilities:**
- Database management and connections
- File system access
- System tray integration
- Native API access
- HTTP API server (Hono)
- Process lifecycle management

#### Renderer Process (Vue.js Frontend)
```typescript
// src/renderer/index.ts - Frontend entry point
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount('#app');
```

**Key Responsibilities:**
- User interface rendering
- User interaction handling
- State management (Pinia)
- Client-side routing
- API communication

#### Preload Scripts (Security Bridge)
```typescript
// src/preload/index.ts - Security bridge
contextBridge.exposeInMainWorld('electron', {
  api: {
    getProjectList: (params) => ipcRenderer.invoke('api:get-project-list', params),
    // ... other API methods
  }
});
```

**Key Responsibilities:**
- Secure API exposure to renderer
- Context isolation enforcement
- Type-safe IPC communication
- Input validation and sanitization

### Communication Patterns

#### 1. HTTP API Communication (Primary)
- **Method**: Axios HTTP calls to localhost:3456
- **Protocol**: RESTful API with JSON payloads
- **Use Case**: Business logic and data operations

#### 2. IPC Communication (Secondary)
- **Method**: Electron IPC invoke/handle pattern
- **Protocol**: Type-safe message passing
- **Use Case**: System operations and configuration

---

## Vue.js Implementation Analysis

### Composition API Patterns

#### Reactive State Management
```typescript
// Example: Pinia store with Composition API
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

### Component Architecture Patterns

#### 1. Section-Based Organization
```
src/renderer/views/project-detail/
├── OverviewSection.vue          # Project overview
├── CoreRulesSection.vue         # Core rules management
├── CoreRuleDetailSection.vue    # Individual core rule
├── CoreRuleAddSection.vue       # Core rule creation
├── TraitsAbilitiesSection.vue   # Traits & abilities
└── PlaceholderSection.vue       # Unimplemented features
```

#### 2. Component Structure Pattern
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

### Router Configuration Analysis

#### Nested Route Strategy
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
    // ... other nested routes
  ],
}
```

**Benefits:**
- Logical grouping of related features
- Clean URL structure
- Component encapsulation
- Shared layout and state

---

## Hono.js API Server Analysis

### Middleware Architecture

#### Global Exception Handling
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
  }, 200); // Always return 200 with error wrapper
};
```

#### Database Context Switching
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

### Route Handler Pattern

#### Controller-Service-Repository Architecture
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

## Drizzle ORM Implementation

### Schema Definition Patterns

#### Common Entity Fields
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

#### Table Definition Example
```typescript
// src/main/server/schema/local/projects.table.ts
export const projectsTable = sqliteTable('pr
