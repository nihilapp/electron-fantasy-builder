# Fantasy Builder Documentation

**Last Updated**: 2026-02-07  
**Version**: 1.0.0

---

## Welcome to Fantasy Builder Documentation

Fantasy Builder is a desktop World Building Tool designed for creative professionals including writers, game designers, comic artists, and scenario writers. This comprehensive documentation will help you understand and use the application effectively.

## Documentation Structure

### 📁 [Architecture](./architecture/)
System design and technical architecture documentation.

- **[Project Overview](./architecture/PROJECT_OVERVIEW.md)** - High-level understanding of Fantasy Builder
- **[Technical Architecture](./architecture/TECHNICAL_ARCHITECTURE.md)** - Detailed technical implementation
- **[File Structure Guide](./architecture/FILE_STRUCTURE.md)** - Complete directory and file organization
- **[Dependencies Analysis](./architecture/DEPENDENCIES_ANALYSIS.md)** - Comprehensive dependency analysis and rationale
- **[Technology Deep Dive](./architecture/TECHNOLOGY_DEEP_DIVE.md)** - In-depth technology implementation patterns
- **[Project Analysis Summary](./architecture/PROJECT_ANALYSIS_SUMMARY.md)** - Complete project analysis and recommendations

### 📁 [API](./api/)
API endpoints and data schemas for developers.

- **[API Reference](./api/API_REFERENCE.md)** - Complete API documentation

### 📁 [Guides](./guides/)
User and development guides.

- **[User Guide](./guides/USER_GUIDE.md)** - How to use Fantasy Builder

### 📁 [Development](./development/)
Development setup and contribution guidelines.

- **[Development Setup](./development/DEVELOPMENT_SETUP.md)** - Getting started for developers
- **[Development Workflow](./development/DEVELOPMENT_WORKFLOW.md)** - Comprehensive development process and best practices
- **[Code Style Guide](./development/CODE_STYLE_GUIDE.md)** - Coding standards and conventions

### 📄 Core Documentation

- **[Database Schema](./DATABASE_SCHEMA.md)** - Complete database design documentation
- **[IPC Guide](./IPC_GUIDE.md)** - Inter-Process Communication documentation
- **[Endpoint Implementation Plan](./ENDPOINT_IMPLEMENTATION_PLAN.md)** - API development roadmap

---

## Quick Start

### For Users

1. **Read the [User Guide](./guides/USER_GUIDE.md)** to learn how to use Fantasy Builder
2. **Create your first project** and start building your world
3. **Explore features** like traits, abilities, and entity relationships

### For Developers

1. **Follow the [Development Setup](./development/DEVELOPMENT_SETUP.md)** guide to get the code running
2. **Review the [Technical Architecture](./architecture/TECHNICAL_ARCHITECTURE.md)** to understand the system design
3. **Check the [API Reference](./api/API_REFERENCE.md)** for integration details
4. **Read the [Database Schema](./DATABASE_SCHEMA.md)** to understand the data model
5. **Study the [Development Workflow](./development/DEVELOPMENT_WORKFLOW.md)** for best practices

---

## Application Overview

### What is Fantasy Builder?

Fantasy Builder is a **desktop World Building Tool** that helps creative professionals:

- **Organize fictional worlds** with structured data management
- **Manage characters and entities** with traits and abilities
- **Maintain consistency** across large creative projects
- **Build relationships** between different world elements
- **Work offline** with local data storage

### Key Features

- **Project-Based Management**: Each creative work gets its own dedicated space
- **Traits & Abilities System**: Global and project-specific character attributes
- **Entity Management**: Characters, creatures, organizations, locations, and more
- **Relationship Mapping**: Define connections between world elements
- **Offline-First**: Core functionality works without internet
- **Cross-Platform**: Windows, macOS, and Linux support

### Technology Stack

- **Frontend**: Vue 3 + TypeScript + Tailwind CSS
- **Backend**: Electron + Node.js + Hono.js
- **Database**: SQLite (local) with PostgreSQL support (remote)
- **Build System**: electron-vite + pnpm
- **State Management**: Pinia stores
- **Validation**: Zod schemas for runtime type checking

---

## Documentation Highlights

### 🆕 New Comprehensive Analysis

We've recently added in-depth analysis documents to provide deeper insights into the project:

#### **[Dependencies Analysis](./architecture/DEPENDENCIES_ANALYSIS.md)**
- Complete breakdown of all 85+ dependencies
- Rationale for each technology choice
- Security and performance impact analysis
- Dependency management strategies

#### **[Technology Deep Dive](./architecture/TECHNOLOGY_DEEP_DIVE.md)**
- Detailed implementation patterns
- Code examples and best practices
- Security implementation analysis
- Performance optimization strategies

#### **[Development Workflow](./development/DEVELOPMENT_WORKFLOW.md)**
- Complete development environment setup
- Build system analysis and optimization
- Testing strategies and debugging techniques
- Release process and quality assurance

#### **[Project Analysis Summary](./architecture/PROJECT_ANALYSIS_SUMMARY.md)**
- Executive summary of project status
- Complete architecture assessment
- Risk analysis and mitigation strategies
- Future development recommendations

---

## Getting Help

### Documentation Resources

- **📖 User Guide**: Comprehensive usage instructions
- **🔧 Development Setup**: Environment setup and contribution guide
- **🏗️ Technical Architecture**: System design and implementation details
- **📡 API Reference**: Complete endpoint documentation
- **🗄️ Database Schema**: Data model and relationships
- **📋 Dependencies Analysis**: Complete technology breakdown
- **💻 Development Workflow**: Comprehensive development process

### Common Questions

**Q: What platforms does Fantasy Builder run on?**
A: Windows, macOS, and Linux (desktop application)

**Q: Can I use Fantasy Builder offline?**
A: Yes, the core functionality works completely offline with local SQLite storage

**Q: Is my data private?**
A: Yes, all data is stored locally by default. Online features are optional

**Q: Can I import/export my data?**
A: Yes, the application supports various import/export formats

**Q: What technologies are used in Fantasy Builder?**
A: See the [Dependencies Analysis](./architecture/DEPENDENCIES_ANALYSIS.md) for complete technology breakdown

---

## For Developers

### Contributing

We welcome contributions from the community! Here's how to get started:

1. **Fork the repository** on GitHub
2. **Set up your development environment** using the Development Setup guide
3. **Create a feature branch** for your contribution
4. **Make your changes** following our coding standards (see [Code Style Guide](./development/CODE_STYLE_GUIDE.md))
5. **Test thoroughly** including UI, API, and database tests
6. **Submit a pull request** with clear description

### Development Focus Areas

We're currently working on:

- **🚧 Traits & Abilities UI**: Frontend implementation for backend-ready features
- **🚧 Entity Management UI**: Characters, creatures, organizations, locations
- **🚧 Relationship Visualization**: Visual display of entity connections
- **📋 Search & Filtering**: Advanced entity discovery capabilities
- **📋 Import/Export**: Data portability features

### Code Standards

- **TypeScript**: Full type coverage with runtime validation
- **Zod Schemas**: Runtime validation for all data structures
- **Component Pattern**: Consistent Vue component structure
- **API First**: Backend APIs designed before UI implementation
- **Testing**: Comprehensive test coverage for all features

### Architecture Patterns

- **Layered Architecture**: Controller → Service → Repository pattern
- **Type-First Development**: Zod schemas define data contracts
- **Component-Based UI**: Reusable Vue components with Tailwind styling
- **RESTful APIs**: Standardized HTTP endpoints with consistent responses
- **Database Migrations**: Schema versioning with Drizzle ORM

---

## Project Status

### Current Version: 1.0.0

#### ✅ Completed
- Project CRUD operations with full UI
- Core rules management system
- Complete database arc
