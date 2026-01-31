import { Hono } from 'hono';

import { ExampleController } from './ExampleController';
import { HealthController } from './HealthController';
import { HomeController } from './HomeController';

/**
 * 모든 컨트롤러를 하나의 Hono 앱으로 묶어 반환합니다.
 */
export function createControllerApp(): Hono {
  const app = new Hono();

  app.route('/', HomeController);
  app.route('/health', HealthController);
  app.route('/example', ExampleController);

  return app;
}
