import { defineConfig } from 'drizzle-kit';

/**
 * 로컬 SQLite 스키마용 Drizzle Kit 설정.
 * 마이그레이션 생성: pnpm db:generate
 * 마이그레이션 실행: pnpm db:migrate
 */
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/main/hono/src/common/db/schema/local/index.ts',
  out: './src/drizzle/local',
  dbCredentials: { url: 'file:./src/data/app.db', },
});
