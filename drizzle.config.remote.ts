import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { defineConfig } from 'drizzle-kit';

/**
 * 원격 Postgres 연결 URL 반환.
 * 1) 환경 변수 DATABASE_URL
 * 2) src/config/app.json 의 db.remote.connectionUrl
 * 없으면 에러 메시지 출력 후 빈 문자열(실행 시 drizzle-kit이 에러 표시).
 */
function getRemoteDbUrl(): string {
  const fromEnv = process.env.DATABASE_URL?.trim();
  if (fromEnv) return fromEnv;

  try {
    const appJsonPath = resolve(process.cwd(), 'src/config/app.json');
    const app = JSON.parse(readFileSync(appJsonPath, 'utf-8')) as { db?: { remote?: { connectionUrl?: string } } };
    const fromConfig = app.db?.remote?.connectionUrl?.trim();
    if (fromConfig) return fromConfig;
  }
  catch {
    // ignore
  }

  console.error(
    '\n[원격 마이그레이션] PostgreSQL URL이 없습니다. 다음 중 하나를 설정하세요:\n'
    + '  1. 환경 변수: DATABASE_URL=postgresql://user:pass@host:5432/dbname pnpm db:migrate:remote\n'
    + '  2. src/config/app.json 의 db.remote.connectionUrl 에 연결 문자열 입력\n'
  );
  return '';
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/main/server/schema/remote/index.ts',
  out: './src/drizzle/remote',
  dbCredentials: { url: getRemoteDbUrl(), },
});
