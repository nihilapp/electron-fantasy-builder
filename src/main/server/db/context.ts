import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import type { Pool } from 'pg';

import appConfig from '@config/app.json';
import type { AppConfig } from '@config/types';

import { createLocalDb, type LocalDb } from './client/local';
import { createRemoteDb, type RemoteDb } from './client/remote';
import type { DbConfig, DbMode } from './client/types';

export type { DbMode };
export type Db = LocalDb | RemoteDb;

let cachedDb: Db | null = null;
let cachedMode: DbMode | null = null;

/** pg Pool은 close()로 종료. better-sqlite3 Database는 .close() */
let remotePool: Pool | null = null;
let localClient: import('better-sqlite3').Database | null = null;

function getDbConfig(): DbConfig {
  const config = appConfig as AppConfig;
  return config.db ?? {};
}

/**
 * 설정 기반으로 현재 DB 모드 결정.
 */
export function getDbMode(): DbMode {
  const config = getDbConfig();
  const mode = config.mode ?? 'local';
  if (mode !== 'local' && mode !== 'remote') return 'local';
  return mode;
}

/**
 * 현재 설정에 따라 DB 연결을 생성·캐시하고 반환합니다.
 * Mapper는 이 함수로 연결을 취득해 쿼리합니다.
 */
export function getDb(): Db {
  const mode = getDbMode();

  if (cachedDb !== null && cachedMode === mode) {
    return cachedDb;
  }

  // 모드가 바뀌었으면 기존 연결 정리
  closeDb();

  const config = getDbConfig();

  if (mode === 'remote') {
    const url = config.remote?.connectionUrl?.trim();
    if (!url) {
      throw new Error(
        '[db] mode가 remote인데 db.remote.connectionUrl이 비어 있습니다. config/app.json을 확인하세요.'
      );
    }
    const db = createRemoteDb(url);
    cachedDb = db;
    cachedMode = 'remote';
    remotePool = (db as { $client: Pool }).$client;
    return db;
  }

  const dbPath = config.local?.path ?? './data/app.db';
  const dbDir = dirname(dbPath);
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true, });
  }
  const db = createLocalDb(dbPath);
  cachedDb = db;
  cachedMode = 'local';
  localClient = (db as { $client: import('better-sqlite3').Database }).$client;

  // 로컬 DB 스키마 마이그레이션 적용 (drizzle/local 폴더에 SQL이 있어야 함)
  try {
    const migrationsFolder = join(process.cwd(), 'drizzle', 'local');
    migrate(db as unknown as Parameters<typeof migrate>[0], { migrationsFolder, });
  }
  catch (e) {
    console.warn('[db] Local migration skipped or failed:', (e as Error).message);
  }

  return db;
}

/**
 * 캐시된 DB 연결을 해제합니다. 앱 종료 시 호출합니다.
 */
export function closeDb(): void {
  const pool = remotePool;
  const sqlite = localClient;
  remotePool = null;
  localClient = null;
  cachedDb = null;
  cachedMode = null;
  if (pool) {
    pool.end().catch(() => {});
  }
  if (sqlite) {
    try {
      sqlite.close();
    }
    catch {
      // ignore
    }
  }
}

/**
 * 앱 기동 시 DB context 초기화.
 * 로컬 모드일 때 즉시 getDb()를 호출해 SQLite 파일 생성 및 마이그레이션을 수행합니다.
 */
export function initDbContext(): void {
  if (getDbMode() === 'local') {
    getDb();
  }
}
