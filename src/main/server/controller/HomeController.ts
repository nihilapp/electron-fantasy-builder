import type { ResponseType } from '@app-types/response.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { Hono } from 'hono';

/** 루트(/) 요청 처리 컨트롤러. */
const home = new Hono();

home.get('/', (context) => {
  const data = { name: 'keyword-manager', server: 'hono' as const, };

  const body: ResponseType<typeof data> = {
    data,
    error: false,
    code: RESPONSE_CODE.OK,
    message: '',
  };

  return context.json(body, 200);
});

export { home as HomeController };
