import type { ResponseType } from '@app-types/response.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { Hono } from 'hono';

import { HealthService } from '../service/HealthService';

/**
 * Health API 컨트롤러.
 * 모든 응답은 HTTP 200, ResponseType 구조로 반환.
 */
const health = new Hono();

health.get('/', (context) => {
  const data = HealthService.getHealth();

  const body: ResponseType<typeof data> = {
    data,
    error: false,
    code: RESPONSE_CODE.OK,
    message: '',
  };

  return context.json(body, 200);
});

export { health as HealthController };
