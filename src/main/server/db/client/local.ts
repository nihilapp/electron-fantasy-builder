import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

export type LocalDb = ReturnType<typeof createLocalDb>;

/**
 * @description 로컬 SQLite 연결 생성 (better-sqlite3 + Drizzle).
 * @param path DB 파일 경로 (config.db.local.path)
 */
export function createLocalDb(path: string) {
  const sqlite = new Database(path);

  return drizzle({
    client: sqlite,
  });
}
