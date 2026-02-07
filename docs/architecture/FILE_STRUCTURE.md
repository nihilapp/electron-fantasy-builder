# File Structure Guide - Fantasy Builder

**Last Updated**: 2026-02-07  
**Version**: 1.0.0

---

## Overview

This document provides a comprehensive overview of the Fantasy Builder project structure, explaining the purpose and organization of each directory and key file.

---

## Root Directory Structure

```
electron-fantasy-builder/
├── src/                    # All source code
├── docs/                   # Documentation files
├── PRD/                    # Product Requirements Document
├── out/                    # Build output directory
├── data/                   # Local database files
├── resources/              # Application resources (icons, etc.)
├── scripts/                # Build and utility scripts
├── references/             # Reference files and documentation
├── package.json            # Project dependencies and scripts
├── pnpm-lock.yaml         # Dependency lock file
├── electron.vite.config.ts # Build configuration
├── tsconfig.json          # TypeScript configuration
├── drizzle.config.*.ts    # Database configuration
├── eslint.config.mjs      # ESLint configuration
└── README.md              # Project README
```

### Root Configuration Files

#### `package.json`
- **Purpose**: Project metadata, dependencies, and npm scripts
- **Key Sections**:
  - `name`, `version`: Project identification
  - `main`: Electron main process entry point
  - `scripts`: Development and build commands
  - `dependencies`: Runtime dependencies
  - `devDependencies`: Development-only dependencies

#### `electron.vite.config.ts`
- **Purpose**: Vite configuration for Electron's three processes
- **Sections**: main, preload, renderer configurations
- **Features**: Path aliases, external dependencies, plugins

#### `tsconfig.json`
- **Purpose**: TypeScript compiler configuration
- **Settings**: Path mappings, compiler options, target configuration

---

## Source Code Structure (`src/`)

```
src/
├── main/                   # Electron main process (Node.js backend)
│   ├── api/               # API client functions
│   ├── server/            # Hono HTTP server
│   │   ├── controller/    # Route handlers
│   │   ├── service/       # Business logic layer
│   │   ├── schema/        # Database schema definitions
│   │   │   ├── local/     # SQLite schemas
│   │   │   └── remote/    # PostgreSQL schemas
│   │   └── db/            # Database connection management
│   ├── window/            # Window management
│   ├── ipc/               # IPC handlers
│   ├── logger.ts          # Logging configuration
│   └── index.ts           # Main process entry point
├── renderer/             # Vue.js frontend
│   ├── views/             # Page components
│   │   └── project-detail/ # Feature-specific components
│   ├── stores/            # Pinia state management
│   ├── components/        # Reusable UI components
│   │   └── common/        # Common UI components
│   ├── utils/             # Frontend utilities
│   ├── router/            # Vue Router configuration
│   ├── api/               # Frontend API client
│   ├── types/             # Frontend TypeScript types
│   ├── data/              # Static data and generated files
│   ├── composables/       # Vue composables
│   └── index.ts           # Frontend entry point
├── preload/               # Preload scripts (security bridge)
│   └── index.ts           # Preload script entry
├── types/                 # Shared TypeScript types
├── zod-schema/            # Runtime validation schemas
├── config/                # Application configuration
├── constants/             # Application constants
└── drizzle/               # Database migrations
    ├── local/             # SQLite migrations
    └── remote/            # PostgreSQL migrations
```

---

## Main Process (`src/main/`)

### Entry Point: `index.ts`
- **Purpose**: Main process initialization and lifecycle management
- **Responsibilities**:
  - Database context initialization
  - IPC handler setup
  - Hono server startup
  - Window creation and management
  - Application event handling

### API Layer (`api/`)
```typescript
// API client functions for frontend communication
├── apiProject.ts          # Project-related API functions
├── apiTrait.ts            # Trait management APIs
├── apiAbility.ts          # Ability management APIs
├── apiProjectTrait.ts     # Project trait APIs
├── apiProjectAbility.ts   # Project ability APIs
├── apiCoreRule.ts         # Core rule APIs
├── apiHealth.ts           # Health check API
└── index.ts               # API module aggregation
```

### Server Layer (`server/`)

#### Controllers (`controller/`)
```typescript
// HTTP request handlers
├── projectController.ts   # Project CRUD endpoints
├── traitController.ts     # Trait management endpoints
├── abilityController.ts   # Ability management endpoints
├── coreRuleController.ts  # Core rule endpoints
└── index.ts              # Controller aggregation
```

#### Services (`service/`)
```typescript
// Business logic and data processing
├── projectService.ts      # Project business logic
├── traitService.ts        # Trait business logic
├── abilityService.ts      # Ability business logic
├── coreRuleService.ts     # Core rule business logic
└── index.ts               # Service aggregation
```

#### Schema (`schema/`)
```typescript
// Database table definitions
├── local/                 # SQLite table schemas
│   ├── common.columns.ts  # Common column definitions
│   ├── projects.table.ts   # Projects table
│   ├── traits.table.ts    # Traits table
│   ├── abilities.table.ts # Abilities table
│   └── ...                # Other local tables
└── remote/                # PostgreSQL table schemas
    ├── common.columns.ts  # Common columns
    ├── users.table.ts     # Users table (remote only)
    └── ...                # Other remote tables
```

#### Database (`db/`)
```typescript
// Database connection and context management
├── index.ts               # Database initialization
├── localDb.ts            # Local SQLite connection
├── remoteDb.ts           # Remote PostgreSQL connection
└── context.ts            # Database context switching
```

### Window Management (`window/`)
```typescript
├── index.ts              # Window management entry
├── mainWindow.ts         # Main application window
└── tray.ts              # System tray integration
```

### IPC (`ipc/`)
```typescript
// Inter-process communication handlers
├── ipcWindowControl.ts   # Window control IPC
└── index.ts              # IPC handler aggregation
```

---

## Renderer Process (`src/renderer/`)

### Entry Point: `index.ts`
- **Purpose**: Vue application initialization
- **Responsibilities**:
  - Vue app creation
  - Router setup
  - Store registration
  - Global components registration

### Views (`views/`)
```vue
# Page-level components for different routes
├── MainView.vue           # Application homepage
├── ProjectListView.vue    # Project management
├── ProjectDetailView.vue   # Project detail container
├── CreateProjectView.vue   # Project creation
└── project-detail/        # Nested project detail views
    ├── OverviewSection.vue      # Project overview
    ├── CoreRulesSection.vue     # Core rules management
    ├── CoreRuleDetailSection.vue # Core rule detail
    ├── CoreRuleAddSection.vue    # Core rule creation
    ├── TraitsAbilitiesSection.vue # Traits & abilities
    └── PlaceholderSection.vue     # Placeholder for unimplemented features
```

### Stores (`stores/`)
```typescript
// Pinia state management
├── projectStore.ts        # Project state management
├── traitStore.ts          # Trait state management
├── abilityStore.ts        # Ability state management
└── [other]Store.ts        # Feature-specific stores
```

### Components (`components/`)
```vue
# Reusable UI components
├── common/                # Shared UI components
│   ├── AppTitleBar.vue    # Custom title bar
│   ├── AppLoadingScreen.vue # Loading screen
│   └── [other]Common.vue  # Other common components
├── forms/                 # Form components
├── lists/                 # List display components
└── [feature]/             # Feature-specific components
```

### Router (`router/`)
`
