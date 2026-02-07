# Development Workflow - Fantasy Builder

**Last Updated**: 2026-02-07  
**Version**: 1.0.0  
**Analysis Date**: 2026-02-07

---

## Overview

This document provides a comprehensive guide to the development workflow, build process, and best practices for the Fantasy Builder project.

---

## Development Environment Setup

### Prerequisites

#### Required Software
- **Node.js**: Version 18 or higher
- **Package Manager**: pnpm (recommended for workspace support)
- **Git**: For version control
- **IDE**: VS Code (recommended with extensions)

#### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json"
  ]
}
```

### Initial Setup

#### 1. Repository Cloning
```bash
git clone <repository-url>
cd electron-fantasy-builder
```

#### 2. Dependency Installation
```bash
# Install all dependencies
pnpm install

# Rebuild native modules (SQLite)
pnpm run rebuild
```

#### 3. Database Initialization
```bash
# Generate local database migrations
pnpm db:generate

# Run database migrations
pnpm db:migrate
```

#### 4. Environment Configuration
```bash
# Copy environment configuration (if needed)
cp .env.example .env
```

---

## Development Workflow

### Daily Development Cycle

#### 1. Start Development Server
```bash
# Start all processes with hot reload
pnpm run dev
```

This command:
- Rebuilds native SQLite modules
- Builds all three Electron processes
- Starts the Hono API server
- Launches the Electron app with hot reload
- Opens renderer development tools

#### 2. Development Mode Features

**Hot Reload Configuration**
- **Main Process**: Automatic restart on file changes
- **Preload Scripts**: Rebuild and reload on changes
- **Renderer Process**: Vite HMR for instant UI updates

**Development Tools Access**
- **Renderer DevTools**: Open automatically in development
- **Main Process Debugging**: Use VS Code launch configuration
- **Database Browser**: Use SQLite browser for local DB inspection

#### 3. Code Development Process

**Feature Development Pattern**
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Implement following the architecture:
#    - Define Zod schemas first
#    - Create database migrations
#    - Implement backend API (Controller → Service → Repository)
#    - Create frontend UI (Store → Component)
#    - Add tests and documentation

# 3. Commit with conventional commits
git commit -m "feat: add new feature description"

# 4. Push and create pull request
git push origin feature/your-feature-name
```

---

## Build System Analysis

### electron-vite Configuration

#### Multi-Process Build Configuration
```typescript
// electron.vite.config.ts
export default defineConfig({
  main: {
    // Main process (Node.js backend)
    build: {
      externalizeDeps: true,  // Don't bundle Node.js modules
      rollupOptions: {
        input: resolve(__dirname, 'src/main/index.ts'),
      },
    },
  },
  preload: {
    // Preload scripts (security bridge)
    build: {
      externalizeDeps: true,
      rollupOptions: {
        input: resolve(__dirname, 'src/preload/index.ts'),
      },
    },
  },
  renderer: {
    // Renderer process (Vue.js frontend)
    root: 'src/renderer',
    plugins: [
      vue(),
      tailwindcss(),
      AutoImport(/* ... */),
      Components(/* ... */),
      Icons(/* ... */),
    ],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'src/renderer/index.html'),
      },
    },
  },
});
```

#### Path Aliases Strategy
```typescript
// Comprehensive path mapping for clean imports
resolve: {
  alias: {
    '~': resolve(__dirname, 'src/renderer'),           // Frontend shortcuts
    '@main': resolve(__dirname, 'src/main'),           // Backend shortcuts
    '@preload': resolve(__dirname, 'src/preload'),       // Preload shortcuts
    '@config': resolve(__dirname, 'src/config'),        // Configuration
    '@app-types': resolve(__dirname, 'src/types'),     // Shared types
    '@zod-schema': resolve(__dirname, 'src/zod-schema'), // Validation schemas
    // ... other aliases
  },
}
```

### Build Commands Analysis

#### Development Commands
```bash
# Full development setup
pnpm run dev
# → pnpm run rebuild && electron-vite build && electron-vite dev

# Native module rebuilding
pnpm run rebuild
# → electron-rebuild -f -w better-sqlite3

# Icon name type generation
pnpm run generate:icon-name-type
# → node scripts/generate-icon-name-type.mjs
```

#### Production Commands
```bash
# Build for production
pnpm run build
# → electron-vite build (all processes)

# Preview production build
pnpm run preview
# → electron-vite preview
```

#### Database Commands
```bash
# Generate local migrations
pnpm db:generate
# → drizzle-kit generate --config=drizzle.config.local.ts

# Run local migrations
pnpm db:migrate
# → drizzle-kit migrate --config=drizzle.config.local.ts

# Generate remote migrations
pnpm db:generate:remote
# → drizzle-kit generate --config=drizzle.config.remote.ts
```

---

## Code Quality and Standards

### ESLint Configuration

#### Multi-File Configuration
```javascript
// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config([
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  ...vue.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ['src/main/**/*.ts', 'src/preload/**/*.ts'],
    languageOptions: {
      globals: {
        NodeJS: true,
      },
    },
  },
  {
    files: ['src/renderer/**/*.ts', 'src/renderer/**/*.vue'],
    languageOptions: {
      globals: {
        window: true,
        document: true,
      },
    },
  },
  // ... other configurations
]);
```

### Code Style Standards

#### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "~": ["./src/renderer"],
      "@main": ["./src/main"],
      "@preload": ["./src/preload"],
      // ... other path mappings
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ],
  "exclude": [
    "node_modules",
    "out",
    "dist"
  ]
}
```

---

## Testing Strategy

### Test Structure

#### Unit Tests
```bash
# Run unit tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

#### Integration Tests
```bash
# Run API integration tests
pnpm test:integration

# Run E2E tests
pnpm test:e2e
```

### Test File Organization
```
src/
├── main/
│   ├── server/
│   │   ├── service/
│   │   │   ├── projectService.test.ts
│   │   │   └── traitService.test.ts
│   │   └── controller/
│   │       ├── projectController.test.ts
│   │       └── traitController.test.ts
└── renderer/
    ├── stores/
    │   ├── projectStore.test.ts
    │   └── traitStore.test.ts
    └── components/
        ├── ProjectCard.test.ts
        └── TraitForm.test.ts
```

---

## Database Development Workflow

### Migration Management

#### Schema Development Process
```bash
# 1. Modify schema files
# src/main/server/schema/local/

# 2. Generate migration
pnpm db:generate

# 3. Review generated migration
# src/drizzle/local/

# 4. Apply migration
pnpm db:migrate

# 5. Test database operations
```

#### Migration File Structure
```typescript
// src
