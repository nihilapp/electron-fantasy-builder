/**
 * config/app.json 구조 타입.
 * 메인 프로세스 전역에서 appConfig 타입·재활용용.
 */

/** Hono(메인 프로세스 내부 서버) 설정 */
export interface ServerConfig {
  port?: number;
  hostname?: string;
}

/** 외부 API(axios) 설정 */
export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
}

/** DB 모드: 로컬(SQLite) vs 원격(Postgres) */
export type DbMode = 'local' | 'remote';

/** DB 설정 */
export interface DbConfig {
  mode?: DbMode;
  local?: { path?: string };
  remote?: { connectionUrl?: string };
}

/** app.json 전체 구조 */
export interface AppConfig {
  api?: ApiConfig;
  server?: ServerConfig;
  db?: DbConfig;
}
