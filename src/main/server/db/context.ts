import { AsyncLocalStorage } from 'node:async_hooks';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import type { Pool } from 'pg';

import type { AppConfig } from '@app-types/config.types';
import type { DbConfig, DbMode } from '@app-types/db.types';
import appConfig from '@config/app.json';
import { createTaggedLogger } from '@main/logger';

import { createLocalDb, type LocalDb } from './client/local';
import { createRemoteDb, type RemoteDb } from './client/remote';

export type { DbMode };
export type Db = LocalDb | RemoteDb;

/** 요청 스코프에서 사용할 DB 모드. 미들웨어에서 X-Db-Target 또는 db 쿼리로 설정. */
const dbTargetStorage = new AsyncLocalStorage<DbMode | undefined>();

let cachedLocalDb: LocalDb | null = null;
let cachedRemoteDb: RemoteDb | null = null;

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
 * 요청 스코프에서 사용할 DB 모드를 반환합니다.
 * 1) 인자 mode 2) AsyncLocalStorage(요청별) 3) config 기본값 순.
 */
function resolveDbMode(mode?: DbMode): DbMode {
  if (mode === 'local' || mode === 'remote') return mode;
  const requestMode = dbTargetStorage.getStore();
  if (requestMode === 'local' || requestMode === 'remote') return requestMode;
  return getDbMode();
}

function getOrCreateLocalDb(): LocalDb {
  if (cachedLocalDb !== null) return cachedLocalDb;
  const config = getDbConfig();
  const dbPath = config.local?.path ?? './src/data/app.db';
  const dbDir = dirname(dbPath);
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true, });
  }
  const db = createLocalDb(dbPath);
  cachedLocalDb = db;
  localClient = (db as { $client: import('better-sqlite3').Database }).$client;
  try {
    const migrationsFolder = join(process.cwd(), 'src', 'drizzle', 'local');
    migrate(db as unknown as Parameters<typeof migrate>[0], { migrationsFolder, });
  }
  catch (error) {
    createTaggedLogger('db').warn('Local migration skipped or failed:', (error as Error).message);
  }
  return db;
}

function getOrCreateRemoteDb(): RemoteDb {
  if (cachedRemoteDb !== null) return cachedRemoteDb;
  const config = getDbConfig();
  const url = config.remote?.connectionUrl?.trim();
  if (!url) {
    throw new Error(
      '[db] remote DB를 사용하려면 src/config/app.json의 db.remote.connectionUrl을 설정하세요.'
    );
  }
  const db = createRemoteDb(url);
  cachedRemoteDb = db;
  remotePool = (db as { $client: Pool }).$client;
  return db;
}

/**
 * 현재 설정 또는 요청 스코프에 따라 DB 연결을 반환합니다.
 * - mode를 넘기면 해당 DB 사용 (로컬/원격 둘 다 캐시되어 동시 사용 가능).
 * - mode 없이 호출 시: 요청 내부면 X-Db-Target / db 쿼리로 정한 값, 아니면 config.db.mode.
 * Mapper/Service는 getDb()만 호출하면 됩니다.
 */
export function getDb(mode?: DbMode): Db {
  const effective = resolveDbMode(mode);
  if (effective === 'remote') return getOrCreateRemoteDb();
  return getOrCreateLocalDb();
}

/**
 * 로컬 SQLite 버전 문자열 (예: "3.43.0").
 * RETURNING 지원은 3.35.0 이상. 로컬 모드가 아니거나 조회 실패 시 null.
 */
export function getSqliteVersion(): string | null {
  if (getDbMode() !== 'local') return null;
  const db = getOrCreateLocalDb();
  const client = (db as { $client: import('better-sqlite3').Database }).$client;
  try {
    const row = client.prepare('SELECT sqlite_version() as v').get() as { v: string } | undefined;
    return row?.v ?? null;
  }
  catch {
    return null;
  }
}

/**
 * 요청 컨텍스트 없이(예: IPC) 특정 DB 모드로 코드를 실행할 때 사용합니다.
 * @example
 * await runWithDbMode('remote', async () => { ... getDb()는 remote 반환 ... });
 */
export async function runWithDbMode<T>(mode: DbMode | undefined, fn: () => Promise<T>): Promise<T> {
  if (mode === 'local' || mode === 'remote') {
    return dbTargetStorage.run(mode, fn);
  }
  return fn();
}

/**
 * 캐시된 DB 연결(로컬·원격 모두)을 해제합니다. 앱 종료 시 호출합니다.
 */
export function closeDb(): void {
  const pool = remotePool;
  const sqlite = localClient;
  remotePool = null;
  localClient = null;
  cachedLocalDb = null;
  cachedRemoteDb = null;
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
