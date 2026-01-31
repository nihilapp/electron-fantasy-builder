# RESULT: main / preload / renderer를 src 폴더로 이전

> **Date:** 2025-01-31  
> **Task ID:** 002_UPDATE_MoveToSrc  
> **Status:** ✅ SUCCESS  
> **Language:** Korean

## 1. Execution Summary

- **main**, **preload**, **renderer** 디렉터리를 **src/** 하위로 이동 완료.
- electron.vite, tsconfig, drizzle, README, IPC_GUIDE 반영 후 **pnpm run build** 및 **pnpm db:generate** 성공.

## 2. Modified Files

- [이동] `main/` → `src/main/`
- [이동] `preload/` → `src/preload/`
- [이동] `renderer/` → `src/renderer/`
- [Modified] `electron.vite.config.ts` — alias·rollup input·renderer root를 `src/` 기준으로 변경
- [Modified] `tsconfig.json` — paths·include를 `src/main`, `src/preload`, `src/renderer` 기준으로 변경
- [Modified] `drizzle.config.local.ts` — schema → `./src/main/server/schema/local/index.ts`
- [Modified] `drizzle.config.remote.ts` — schema → `./src/main/server/schema/remote/index.ts`
- [Modified] `README.md` — 프로젝트 구조 트리를 src 포함 구조로 수정
- [Modified] `docs/IPC_GUIDE.md` — main/, preload/, renderer/ 경로를 src/main/, src/preload/, src/renderer/로 일괄 수정

## 3. Key Changes

- **mainWindow.ts**, **package.json** 은 변경하지 않음. 빌드 결과물이 여전히 `out/main`, `out/preload`, `out/renderer` 이므로 런타임 경로·main 진입점 유지.
- 소스 import(@main, @preload, ~)는 alias만 설정에서 src 하위로 맞춤. 코드 수정 없음.

## 4. Verification Results

| 항목 | 결과 |
|------|------|
| `pnpm run build` | ✅ 성공 (main/preload/renderer 빌드 완료) |
| `pnpm db:generate` | ✅ 성공 (스키마 경로 인식 정상) |
| 디렉터리 구조 | ✅ `src/main`, `src/preload`, `src/renderer` 존재 확인 |
