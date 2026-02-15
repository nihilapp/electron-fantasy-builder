import { Hono } from 'hono';

import type { ResponseType } from '@app-types/response.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { HealthService } from './HealthService';

/**
 * @description Health API 컨트롤러. 모든 응답은 HTTP 200, ResponseType 구조로 반환.
 */
const health = new Hono();

/**
 * @description Health 상태 조회.
 * @param context Hono 컨텍스트
 */
health.get('/', (context) => {
  const data = HealthService.getHealth();

  const body: ResponseType<typeof data> = {
    data,
    error: false,
    code: RESPONSE_CODE.OK,
    message: '',
  };

  return context.json(
    body,
    200
  );
});

export { health as HealthController };
