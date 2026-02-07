# 코드 스타일 가이드 (Code Style Guide) - Fantasy Builder

**최종 업데이트**: 2026-02-07  
**버전**: 1.0.0

---

## 개요 (Overview)

이 가이드는 Fantasy Builder 프로젝트의 일관성, 유지보수성, 협업 효율성을 보장하기 위한 코딩 표준 및 규칙을 수립합니다.

---

## TypeScript 표준 (TypeScript Standards)

### 타입 정의 (Type Definitions)

#### 인터페이스 네이밍
```typescript
// ✅ Good: 서술적이고 목적이 분명함
interface ProjectData {
  prjNo: number;
  prjNm: string;
  genreType?: string;
}

// ❌ Bad: 모호하거나 약어 사용
interface Proj {
  id: number;
  name: string;
  type?: string;
}
```

#### 타입 어노테이션
```typescript
// ✅ Good: 명시적 타입
function createProject(data: ProjectData): Promise<Project> {
  return apiClient.post('/projects', data);
}

// ✅ Good: 명확한 경우 타입 추론 사용
const projects = ref<Project[]>([]);
const isLoading = ref(false);
```

#### Enums 대 Union Types
```typescript
// ✅ 문자열 상수에는 Union Types 사용
type DatabaseMode = 'local' | 'remote';
type ResponseCode = 'SUCCESS' | 'VALIDATION_ERROR' | 'NOT_FOUND';

// ✅ 숫자 또는 복잡한 상수에는 Enums 사용
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}
```

### 에러 처리 (Error Handling)

#### 표준 에러 패턴
```typescript
// ✅ Good: 일관된 에러 처리
async function getProjectList(query: ProjectQuery): Promise<ListResponseType<Project>> {
  try {
    const response = await apiClient.get<ListResponseType<Project>>('/projects', {
      params: query
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw new Error('프로젝트를 불러올 수 없습니다. 다시 시도해주세요.');
  }
}

// ❌ Bad: 조용한 실패 (Silent failures)
async function getProjectList(query: ProjectQuery) {
  try {
    // API call
  } catch (e) {
    // 아무것도 하지 않음
  }
}
```

---

## Vue.js 컴포넌트 표준 (Vue.js Component Standards)

### 컴포넌트 구조 (Component Structure)

#### 파일 구성
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

#### 컴포넌트 네이밍
```typescript
// ✅ Good: 서술적이고 일관성 있음
ProjectListView.vue
ProjectDetailView.vue
CoreRulesSection.vue

// ✅ Good: 명확한 목적
AppLoadingScreen.vue
AppTitleBar.vue

// ❌ Bad: 불분명하거나 약어 사용
ProjList.vue
ProjDet.vue
CoreSec.vue
```

### Props와 Emits

#### 타입 안전성
```vue
<script setup lang="ts">
// ✅ Good: 검증을 포함한 명시적 prop 타이핑
interface Props {
  project: Project;
  isLoading?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: null
});

// ✅ Good: 명시적 emit 타이핑
interface Emits {
  'update:project': [project: Project];
  'delete': [projectId: number];
}

const emit = defineEmits<Emits>();
</script>
```

---

## CSS 및 스타일링 표준 (CSS and Styling Standards)

### Tailwind CSS 규칙

#### 유틸리티 클래스 사용
```vue
<template>
  <!-- ✅ Good: 의미론적 유틸리티 조합 -->
  <div class="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-sm">
    <h2 class="text-lg font-semibold text-gray-900">
      {{ project.prjNm }}
    </h2>
    <p class="text-sm text-gray-600">
      {{ project.prjDesc }}
    </p>
  </div>

  <!-- ❌ Bad: 일관성 없거나 임의적인 스타일링 -->
  <div class="grid grid-cols-1 mt-4 bg-white border-2 border-gray-300 rounded-lg p-2">
    <h3 class="font-bold text-2xl text-blue-500">
      {{ project.prjNm }}
    </h3>
  </div>
</template>
```

#### CVA를 활용한 커스텀 컴포넌트
```typescript
// ✅ Good: 재사용 가능한 컴포넌트 변형(variants)
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

### 반응형 디자인 (Responsive Design)
```vue
<template>
  <!-- ✅ Good: 모바일 우선 반응형 디자인 -->
  <div class="container mx-auto px-4 py-6">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Content -->
    </div>
  </div>
</template>
```

---

## API 개발 표준 (API Development Standards)

### 엔드포인트 네이밍
```typescript
// ✅ Good: RESTful하고 일관성 있음
GET    /projects              // 프로젝트 목록 조회
GET    /projects/:prjNo       // 특정 프로젝트 조회
POST   /projects              // 프로젝트 생성
PATCH  /projects/:prjNo       // 프로젝트 수정
DELETE /projects/:prjNo       // 프로젝트 삭제

// ✅ Good: 프로젝트 범위 엔티티
GET    /characters?prjNo=123  // 프로젝트 내 캐릭터 목록 조회
POST   /characters            // 캐릭터 생성 (body에 prjNo 포함)
```

### 응답 구조
```typescript
// ✅ Good: 일관된 응답 포맷
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

### 에러 처리
```typescript
// ✅ Good: 구조화된 에러 응답
{
  "data": null,
  "error": true,
  "code": "VALIDATION_ERROR",
  "message": "Project name is required"
}
```

---

## 데이터베이스 스키마 표준 (Database Schema Standards)

### 테이블 네이밍
```sql
-- ✅ Good: 서술적, 복수형, snake_case
projects
traits
abilities
project_traits
char_trait_maps

-- ❌ Bad: 일관성 없거나 불분명한 이름
proj
trait
ability_map
chartraits
```

### 컬럼 네이밍
```sql
-- ✅ Good: 일관된 네이밍 규칙
prjNo        -- 기본 키 (테이블 약어 + No)
prjNm        -- 이름 (약어 + Nm)
prjDesc      -- 설명 (약어 + Desc)
crtDt        -- 생성일
updtDt       -- 수정일
delYn        -- 삭제 여부

-- ❌ Bad: 일관성 없는 패턴
project_id
project_name
project_description
created_at
updated_at
is_deleted
```

### 인덱싱 전략
```sql
-- ✅ Good: 전략적 인덱싱
CREATE INDEX idx_projects_name ON projects(prjNm);
CREATE INDEX idx_projects_genre ON projects(genreType);
CREATE INDEX idx_projects_user ON projects(userNo);

-- 일반적인 쿼리를 위한 복합 인덱스
CREATE INDEX idx_char_trait_composite ON char_trait_maps(charNo, traitType, traitNo);
```

---

## 파일 및 디렉토리 구성 (File and Directory Organization)

### 네이밍 규칙
```typescript
// ✅ Good: 명확하고 일관된 네이밍
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
```
