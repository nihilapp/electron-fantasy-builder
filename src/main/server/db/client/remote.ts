import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export type RemoteDb = ReturnType<typeof createRemoteDb>;

/**
 * 외부 Postgres 연결 생성 (pg Pool + Drizzle).
 * @param connectionUrl postgres://user:password@host:5432/dbname
 */
export function createRemoteDb(connectionUrl: string) {
  const pool = new Pool({ connectionString: connectionUrl });
  return drizzle({ client: pool });
}
