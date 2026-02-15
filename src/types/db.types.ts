/**
 * DB 레이어 타입.
 * main/hono/db 등에서 사용합니다.
 */

/** DB 모드: 로컬(SQLite) vs 원격(Postgres) */
export type DbMode = 'local' | 'remote';

/** DB 설정 */
export interface DbConfig {
  mode?: DbMode;
  local?: { path?: string };
  remote?: { connectionUrl?: string };
}
