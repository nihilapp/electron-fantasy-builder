# PLAN: 로컬 SQLite 기본 + 특정 상황 시 외부 DB 연결 구조

> **Date:** 2025-01-31  
> **Task ID:** 001_UPDATE_DualDbLocalAndExternal  
> **Language:** Korean (Required)

## 1. Objective

- **기본**: 앱의 기본 DB는 로컬 SQLite(파일 DB)이다.
- **특정 상황**: 조건에 따라 외부 DB에 연결하는 구조로 설계한다.
- Controller → Service → Mapper 계층은 그대로 유지하고, **Mapper가 "어느 DB에 붙을지"를 알지 못하게** 추상화한다.

## 2. Context Analysis

- **현재**: `main/server/db`에는 Mapper만 있고, 실제 DB 연결( better-sqlite3 / Drizzle )은 아직 미구현.
- **의존성**: `better-sqlite3`, `drizzle-orm`, `drizzle-kit` 이미 존재.
- **목표**: 로컬 SQLite는 기본, "특정 상황"에서만 외부 DB를 쓰도록 **연결 선택 로직**을 한곳에서 관리.

## 3. "특정 상황" 정의 (선택지)

아래 중 하나 또는 조합으로 "지금은 외부 DB를 쓴다"를 결정할 수 있다.

| 방식 | 설명 | 적합한 경우 |
|------|------|-------------|
| **A. 설정(Config)** | `config/app.json` 또는 환경 변수에 `db.mode: "local" \| "remote"` 등 | 앱 시작 시 한 번 정해지면 계속 유지 |
| **B. 환경 변수** | `DB_MODE=remote`, `REMOTE_DATABASE_URL=...` | 배포/실행 환경별로 전환 |
| **C. 요청 단위** | 헤더/쿼리로 `X-DB-Context: remote` 등 전달 | 같은 앱에서 요청마다 로컬/원격 전환 |
| **D. 런타임 전환** | UI/설정에서 "외부 DB 사용" 토글 시 전환 | 사용자가 앱 내에서 전환 |

**권장**: 먼저 **A + B**(설정 + 환경 변수)로 "앱/프로세스 단위" 전환을 구현하고, 필요 시 C/D를 추가하는 것이 구현·테스트가 단순하다.

## 4. Strategy

### 4.1 추상화 원칙

- **Mapper는 "DB 연결 객체"의 종류(로컬/외부)를 모른다.**
- 실행 시점에 **"현재 사용할 DB 연결"**이 주입되거나, **Mapper가 공통 인터페이스를 통해 접근**한다.

### 4.2 기술 선택

- **로컬 DB**: `better-sqlite3` + `drizzle-orm` (기존 스택 활용). DB 파일 경로는 설정 또는 `app.getPath('userData')` 등 Electron 경로 사용.
- **외부 DB**: Drizzle이 지원하는 DB로 통일하면 쿼리/스키마 재사용이 쉽다.  
  - 예: **PostgreSQL** 또는 **MySQL** (`pg` / `mysql2` 드라이버 + Drizzle).  
  - 외부가 "원격 SQLite"라면 `better-sqlite3`는 로컬 전용으로 두고, 원격은 HTTP API나 별도 프로토콜로 감싸는 방식도 가능(복잡도 상승).

**권장**: 로컬 = Drizzle + better-sqlite3, 외부 = Drizzle + pg(또는 mysql2). 스키마는 Drizzle 스키마 한 벌로 두고, 연결만 바꾼다.

### 4.3 구조 제안

```
main/server/db/
├── index.ts              # getDb() 등 "현재 DB 접근점" export
├── client/
│   ├── types.ts           # DbClient 또는 Drizzle 인스턴스 타입 정의
│   ├── local.ts           # 로컬 SQLite 연결 생성 (Drizzle + better-sqlite3)
│   └── remote.ts          # 외부 DB 연결 생성 (Drizzle + pg 등)
├── context.ts             # "지금 로컬 쓸지, 외부 쓸지" 결정 + 연결 캐시
└── mapper/
    └── ...
```

- **context (또는 connection manager)**  
  - 설정/환경 변수(또는 나중에 요청 컨텍스트)를 보고 `local` vs `remote` 결정.  
  - 연결 인스턴스를 생성·캐시하고, Mapper는 이 context를 통해서만 DB에 접근.

- **Mapper**  
  - `getDb()` 또는 `getConnection()`으로 "현재 연결"을 받아서 쿼리 수행.  
  - Mapper 내부에서는 "로컬/원격" 분기 없이, 주입된 연결만 사용.

### 4.4 설정 확장

`config/app.json` 예시:

```json
{
  "db": {
    "mode": "local",
    "local": {
      "path": "./data/app.db"
    },
    "remote": {
      "url": "${REMOTE_DATABASE_URL}",
      "driver": "pg"
    }
  }
}
```

- `mode`: `"local"` | `"remote"`  
- 환경 변수 치환은 앱 부트스트랩 시 한 번 처리.

### 4.5 연결 라이프사이클

- **로컬 SQLite**: Electron 앱 기동 시 한 번 연결, 앱 종료 시 close.
- **외부 DB**:  
  - 풀 사용 시: 앱 기동 시 풀 생성, 종료 시 풀 종료.  
  - "특정 상황"이 **요청 단위**라면, 요청 처리 시작 시 context 설정 → Mapper에서 해당 연결 사용 → 요청 끝나면 정리(또는 풀 반환).

## 5. Impact Analysis

- **추가 파일**: `db/client/types.ts`, `db/client/local.ts`, `db/client/remote.ts`, `db/context.ts`, (선택) `db/schema/` for Drizzle schema.
- **수정 파일**: `db/index.ts`(getDb/context 노출), 각 Mapper(연결 주입 방식으로 변경), `config/app.json`.
- **의존성**: 외부 DB 사용 시 `pg` 또는 `mysql2` 등 드라이버 추가.
- **Side Effects**: Mapper 시그니처가 "연결을 받는 형태"로 바뀌거나, 전역/스레드 로컬 "현재 연결"을 쓰게 됨.

## 6. Task List

- [x] `config/app.json`에 `db.mode`, `db.local`, `db.remote` 설정 추가
- [x] `db/client/types.ts`에서 공통 DB 클라이언트 타입(또는 Drizzle 인스턴스 타입) 정의
- [x] `db/client/local.ts`: better-sqlite3 + Drizzle 로컬 연결 생성
- [x] `db/client/remote.ts`: 외부 DB(Drizzle + pg) 연결 생성 (mode=remote일 때만 사용)
- [x] `db/context.ts`: 설정 기반으로 mode 결정, 연결 생성·캐시, `getDb()` 제공
- [x] `db/index.ts`에서 `getDb()`, `getDbMode()`, `initDbContext()`, `closeDb()` export
- [ ] 기존 Mapper를 "getDb()로 연결 취득 후 쿼리" 방식으로 변경 (실제 테이블 생기면 적용)
- [ ] (선택) Drizzle 스키마 정의 및 마이그레이션 경로 정리
- [x] 앱 기동 시 DB context 초기화, 앱 종료 시 연결/풀 종료 훅 연결

## 7. Verification Plan

- `db.mode: "local"` 일 때: 로컬 SQLite 파일 생성 및 Mapper 쿼리 동작 확인.
- `db.mode: "remote"` + 유효한 외부 DB URL 일 때: 해당 DB로 쿼리 수행 확인.
- Mapper 단위 테스트 시 "가짜 연결" 주입 가능한지 확인(추상화가 잘 되었는지).

---

**다음 단계**: 위 "특정 상황" 정의(3번)에서 어떤 방식(A/B/C/D)을 우선 적용할지 정하면, 그에 맞춰 6번 태스크 순서대로 구현하면 된다.
