import { Hono } from 'hono';

import type { NationVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { nationSchema } from '@zod-schema/nation.schema';

import { NationService } from './NationService';

/**
 * @description 국가 API 컨트롤러. /nations 마운트. prjNo는 쿼리(GET/PATCH/DELETE) 또는 바디(POST)로 전달.
 */
const nations = new Hono();

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
 * @description 국가 목록 조회.
 * @param context Hono 컨텍스트
 */
nations.get('/', async (context) => {
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
  const params = nationSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await NationService.getList(prjNo, params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 국가 상세 조회.
 * @param context Hono 컨텍스트
 */
nations.get('/:ntnNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const ntnNo = Number(context.req.param('ntnNo'));

  if (prjNo == null || Number.isNaN(ntnNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, ntnNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await NationService.getByNo(prjNo, ntnNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 국가 생성.
 * @param context Hono 컨텍스트
 */
nations.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = nationSchema.safeParse(raw);

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

  const ntnNm = (parsed.data.ntnNm ?? '').toString().trim();
  if (!ntnNm) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'ntnNm은 필수이며 비어 있을 수 없습니다.',
      },
      200
    );
  }

  const result = await NationService.create(prjNo, parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 국가 수정.
 * @param context Hono 컨텍스트
 */
nations.patch('/:ntnNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const ntnNo = Number(context.req.param('ntnNo'));

  if (prjNo == null || Number.isNaN(ntnNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, ntnNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = nationSchema.partial().safeParse(raw);

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

  const result = await NationService.update(
    prjNo,
    ntnNo,
    parsed.data ?? {} as Partial<NationVo>
  );

  return context.json(
    result,
    200
  );
});

/**
 * @description 국가 삭제.
 * @param context Hono 컨텍스트
 */
nations.delete('/:ntnNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const ntnNo = Number(context.req.param('ntnNo'));

  if (prjNo == null || Number.isNaN(ntnNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, ntnNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await NationService.delete(prjNo, ntnNo);

  return context.json(
    result,
    200
  );
});

export { nations as NationController };
