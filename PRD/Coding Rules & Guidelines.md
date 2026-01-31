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
- **공용 타입**: `src/types/` 에만 정의. main·renderer 모두 `@app-types/*` 로 참조. DTO·테이블·config 타입 중복 정의 금지.
- **타입 파일 명명**: `src/types/` 아래 파일은 반드시 `*.types.ts` 로 명명 (예: `response.types.ts`, `config.types.ts`).
- **상수**: `src/constants/` 아래 파일은 `*.const.ts` 로만 명명 (예: `response-code.const.ts`).
- **도메인별**: Controller, Service, Mapper는 기능 단위로 구성. 공통(common)은 shared 또는 공통 모듈로.

---

## 2. Folder Structure (Tree View)

```
fantasy-builder-exe/
├── src/
│   ├── config/                # 설정 (앱 전역)
│   │   └── app.json           # api.baseURL, server(port/hostname), db(mode/local/remote)
│   ├── types/                 # 공용 타입 (main·renderer 공유, @app-types/*). 파일명은 *.types.ts
│   │   ├── config.types.ts    # AppConfig, ServerConfig, ApiConfig
│   │   ├── db.types.ts        # DbConfig, DbMode
│   │   ├── dto.types.ts       # API DTO
│   │   ├── response.types.ts # API 응답 래퍼 타입
│   │   └── table.types.ts     # Drizzle InferSelectModel/InferInsertModel
│   ├── constants/             # 앱 전역 상수 (@constants/*)
│   │   ├── index.ts
│   │   └── *.const.ts         # 상수 파일은 반드시 *.const.ts 명명 (예: response-code.const.ts)
│   ├── data/                  # 로컬 DB 파일 등 (app.db)
│   ├── drizzle/               # Drizzle 마이그레이션 (local | remote)
│   │   ├── local/
│   │   └── remote/
│   ├── main/                  # Main Process
│   │   ├── index.ts
│   │   ├── api/               # Hono API (axios 단일 인스턴스)
│   │   │   ├── index.ts
│   │   │   ├── clients.ts
│   │   │   └── apiGet*.ts
│   │   ├── ipc/               # IPC 핸들러
│   │   ├── server/            # Hono 서버 (Controller → Service → DB)
│   │   │   ├── index.ts
│   │   │   ├── honoApp.ts
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── db/            # context, client(local/remote), mapper
│   │   │   └── schema/        # Drizzle 스키마 (local | remote)
│   │   │       ├── local/     # SQLite (common.columns, *.table.ts)
│   │   │       └── remote/    # Postgres (common.columns, *.table.ts)
│   │   └── window/
│   ├── preload/
│   └── renderer/              # Vue (Composition API)
│       ├── api/
│       ├── assets/
│       ├── views/
│       ├── router/
│       └── App.vue
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
- **Types**: `src/types/` 아래 파일은 반드시 `*.types.ts` 로 명명 (예: `response.types.ts`, `config.types.ts`).
- **Constants**: `src/constants/` 아래 파일은 반드시 `*.const.ts` 로 명명 (예: `response-code.const.ts`).
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
- **공용 타입**: `src/types/` 에 한 곳만 정의. main·renderer에서 `@app-types/*` 로 import.

### Schema (Drizzle)
- **공통 필드**: `common.columns.ts` (useYn, shrnYn, delYn, crtNo, crtDt, updtNo, updtDt, delNo, delDt)를 모든 엔티티 테이블에 spread.
- **TS 필드명**: camelCase. DB 컬럼명: snake_case.
- **로컬(SQLite)**: integer PK autoIncrement, text(날짜는 ISO 8601 문자열).
- **원격(Postgres)**: serial/bigint, text, timestamp, varchar.

### Service / Controller
- **Service**: 비즈니스 로직. Mapper 결과 → DTO 변환. Entity 직접 반환 금지.
- **Controller**: RESTful. 모든 API 응답은 **HTTP 200**. `@app-types/response.types` 의 **ResponseType&lt;TData&gt;** 구조(`data`, `error`, `code`, `message`)로 통일. 목록 API는 **ResponseType&lt;ListType&lt;TData&gt;&gt;** (ListResponseType&lt;TData&gt;) 사용.
- **Hono 핸들러**: 매개변수를 줄여서 작성하지 말 것 (예: `c` 대신 `context`). 축약형은 혼동을 불러올 수 있음.
- **API 응답**: ResponseType 전체를 반환. 호출부에서 `data`만 잘라서 전달하지 말 것.
- **코드 스타일**: 웬만하면 구문은 한 줄씩 띄어서 작성 (한 줄에 한 문장·표현, 논리 블록 사이 빈 줄).

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
- **목록 응답**: `ResponseType<ListType<TData>>` (ListResponseType) 사용. data 안에 `list`, `totalCnt`, `pageSize`, `page`, `totalPage`, `isFirst`, `isLast` 유지.
- **페이징**: 쿼리 `page`, `pageSize`로 전달. 기본 pageSize는 `config/app.json`의 `pagination.pageSize`(기본 10). 사용자 쿼리 `pageSize`가 있으면 해당 값 사용.
- **Vue에서 API**: 반드시 `window.electron.api.*` 로만 접근. IPC는 설정·ping 등 비엔드포인트 통신용.

---

*문서 끝*
