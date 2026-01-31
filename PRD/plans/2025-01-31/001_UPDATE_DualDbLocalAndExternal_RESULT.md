# RESULT: 로컬 SQLite 기본 + 특정 상황 시 외부 DB 연결 구조

> **Date:** 2025-01-31  
> **Task ID:** 001_UPDATE_DualDbLocalAndExternal  
> **Status:** ✅ SUCCESS  
> **Language:** Korean

## 1. Execution Summary

플랜 6번 Task List 중 실제 테이블/스키마가 없는 항목을 제외하고 구현 완료.  
로컬(better-sqlite3 + Drizzle) / 원격(Postgres + pg + Drizzle) 전환을 설정(`config/app.json`의 `db.mode`)으로 제어하고, `getDb()`로 현재 연결을 취득·캐시하며, 앱 종료 시 `closeDb()`로 정리한다.

## 2. Modified Files

- [Modified] `config/app.json` — 이미 `db.mode`, `db.local`, `db.remote` 존재 (이전 작업)
- [Added] `main/server/db/client/types.ts` — DbMode, DbConfig
- [Added] `main/server/db/client/local.ts` — createLocalDb (better-sqlite3 + Drizzle)
- [Added] `main/server/db/client/remote.ts` — createRemoteDb (pg Pool + Drizzle)
- [Added] `main/server/db/context.ts` — getDbMode, getDb(), closeDb(), initDbContext()
- [Modified] `main/server/db/index.ts` — getDb, getDbMode, initDbContext, closeDb, Db, DbMode export
- [Modified] `main/index.ts` — initDbContext() in whenReady, closeDb() in before-quit
- [Modified] `PRD/plans/2025-01-31/001_UPDATE_DualDbLocalAndExternal_PLAN.md` — Task List 완료 표시

## 3. Key Changes

- **db/client**: 로컬은 `createLocalDb(path)`, 원격은 `createRemoteDb(connectionUrl)`로 Drizzle 인스턴스 생성.
- **db/context**: `getDbMode()`는 config만 읽고, `getDb()`는 mode에 따라 연결 생성·캐시 후 반환. `closeDb()`는 pg Pool.end() 및 better-sqlite3 .close() 호출.
- **main**: 기동 시 `initDbContext()`(모드 검증), 종료 시 `closeDb()` 후 Hono 서버 종료.
- Mapper는 아직 getDb() 미사용(실제 테이블 생기면 적용). HealthMapper는 기존대로 시스템 정보만 반환.

## 4. Verification Results

- `pnpm run build` 성공.
- `db.mode: "local"` 시 getDb() 호출 시 로컬 SQLite 파일 생성됨.
- `db.mode: "remote"` 이고 `db.remote.connectionUrl` 비어 있으면 getDb()에서 명시적 에러 throw.
