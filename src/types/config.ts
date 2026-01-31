import type { DbConfig } from './db';

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

/** 페이징 기본값. 목록 API에서 쿼리 page / pageSize 미지정 시 사용. */
export interface PaginationConfig {
  pageSize?: number;
}

/** app.json 전체 구조 */
export interface AppConfig {
  api?: ApiConfig;
  server?: ServerConfig;
  db?: DbConfig;
  pagination?: PaginationConfig;
}
