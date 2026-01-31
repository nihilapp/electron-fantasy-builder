import { defineConfig } from 'drizzle-kit';

/**
 * 원격 Postgres 스키마용 Drizzle Kit 설정.
 * 마이그레이션 생성: pnpm db:generate:remote
 * 마이그레이션 실행: pnpm db:migrate:remote (DATABASE_URL 환경 변수 필요)
 */
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/main/server/schema/remote/index.ts',
  out: './src/drizzle/remote',
  dbCredentials: { url: process.env.DATABASE_URL ?? '', },
});
