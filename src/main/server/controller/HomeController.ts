import { Hono } from 'hono';

/**
 * 루트(/) 요청 처리 컨트롤러.
 */
const home = new Hono();

home.get('/', (c) =>
  c.json({
    name: 'keyword-manager',
    server: 'hono',
  })
);

export { home as HomeController };
