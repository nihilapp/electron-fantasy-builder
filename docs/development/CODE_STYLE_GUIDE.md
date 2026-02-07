# Code Style Guide - Fantasy Builder

**Last Updated**: 2026-02-07  
**Version**: 1.0.0

---

## Overview

This guide establishes coding standards and conventions for the Fantasy Builder project to ensure consistency, maintainability, and collaboration efficiency.

---

## TypeScript Standards

### Type Definitions

#### Interface Naming
```typescript
// ✅ Good: Descriptive and purposeful
interface ProjectData {
  prjNo: number;
  prjNm: string;
  genreType?: string;
}

// ❌ Bad: Vague or abbreviated
interface Proj {
  id: number;
  name: string;
  type?: string;
}
```

#### Type Annotations
```typescript
// ✅ Good: Explicit types
function createProject(data: ProjectData): Promise<Project> {
  return apiClient.post('/projects', data);
}

// ✅ Good: Inferred types when obvious
const projects = ref<Project[]>([]);
const isLoading = ref(false);
```

#### Enums vs Union Types
```typescript
// ✅ Use union types for string constants
type DatabaseMode = 'local' | 'remote';
type ResponseCode = 'SUCCESS' | 'VALIDATION_ERROR' | 'NOT_FOUND';

// ✅ Use enums for numeric or complex constants
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}
```

### Error Handling

#### Standard Error Pattern
```typescript
// ✅ Good: Consistent error handling
async function getProjectList(query: ProjectQuery): Promise<ListResponseType<Project>> {
  try {
    const response = await apiClient.get<ListResponseType<Project>>('/projects', {
      params: query
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw new Error('Unable to load projects. Please try again.');
  }
}

// ❌ Bad: Silent failures
async function getProjectList(query: ProjectQuery) {
  try {
    // API call
  } catch (e) {
    // Do nothing
  }
}
```

---

## Vue.js Component Standards

### Component Structure

#### File Organization
```vue
<script setup lang="ts">
// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, useRoute 등)
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────
</script>

<template>
  <!-- Component template -->
</template>

<style scoped>
/* Component-specific styles */
</style>
```

#### Component Naming
```typescript
// ✅ Good: Descriptive and consistent
ProjectListView.vue
ProjectDetailView.vue
CoreRulesSection.vue

// ✅ Good: Clear purpose
AppLoadingScreen.vue
AppTitleBar.vue

// ❌ Bad: Unclear or abbreviated
ProjList.vue
ProjDet.vue
CoreSec.vue
```

### Props and Emits

#### Type Safety
```vue
<script setup lang="ts">
// ✅ Good: Explicit prop typing with validation
interface Props {
  project: Project;
  isLoading?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: null
});

// ✅ Good: Explicit emit typing
interface Emits {
  'update:project': [project: Project];
  'delete': [projectId: number];
}

const emit = defineEmits<Emits>();
</script>
```

---

## CSS and Styling Standards

### Tailwind CSS Conventions

#### Utility Class Usage
```vue
<template>
  <!-- ✅ Good: Semantic utility combinations -->
  <div class="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-sm">
    <h2 class="text-lg font-semibold text-gray-900">
      {{ project.prjNm }}
    </h2>
    <p class="text-sm text-gray-600">
      {{ project.prjDesc }}
    </p>
  </div>

  <!-- ❌ Bad: Inconsistent or arbitrary styling -->
  <div class="grid grid-cols-1 mt-4 bg-white border-2 border-gray-300 rounded-lg p-2">
    <h3 class="font-bold text-2xl text-blue-500">
      {{ project.prjNm }}
    </h3>
  </div>
</template>
```

#### Custom Components with CVA
```typescript
// ✅ Good: Reusable component variants
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

### Responsive Design
```vue
<template>
  <!-- ✅ Good: Mobile-first responsive design -->
  <div class="container mx-auto px-4 py-6">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Content -->
    </div>
  </div>
</template>
```

---

## API Development Standards

### Endpoint Naming
```typescript
// ✅ Good: RESTful and consistent
GET    /projects              // List projects
GET    /projects/:prjNo       // Get specific project
POST   /projects              // Create project
PATCH  /projects/:prjNo       // Update project
DELETE /projects/:prjNo       // Delete project

// ✅ Good: Project-scoped entities
GET    /characters?prjNo=123  // List characters in project
POST   /characters           // Create character (prjNo in body)
```

### Response Structure
```typescript
// ✅ Good: Consistent response format
interface ResponseType<TData> {
  data: TData;
  error: boolean;
  code: ResponseCode;
  message: string;
}

interface ListType<TData> {
  list: TData[];
  totalCnt: number;
  pageSize: number;
  page: number;
  totalPage: number;
  isFirst: boolean;
  isLast: boolean;
}
```

### Error Handling
```typescript
// ✅ Good: Structured error responses
{
  "data": null,
  "error": true,
  "code": "VALIDATION_ERROR",
  "message": "Project name is required"
}
```

---

## Database Schema Standards

### Table Naming
```sql
-- ✅ Good: Descriptive, plural, snake_case
projects
traits
abilities
project_traits
char_trait_maps

-- ❌ Bad: Inconsistent or unclear names
proj
trait
ability_map
chartraits
```

### Column Naming
```sql
-- ✅ Good: Consistent naming convention
prjNo        -- Primary key (Table abbreviation + No)
prjNm        -- Name (abbreviation + Nm)
prjDesc      -- Description (abbreviation + Desc)
crtDt        -- Creation date
updtDt       -- Update date
delYn        -- Deletion flag

-- ❌ Bad: Inconsistent patterns
project_id
project_name
project_description
created_at
updated_at
is_deleted
```

### Indexing Strategy
```sql
-- ✅ Good: Strategic indexing
CREATE INDEX idx_projects_name ON projects(prjNm);
CREATE INDEX idx_projects_genre ON projects(genreType);
CREATE INDEX idx_projects_user ON projects(userNo);

-- Composite indexes for common queries
CREATE INDEX idx_char_trait_composite ON char_trait_maps(charNo, traitType, traitNo);
```

---

## File and Directory Organization

### Naming Conventions
```typescript
// ✅ Good: Clear and consistent naming
components/
├── common/
│   ├── AppTitleBar.vue
│   ├── AppLoadingScreen.vue
│   └── ModalDialog.vue
├── forms/
│   ├── ProjectForm.vue
│   ├── CharacterForm.vue
│   └── TraitForm.vue
└── lists/
    ├── Pro
