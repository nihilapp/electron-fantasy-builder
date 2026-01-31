import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { createControllerApp } from './controller';

/**
 * 메인 프로세스 내부에서 동작하는 Hono 앱.
 * Controller → Service → DB(Mapper) 3계층 구조로 라우트가 구성됩니다.
 */
const app = new Hono();

// 렌더러(localhost:3000 등)에서 fetch 시 CORS 허용
app.use(
  '*',
  cors({
    origin: (origin) => origin || '*',
    allowMethods: [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', ],
    allowHeaders: [ 'Content-Type', 'Authorization', ],
  })
);

app.route('/', createControllerApp());

export { app as honoApp };
