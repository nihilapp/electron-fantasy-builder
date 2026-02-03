import { Hono } from 'hono';

import { RESPONSE_CODE } from '@constants/response-code.const';
import { abilitySearchQuerySchema } from '@zod-schema/abilitySearch.schema';
import { traitSearchQuerySchema } from '@zod-schema/traitSearch.schema';

import { AbilitySearchService } from '../service/AbilitySearchService';
import { TraitSearchService } from '../service/TraitSearchService';

/**
 * @description 통합 검색 API 컨트롤러. /search 마운트. prjNo는 쿼리로 전달. GET /search/traits, GET /search/abilities
 */
const search = new Hono();

/**
 * @description 쿼리/바디의 prjNo 문자열을 숫자로 파싱. 유효하지 않으면 null.
 * @param raw prjNo 문자열
 */
function parsePrjNo(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

/**
 * @description 특성 검색.
 * @param context Hono 컨텍스트
 */
search.get('/traits', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));

  if (prjNo == null) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const query = context.req.query();
  const params = traitSearchQuerySchema.parse({
    type: query.type ?? 'ALL',
    searchKeyword: query.searchKeyword ?? null,
    searchType: query.searchType ?? null,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await TraitSearchService.getSearch(prjNo, params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 어빌리티 검색.
 * @param context Hono 컨텍스트
 */
search.get('/abilities', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));

  if (prjNo == null) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const query = context.req.query();
  const params = abilitySearchQuerySchema.parse({
    type: query.type ?? 'ALL',
    searchKeyword: query.searchKeyword ?? null,
    searchType: query.searchType ?? null,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await AbilitySearchService.getSearch(prjNo, params);

  return context.json(
    body,
    200
  );
});

export { search as SearchController };
