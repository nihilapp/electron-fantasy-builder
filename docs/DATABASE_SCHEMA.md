# Database Schema - Fantasy Builder

**Last Updated**: 2026-02-07  
**Version**: 1.0.0

---

## Overview

Fantasy Builder uses a dual-database architecture with schema-first design using Drizzle ORM. All entities follow consistent patterns with common audit fields and support for both local (SQLite) and remote (PostgreSQL) deployments.

---

## Design Principles

### 1. Common Entity Pattern
All tables extend a common base structure:
```sql
useYn     VARCHAR(1) NOT NULL DEFAULT 'Y'  -- Active/inactive flag
shrnYn    VARCHAR(1) NOT NULL DEFAULT 'N'  -- Shared flag
delYn     VARCHAR(1) NOT NULL DEFAULT 'N'  -- Soft delete flag
crtNo     INTEGER NOT NULL                   -- Creator ID
crtDt     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Creation time
updtNo     INTEGER NOT NULL                   -- Updater ID  
updtDt     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Update time
delNo     INTEGER NULL                        -- Deleter ID
delDt     TIMESTAMP NULL                      -- Deletion time
```

### 2. Project Scoping
- **Global Entities**: `traits`, `abilities` - shared across projects
- **Project Entities**: `characters`, `creatures`, etc. - belong to specific projects
- **Mapping Tables**: Many-to-many relationships with project context

### 3. Soft Deletion
All data is preserved with `delYn` flag for audit trail and recovery.

---

## Core Tables

### projects
Central entity containing all world-building projects.

```sql
CREATE TABLE projects (
  prjNo      INTEGER PRIMARY KEY AUTOINCREMENT,
  userNo     INTEGER NULL,                    -- Remote DB only
  prjNm      VARCHAR(255) NOT NULL,          -- Project name
  genreType  VARCHAR(100) NULL,              -- Genre (Fantasy, Sci-Fi, etc.)
  prjDesc    TEXT NULL,                      -- Short description
  cvrImgUrl  VARCHAR(500) NULL,              -- Cover image URL
  prjExpln   TEXT NULL,                      -- Detailed explanation
  prjVer     VARCHAR(50) NULL,               -- Version
  -- Common fields (useYn, shrnYn, delYn, crtNo, crtDt, updtNo, updtDt, delNo, delDt)
);
```

---

## Global Tables (Shared Across Projects)

### traits
Global trait definitions available to all projects.

```sql
CREATE TABLE traits (
  traitNo     INTEGER PRIMARY KEY AUTOINCREMENT,
  traitNm     VARCHAR(255) NOT NULL,         -- Trait name
  traitExpln  TEXT NULL,                     -- Trait explanation
  traitLcls   VARCHAR(100) NULL,             -- Large category
  traitMcls   VARCHAR(100) NULL,             -- Medium category
  aplyTrgt    VARCHAR(255) NULL,             -- Application targets (Character,Creature,etc.)
  cnflTraitNo INTEGER NULL,                  -- Conflict trait (self-reference)
  -- Common fields
);

-- Indexes
CREATE INDEX idx_traits_name ON traits(traitNm);
CREATE INDEX idx_traits_category ON traits(traitLcls, traitMcls);
CREATE INDEX idx_traits_target ON traits(aplyTrgt);
```

### abilities
Global ability definitions available to all projects.

```sql
CREATE TABLE abilities (
  abilityNo    INTEGER PRIMARY KEY AUTOINCREMENT,
  abilityNm    VARCHAR(255) NOT NULL,        -- Ability name
  abilityType  VARCHAR(100) NULL,            -- Ability type
  abilityLcls  VARCHAR(100) NULL,            -- Large category
  abilityExpln TEXT NULL,                    -- Ability explanation
  trgtType     VARCHAR(100) NULL,            -- Target type
  dmgType      VARCHAR(100) NULL,            -- Damage type
  -- Common fields
);

-- Indexes
CREATE INDEX idx_abilities_name ON abilities(abilityNm);
CREATE INDEX idx_abilities_type ON abilities(abilityType, abilityLcls);
```

---

## Project-Specific Tables

### project_traits
Project-specific trait definitions.

```sql
CREATE TABLE project_traits (
  traitNo      INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INTEGER NOT NULL,             -- Project reference
  traitNm      VARCHAR(255) NOT NULL,        -- Trait name
  traitExpln   TEXT NULL,                     -- Trait explanation
  traitLcls    VARCHAR(100) NULL,            -- Large category
  traitMcls    VARCHAR(100) NULL,            -- Medium category
  aplyTrgt     VARCHAR(255) NULL,            -- Application targets
  cnflTraitNo  INTEGER NULL,                 -- Conflict trait
  cnflTraitType VARCHAR(10) NULL DEFAULT 'PROJECT', -- GLOBAL or PROJECT
  -- Common fields
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
);
```

### project_abilities
Project-specific ability definitions.

```sql
CREATE TABLE project_abilities (
  abilityNo    INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INTEGER NOT NULL,             -- Project reference
  abilityNm    VARCHAR(255) NOT NULL,        -- Ability name
  abilityType  VARCHAR(100) NULL,            -- Ability type
  abilityLcls  VARCHAR(100) NULL,            -- Large category
  abilityExpln TEXT NULL,                    -- Ability explanation
  trgtType     VARCHAR(100) NULL,            -- Target type
  dmgType      VARCHAR(100) NULL,            -- Damage type
  -- Common fields
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
);
```

### core_rules
Project core rules and settings.

```sql
CREATE TABLE core_rules (
  coreNo      INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo       INTEGER NOT NULL,              -- Project reference
  coreNm      VARCHAR(255) NOT NULL,         -- Core rule name
  coreExpln   TEXT NULL,                     -- Core rule explanation
  coreType    VARCHAR(100) NULL,             -- Core rule type
  -- Common fields
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
);
```

### characters
Character entities within projects.

```sql
CREATE TABLE characters (
  charNo       INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INTEGER NOT NULL,             -- Project reference
  charNm       VARCHAR(255) NOT NULL,        -- Character name
  aliasNm      VARCHAR(255) NULL,            -- Alias/nickname
  roleType     VARCHAR(100) NULL,            -- Role type (Protagonist, Antagonist, etc.)
  logline      TEXT NULL,                     -- One-line description
  raceNo       INTEGER NULL,                 -- Race/creature reference
  ntnNo        INTEGER NULL,                 -- Nation reference
  orgNo        INTEGER NULL,                 -- Organization reference
  -- Additional character fields (age, gender, appearance, etc.)
  -- Common fields
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
  FOREIGN KEY (raceNo) REFERENCES creatures(creatureNo)
  FOREIGN KEY (ntnNo) REFERENCES nations(ntnNo)
  FOREIGN KEY (orgNo) REFERENCES organizations(orgNo)
);
```

### creatures
Creature and race entities within projects.

```sql
CREATE TABLE creatures (
  creatureNo   INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INTEGER NOT NULL,             -- Project reference
  creatureNm   VARCHAR(255) NOT NULL,        -- Creature/race name
  creatureType VARCHAR(100) NULL,            -- Creature type
  creatureExpln TEXT NULL,                    -- Creature explanation
  -- Additional creature fields
  -- Common fields
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
);
```

### items
Item entities within projects.

```sql
CREATE TABLE items (
  itemNo       INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INTEGER NOT NULL,             -- Project reference
  itemNm       VARCHAR(255) NOT NULL,        -- Item name
  itemType     VARCHAR(100) NULL,            -- Item type
  itemExpln    TEXT NULL,                     -- Item explanation
  -- Additional item fields (rarity, properties, etc.)
  -- Common fields
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
);
```

### regions
Geographic regions within projects.

```sql
CREATE TABLE regions (
  regionNo     INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INTEGER NOT NULL,             -- Project reference
  regionNm     VARCHAR(255) NOT NULL,        -- Region name
  regionType   VARCHAR(100) NULL,            -- Region type
  regionExpln  TEXT NULL,                     -- Region explanation
  -- Common fields
  FOREIGN KEY (prjNo) REFERENCES projects(prjNo)
);
```

### nations
Political entities (countries, kingdoms) within projects.

```sql
CREATE TABLE nations (
  ntnNo        INTEGER PRIMARY KEY AUTOINCREMENT,
  prjNo        INT
