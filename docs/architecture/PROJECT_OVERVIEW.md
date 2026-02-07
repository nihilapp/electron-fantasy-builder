# Project Overview - Fantasy Builder

**Last Updated**: 2026-02-07  
**Version**: 1.0.0  
**Status**: Active Development

---

## What is Fantasy Builder?

Fantasy Builder is a **desktop World Building Tool** designed for creative professionals including writers, game designers, comic artists, and scenario writers. It provides a systematic approach to organizing and documenting fictional worlds, characters, and settings in a project-based structure.

### Core Purpose
- **Systematic World Building**: Organize fictional settings, characters, and lore in a structured manner
- **Project-Based Management**: Each creative work (novel, game, comic, etc.) gets its own dedicated project space
- **Character & Entity Management**: Manage traits, abilities, and relationships between characters, creatures, organizations, and locations
- **Offline-First Approach**: Primary functionality works without internet, with optional online features

### Target Audience
| User Type | Primary Use Case |
|-----------|------------------|
| **Writers** | Novel character profiles, world-building, plot organization |
| **Game Designers** | Character stats, racial traits, skill systems, faction relationships |
| **Comic Artists** | Character designs, background settings, story timelines |
| **Scenario Writers** | Character relationships, location details, event sequences |

---

## Key Features

### 1. Project Management
- **Independent Project Spaces**: Each work gets its own isolated environment
- **Project Metadata**: Genre, description, cover images, version tracking
- **Quick Navigation**: Fast switching between projects

### 2. Traits & Abilities System
- **Global Pool**: Reusable traits and abilities across multiple projects
- **Project-Specific**: Custom traits and abilities unique to each project
- **Categorization**: Organized by type, application targets, and relationships
- **Conflict Resolution**: Handle contradictory traits and abilities

### 3. Entity Management
- **Characters**: Detailed character profiles with traits, abilities, and relationships
- **Creatures/Races**: Species and creature management
- **Organizations**: Factions, guilds, companies, and groups
- **Locations**: Regions, nations, and specific places
- **Items**: Weapons, artifacts, and significant objects
- **Events**: Historical events and timeline management
- **Lore**: Myths, legends, and background stories

### 4. Relationship System
- **Entity Connections**: Link characters to organizations, locations to nations, etc.
- **Visual Navigation**: Explore relationships through interconnected entities
- **Relationship Types**: Define different kinds of connections (family, employment, alliance, etc.)

---

## Technical Architecture Overview

### Application Type
- **Electron Desktop Application**: Cross-platform (Windows, macOS, Linux)
- **Hybrid Architecture**: Main process (Node.js) + Renderer process (Vue.js)
- **Internal API**: Hono-based HTTP server for main-renderer communication

### Technology Stack
- **Frontend**: Vue 3 (Composition API), TypeScript, Tailwind CSS v4
- **Backend**: Hono (HTTP API), Drizzle ORM
- **Database**: SQLite (local) with PostgreSQL support (remote)
- **Build System**: electron-vite, pnpm package manager
- **State Management**: Pinia stores
- **Validation**: Zod schemas for runtime type checking

### Data Architecture
- **Dual Database Support**: Local SQLite for offline use, remote PostgreSQL for online features
- **Schema-Driven**: Drizzle ORM with TypeScript-first database design
- **Soft Deletes**: Data preservation with deletion flags
- **Audit Trail**: Creation/modification tracking for all entities

---

## Current Implementation Status

### ✅ Completed Features
- **Project CRUD Operations**: Create, read, update, delete projects
- **Core Rules Management**: Basic world-building rules and settings
- **Database Architecture**: Complete schema with local and remote support
- **API Layer**: RESTful endpoints for all major entities
- **Basic UI Framework**: Vue components with Tailwind styling
- **Theme System**: Dark/light mode foundation

### 🚧 In Progress
- **Traits & Abilities UI**: Backend ready, frontend implementation needed
- **Entity Management UI**: Characters, creatures, organizations, etc.
- **Relationship Visualization**: Entity connection display
- **Search & Filtering**: Advanced entity discovery
- **Import/Export**: Data portability features

### 📋 Planned Features
- **User Authentication**: Account system for online features
- **Collaboration**: Multi-user project support
- **Media Management**: Image uploads for characters and locations
- **Template System**: Pre-built world-building templates
- **Integration**: Export to popular writing tools

---

## Development Philosophy

### Design Principles
1. **Offline First**: Core functionality without internet dependency
2. **Data Portability**: User owns and can export their data
3. **Modular Architecture**: Independent, maintainable components
4. **Type Safety**: Full TypeScript coverage with runtime validation
5. **User Experience**: Intuitive interface with minimal learning curve

### Code Organization
- **Layered Architecture**: Controller → Service → Database pattern
- **Type-First Development**: Zod schemas define data contracts
- **Component-Based UI**: Reusable Vue components with consistent styling
- **API-First Design**: Backend APIs designed before UI implementation
- **Configuration-Driven**: Settings managed through JSON configuration

---

## Project Structure

```
src/
├── main/           # Electron main process (Node.js)
│   ├── api/        # API client functions
│   ├── server/     # Hono HTTP server
│   ├── window/     # Window management
│   └── ipc/        # IPC handlers
├── renderer/       # Vue frontend
│   ├── views/      # Page components
│   ├── stores/     # Pinia state management
│   ├── components/ # Reusable UI components
│   └── utils/      # Frontend utilities
├── preload/        # Preload scripts (security bridge)
├── types/          # TypeScript type definitions
├── zod-schema/     # Runtime validation schemas
└── config/         # Application configuration
```

---

## Getting Started

### Prerequisites
- **Node.js**: 18 or higher
- **Package Manager**: pnpm (recommended)

### Development Setup
```bash
# Install dependencies
pnpm install

# Rebuild native modules (SQLite)
pnpm run rebuild

# Start development server
pnpm run dev
```

### Build Process
```bash
# Build for production
pnpm run build

# Preview built application
pnpm run preview
```

---

## Documentation Structure

This documentation is organized into several key areas:

- **[Architecture](./architecture/)**: System design and technical architecture
- **[API](./api/)**: API endpoints and data schemas
- **[Guides](./guides/)**: Development and usage guides
- **[Development](./development/)**: Setup, debugging, and contribution guidelines

---

## Contributing

This project follows a structured development approach with clear separation between:

1. **Backend Development**: API and database layer
2. **Frontend Development**: Vue components and user interface
3. **Schema Development**: Data models and validation rules
4. **Documentation**: Technical and user documentation

For detailed contribution guidelines, see the [Development Guide](../development/DEVELOPMENT_GUIDE.md).

---

*This overview provides a high-level understanding of the Fantasy Builder project. For detailed technical information, refer to the specific documentation sections.*
