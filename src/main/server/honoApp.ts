import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { createControllerApp } from './controller';
import { runWithDbMode } from './db';
import type { DbMode } from './db';

/**
 * 메인 프로세스 내부에서 동작하는 Hono 앱.
 * Controller → Service → DB(Mapper) 3계층 구조로 라우트가 구성됩니다.
 * 요청별 DB: X-Db-Target 헤더 또는 db 쿼리(remote | local)로 외부/로컬 DB 선택.
 */
const app = new Hono();

// 렌더러(localhost:3000 등)에서 fetch 시 CORS 허용
app.use(
  '*',
  cors({
    origin: (origin) => origin || '*',
    allowMethods: [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', ],
    allowHeaders: [ 'Content-Type', 'Authorization', 'X-Db-Target', ],
  })
);

// 요청별 DB 타깃: X-Db-Target: remote | local 또는 ?db=remote | ?db=local (미지정 시 config.db.mode)
app.use('*', async (context, next) => {
  const raw = context.req.header('X-Db-Target') ?? context.req.query('db');

  let mode: DbMode | undefined;
  if (raw === 'remote') mode = 'remote';
  else if (raw === 'local') mode = 'local';

  return runWithDbMode(mode, next);
});

app.route('/', createControllerApp());

export { app as honoApp };
