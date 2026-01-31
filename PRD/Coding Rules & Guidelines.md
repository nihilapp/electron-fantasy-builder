# Coding Rules & Guidelines — Fantasy Builder (Electron + Vue + Hono)

**작성일**: 2026-01-31  
**버전**: 1.0

---

## 1. Architectural Principles

### Design Pattern
**Controller → Service → DB(Mapper)** 3계층 + **도메인 주도 설계(DDD) Lite**를 적용합니다.

- **Hono Controller**: HTTP 요청/응답만 담당. Service 호출 후 `c.json()` 반환.
- **Service**: 비즈니스 로직. Mapper 결과를 DTO로 가공.
- **Mapper**: Drizzle 쿼리 수행. `getDb()`로 연결 취득 후 `schema/local` 또는 `schema/remote` 스키마 사용.

### IPC vs API
- **엔드포인트 통신 = API(HTTP)**. Hono·외부 서버 호출은 axios(메인) 또는 fetch(렌더러 honoClient)로만 수행.
- **설정·앱 단 통신 = IPC**. base URL, DB 모드 등은 IPC로 제공.

### Directory Strategy
- **Main / Preload / Renderer** 분리.
- **공용 타입**: 루트 `types/` 에만 정의. main·renderer 모두 `@/types/*` 로 참조. DTO·테이블 타입 중복 정의 금지.
- **도메인별**: Controller, Service, Mapper는 기능 단위로 구성. 공통(common)은 shared 또는 공통 모듈로.

---

## 2. Folder Structure (Tree View)

```
fantasy-builder-exe/
├── config/                     # 설정 (앱 전역)
│   ├── app.json               # api.baseURL, server(port/hostname), db(mode/local/remote)
│   └── types.ts
├── types/                      # 공용 타입 (main·renderer 공유)
│   ├── dto.ts                 # API DTO
│   └── table.ts               # Drizzle InferSelectModel/InferInsertModel
├── src/main/                   # Main Process
│   ├── index.ts
│   ├── api/                   # Hono API (axios 단일 인스턴스)
│   │   ├── index.ts
│   │   ├── clients.ts
│   │   └── apiGet*.ts
│   ├── ipc/                   # IPC 핸들러
│   ├── server/                # Hono 서버 (Controller → Service → DB)
│   │   ├── index.ts
│   │   ├── honoApp.ts
│   │   ├── controller/
│   │   ├── service/
│   │   ├── db/                # context, client(local/remote), mapper
│   │   └── schema/            # Drizzle 스키마 (local | remote)
│   │       ├── local/         # SQLite (common.columns, *.table.ts)
│   │       └── remote/        # Postgres (common.columns, *.table.ts)
│   └── window/
├── src/preload/
├── src/renderer/               # Vue (Composition API)
│   ├── api/
│   ├── assets/styles/
│   ├── views/
│   ├── router/
│   └── App.vue
├── drizzle/                    # Drizzle 마이그레이션 (local | remote)
├── PRD/
│   ├── PRD.md
│   ├── Coding Rules & Guidelines.md
│   ├── Development Task List.md
│   ├── TODO.md
│   └── plans/
└── package.json
```

---

## 3. Naming Conventions (Strict)

### Files
- **IPC**: `ipc<행위><대상>.ts` (예: ipcGetDbMode.ts)
- **API**: `apiGet<대상>.ts`, `apiPost<대상>.ts` 등
- **Controller/Service**: `*Controller.ts`, `*Service.ts`
- **Mapper**: `*Mapper.ts` 또는 도메인별 mapper
- **Schema**: `*.table.ts`, `common.columns.ts`
- **Vue**: `PascalCase.vue`

### Variables / Types
- **Variables**: `camelCase`. boolean은 `is*`, `has*` 권장.
- **Constants**: `UPPER_SNAKE_CASE`. 설정은 `config/app.json`.
- **Types/Interfaces**: `PascalCase`. DTO는 `*Dto`, 테이블 get/insert는 `InferSelectModel`/`InferInsertModel` 또는 `*TableGet`/`*TablePost`.

### Database
- **테이블명**: `snake_case` 복수형 (users, projects, traits, char_trait_maps)
- **컬럼명**: `snake_case` (user_no, prj_no, trait_nm)

### Commits
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:` 등

---

## 4. Coding Standards

### Type Safety
- **`any` 사용 금지**. 불가피한 경우 `unknown` 사용 후 Type Narrowing.
- **공용 타입**: 루트 `types/` 에 한 곳만 정의. main·renderer에서 import.

### Schema (Drizzle)
- **공통 필드**: `common.columns.ts` (useYn, shrnYn, delYn, crtNo, crtDt, updtNo, updtDt, delNo, delDt)를 모든 엔티티 테이블에 spread.
- **TS 필드명**: camelCase. DB 컬럼명: snake_case.
- **로컬(SQLite)**: integer PK autoIncrement, text(날짜는 ISO 8601 문자열).
- **원격(Postgres)**: serial/bigint, text, timestamp, varchar.

### Service / Controller
- **Service**: 비즈니스 로직. Mapper 결과 → DTO 변환. Entity 직접 반환 금지.
- **Controller**: RESTful. `c.json({ data, error, code, message })` 형태로 통일. 표준 에러 응답 포맷 유지.

### Error Handling
- **Renderer**: API 호출 실패 시 try/catch로 메시지 표시.
- **Main**: 예외는 IPC 응답으로 전달하지 않고, API 레이어에서 catch 후 적절한 응답/로그 처리.

### Logging
- **Main**: console.log/error (개발 시). API 요청/응답은 `main/api/clients.ts` 인터셉터에서 로그.
- **Renderer**: DevTools Console.

---

## 5. Fantasy Builder 특화 규칙

- **소프트 삭제**: `del_yn = 'Y'`로 표시. 조회 시 `del_yn = 'N'` 조건 필수.
- **공유 여부**: `shrn_yn = 'Y'`인 경우 접근 제어 정책에 따라 조회 허용.
- **목록 응답**: 페이징 시 `list`, `totalCnt`, `pageSize`, `page`, `totalPage`, `isFirst`, `isLast` 구조 유지 (PRD copy ListType 호환).
- **Vue에서 API**: 반드시 `window.electron.api.*` 로만 접근. IPC는 설정·ping 등 비엔드포인트 통신용.

---

*문서 끝*
