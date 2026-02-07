# Development Setup Guide - Fantasy Builder

**Last Updated**: 2026-02-07  
**Version**: 1.0.0

---

## Prerequisites

### Required Software
- **Node.js**: Version 18 or higher
- **Package Manager**: pnpm (recommended) or npm
- **Git**: For version control
- **Code Editor**: VS Code (recommended) with extensions

### VS Code Extensions (Recommended)
- **Vue Language Features (Volar)**
- **TypeScript Vue Plugin (Volar)**
- **ESLint**
- **Prettier**
- **Tailwind CSS IntelliSense**
- **Drizzle ORM**
- **GitLens**

---

## Initial Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd electron-fantasy-builder
```

### 2. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install
```

### 3. Rebuild Native Dependencies
The application uses `better-sqlite3` which requires rebuilding for your system:

```bash
pnpm run rebuild
```

### 4. Environment Setup
Create environment variables if needed (see Configuration section).

---

## Development Workflow

### Starting Development Server
```bash
pnpm run dev
```

This command:
1. Rebuilds native dependencies (SQLite)
2. Starts the Electron main process
3. Launches the Hono API server (port 3456)
4. Starts the Vite dev server for the renderer process
5. Enables hot reload for frontend changes
6. Auto-restarts main process on backend changes

### Development Server URLs
- **API Server**: http://localhost:3456
- **Renderer Dev Server**: http://127.0.0.1:3000
- **Electron Window**: Opens automatically

### File Watching and Hot Reload
- **Frontend (renderer)**: Hot reload enabled for Vue components, styles, and TypeScript files
- **Backend (main)**: Auto-restart on file changes
- **Database**: Manual restart required for schema changes

---

## Project Structure

### Directory Overview
```
electron-fantasy-builder/
├── src/
│   ├── main/              # Electron main process
│   │   ├── api/           # API client functions
│   │   ├── server/        # Hono HTTP server
│   │   │   ├── controller/ # Route handlers
│   │   │   ├── service/    # Business logic
│   │   │   ├── schema/     # Database schemas
│   │   │   └── db/         # Database connections
│   │   ├── window/        # Window management
│   │   ├── ipc/           # IPC handlers
│   │   └── index.ts       # Main process entry
│   ├── renderer/          # Vue.js frontend
│   │   ├── views/         # Page components
│   │   │   └── project-detail/ # Feature components
│   │   ├── stores/        # Pinia stores
│   │   ├── components/    # Reusable UI components
│   │   ├── utils/         # Frontend utilities
│   │   ├── router/        # Vue Router configuration
│   │   └── index.ts       # Frontend entry
│   ├── preload/           # Preload scripts
│   ├── types/             # TypeScript types
│   ├── zod-schema/        # Runtime validation schemas
│   ├── config/             # Application configuration
│   └── constants/         # Constants
├── docs/                  # Documentation
├── PRD/                   # Product requirements
└── data/                  # Local database files
```

### Key Configuration Files
- `electron.vite.config.ts` - Build configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `drizzle.config.*.ts` - Database configuration

---

## Database Management

### Database Modes
The application supports two database modes configured in `src/config/app.json`:

#### Local Mode (Default)
- **Database**: SQLite
- **Location**: `./src/data/app.db`
- **Use Case**: Offline single-user development
- **Migrations**: `src/drizzle/local/`

#### Remote Mode
- **Database**: PostgreSQL
- **Use Case**: Multi-user online features
- **Migrations**: `src/drizzle/remote/`

### Database Migrations

#### Generate New Migration
```bash
# Local database
pnpm run db:generate

# Remote database
pnpm run db:generate:remote
```

#### Run Migrations
```bash
# Local database
pnpm run db:migrate

# Remote database
pnpm run db:migrate:remote
```

### Schema Development
1. Define schemas in `src/main/server/schema/[mode]/`
2. Generate migration files
3. Run migrations to apply changes
4. Update Zod schemas in `src/zod-schema/`

---

## API Development

### Adding New Endpoints

#### 1. Database Schema
Add tables to appropriate schema file:
```typescript
// src/main/server/schema/local/newEntity.table.ts
export const newEntityTable = sqliteTable('new_entity', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  // ... other fields
  ...commonColumns, // Include common fields
});
```

#### 2. Zod Schema
Create validation schema:
```typescript
// src/zod-schema/newEntity.schema.ts
export const newEntitySchema = z.object({
  id: z.number().int().nullable().optional(),
  name: z.string().nullable().optional(),
}).extend(commonSchema.shape);
```

#### 3. Service Layer
Create business logic:
```typescript
// src/main/server/service/newEntityService.ts
export class NewEntityService {
  async getNewEntityList(query: any): Promise<ListResponseType<NewEntity>> {
    // Business logic here
  }
}
```

#### 4. Controller Layer
Create route handlers:
```typescript
// src/main/server/controller/newEntityController.ts
export const newEntityController = {
  getNewEntityList: async (c: Context) => {
    const result = await newEntityService.getNewEntityList(c.req.query());
    return c.json(result);
  },
};
```

#### 5. API Client
Create frontend API functions:
```typescript
// src/main/api/apiNewEntity.ts
export async function apiGetNewEntityList(query: any) {
  return await apiClient.get('/new-entity', { params: query });
}
```

#### 6. Route Registration
Register routes in controller app:
```typescript
// src/main/server/controller/index.ts
app.route('/new-entity', createNewEntityApp());
```

### API Testing
Use browser dev tools, Postman, or curl:
```bash
curl -X GET "http://localhost:3456/new-entity" \
     -H "Content-Type: application/json"
```

---

## Frontend Development

### Component Development

#### Vue Component Structure
Follow the established component structure:
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

### State Management

#### Pinia Store Pattern
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

### Routing

#### Adding New Routes
```typescript
// src/renderer/router/index.ts
{
  path: '/new-feature',
  name: 'new-feature',
  component: NewFeatureView,
  props: true,
}
```

### Styling

#### Tailwind CSS Usage
- Use utility classes for styling
- Follow established design tokens
- Use component variants with `class-variance-authority`
- Maintain responsive design patterns

#### Custom 
