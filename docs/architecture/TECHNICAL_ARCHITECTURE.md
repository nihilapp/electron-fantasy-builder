# Technical Architecture - Fantasy Builder

**Last Updated**: 2026-02-07  
**Version**: 1.0.0

---

## System Architecture Overview

Fantasy Builder uses a **hybrid Electron architecture** with clear separation between the main process (backend) and renderer process (frontend). Communication happens through a combination of HTTP APIs and IPC (Inter-Process Communication).

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Application                    │
├─────────────────────┬───────────────────────────────────────┤
│   Main Process       │         Renderer Process             │
│   (Node.js Backend)  │         (Vue.js Frontend)           │
│                     │                                       │
│ ┌─────────────────┐ │ ┌─────────────────────────────────┐ │
│ │   Hono Server   │ │ │        Vue Application          │ │
│ │   (Port 3456)   │ │ │                                 │ │
│ └─────────────────┘ │ │ ┌─────────────┐ ┌─────────────┐ │ │
│         │           │ │ │  Components │ │   Stores    │ │ │
│         ▼           │ │ └─────────────┘ └─────────────┘ │ │
│ ┌─────────────────┐ │ │ ┌─────────────┐ ┌─────────────┐ │ │
│ │ Drizzle ORM     │ │ │ │    Router   │ │   Utils     │ │ │
│ │ (DB Layer)      │ │ │ └─────────────┘ └─────────────┘ │ │
│ └─────────────────┘ │ └─────────────────────────────────┘ │
└─────────────────────┴───────────────────────────────────────┘
                               │
                               ▼ HTTP API (localhost:3456)
                    ┌─────────────────────────────────┐
                    │         Database Layer          │
                    │  ┌─────────┐    ┌─────────────┐ │
                    │  │ SQLite  │    │ PostgreSQL  │ │
                    │  │ (Local) │    │ (Remote)    │ │
                    │  └─────────┘    └─────────────┘ │
                    └─────────────────────────────────┘
```

---

## Core Components

### 1. Main Process (Backend)

#### Hono HTTP Server
- **Purpose**: Internal API server for main-renderer communication
- **Port**: 3456 (configurable)
- **Framework**: Hono.js with TypeScript
- **Features**:
  - RESTful API endpoints
  - CORS support for renderer process
  - Global exception handling
  - Request/response logging

#### Database Layer
- **ORM**: Drizzle ORM with TypeScript
- **Dual Support**: 
  - **Local**: SQLite via better-sqlite3
  - **Remote**: PostgreSQL via pg
- **Schema Management**: Automated migrations with version control
- **Connection Management**: Context-based DB switching

#### IPC Handlers
- **Purpose**: Configuration and system-level operations
- **Functions**:
  - Database mode switching (local/remote)
  - Application settings management
  - Window control operations
  - System information access

### 2. Renderer Process (Frontend)

#### Vue.js Application
- **Framework**: Vue 3 with Composition API
- **Architecture**: Single Page Application (SPA)
- **Routing**: Vue Router with hash history
- **State Management**: Pinia stores
- **Build Tool**: Vite with electron-vite

#### Component System
- **Design System**: Tailwind CSS v4 with custom components
- **Icon System**: Unplugin-icons with multiple icon sets
- **Auto-imports**: Vue, Pinia, and utilities auto-imported
- **Component Auto-registration**: Components auto-detected and imported

#### API Client
- **HTTP Client**: Axios-based API communication
- **Type Safety**: Full TypeScript integration
- **Error Handling**: Centralized error processing
- **Response Structure**: Standardized ResponseType format

### 3. Preload Scripts (Security Bridge)

#### Context Isolation
- **Security**: Node integration disabled, context isolation enabled
- **API Exposure**: Controlled exposure of main process APIs
- **Type Safety**: Full TypeScript definitions for all exposed APIs
- **Validation**: Runtime validation for all IPC communications

---

## Data Flow Architecture

### Request-Response Cycle

1. User Action (Vue Component)
2. Store Action (Pinia)
3. API Client (Axios)
4. HTTP Request (localhost:3456)
5. Hono Route Handler
6. Service Layer (Business Logic)
7. Database Operation (Drizzle ORM)
8. Response Processing
9. Frontend State Update
10. UI Re-render

### Database Mode Switching

Configuration-based DB selection with runtime context switching via headers or query parameters.

---

## Database Architecture

### Schema Design Principles

#### 1. Entity-Relationship Model
- **Projects**: Central entity, contains all world-building data
- **Global Entities**: Traits, abilities (shared across projects)
- **Project Entities**: Characters, creatures, locations (project-specific)
- **Mapping Tables**: Many-to-many relationships between entities

#### 2. Common Fields (CommonEntity)
All tables include standardized fields for auditing and soft deletion:
- useYn, shrnYn, delYn (status flags)
- crtNo, crtDt, updtNo, updtDt (creation/update tracking)
- delNo, delDt (deletion tracking)

#### 3. Project Scoping
- **Local DB**: Single-user mode, no user management tables
- **Remote DB**: Multi-user support with authentication and ownership

---

## API Architecture

### Design Principles

#### 1. Resource-Based Endpoints
RESTful endpoints following pattern: GET/POST/PATCH/DELETE per resource

#### 2. Project Scoping via Query Parameters
Project-scoped data passed via query parameters or request body

#### 3. Standardized Response Format
All APIs return HTTP 200 with standardized ResponseType wrapper containing data, error status, codes, and messages.

### Controller-Service-Repository Pattern
Three-layer architecture:
- Controllers: HTTP request handling
- Services: Business logic and validation
- Repositories: Database operations via Drizzle

---

## Frontend Architecture

### Vue.js Component Structure

#### 1. View Components (Pages)
Location: src/renderer/views/
Route-level components for major features

#### 2. Feature Components
Location: src/renderer/views/[feature]/
Feature-specific components

#### 3. Shared Components
Location: src/renderer/components/
Reusable UI components

### State Management Pattern
Pinia stores with Composition API:
- State management with refs
- Computed getters
- Async actions for API calls

### Routing Architecture
Vue Router with nested routes for project detail views

---

## Build and Development Architecture

### electron-vite Configuration
Separate configurations for main, preload, and renderer processes with path aliases and external dependencies.

### Development Workflow
1. Install dependencies
2. Rebuild native modules (SQLite)
3. Start development with hot reload

### Build Process
Production builds create optimized bundles for all processes

---

## Security Architecture

### 1. Context Isolation
- Node integration disabled in renderer
- Context isolation enabled
- Controlled API exposure via preload scripts

### 2. API Security
- CORS restrictions
- Zod schema validation
- SQL injection protection via Drizzle ORM

### 3. Data Security
- Local SQLite encryption
- HTTPS for remote PostgreSQL
- Complete audit trail

---

## Performance Considerations

### 1. Database Optimization
- Strategic indexing
- Connection pooling
- Pagination for large datasets

### 2. Frontend Performance
- Code splitting
- Component lazy loading
- Virtual scrolling

### 3. Memory Management
- Proper cleanup in stores
- Event listener cleanup
- Database connection lifecycle management

---

## Monitoring and Debugging

### 1. Development Tools
- Vue DevTools
- Electron DevTools
- Database query logging

### 2. Error Handling
- Global exception handling
- User-friendly error messages
- Structured logging

### 3. Performance Monitoring
- API response time tracking
- Database performance monitoring
- Memory usage tracking

---

*This technical architecture document provides a comprehensive overview of the Fantasy Builder application's internal design. For specific implementation details, refer to the individual component documentation.*
