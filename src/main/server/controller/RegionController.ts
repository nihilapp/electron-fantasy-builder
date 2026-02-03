import { Hono } from 'hono';

import type { RegionVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { regionSchema } from '@zod-schema/region.schema';

import { RegionService } from '../service/RegionService';

/**
 * @description 지역 API 컨트롤러. /regions 마운트. prjNo는 쿼리(GET/PATCH/DELETE) 또는 바디(POST)로 전달.
 */
const regions = new Hono();

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
 * @description 지역 목록 조회.
 * @param context Hono 컨텍스트
 */
regions.get('/', async (context) => {
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
  const params = regionSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await RegionService.getList(prjNo, params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 지역 상세 조회.
 * @param context Hono 컨텍스트
 */
regions.get('/:regionNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const regionNo = Number(context.req.param('regionNo'));

  if (prjNo == null || Number.isNaN(regionNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, regionNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await RegionService.getByNo(prjNo, regionNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 지역 생성.
 * @param context Hono 컨텍스트
 */
regions.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = regionSchema.safeParse(raw);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => issue.message)
      .join('; ') || '요청 검증 실패';

    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message,
      },
      200
    );
  }

  const prjNo = parsed.data.prjNo ?? null;
  if (prjNo == null || !Number.isInteger(prjNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'prjNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const regionNm = (parsed.data.regionNm ?? '').toString().trim();
  if (!regionNm) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'regionNm은 필수이며 비어 있을 수 없습니다.',
      },
      200
    );
  }

  const result = await RegionService.create(prjNo, parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 지역 수정.
 * @param context Hono 컨텍스트
 */
regions.patch('/:regionNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const regionNo = Number(context.req.param('regionNo'));

  if (prjNo == null || Number.isNaN(regionNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, regionNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = regionSchema.partial().safeParse(raw);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => issue.message)
      .join('; ') || '요청 검증 실패';

    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message,
      },
      200
    );
  }

  const result = await RegionService.update(
    prjNo,
    regionNo,
    parsed.data ?? {} as Partial<RegionVo>
  );

  return context.json(
    result,
    200
  );
});

/**
 * @description 지역 삭제.
 * @param context Hono 컨텍스트
 */
regions.delete('/:regionNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const regionNo = Number(context.req.param('regionNo'));

  if (prjNo == null || Number.isNaN(regionNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, regionNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await RegionService.delete(prjNo, regionNo);

  return context.json(
    result,
    200
  );
});

export { regions as RegionController };
