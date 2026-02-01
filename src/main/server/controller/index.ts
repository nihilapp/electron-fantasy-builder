import { Hono } from 'hono';

import { AbilityController } from './AbilityController';
import { HealthController } from './HealthController';
import { HomeController } from './HomeController';
import { ProjectController } from './ProjectController';
import { TraitController } from './TraitController';

/**
 * 모든 컨트롤러를 하나의 Hono 앱으로 묶어 반환합니다.
 */
export function createControllerApp(): Hono {
  const app = new Hono();

  app.route('/', HomeController);
  app.route('/health', HealthController);
  app.route('/projects', ProjectController);
  app.route('/traits', TraitController);
  app.route('/abilities', AbilityController);

  return app;
}
