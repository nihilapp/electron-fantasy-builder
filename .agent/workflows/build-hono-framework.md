---
description: Scaffolds a new Hono framework module (Controller, Service, Mapper, Schemas) or initializes a new Hono project structure.
---
# build-hono-framework Workflow

> **Trigger**: /build-hono-framework {EntityName | init}

## Steps

### Mode 1: Initialize Project
If you want to set up the Hono project structure (`src/main.ts`, `src/app.ts`):
1. **Execute**: `uv run python .agent/skills/build-hono-framework/scripts/init_project.py`

### Mode 2: Generate Module
If you want to create a new entity module:
1. **Execute**: `uv run python .agent/skills/build-hono-framework/scripts/generate_module.py {EntityName}`
   - Example: `uv run python .../generate_module.py Product`
