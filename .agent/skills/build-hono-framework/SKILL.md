---
name: build-hono-framework
description: |
  Scaffolds a new Hono framework module (Controller, Service, Mapper, Schemas) or initializes a new Hono project structure.
  Supports Domain-Driven Design Lite pattern.

  ## Language & Output Rules (System Core)
  1. **Instruction Language**: All internal logic and reasoning MUST be in **English**.
  2. **Output Language**:
     - **User Communication**: MUST be in **Korean (한국어)**.
     - **Artifacts**: Generated files MUST be in **Korean**.
  3. **Terminology**: Use English terms but describe in Korean.
---

# Build Hono Framework

## Purpose

Provides a complete toolkit for building Hono applications:
1.  **Project Initialization**: Sets up standard `src/main.ts` and `src/app.ts` structure.
2.  **Module Scaffolding**: Generates Domain-Driven modules (Controller, Service, Mapper, Schema).

## Instructions

### Mode 1: Project Initialization

Use this when starting a new Hono project or migrating to a standard structure.

```bash
uv run python .agent/skills/build-hono-framework/scripts/init_project.py [--base-dir BASE_DIR]
```
*   **Standard (Default)**: `src/main.ts`
    *   `uv run python .../init_project.py`
*   **Electron (Custom)**: `src/main/hono/main.ts`
    *   `uv run python .../init_project.py --base-dir src/main/hono`

### Mode 2: Module Generation

Use this when adding a new feature entity.

```bash
uv run python .agent/skills/build-hono-framework/scripts/generate_module.py {EntityName} [--base-dir BASE_DIR]
```

*   **Standard (Default)**: `src/{Entity}`
    *   `uv run python .../generate_module.py Product`
*   **Electron (Custom)**: `src/main/hono/{Entity}`
    *   `uv run python .../generate_module.py Product --base-dir src/main/hono`

#### Output Structure (Standard)
- `{base-dir}/{entity}/` (Controller, Service, Mapper)
- `{base-dir}/common/db/schema/` (DB Tables)
- `src/zod-schema/` (VO Schema - Fixed)
- `src/types/vo.types.ts` (VO Type Definition - Auto Updated)

### Step 3: Verify

Check if the requested files are created correctly in the target directory.