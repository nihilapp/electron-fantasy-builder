import type { AppConfig } from '@app-types/config';
import type { ExampleDto } from '@app-types/dto';
import type { ListResponseType } from '@app-types/response.types';
import { Hono } from 'hono';

import appConfig from '@config/app.json';

import { ExampleService } from '../service/ExampleService';

const config = appConfig as AppConfig;
const DEFAULT_PAGE_SIZE = config.pagination?.pageSize ?? 10;

/**
 * Example API 컨트롤러.
 * Service가 ListResponseType을 반환하므로 그대로 json으로 내려줌.
 * page, pageSize 는 쿼리스트링으로 전달. pageSize 미지정 시 config.pagination.pageSize(기본 10) 사용.
 */
const example = new Hono();

example.get('/', (context) => {
  const page = Math.max(1, Number(context.req.query('page')) || 1);
  const pageSize = Math.max(1, Number(context.req.query('pageSize')) || DEFAULT_PAGE_SIZE);

  const body: ListResponseType<ExampleDto> = ExampleService.getList(page, pageSize);

  return context.json(body, 200);
});

export { example as ExampleController };
