import { Hono } from 'hono';

import { RESPONSE_CODE } from '@constants/response-code.const';
import { settingsSearchParamsSchema } from '@zod-schema/settingsSearch.schema';

import { searchUnified } from './SettingsSearchService';

/**
 * @description 전체 설정 통합 검색 API. /settings 마운트.
 * GET /settings/search?prjNo=&q=&categories=&page=&pageSize=
 */
const settings = new Hono();

settings.get('/search', async (context) => {
  const query = context.req.query();
  const prjNoRaw = query.prjNo;
  const prjNo = prjNoRaw
    ? Number(prjNoRaw)
    : NaN;

  if (!Number.isInteger(prjNo) || prjNo < 1) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo는 필수이며 1 이상의 정수여야 합니다.',
      },
      200
    );
  }

  const params = settingsSearchParamsSchema.parse({
    prjNo,
    q: query.q ?? '',
    categories: query.categories ?? '',
    page: query.page
      ? Number(query.page)
      : 1,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : 20,
  });

  const body = await searchUnified(prjNo, {
    q: params.q,
    categories: params.categories,
    page: params.page,
    pageSize: params.pageSize,
  });

  return context.json(body, 200);
});

export { settings as SettingsSearchController };
