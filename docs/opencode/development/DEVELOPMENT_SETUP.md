# 개발 환경 설정 가이드 (Development Setup Guide) - Fantasy Builder

**최종 업데이트**: 2026-02-07  
**버전**: 1.0.0

---

## 사전 요구사항 (Prerequisites)

### 필수 소프트웨어
- **Node.js**: 버전 18 이상
- **패키지 매니저**: pnpm (워크스페이스 지원 권장) 또는 npm
- **Git**: 버전 관리를 위해 필요
- **코드 에디터**: VS Code (확장 프로그램 포함 권장)

### VS Code 권장 확장 프로그램
- **Vue Language Features (Volar)**
- **TypeScript Vue Plugin (Volar)**
- **ESLint**
- **Prettier**
- **Tailwind CSS IntelliSense**
- **Drizzle ORM**
- **GitLens**

---

## 초기 설정 (Initial Setup)

### 1. 저장소 클론 (Clone the Repository)
```bash
git clone <repository-url>
cd electron-fantasy-builder
```

### 2. 의존성 설치 (Install Dependencies)
```bash
# pnpm 사용 (권장)
pnpm install

# npm 사용
npm install
```

### 3. 네이티브 의존성 리빌드 (Rebuild Native Dependencies)
애플리케이션은 시스템에 맞게 리빌드해야 하는 `better-sqlite3`를 사용합니다:

```bash
pnpm run rebuild
```

### 4. 환경 변수 설정 (Environment Setup)
필요한 경우 환경 변수를 생성합니다 (설정 섹션 참조).

---

## 개발 워크플로우 (Development Workflow)

### 개발 서버 시작 (Starting Development Server)
```bash
pnpm run dev
```

이 명령어는 다음 작업을 수행합니다:
1. 네이티브 의존성(SQLite) 리빌드
2. Electron 메인 프로세스 시작
3. Hono API 서버 실행 (포트 3456)
4. 렌더러 프로세스를 위한 Vite 개발 서버 시작
5. 프론트엔드 변경 사항에 대한 핫 리로드 활성화
6. 백엔드 변경 사항 발생 시 메인 프로세스 자동 재시작

### 개발 서버 URL
- **API 서버**: http://localhost:3456
- **렌더러 개발 서버**: http://127.0.0.1:3000
- **Electron 윈도우**: 자동으로 열림

### 파일 감지 및 핫 리로드
- **프론트엔드 (renderer)**: Vue 컴포넌트, 스타일, TypeScript 파일에 대해 핫 리로드 활성화
- **백엔드 (main)**: 파일 변경 시 자동 재시작
- **데이터베이스**: 스키마 변경 시 수동 재시작 필요

---

## 프로젝트 구조 (Project Structure)

### 디렉토리 개요
```
electron-fantasy-builder/
├── src/
│   ├── main/              # Electron 메인 프로세스
│   │   ├── api/           # API 클라이언트 함수
│   │   ├── server/        # Hono HTTP 서버
│   │   │   ├── controller/ # 라우트 핸들러
│   │   │   ├── service/    # 비즈니스 로직
│   │   │   ├── schema/     # 데이터베이스 스키마
│   │   │   └── db/         # 데이터베이스 연결
│   │   ├── window/        # 윈도우 관리
│   │   ├── ipc/           # IPC 핸들러
│   │   └── index.ts       # 메인 프로세스 진입점
│   ├── renderer/          # Vue.js 프론트엔드
│   │   ├── views/         # 페이지 컴포넌트
│   │   │   └── project-detail/ # 기능별 컴포넌트
│   │   ├── stores/        # Pinia 스토어
│   │   ├── components/    # 재사용 가능한 UI 컴포넌트
│   │   ├── utils/         # 프론트엔드 유틸리티
│   │   ├── router/        # Vue Router 설정
│   │   └── index.ts       # 프론트엔드 진입점
│   ├── preload/           # Preload 스크립트
│   ├── types/             # TypeScript 타입
│   ├── zod-schema/        # 런타임 검증 스키마
│   ├── config/             # 애플리케이션 설정
│   └── constants/         # 상수
├── docs/                  # 문서
├── PRD/                   # 제품 요구사항
└── data/                  # 로컬 데이터베이스 파일
```

### 주요 설정 파일
- `electron.vite.config.ts` - 빌드 설정
- `package.json` - 의존성 및 스크립트
- `tsconfig.json` - TypeScript 설정
- `tailwind.config.js` - Tailwind CSS 설정
- `drizzle.config.*.ts` - 데이터베이스 설정

---

## 데이터베이스 관리 (Database Management)

### 데이터베이스 모드
애플리케이션은 `src/config/app.json`에서 설정된 두 가지 데이터베이스 모드를 지원합니다:

#### 로컬 모드 (기본값)
- **데이터베이스**: SQLite
- **위치**: `./src/data/app.db`
- **사용 사례**: 오프라인 단일 사용자 개발
- **마이그레이션**: `src/drizzle/local/`

#### 원격 모드
- **데이터베이스**: PostgreSQL
- **사용 사례**: 다중 사용자 온라인 기능
- **마이그레이션**: `src/drizzle/remote/`

### 데이터베이스 마이그레이션

#### 새 마이그레이션 생성
```bash
# 로컬 데이터베이스
pnpm run db:generate

# 원격 데이터베이스
pnpm run db:generate:remote
```

#### 마이그레이션 실행
```bash
# 로컬 데이터베이스
pnpm run db:migrate

# 원격 데이터베이스
pnpm run db:migrate:remote
```

### 스키마 개발
1. `src/main/server/schema/[mode]/`에 스키마 정의
2. 마이그레이션 파일 생성
3. 마이그레이션 실행하여 변경 사항 적용
4. `src/zod-schema/`의 Zod 스키마 업데이트

---

## API 개발 (API Development)

### 새로운 엔드포인트 추가

#### 1. 데이터베이스 스키마
적절한 스키마 파일에 테이블 추가:
```typescript
// src/main/server/schema/local/newEntity.table.ts
export const newEntityTable = sqliteTable('new_entity', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  // ... 기타 필드
  ...commonColumns, // 공통 필드 포함
});
```

#### 2. Zod 스키마
검증 스키마 생성:
```typescript
// src/zod-schema/newEntity.schema.ts
export const newEntitySchema = z.object({
  id: z.number().int().nullable().optional(),
  name: z.string().nullable().optional(),
}).extend(commonSchema.shape);
```

#### 3. 서비스 계층
비즈니스 로직 생성:
```typescript
// src/main/server/service/newEntityService.ts
export class NewEntityService {
  async getNewEntityList(query: any): Promise<ListResponseType<NewEntity>> {
    // 비즈니스 로직
  }
}
```

#### 4. 컨트롤러 계층
라우트 핸들러 생성:
```typescript
// src/main/server/controller/newEntityController.ts
export const newEntityController = {
  getNewEntityList: async (c: Context) => {
    const result = await newEntityService.getNewEntityList(c.req.query());
    return c.json(result);
  },
};
```

#### 5. API 클라이언트
프론트엔드 API 함수 생성:
```typescript
// src/main/api/apiNewEntity.ts
export async function apiGetNewEntityList(query: any) {
  return await apiClient.get('/new-entity', { params: query });
}
```

#### 6. 라우트 등록
컨트롤러 앱에 라우트 등록:
```typescript
// src/main/server/controller/index.ts
app.route('/new-entity', createNewEntityApp());
```

### API 테스트
브라우저 개발자 도구, Postman, 또는 curl 사용:
```bash
curl -X GET "http://localhost:3456/new-entity" \
     -H "Content-Type: application/json"
```

---

## 프론트엔드 개발 (Frontend Development)

### 컴포넌트 개발

#### Vue 컴포넌트 구조
확립된 컴포넌트 구조를 따릅니다:
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
```

### 상태 관리

#### Pinia 스토어 패턴
```typescript
// src/renderer/stores/newStore.ts
export const useNewStore = defineStore('new', () => {
  // State
  const items = ref<NewItem[]>([]);
  const current = ref<NewItem | null>(null);
  
  // Getters
  const hasItems = computed(() => items.value.length > 0);
  
  // Actions
  async function fetchItems() {
    const response = await apiGetNewItemList();
    items.value = response.data.list;
  }
  
  return { items, current, hasItems, fetchItems };
});
```

### 라우팅

#### 새 라우트 추가
```typescript
// src/renderer/router/index.ts
{
  path: '/new-feature',
  name: 'new-feature',
  component: NewFeatureView,
  props: true,
}
```

### 스타일링

#### Tailwind CSS 사용
- 스타일링에 유틸리티 클래스 사용
- 확립된 디자인 토큰 준수
- `class-variance-authority`를 사용한 컴포넌트 변형(variants) 사용
- 반응형 디자인 패턴 유지
