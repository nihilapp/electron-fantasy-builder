# API Reference - Fantasy Builder

**Last Updated**: 2026-02-07  
**Version**: 1.0.0  
**Base URL**: http://localhost:3456

---

## Overview

Fantasy Builder uses a RESTful API built with Hono.js running on port 3456. All communication between the frontend (renderer process) and backend (main process) happens through HTTP requests. The API follows consistent patterns and response formats.

## Common Patterns

### Request Structure
- **Content-Type**: `application/json`
- **Method**: GET, POST, PATCH, DELETE
- **Headers**: Standard headers plus optional `X-Db-Target` for DB mode selection

### Response Structure
All APIs return HTTP 200 with a standardized response format:

```typescript
interface ResponseType<TData> {
  data: TData;
  error: boolean;
  code: ResponseCode;
  message: string;
}

interface ListType<TData> {
  list: TData[];
  totalCnt: number;
  pageSize: number;
  page: number;
  totalPage: number;
  isFirst: boolean;
  isLast: boolean;
}
```

### Project Scoping
For project-scoped entities:
- **List requests**: Use `?prjNo=123` query parameter
- **Create/Update requests**: Include `prjNo` in request body

### Database Mode Selection
Switch between local and remote databases:
- **Header**: `X-Db-Target: local|remote`
- **Query**: `?db=local|?db=remote`

---

## Authentication

Currently, the API operates in single-user mode with no authentication. Future versions will implement JWT-based authentication for multi-user support.

---

## Endpoints

## Health Check

### GET /health
Check if the API server is running and database is connected.

**Response:**
```json
{
  "data": "OK",
  "error": false,
  "code": "SUCCESS",
  "message": "Health check successful"
}
```

---

## Projects

### GET /projects
Get a paginated list of projects.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**Response:**
```json
{
  "data": {
    "list": [
      {
        "prjNo": 1,
        "prjNm": "Fantasy World",
        "genreType": "Fantasy",
        "prjDesc": "A magical world",
        "cvrImgUrl": null,
        "prjExpln": null,
        "prjVer": "1.0",
        "userNo": null,
        "useYn": "Y",
        "shrnYn": "N",
        "delYn": "N",
        "crtNo": 1,
        "crtDt": "2026-02-07T10:00:00Z",
        "updtNo": 1,
        "updtDt": "2026-02-07T10:00:00Z"
      }
    ],
    "totalCnt": 1,
    "pageSize": 10,
    "page": 1,
    "totalPage": 1,
    "isFirst": true,
    "isLast": true
  },
  "error": false,
  "code": "SUCCESS",
  "message": "Projects retrieved successfully"
}
```

### GET /projects/:prjNo
Get a specific project by ID.

**Path Parameters:**
- `prjNo`: Project ID

**Response:**
```json
{
  "data": {
    "prjNo": 1,
    "prjNm": "Fantasy World"
  },
  "error": false,
  "code": "SUCCESS",
  "message": "Project retrieved successfully"
}
```

### POST /projects
Create a new project.

**Request Body:**
```json
{
  "prjNm": "New Project",
  "genreType": "Sci-Fi",
  "prjDesc": "A futuristic world",
  "prjExpln": "Detailed description"
}
```

### PATCH /projects/:prjNo
Update an existing project.

### DELETE /projects/:prjNo
Soft delete a project.

---

## Traits (Global)

### GET /traits
Get a paginated list of global traits.

**Query Parameters:**
- `page` (optional): Page number
- `pageSize` (optional): Items per page
- `keyword` (optional): Search term
- `traitLcls` (optional): Large category filter
- `traitMcls` (optional): Medium category filter
- `aplyTrgt` (optional): Application target filter

### GET /traits/:traitNo
Get a specific trait by ID.

### POST /traits
Create a new global trait.

**Request Body:**
```json
{
  "traitNm": "Wise",
  "traitExpln": "Possessing great wisdom",
  "traitLcls": "Personality",
  "traitMcls": "Mental",
  "aplyTrgt": "Character"
}
```

### PATCH /traits/:traitNo
Update an existing trait.

### DELETE /traits/:traitNo
Soft delete a trait.

---

## Abilities (Global)

### GET /abilities
Get a paginated list of global abilities.

**Query Parameters:**
- `page` (optional): Page number
- `pageSize` (optional): Items per page
- `keyword` (optional): Search term
- `abilityType` (optional): Ability type filter
- `abilityLcls` (optional): Large category filter
- `trgtType` (optional): Target type filter
- `dmgType` (optional): Damage type filter

### GET /abilities/:abilityNo
Get a specific ability by ID.

### POST /abilities
Create a new global ability.

### PATCH /abilities/:abilityNo
Update an existing ability.

### DELETE /abilities/:abilityNo
Soft delete an ability.

---

## Project Traits

### GET /project-traits
Get project-specific traits.

**Required Query Parameters:**
- `prjNo`: Project ID

### GET /project-traits/:traitNo
Get a specific project trait by ID.

### POST /project-traits
Create a new project-specific trait.

**Request Body:**
```json
{
  "prjNo": 1,
  "traitNm": "Dragonborn",
  "traitExpln": "Has dragon ancestry",
  "traitLcls": "Racial",
  "traitMcls": "Heritage",
  "aplyTrgt": "Character"
}
```

### PATCH /project-traits/:traitNo
Update a project trait.

### DELETE /project-traits/:traitNo
Soft delete a project trait.

---

## Project Abilities

### GET /project-abilities
Get project-specific abilities.

**Required Query Parameters:**
- `prjNo`: Project ID

### GET /project-abilities/:abilityNo
Get a specific project ability by ID.

### POST /project-abilities
Create a new project-specific ability.

**Request Body:**
```json
{
  "prjNo": 1,
  "abilityNm": "Dragon Breath",
  "abilityType": "Racial",
  "abilityLcls": "Breath Weapon",
  "abilityExpln": "Breathe elemental damage",
  "trgtType": "Enemy",
  "dmgType": "Fire"
}
```

### PATCH /project-abilities/:abilityNo
Update a project ability.

### DELETE /project-abilities/:abilityNo
Soft delete a project ability.

---

## Core Rules

### GET /core-rules
Get core rules for a project.

**Required Query Parameters:**
- `prjNo`: Project ID

---

## Response Codes

The API uses standardized response codes:

| Code | Description |
|------|-------------|
| SUCCESS | Operation completed successfully |
| VALIDATION_ERROR | Input validation failed |
| NOT_FOUND | Resource not found |
| DUPLICATE_ENTRY | Duplicate data entry |
| DATABASE_ERROR | Database operation failed |
| INTERNAL_ERROR | Internal server error |
| UNAUTHORIZED | Authentication required |
| FORBIDDEN | Access denied |

---

## Error Handling

All errors return HTTP 200 with error information in the response body:

```json
{
  "data": null,
  "error": true,
  "code": "VALIDATION_ERROR",
  "message": "Invalid input: project name is required"
}
```

---

## Pagination

List endpoints support pagination with these parameters:
- `page`: Page number (1-based)
- `pageSize`: Items per page (default: 10, max: 100)

---

## Search and Filtering

Many endpoints support search and filtering:
- `keyword`: Text search across relevant fields
- Category filters specific to the entity type
- Multiple filter values can be combined

---

## Future Endpoints

The following endpoints are planned but not yet implemented:

### Entities
- `/characters` - Character management
- `/creatures` - Creature/Race management  
- `/items` - Item management
- `/regions` - Region management
- `/nations` - Nation management
- `/organizations` - Organization management
- `/events` - Event management
- `/lores` - Lore management

### Relationships
- `/char-trait-maps` - Character trait assignments
- `/char-ability-maps` - Character ability assignments
- `/creature-trait-maps` - Creature trait assignments
- `/creature-ability-maps` - Creature ability assignments
- `/char-relations` - Character relationships

---

## Development Notes

### Running the API Server
The API server starts automatically when running `pnpm run dev` and listens on port 3456.

### Database Modes
- **Local**: SQLite database at `./src/data/app.db`
- **Remote**: PostgreSQL connection (requires configuration)

### Testing
API endpoints can be tested using:
- Browser with JSON viewer extensions
- Postman or similar API testing tools
- curl commands from terminal

Example curl command:
```bash
curl -X GET "http:
