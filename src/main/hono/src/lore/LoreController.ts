import { Hono } from 'hono';

import type { LoreVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { loreSchema } from '@zod-schema/lore.schema';

import { LoreService } from './LoreService';

/**
 * @description 전승/설화 API 컨트롤러. /lores 마운트. prjNo는 쿼리(GET/PATCH/DELETE) 또는 바디(POST)로 전달.
 */
const lores = new Hono();

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
 * @description 전승/설화 목록 조회.
 * @param context Hono 컨텍스트
 */
lores.get('/', async (context) => {
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
  const params = loreSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await LoreService.getList(prjNo, params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 전승/설화 상세 조회.
 * @param context Hono 컨텍스트
 */
lores.get('/:loreNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const loreNo = Number(context.req.param('loreNo'));

  if (prjNo == null || Number.isNaN(loreNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, loreNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await LoreService.getByNo(prjNo, loreNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 전승/설화 생성.
 * @param context Hono 컨텍스트
 */
lores.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = loreSchema.safeParse(raw);

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

  const loreNm = (parsed.data.loreNm ?? '').toString().trim();
  if (!loreNm) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'loreNm은 필수이며 비어 있을 수 없습니다.',
      },
      200
    );
  }

  const result = await LoreService.create(prjNo, parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 전승/설화 수정.
 * @param context Hono 컨텍스트
 */
lores.patch('/:loreNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const loreNo = Number(context.req.param('loreNo'));

  if (prjNo == null || Number.isNaN(loreNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, loreNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = loreSchema.partial().safeParse(raw);

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

  const result = await LoreService.update(
    prjNo,
    loreNo,
    parsed.data ?? {} as Partial<LoreVo>
  );

  return context.json(
    result,
    200
  );
});

/**
 * @description 전승/설화 삭제.
 * @param context Hono 컨텍스트
 */
lores.delete('/:loreNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const loreNo = Number(context.req.param('loreNo'));

  if (prjNo == null || Number.isNaN(loreNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, loreNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await LoreService.delete(prjNo, loreNo);

  return context.json(
    result,
    200
  );
});

export { lores as LoreController };
