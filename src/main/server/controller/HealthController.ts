import { Hono } from 'hono';

import { HealthService } from '../service/HealthService';

/**
 * Health API 컨트롤러.
 * Service 레이어를 호출하고 HTTP 응답을 반환합니다.
 */
const health = new Hono();

health.get('/', (c) => {
  const dto = HealthService.getHealth();
  return c.json(dto);
});

export { health as HealthController };
