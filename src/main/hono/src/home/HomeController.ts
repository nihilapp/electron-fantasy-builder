import { Hono } from 'hono';

import type { ResponseType } from '@app-types/response.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

/**
 * @description 루트(/) 요청 처리 컨트롤러.
 */
const home = new Hono();

/**
 * @description 루트 GET. 서버 정보 반환.
 * @param context Hono 컨텍스트
 */
home.get('/', (context) => {
  const data = {
    name: 'keyword-manager',
    server: 'hono' as const,
  };

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

export { home as HomeController };
