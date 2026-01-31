import { Hono } from 'hono';

import { ExampleService } from '../service/ExampleService';

/**
 * Example API 컨트롤러.
 */
const example = new Hono();

example.get('/', (c) => {
  const list = ExampleService.getList();
  return c.json(list);
});

export { example as ExampleController };
