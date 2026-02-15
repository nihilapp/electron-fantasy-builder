
```typescript
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import { createControllerApp } from './controller';
import { runWithDbMode } from './db';
import type { DbMode } from './db'; // Ensure you implement this in ./db

const app = new Hono();

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: (origin) => origin || '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Db-Target'],
    credentials: true,
  })
);

// 요청별 DB 타깃: X-Db-Target: remote | local 또는 ?db=remote | ?db=local
app.use('*', async (context, next) => {
  const raw = context.req.header('X-Db-Target') ?? context.req.query('db');

  let mode: DbMode | undefined;
  if (raw === 'remote') mode = 'remote';
  else if (raw === 'local') mode = 'local';

  return runWithDbMode(mode, next);
});

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// Import and route your controllers here
// app.route('/', createControllerApp());

export default app;
```
